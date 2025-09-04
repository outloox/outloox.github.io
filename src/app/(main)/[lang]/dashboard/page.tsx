
'use client';

import { getDictionary } from "@/lib/i18n/dictionaries";
import { AccountCard } from "@/components/account-card";
import type { Account } from "@/lib/types";
import { AlertCircle, Database, CalendarDays, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { isToday } from "date-fns";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// This is a client-side component now
export default function DashboardPage() {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] as 'en' | 'ar';

  const [dictionary, setDictionary] = useState<any>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lang) return;

    // Fetch dictionary
    getDictionary(lang).then(setDictionary);

    // Fetch accounts from Firebase in real-time
    const accountsRef = ref(db, 'accounts');
    const unsubscribe = onValue(accountsRef, (snapshot) => {
      if (snapshot.exists()) {
        const accountsData = snapshot.val();
        const accountsArray: Account[] = [];
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        for (const key in accountsData) {
            const account = { id: key, ...accountsData[key] };
            // Auto-deletion logic can remain, it's a good feature
            if (account.createdAt && (now - new Date(account.createdAt).getTime() > oneDay)) {
                // Deletion can be handled by a separate process or kept here,
                // but for client-side it's better to just filter them out.
            } else {
                accountsArray.push(account);
            }
        }
        
        accountsArray.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
        
        setAccounts(accountsArray);
      } else {
        setAccounts([]);
      }
      setLoading(false);
    }, (err: any) => {
      console.error("Firebase read failed in Dashboard:", err);
      setError(err.message);
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [lang]);

  if (loading || !dictionary) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

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
              {todayAccounts.map((account, index) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  dictionary={dictionary.home}
                  index={index}
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
              {olderAccounts.map((account, index) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  dictionary={dictionary.home}
                  index={todayAccounts.length + index}
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
