import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

export const DEMO_EMAIL = "demo@hurricaneproductionsllc.com";
export const DEMO_PASSWORD = "NorthlineDemo1";
export const DEMO_NAME = "Demo Operator";

export const ensureDemoAccount = createServerFn({ method: "POST" }).handler(async () => {
  const sql = await getSql();
  const { auth } = await import("@/lib/auth/server");
  const ctx = await auth.$context;
  const hash = await ctx.password.hash(DEMO_PASSWORD);
  const existing = await sql.query(`select id from "user" where lower(email) = $1`, [DEMO_EMAIL]);
  const userId = existing[0] ? String(existing[0].id) : "demo-user";
  if (!existing[0]) {
    await sql.query(
      `insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
       values ($1, $2, $3, true, now(), now())`,
      [userId, DEMO_NAME, DEMO_EMAIL],
    );
  } else {
    await sql.query(`update "user" set name = $1, "updatedAt" = now() where id = $2`, [DEMO_NAME, userId]);
  }
  const accounts = await sql.query(
    `select id from account where "userId" = $1 and "providerId" = 'credential'`,
    [userId],
  );
  if (accounts[0]) {
    await sql.query(`update account set password = $1, "updatedAt" = now() where id = $2`, [hash, String(accounts[0].id)]);
  } else {
    await sql.query(
      `insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
       values ($1, $2, 'credential', $3, $4, now(), now())`,
      [`cred_${userId}`, userId, userId, hash],
    );
  }
  const member = (await sql.query(`select id from members where lower(email) = $1`, [DEMO_EMAIL]))[0];
  if (!member) {
    await sql.query(
      `insert into members (name, email, title, role, initials, tone)
       values ($1, $2, 'Demo / testing', 'admin', 'DM', 'steel')`,
      [DEMO_NAME, DEMO_EMAIL],
    );
  }
  return { ok: true as const, email: DEMO_EMAIL, password: DEMO_PASSWORD, name: DEMO_NAME };
});
