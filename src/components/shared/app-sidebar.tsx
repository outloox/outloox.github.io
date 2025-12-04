import Link from "next/link";
import { Mail } from "lucide-react";
import { AppSidebarNav } from "./app-sidebar-nav";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/types";

type AppSidebarProps = {
  dictionary: Dictionary;
  lang: string;
}

export function AppSidebar({ dictionary, lang }: AppSidebarProps) {
  return (
    <aside className={cn("hidden md:block md:w-64 border-r rtl:border-r-0 rtl:border-l bg-muted/40")}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold">
            <Mail className="h-6 w-6 text-primary" />
            <span>Outloox</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
            <AppSidebarNav dictionary={dictionary.header} lang={lang} isMobile={false} />
        </div>
      </div>
    </aside>
  );
}
