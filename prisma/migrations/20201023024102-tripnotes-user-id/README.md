# Migration `20201023024102-tripnotes-user-id`

This migration has been generated by Perry Raskin at 10/22/2020, 10:41:02 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."TripNote" ADD COLUMN "userId" integer   

ALTER TABLE "public"."TripNote" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201022034959-trip-notes..20201023024102-tripnotes-user-id
--- datamodel.dml
+++ datamodel.dml
@@ -2,21 +2,22 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
 }
 model User {
-  id        Int      @id @default(autoincrement())
-  createdAt DateTime @default(now())
+  id        Int        @id @default(autoincrement())
+  createdAt DateTime   @default(now())
   name      String
   email     String
   Trips     Trip[]
+  TripNotes TripNote[]
 }
 model Trip {
   id             Int        @id @default(autoincrement())
@@ -32,13 +33,15 @@
 model TripNote {
   id            Int            @id @default(autoincrement())
   createdAt     DateTime       @default(now())
+  userId        Int?
   tripId        Int?
   tripNoteType  Int
   tag           String
   title         String
   subtitle      String
+  User          User?          @relation(fields: [userId], references: [id])
   Trip          Trip?          @relation(fields: [tripId], references: [id])
   TripNoteCosts TripNoteCost[]
   TripNoteItems TripNoteItem[]
 }
```

