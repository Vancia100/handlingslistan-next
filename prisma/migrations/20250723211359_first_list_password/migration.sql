/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title,createdById]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterEnum
ALTER TYPE "Units" ADD VALUE 'pkt';

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "aliases" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListIngredients" (
    "id" SERIAL NOT NULL,
    "listId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "unit" "Units" NOT NULL,
    "recipeItemID" INTEGER,
    "recipeCuston" TEXT,

    CONSTRAINT "ListIngredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EditableLists" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EditableLists_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EditableLists_B_index" ON "_EditableLists"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_title_createdById_key" ON "Recipe"("title", "createdById");

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListIngredients" ADD CONSTRAINT "ListIngredients_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListIngredients" ADD CONSTRAINT "ListIngredients_recipeItemID_fkey" FOREIGN KEY ("recipeItemID") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditableLists" ADD CONSTRAINT "_EditableLists_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditableLists" ADD CONSTRAINT "_EditableLists_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
