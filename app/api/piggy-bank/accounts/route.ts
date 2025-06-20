import { piggyBankAccountService } from '@/app/lib/services/piggyBankAccountService';
import { createApiHandler, successResponse } from '@/app/lib/api-utils';

export const dynamic = 'force-dynamic';

export const GET = createApiHandler(async () => {
  const accounts = await piggyBankAccountService.getAllAccounts();

  // Format response to match expected structure
  const formattedAccounts = accounts.map((account) => ({
    account_id: account.account_id,
    user_name: account.user_name || 'Unknown',
    balance: account.balance,
  }));

  return successResponse(formattedAccounts);
});
