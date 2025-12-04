
"use client";

import * as React from "react";
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
  ChevronDown,
  Copy,
  Check,
  Mail,
  ShieldCheck,
  Server,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";


type AccountCardProps = {
  account: Account;
  dictionary: Dictionary["home"];
  index: number;
};


export function AccountCard({ account, dictionary, index }: AccountCardProps) {
  const [isCopied, setIsCopied] = React.useState<"email" | "password" | null>(null);
  const { toast } = useToast();

  const handleCopy = (textToCopy: string | undefined, type: "email" | "password") => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(type);
    toast({
      description: dictionary.copied_to_clipboard,
    });
    setTimeout(() => setIsCopied(null), 2000);
  };
  
  const handleMoreServicesClick = () => {
    toast({
      title: dictionary.services_toast_title,
      description: dictionary.services_toast_message,
    });
  };

  const CopyButton = ({ text, type, label }: { text: string | undefined; type: "email" | "password", label: string }) => (
    <Button variant="outline" size="sm" onClick={() => handleCopy(text, type)} className="flex-1">
      {isCopied === type ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      <span className="mx-2">{label}</span>
    </Button>
  );

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-card border rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-fade-in-up"
      style={{ animationDelay: `${0.2 + index * 0.05}s` }}
    >
      <AccordionItem value={account.id} className="border-b-0">
        <AccordionTrigger className="p-4 hover:no-underline group w-full">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                 <Mail className="w-4 h-4 text-primary" />
              </div>
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2 w-full">
                        <p className="font-mono text-xs text-muted-foreground truncate bg-muted px-3 py-2 rounded-md flex-1">
                          {account.email}
                        </p>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(account.email, "email")}>
                            {isCopied === 'email' ? <Check className="text-primary" /> : <Copy />}
                        </Button>
                    </div>
                   {account.password && (
                     <div className="flex items-center gap-2 w-full">
                        <p className="font-mono text-xs text-muted-foreground truncate bg-muted px-3 py-2 rounded-md flex-1">
                          {'*'.repeat(12)}
                        </p>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(account.password, "password")}>
                            {isCopied === 'password' ? <Check className="text-primary" /> : <Copy />}
                        </Button>
                    </div>
                   )}
                </div>
              
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

            <div className="mt-6">
                <Button asChild variant="default" size="lg" className="w-full h-12 text-base md:h-11 md:text-sm">
                    <Link href={`https://t.me/OutlooxBot?start=${account.id}`} target="_blank" rel="noopener noreferrer">
                        <ShieldCheck className="h-4 w-4" />
                        {dictionary.check_account_button}
                    </Link>
                </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
