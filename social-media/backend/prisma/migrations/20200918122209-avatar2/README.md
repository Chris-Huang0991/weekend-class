# Migration `20200918122209-avatar2`

This migration has been generated by ENData-Claim at 9/18/2020, 10:22:09 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Avatar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
PRIMARY KEY ("id")
);
INSERT INTO "new_Avatar" ("id", "url") SELECT "id", "url" FROM "Avatar";
DROP TABLE "Avatar";
ALTER TABLE "new_Avatar" RENAME TO "Avatar";
CREATE UNIQUE INDEX "Avatar_userId_unique" ON "Avatar"("userId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
PRIMARY KEY ("id")
);
INSERT INTO "new_User" ("id", "email", "password", "name") SELECT "id", "email", "password", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200918101336-avatar..20200918122209-avatar2
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 generator prisma_client {
   provider = "prisma-client-js"
@@ -18,8 +18,10 @@
 }
 model Avatar {
   id       String  @id @default(cuid())
+  user     User    @relation(fields: [userId], references: [id])
+  userId   String
   url      String
 }
 model Like {
```

