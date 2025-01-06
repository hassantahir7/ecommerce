-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MEN', 'WOMEN', 'UNISEX');

-- CreateTable
CREATE TABLE "Categories" (
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attachment" TEXT,
    "gender" "Gender" NOT NULL,
    "is_Active" BOOLEAN NOT NULL DEFAULT true,
    "is_Deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("categoryId")
);
