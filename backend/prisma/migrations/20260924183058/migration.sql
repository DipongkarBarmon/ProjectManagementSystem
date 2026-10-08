-- CreateTable
CREATE TABLE "oauthaccounts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauthaccounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "oauthaccounts_userId_idx" ON "oauthaccounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "oauthaccounts_provider_providerAccountId_key" ON "oauthaccounts"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "oauthaccounts" ADD CONSTRAINT "oauthaccounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
