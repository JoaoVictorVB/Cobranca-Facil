-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('PENDENTE', 'ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('ENVIADO', 'RECEBIDO', 'DEVOLVIDO', 'CANCELADO');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "origin_product_id" TEXT,
ADD COLUMN     "origin_supplier_id" TEXT;

-- CreateTable
CREATE TABLE "business_relationships" (
    "id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "reseller_id" TEXT NOT NULL,
    "status" "RelationshipStatus" NOT NULL DEFAULT 'PENDENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),

    CONSTRAINT "business_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfers" (
    "id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "reseller_id" TEXT NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'ENVIADO',
    "items" JSONB NOT NULL,
    "notes" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "received_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_relationships_supplier_id_reseller_id_key" ON "business_relationships"("supplier_id", "reseller_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_origin_product_id_fkey" FOREIGN KEY ("origin_product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_relationships" ADD CONSTRAINT "business_relationships_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_relationships" ADD CONSTRAINT "business_relationships_reseller_id_fkey" FOREIGN KEY ("reseller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_reseller_id_fkey" FOREIGN KEY ("reseller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
