import { getDictionary } from "@/lib/i18n/dictionaries";
import { AccountCard } from "@/components/account-card";
import type { Account } from "@/lib/types";
import { AlertCircle, Database, CalendarDays } from "lucide-react";
import { db } from "@/lib/firebase";
import { get, ref, remove } from "firebase/database";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { isToday } from "date-fns";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }]
}

// This function fetches all accounts from Firebase Realtime Database
async function getAccountsFromDB(): Promise<{ accounts: Account[] | null, error: string | null }> {
  try {
    const accountsRef = ref(db, 'accounts');
    const snapshot = await get(accountsRef);
    if (snapshot.exists()) {
      const accountsData = snapshot.val();
      const accountsArray: Account[] = [];
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      for (const key in accountsData) {
        const account = { id: key, ...accountsData[key] };
        // Auto-delete accounts older than 24 hours
        if (account.createdAt && (now - new Date(account.createdAt).getTime() > oneDay)) {
          await remove(ref(db, `accounts/${key}`));
        } else {
          accountsArray.push(account);
        }
      }

      // Sort accounts by creation date, newest first
      accountsArray.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });


      return { accounts: accountsArray, error: null };
    }
    return { accounts: [], error: null };
  } catch (e: any) {
    console.error("Firebase read/delete failed in Dashboard:", e);
    return { accounts: null, error: e.message };
  }
}

export default async function DashboardPage({
  params,
}: {
  params: { lang: "en" | "ar" };
}) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  const { accounts, error } = await getAccountsFromDB();

  const todayAccounts = accounts?.filter(acc => acc.createdAt && isToday(new Date(acc.createdAt))) || [];
  const olderAccounts = accounts?.filter(acc => !acc.createdAt || !isToday(new Date(acc.createdAt))) || [];

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex justify-center py-16">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{dictionary.home.error}</AlertTitle>
            <AlertDescription>
              {dictionary.home.error_desc}
              <p className="text-xs mt-2 font-mono">Details: {error}</p>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    
    if (!accounts || accounts.length === 0) {
      return (
         <div className="text-center py-16 px-6 rounded-lg bg-card/50 border border-dashed">
          <Database className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">
            {dictionary.home.noAccounts}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {dictionary.home.noAccounts_desc}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {todayAccounts.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{dictionary.home.posted_today}</h2>
            </div>
            <div className="space-y-4">
              {todayAccounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  dictionary={dictionary.home}
                />
              ))}
            </div>
          </div>
        )}

        {olderAccounts.length > 0 && (
          <div>
             <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">{dictionary.home.posted_previously}</h2>
            </div>
            <div className="space-y-4">
              {olderAccounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  dictionary={dictionary.home}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            {dictionary.home.title}
          </h1>
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            {dictionary.home.description}
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
