
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Account, Dictionary } from "@/lib/types";
import {
  Globe,
  KeyRound,
  Mail,
  Server,
  ChevronDown,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { db } from "@/lib/firebase";
import { ref, runTransaction } from "firebase/database";

type AccountCardProps = {
  account: Account;
  dictionary: Dictionary["home"];
  index: number;
};

const REPORTS_TO_DELETE = 20;

async function sendTelegramMessage(message: string) {
    const reportBotToken = '7712257349:AAFY5feUQytjcbUJ443fySEx7SsqvLp1980';
    const reportChatId = '6022061821';
    const url = `https://api.telegram.org/bot${reportBotToken}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: reportChatId,
                text: message,
                parse_mode: 'Markdown',
            }),
        });
        return true;
    } catch (error) {
        console.error('Failed to send Telegram message:', error);
        return false;
    }
}


export function AccountCard({ account, dictionary, index }: AccountCardProps) {
  const [isCopied, setIsCopied] = useState<"email" | "password" | null>(null);
  const [isReported, setIsReported] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const reportedCookie = Cookies.get(`reported_${account.id}`);
    if (reportedCookie) {
      setIsReported(true);
    }
  }, [account.id]);

  const handleCopy = (textToCopy: string | undefined, type: "email" | "password") => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(type);
    toast({
      description: dictionary.copied_to_clipboard,
    });
    setTimeout(() => setIsCopied(null), 2000);
  };
  
  const handleReport = async () => {
    setIsReporting(true);
    try {
        const accountRef = ref(db, `accounts/${account.id}`);
        let accountDeleted = false;
        
        await runTransaction(accountRef, (currentData: Omit<Account, 'id'> | null) => {
            if (currentData === null) return;
            const newReportCount = (currentData.reportCount || 0) + 1;
            if (newReportCount >= REPORTS_TO_DELETE) {
                accountDeleted = true;
                return null;
            } else {
                return { ...currentData, reportCount: newReportCount };
            }
        });

        if (accountDeleted) {
            const message = `*Account Auto-Deleted after ${REPORTS_TO_DELETE} Reports* \n----------------------------- \n*Email:* \`${account.email}\` \n*ID:* \`${account.id}\``;
            await sendTelegramMessage(message);
            toast({ title: dictionary.report_success_title, description: dictionary.report_limit_message });
        } else {
            toast({ title: dictionary.report_success_title, description: dictionary.report_success_message });
        }
        setIsReported(true);
        Cookies.set(`reported_${account.id}`, 'true', { expires: 365 });

    } catch (error) {
        toast({ title: dictionary.report_error_title, description: "An error occurred while reporting the account.", variant: "destructive" });
    } finally {
        setIsReporting(false);
    }
  }

  const handleMoreServicesClick = () => {
    toast({
      title: dictionary.services_toast_title,
      description: dictionary.services_toast_message,
    });
  };

  const CopyButton = ({ text, type }: { text: string | undefined; type: "email" | "password" }) => (
    <Button variant="outline" size="sm" onClick={() => handleCopy(text, type)}>
      {isCopied === type ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      <span>{dictionary.copy_button}</span>
    </Button>
  );

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-card border rounded-lg shadow-sm"
    >
      <AccordionItem value={account.id} className="border-b-0">
        <AccordionTrigger className="p-4 hover:no-underline group w-full">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1 text-left rtl:text-right min-w-0">
                <p className="font-medium text-base">
                  <span>{dictionary.account_prefix}</span>
                  <span className="ms-2 font-mono">{index + 1}</span>
                </p>
                <p className="text-sm text-muted-foreground">{account.country}</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground ml-auto" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-4 pb-4 border-t pt-4">
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-semibold">{dictionary.email}:</span>
                  </div>
                  <CopyButton text={account.email} type="email" />
              </div>

              {account.password && (
                 <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <KeyRound className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-semibold">{dictionary.password}:</span>
                    </div>
                    <CopyButton text={account.password} type="password" />
                </div>
              )}
              
              <div className="flex items-center gap-3 min-w-0">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{dictionary.country}:</span>
                <span className="truncate flex-1 min-w-0">{account.country}</span>
              </div>
              
              <div className="flex items-start gap-3">
                <Server className="w-4 h-4 text-muted-foreground mt-1" />
                <span className="font-semibold mt-0.5">{dictionary.services}:</span>
                <div className="flex flex-wrap gap-2">
                  {account.services && account.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                   <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={handleMoreServicesClick}
                    >
                      ...more
                    </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                 {account.link && (
                    <Button asChild variant="outline" size="sm">
                        <Link href={account.link} target="_blank" rel="noopener noreferrer">
                            <ShieldCheck className="h-4 w-4" />
                            {dictionary.check_account_button}
                        </Link>
                    </Button>
                 )}
                <Button
                    onClick={handleReport}
                    disabled={isReporting || isReported}
                    variant="ghost"
                    size="sm"
                    className="disabled:opacity-60 disabled:cursor-not-allowed gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    {isReporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                    <span>{isReported ? dictionary.reported : (isReporting ? dictionary.reporting : dictionary.report_account)}</span>
                </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
