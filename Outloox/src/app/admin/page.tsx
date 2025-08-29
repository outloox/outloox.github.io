'use client';

import { useState, useEffect, useTransition } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import type { Account } from '@/lib/types';
import { addAccount, deleteAccount } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Loader2, PlusCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getCountryNameByFlag } from '@/lib/country-flags';

type AccountsList = (Account & { id: string })[];

export default function AdminPage() {
  const [accounts, setAccounts] = useState<AccountsList>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isAdding, startAddTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [countryInput, setCountryInput] = useState("");

  useEffect(() => {
    const accountsRef = ref(db, 'accounts');
    const unsubscribe = onValue(accountsRef, (snapshot) => {
      setError(null);
      try {
        if (snapshot.exists()) {
          const accountsData = snapshot.val();
          const accountsArray = Object.keys(accountsData).map(key => ({ id: key, ...accountsData[key] }));
          setAccounts(accountsArray);
        } else {
          setAccounts([]);
        }
      } catch (err: any) {
        console.error("Firebase read failed in AdminPage:", err);
        setError(`Failed to process data from the database. Details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }, (err: any) => {
        console.error("Firebase connection failed in AdminPage:", err);
        setError(`Failed to connect to the database. Check Firebase rules and config. Details: ${err.message}`);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddAccount = async (formData: FormData) => {
    const form = document.getElementById('add-account-form') as HTMLFormElement;
    startAddTransition(async () => {
      const result = await addAccount(null, formData);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      if (result.success) {
        form?.reset();
        setCountryInput("");
      }
    });
  };

  const handleDeleteAccount = (accountId: string) => {
    startDeleteTransition(async () => {
      const result = await deleteAccount(accountId);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    });
  };
  
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Admin Panel</h1>
          <p className="mt-2 text-lg text-muted-foreground">Manage your Outloox application.</p>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading Admin Panel...</p>
          </div>
        )}

        {error && !loading && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Connection Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
              <CardHeader>
                <CardTitle>Add New Account</CardTitle>
                <CardDescription>Fill in the details to add a new account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="add-account-form" action={handleAddAccount} className="space-y-4">
                  <Input name="email" placeholder="Email" required type="email" />
                  <Input name="password" placeholder="Password" />
                  <Input name="name" placeholder="Name" />
                  <Input 
                    name="country" 
                    placeholder="Country (e.g. 🇸🇦 or Saudi Arabia)" 
                    required 
                    value={countryInput}
                    onChange={(e) => setCountryInput(e.target.value)}
                  />
                  <Input name="services" placeholder="Services (comma-separated)" />
                  <Button type="submit" disabled={isAdding} className="gap-2 w-full">
                    {isAdding ? <Loader2 className="animate-spin h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                    Add Account
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Accounts</CardTitle>
                <CardDescription>{accounts.length} accounts found.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{account.email}</p>
                            <p className="text-sm text-muted-foreground truncate">{account.country}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)} disabled={isDeleting} className="shrink-0 ml-4">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No accounts found.</p>
                      <p className="text-sm text-muted-foreground/80">Add one using the form on the left.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
