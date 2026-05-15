import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p80681349_interactive_raffle_k')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def ok(data, status=200):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(data, default=str)}

def err(msg, status=400):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg})}

def require_admin(cur, token):
    if not token:
        return None
    cur.execute(
        f"SELECT u.id, u.is_admin FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON s.user_id = u.id "
        f"WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    if not row or not row[1]:
        return None
    return row[0]

def handler(event: dict, context) -> dict:
    """Панель администратора: список пользователей, статистика, управление балансами."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    action = path.strip('/').split('/')[-1]
    token = (event.get('headers') or {}).get('X-Session-Token', '')

    conn = get_conn()
    cur = conn.cursor()

    try:
        admin_id = require_admin(cur, token)
        if not admin_id:
            return err('Доступ запрещён', 403)

        # GET /admin/stats — общая статистика
        if method == 'GET' and action == 'stats':
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users WHERE is_admin = FALSE")
            total_users = cur.fetchone()[0]
            cur.execute(f"SELECT COALESCE(SUM(total_won), 0) FROM {SCHEMA}.users")
            total_paid = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.transactions WHERE type = 'win' AND created_at > NOW() - INTERVAL '24 hours'")
            prizes_today = cur.fetchone()[0]
            cur.execute(f"SELECT COALESCE(SUM(amount), 0) FROM {SCHEMA}.transactions WHERE type = 'deposit' AND created_at > NOW() - INTERVAL '24 hours'")
            deposits_today = cur.fetchone()[0]
            return ok({
                'totalUsers': total_users,
                'totalPaid': total_paid,
                'prizesToday': prizes_today,
                'depositsToday': deposits_today,
            })

        # GET /admin/users — список пользователей
        if method == 'GET' and action == 'users':
            cur.execute(
                f"""SELECT id, email, name, balance, total_won, referral_income, level, is_vip, is_admin, created_at
                    FROM {SCHEMA}.users ORDER BY created_at DESC LIMIT 100"""
            )
            rows = cur.fetchall()
            users = [{
                'id': r[0], 'email': r[1], 'name': r[2], 'balance': r[3],
                'totalWon': r[4], 'referralIncome': r[5], 'level': r[6],
                'isVip': r[7], 'isAdmin': r[8], 'createdAt': r[9].isoformat() if r[9] else None,
            } for r in rows]
            return ok({'users': users})

        # POST /admin/adjust_balance — изменить баланс пользователя
        if method == 'POST' and action == 'adjust_balance':
            body = json.loads(event.get('body') or '{}')
            user_id = int(body.get('userId', 0))
            amount  = int(body.get('amount', 0))
            reason  = body.get('reason', 'Корректировка администратором')

            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE id = %s AND is_admin = FALSE", (user_id,))
            if not cur.fetchone():
                return err('Пользователь не найден')

            cur.execute(f"UPDATE {SCHEMA}.users SET balance = balance + %s, updated_at = NOW() WHERE id = %s", (amount, user_id))
            cur.execute(f"INSERT INTO {SCHEMA}.transactions (user_id, type, amount, description) VALUES (%s, 'admin', %s, %s)",
                        (user_id, amount, reason))
            conn.commit()
            return ok({'ok': True})

        # POST /admin/set_vip — сделать VIP
        if method == 'POST' and action == 'set_vip':
            body = json.loads(event.get('body') or '{}')
            user_id = int(body.get('userId', 0))
            is_vip  = bool(body.get('isVip', False))
            cur.execute(f"UPDATE {SCHEMA}.users SET is_vip = %s WHERE id = %s AND is_admin = FALSE", (is_vip, user_id))
            conn.commit()
            return ok({'ok': True})

        return err('Неизвестный маршрут', 404)

    finally:
        cur.close()
        conn.close()
