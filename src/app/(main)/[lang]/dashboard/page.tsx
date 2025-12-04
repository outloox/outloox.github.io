
'use client';

import { getDictionary } from "@/lib/i18n/dictionaries";
import { AccountCard } from "@/components/account-card";
import type { Account } from "@/lib/types";
import { AlertCircle, Database, CalendarDays, Loader2 } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { isToday } from "date-fns";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export default function DashboardPage() {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] as 'en' | 'ar';

  const [dictionary, setDictionary] = useState<any>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lang) return;

    const fetchDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    };
    fetchDictionary();

    const accountsRef = ref(db, 'accounts');
    const unsubscribe = onValue(accountsRef, (snapshot) => {
        setLoading(true);
        setError(null);
        try {
            if (snapshot.exists()) {
                const accountsData = snapshot.val();
                const accountsArray: Account[] = Object.keys(accountsData).map(key => ({
                    id: key,
                    ...accountsData[key]
                }));
                accountsArray.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
                setAccounts(accountsArray);
            } else {
                setAccounts([]);
            }
        } catch (err: any) {
            console.error("Data processing failed in Dashboard:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, (err: any) => {
        console.error("Data fetch failed in Dashboard:", err);
        setError(`Failed to connect to the database. Check Firebase rules and config. Details: ${err.message}`);
        setLoading(false);
    });

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
         <div className="text-center py-16 px-6 rounded-lg bg-card border border-dashed animate-fade-in-up">
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
      <div className="space-y-8 animate-fade-in-up">
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
          <div className="mt-12">
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
    <div className="container py-8 md:py-12 animate-fade-in-up">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
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
