
"use client";

import { useState, useEffect } from "react";
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
  User,
  Mail,
  Server,
  ChevronDown,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { reportAccount } from "@/lib/actions";
import Cookies from "js-cookie";

type AccountCardProps = {
  account: Account;
  dictionary: Dictionary["home"];
};

export function AccountCard({ account, dictionary }: AccountCardProps) {
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
    const result = await reportAccount(account.id, account.email);
    toast({
      title: result.success ? dictionary.report_success_title : dictionary.report_error_title,
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
    if (result.success) {
      setIsReported(true);
      Cookies.set(`reported_${account.id}`, 'true', { expires: 365 });
    }
    setIsReporting(false);
  }

  const CopyButton = ({ text, type }: { text: string | undefined; type: "email" | "password" }) => (
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(text, type)}>
      {isCopied === type ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
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
              <div className="flex-1 text-left min-w-0">
                <p className="font-normal break-all">{account.email}</p>
                <p className="text-sm text-muted-foreground">{account.country}</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground ml-auto" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-4 pb-4 border-t pt-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-semibold">{dictionary.email}:</span>
                    <span className="font-mono break-all flex-1">{account.email}</span>
                  </div>
                  <CopyButton text={account.email} type="email" />
              </div>

              {account.password && (
                 <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <KeyRound className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-semibold">{dictionary.password}:</span>
                      <span className="font-mono break-all flex-1 min-w-0">{account.password}</span>
                    </div>
                    <CopyButton text={account.password} type="password" />
                </div>
              )}
              
              <div className="flex items-center gap-3 min-w-0">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{dictionary.country}:</span>
                <span className="truncate flex-1 min-w-0">{account.country}</span>
              </div>

              {account.name && (
                <div className="flex items-center gap-3 min-w-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">{dictionary.name}:</span>
                  <span className="truncate flex-1 min-w-0">{account.name}</span>
                </div>
              )}

              {account.services && account.services.length > 0 && (
                <div className="flex items-start gap-3">
                  <Server className="w-4 h-4 text-muted-foreground mt-1" />
                  <span className="font-semibold mt-0.5">{dictionary.services}:</span>
                  <div className="flex flex-wrap gap-2">
                    {account.services.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6">
                <Button
                    onClick={handleReport}
                    disabled={isReporting || isReported}
                    variant="outline"
                    size="sm"
                    className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-60 disabled:cursor-not-allowed gap-2"
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
