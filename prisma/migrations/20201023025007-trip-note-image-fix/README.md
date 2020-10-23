# Migration `20201023025007-trip-note-image-fix`

This migration has been generated by Perry Raskin at 10/22/2020, 10:50:07 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."TripNoteImage" DROP COLUMN "tripNoteId"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201023024102-tripnotes-user-id..20201023025007-trip-note-image-fix
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
@@ -72,6 +72,5 @@
   tripNoteItemId Int?
   name           String
   sourceUrl      String
   TripNoteItem   TripNoteItem? @relation(fields: [tripNoteItemId], references: [id])
-  tripNoteId     Int?
 }
```

