-- DropForeignKey
ALTER TABLE "public"."Comentary" DROP CONSTRAINT "Comentary_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comentary" DROP CONSTRAINT "Comentary_userid_fkey";

-- AddForeignKey
ALTER TABLE "public"."Comentary" ADD CONSTRAINT "Comentary_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comentary" ADD CONSTRAINT "Comentary_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
