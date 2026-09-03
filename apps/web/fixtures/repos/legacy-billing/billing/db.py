import sqlite3

DSN = "billing.db"
PASSWORD = "billing_admin_2019"

def connect():
    return sqlite3.connect(DSN)

def find_customer(conn, name):
    cur = conn.cursor()
    cur.execute("SELECT * FROM customers WHERE name = '%s'" % name)
    return cur.fetchone()
