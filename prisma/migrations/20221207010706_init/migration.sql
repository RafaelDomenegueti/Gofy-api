-- CreateTable
CREATE TABLE "tb_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "tb_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_contents" (
    "id" TEXT NOT NULL,
    "banner" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "author" TEXT,
    "isPublic" BOOLEAN NOT NULL,
    "creatorId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "like" BOOLEAN NOT NULL,

    CONSTRAINT "tb_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tb_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_contentTags" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "tb_contentTags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_email_key" ON "tb_users"("email");

-- AddForeignKey
ALTER TABLE "tb_contents" ADD CONSTRAINT "tb_contents_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_purchases" ADD CONSTRAINT "tb_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_purchases" ADD CONSTRAINT "tb_purchases_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "tb_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_contentTags" ADD CONSTRAINT "tb_contentTags_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "tb_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_contentTags" ADD CONSTRAINT "tb_contentTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tb_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
