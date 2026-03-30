PRAGMA foreign_keys=off;
BEGIN TRANSACTION;

-- Recreate User table to extend CHECK constraint to include 'STAFF'
CREATE TABLE "User_new" (
  id TEXT PRIMARY KEY DEFAULT (cuid()),
  name TEXT,
  email TEXT,
  hashedPassword TEXT,
  role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('USER','ADMIN','STAFF')),
  organizationId TEXT,
  emailVerified DATETIME,
  image TEXT
);

-- Preserve unique index on email if present
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User_new" (email);

-- Copy existing data; normalize role to allowed values
INSERT INTO "User_new" (id, name, email, hashedPassword, role, organizationId, emailVerified, image)
SELECT id, name, email, hashedPassword,
       CASE WHEN role IN ('USER','ADMIN','STAFF') THEN role ELSE 'USER' END as role,
       organizationId, emailVerified, image
FROM "User";

-- Drop old table and rename
DROP TABLE IF EXISTS "User";
ALTER TABLE "User_new" RENAME TO "User";

COMMIT;
PRAGMA foreign_keys=on;

