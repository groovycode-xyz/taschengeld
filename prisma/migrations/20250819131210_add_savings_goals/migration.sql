-- CreateTable
CREATE TABLE "public"."savings_goals" (
    "goal_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon_name" VARCHAR(50) NOT NULL,
    "target_amount" DECIMAL(15,2) NOT NULL,
    "current_balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "savings_goals_pkey" PRIMARY KEY ("goal_id")
);

-- CreateTable
CREATE TABLE "public"."savings_goal_transactions" (
    "transaction_id" SERIAL NOT NULL,
    "goal_id" INTEGER NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "transaction_type" VARCHAR(20) NOT NULL,
    "transaction_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "from_piggybank" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "savings_goal_transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- AddForeignKey
ALTER TABLE "public"."savings_goals" ADD CONSTRAINT "savings_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."savings_goal_transactions" ADD CONSTRAINT "savings_goal_transactions_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."savings_goals"("goal_id") ON DELETE CASCADE ON UPDATE CASCADE;
