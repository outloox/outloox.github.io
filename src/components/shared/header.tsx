import Link from "next/link";
import { Mail, Menu } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/types";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import { AppSidebarNav } from "./app-sidebar-nav";

type HeaderProps = {
  dictionary: Dictionary["header"];
  lang: string;
};

export function Header({ dictionary, lang }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex h-16 items-center border-b px-6">
            <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold">
              <Mail className="h-6 w-6 text-primary" />
              <span>{dictionary.title}</span>
            </Link>
          </div>
          <div className="mt-6">
            <AppSidebarNav dictionary={dictionary} lang={lang} isMobile={true} />
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
