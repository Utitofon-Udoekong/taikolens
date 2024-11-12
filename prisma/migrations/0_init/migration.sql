-- CreateTable
CREATE TABLE "taiko_account" (
    "vid" BIGINT NOT NULL,
    "block_range" TEXT NOT NULL,
    "id" BYTEA NOT NULL,
    "balance" DECIMAL NOT NULL,
    "last_transaction_timestamp" DECIMAL NOT NULL,
    "is_minter" BOOLEAN NOT NULL,
    "_gs_chain" TEXT NOT NULL,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "taiko_account_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "taiko_approval" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "owner" BYTEA NOT NULL,
    "spender" BYTEA NOT NULL,
    "value" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT NOT NULL,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "taiko_approval_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "taiko_daily_metric" (
    "vid" BIGINT NOT NULL,
    "block_range" TEXT NOT NULL,
    "id" BYTEA NOT NULL,
    "date" TEXT NOT NULL,
    "transfer_count" DECIMAL NOT NULL,
    "active_users" DECIMAL NOT NULL,
    "volume" DECIMAL NOT NULL,
    "mint_volume" DECIMAL NOT NULL,
    "burn_volume" DECIMAL NOT NULL,
    "average_transfer_value" DECIMAL NOT NULL,
    "largest_transfer" DECIMAL NOT NULL,
    "unique_minters" DECIMAL NOT NULL,
    "_gs_chain" TEXT NOT NULL,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "taiko_daily_metric_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "taiko_hourly_metric" (
    "vid" BIGINT NOT NULL,
    "block_range" TEXT NOT NULL,
    "id" BYTEA NOT NULL,
    "hour" TEXT NOT NULL,
    "transfer_count" DECIMAL NOT NULL,
    "active_users" DECIMAL NOT NULL,
    "volume" DECIMAL NOT NULL,
    "mint_volume" DECIMAL NOT NULL,
    "burn_volume" DECIMAL NOT NULL,
    "average_transfer_value" DECIMAL NOT NULL,
    "_gs_chain" TEXT NOT NULL,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "taiko_hourly_metric_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "taiko_minter" (
    "vid" BIGINT NOT NULL,
    "block_range" TEXT NOT NULL,
    "id" BYTEA NOT NULL,
    "address" BYTEA NOT NULL,
    "token" BYTEA NOT NULL,
    "added_at" DECIMAL NOT NULL,
    "removed_at" DECIMAL,
    "is_active" BOOLEAN NOT NULL,
    "minted_amount" DECIMAL NOT NULL,
    "mint_count" DECIMAL NOT NULL,
    "add_transaction_hash" BYTEA NOT NULL,
    "remove_transaction_hash" BYTEA,
    "_gs_chain" TEXT NOT NULL,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "taiko_minter_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "taiko_ownership_transferred" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "previous_owner" BYTEA NOT NULL,
    "new_owner" BYTEA NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT NOT NULL,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "taiko_ownership_transferred_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "taiko_token" (
    "vid" BIGINT NOT NULL,
    "block_range" TEXT NOT NULL,
    "id" BYTEA NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "total_supply" DECIMAL NOT NULL,
    "transfer_count" DECIMAL NOT NULL,
    "holder_count" DECIMAL NOT NULL,
    "last_update_timestamp" DECIMAL NOT NULL,
    "owner" BYTEA NOT NULL,
    "_gs_chain" TEXT NOT NULL,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "taiko_token_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "taiko_transfer" (
    "vid" BIGINT NOT NULL,
    "block_range" TEXT NOT NULL,
    "id" BYTEA NOT NULL,
    "from" BYTEA NOT NULL,
    "to" BYTEA NOT NULL,
    "value" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "is_mint" BOOLEAN NOT NULL,
    "is_burn" BOOLEAN NOT NULL,
    "_gs_chain" TEXT NOT NULL,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "taiko_transfer_pkey" PRIMARY KEY ("_gs_gid")
);

