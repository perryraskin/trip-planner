# Migration `20201020021258-trips-fix`

This migration has been generated by Perry Raskin at 10/19/2020, 10:12:58 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Trips" DROP COLUMN "startDate",
DROP COLUMN "endDate",
ADD COLUMN "dateStart" timestamp(3)   NOT NULL ,
ADD COLUMN "dateEnd" timestamp(3)   NOT NULL 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201020015857-trips..20201020021258-trips-fix
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -20,7 +20,7 @@
 model Trips {
   id        Int      @id @default(autoincrement())
   createdAt DateTime @default(now())
   nickname  String
-  startDate DateTime
-  endDate   DateTime
+  dateStart DateTime
+  dateEnd   DateTime
 }
```

