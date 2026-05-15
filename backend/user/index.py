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
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(data)}

def err(msg, status=400):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg})}

def get_user_from_token(cur, token):
    if not token:
        return None
    cur.execute(
        f"SELECT u.id, u.email, u.name, u.balance, u.total_won, u.referral_income, u.level, u.is_vip, u.is_admin, u.referral_code "
        f"FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON s.user_id = u.id "
        f"WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    if not row:
        return None
    return {'id': row[0], 'email': row[1], 'name': row[2], 'balance': row[3],
            'totalWon': row[4], 'referralIncome': row[5], 'level': row[6],
            'isVip': row[7], 'isAdmin': row[8], 'referralCode': row[9]}

def handler(event: dict, context) -> dict:
    """Операции с аккаунтом: пополнение, покупка ключа, история транзакций."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    action = path.strip('/').split('/')[-1]
    token = (event.get('headers') or {}).get('X-Session-Token', '')

    conn = get_conn()
    cur = conn.cursor()

    try:
        user = get_user_from_token(cur, token)

        # GET /user/transactions — история транзакций
        if method == 'GET' and action == 'transactions':
            if not user:
                return err('Не авторизован', 401)
            cur.execute(
                f"SELECT id, type, amount, description, door_name, created_at FROM {SCHEMA}.transactions "
                f"WHERE user_id = %s ORDER BY created_at DESC LIMIT 50",
                (user['id'],)
            )
            rows = cur.fetchall()
            txs = [{'id': r[0], 'type': r[1], 'amount': r[2], 'description': r[3],
                    'doorName': r[4], 'createdAt': r[5].isoformat()} for r in rows]
            return ok({'transactions': txs})

        body = {}
        if event.get('body'):
            body = json.loads(event['body'])

        # POST /user/deposit — пополнение баланса
        if method == 'POST' and action == 'deposit':
            if not user:
                return err('Не авторизован', 401)
            amount = int(body.get('amount', 0))
            if amount < 100:
                return err('Минимальная сумма пополнения — ₽100')

            cur.execute(f"UPDATE {SCHEMA}.users SET balance = balance + %s, updated_at = NOW() WHERE id = %s",
                        (amount, user['id']))
            cur.execute(
                f"INSERT INTO {SCHEMA}.transactions (user_id, type, amount, description) VALUES (%s, 'deposit', %s, 'Пополнение баланса')",
                (user['id'], amount)
            )
            conn.commit()
            cur.execute(f"SELECT balance FROM {SCHEMA}.users WHERE id = %s", (user['id'],))
            new_balance = cur.fetchone()[0]
            return ok({'balance': new_balance, 'ok': True})

        # POST /user/open_door — покупка ключа и открытие двери
        if method == 'POST' and action == 'open_door':
            if not user:
                return err('Не авторизован', 401)
            door_name  = body.get('doorName', '')
            key_price  = int(body.get('keyPrice', 0))
            min_prize  = int(body.get('minPrize', 0))
            max_prize  = int(body.get('maxPrize', 0))

            cur.execute(f"SELECT balance FROM {SCHEMA}.users WHERE id = %s FOR UPDATE", (user['id'],))
            current_balance = cur.fetchone()[0]
            if current_balance < key_price:
                return err('Недостаточно средств на балансе')

            import random
            prize = random.randint(min_prize, max_prize)

            net = prize - key_price
            cur.execute(f"UPDATE {SCHEMA}.users SET balance = balance - %s + %s, total_won = total_won + %s, updated_at = NOW() WHERE id = %s",
                        (key_price, prize, prize, user['id']))

            cur.execute(
                f"INSERT INTO {SCHEMA}.transactions (user_id, type, amount, description, door_name) VALUES (%s, 'key', %s, %s, %s)",
                (user['id'], -key_price, f'Ключ: {door_name}', door_name)
            )
            cur.execute(
                f"INSERT INTO {SCHEMA}.transactions (user_id, type, amount, description, door_name) VALUES (%s, 'win', %s, %s, %s)",
                (user['id'], prize, f'Выигрыш: {door_name}', door_name)
            )

            # Начислить реферальные бонусы
            cur.execute(f"SELECT referred_by FROM {SCHEMA}.users WHERE id = %s", (user['id'],))
            ref1_row = cur.fetchone()
            if ref1_row and ref1_row[0]:
                bonus1 = int(prize * 0.10)
                cur.execute(f"UPDATE {SCHEMA}.users SET referral_income = referral_income + %s, balance = balance + %s WHERE id = %s",
                            (bonus1, bonus1, ref1_row[0]))
                cur.execute(f"INSERT INTO {SCHEMA}.transactions (user_id, type, amount, description) VALUES (%s, 'referral', %s, 'Реферальный бонус 1 уровень')",
                            (ref1_row[0], bonus1))
                cur.execute(f"SELECT referred_by FROM {SCHEMA}.users WHERE id = %s", (ref1_row[0],))
                ref2_row = cur.fetchone()
                if ref2_row and ref2_row[0]:
                    bonus2 = int(prize * 0.05)
                    cur.execute(f"UPDATE {SCHEMA}.users SET referral_income = referral_income + %s, balance = balance + %s WHERE id = %s",
                                (bonus2, bonus2, ref2_row[0]))

            conn.commit()
            cur.execute(f"SELECT balance, total_won FROM {SCHEMA}.users WHERE id = %s", (user['id'],))
            row = cur.fetchone()
            return ok({'prize': prize, 'balance': row[0], 'totalWon': row[1], 'ok': True})

        return err('Неизвестный маршрут', 404)

    finally:
        cur.close()
        conn.close()
