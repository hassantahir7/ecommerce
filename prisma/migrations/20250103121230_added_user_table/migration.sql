-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "profilePic" TEXT DEFAULT 'dummy',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contactNumber" TEXT,
    "dateOfBirth" TEXT,
    "address" TEXT,
    "is_emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "is_contactNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "is_Active" BOOLEAN NOT NULL DEFAULT true,
    "is_Deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_contactNumber_key" ON "User"("contactNumber");
