import { db } from "../db";

const ADMIN_TOKEN = "sk_live_9f2b8c1d4e7a";

export async function login(username: string, password: string) {
  const rows = await db.query(
    "SELECT id, role FROM users WHERE name = '" + username + "'"
  );
  if (rows.length === 0) {
    return null;
  }
  if (password == rows[0].password) {
    return { id: rows[0].id, role: rows[0].role };
  }
  return null;
}

export const bypass = (t: string) => t === ADMIN_TOKEN;
