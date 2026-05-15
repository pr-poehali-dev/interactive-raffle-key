import json
import os
import hashlib
import secrets
import psycopg2
from datetime import datetime, timedelta, timezone

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p80681349_interactive_raffle_k')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def gen_token() -> str:
    return secrets.token_hex(48)

def gen_ref_code(name: str) -> str:
    base = name.lower().replace(' ', '_')[:8]
    return base + '_' + secrets.token_hex(4)

def ok(data: dict, status: int = 200):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(data)}

def err(msg: str, status: int = 400):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg})}

def ensure_admin_exists(cur):
    """Создаёт аккаунт администратора если не существует."""
    admin_email = 'worldtotem@ya.ru'
    admin_hash = hash_password('Lev030508')
    cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (admin_email,))
    if not cur.fetchone():
        ref_code = gen_ref_code('admin')
        cur.execute(
            f"""INSERT INTO {SCHEMA}.users (email, password_hash, name, balance, is_admin, is_vip, referral_code)
                VALUES (%s, %s, %s, %s, TRUE, TRUE, %s)""",
            (admin_email, admin_hash, 'Администратор', 999999, ref_code)
        )

def handler(event: dict, context) -> dict:
    """Авторизация: register, login, logout, me."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    action = path.strip('/').split('/')[-1]

    token = (event.get('headers') or {}).get('X-Session-Token', '')

    conn = get_conn()
    cur = conn.cursor()

    try:
        ensure_admin_exists(cur)
        conn.commit()

        # GET /auth/me — получить текущего пользователя
        if method == 'GET' and action == 'me':
            if not token:
                return err('Не авторизован', 401)
            cur.execute(
                f"SELECT u.id, u.email, u.name, u.balance, u.total_won, u.referral_income, u.level, u.is_vip, u.is_admin, u.referral_code "
                f"FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON s.user_id = u.id "
                f"WHERE s.token = %s AND s.expires_at > NOW()",
                (token,)
            )
            row = cur.fetchone()
            if not row:
                return err('Сессия истекла', 401)
            return ok({'user': {
                'id': row[0], 'email': row[1], 'name': row[2],
                'balance': row[3], 'totalWon': row[4], 'referralIncome': row[5],
                'level': row[6], 'isVip': row[7], 'isAdmin': row[8],
                'referralCode': row[9],
            }})

        body = {}
        if event.get('body'):
            body = json.loads(event['body'])

        # POST /auth/register
        if method == 'POST' and action == 'register':
            name     = (body.get('name') or '').strip()
            email    = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            ref_by   = body.get('referralCode') or ''

            if not name or not email or not password:
                return err('Заполните все поля')
            if len(password) < 6:
                return err('Пароль должен быть не менее 6 символов')

            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
            if cur.fetchone():
                return err('Email уже зарегистрирован')

            referred_by_id = None
            if ref_by:
                cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE referral_code = %s", (ref_by,))
                ref_row = cur.fetchone()
                if ref_row:
                    referred_by_id = ref_row[0]

            pwd_hash = hash_password(password)
            ref_code = gen_ref_code(name)
            cur.execute(
                f"""INSERT INTO {SCHEMA}.users (email, password_hash, name, balance, referral_code, referred_by)
                    VALUES (%s, %s, %s, 100, %s, %s) RETURNING id""",
                (email, pwd_hash, name, ref_code, referred_by_id)
            )
            user_id = cur.fetchone()[0]

            cur.execute(
                f"""INSERT INTO {SCHEMA}.transactions (user_id, type, amount, description)
                    VALUES (%s, 'bonus', 100, 'Приветственный бонус')""",
                (user_id,)
            )

            if referred_by_id:
                cur.execute(
                    f"""UPDATE {SCHEMA}.users SET referral_income = referral_income + 50
                        WHERE id = %s""",
                    (referred_by_id,)
                )

            tok = gen_token()
            expires = datetime.now(timezone.utc) + timedelta(days=30)
            cur.execute(
                f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user_id, tok, expires)
            )
            conn.commit()
            return ok({'token': tok, 'user': {
                'id': user_id, 'email': email, 'name': name,
                'balance': 100, 'totalWon': 0, 'referralIncome': 0,
                'level': 1, 'isVip': False, 'isAdmin': False,
                'referralCode': ref_code,
            }}, 201)

        # POST /auth/login
        if method == 'POST' and action == 'login':
            email    = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            if not email or not password:
                return err('Заполните все поля')

            pwd_hash = hash_password(password)
            cur.execute(
                f"""SELECT id, email, name, balance, total_won, referral_income, level, is_vip, is_admin, referral_code
                    FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s""",
                (email, pwd_hash)
            )
            row = cur.fetchone()
            if not row:
                return err('Неверный email или пароль')

            tok = gen_token()
            expires = datetime.now(timezone.utc) + timedelta(days=30)
            cur.execute(
                f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (row[0], tok, expires)
            )
            conn.commit()
            return ok({'token': tok, 'user': {
                'id': row[0], 'email': row[1], 'name': row[2],
                'balance': row[3], 'totalWon': row[4], 'referralIncome': row[5],
                'level': row[6], 'isVip': row[7], 'isAdmin': row[8],
                'referralCode': row[9],
            }})

        # POST /auth/logout
        if method == 'POST' and action == 'logout':
            if token:
                cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
                conn.commit()
            return ok({'ok': True})

        return err('Неизвестный маршрут', 404)

    finally:
        cur.close()
        conn.close()
