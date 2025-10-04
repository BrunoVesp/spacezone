-- DropForeignKey
ALTER TABLE "public"."Comentary" DROP CONSTRAINT "Comentary_userid_fkey";

-- AddForeignKey
ALTER TABLE "public"."Comentary" ADD CONSTRAINT "Comentary_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
