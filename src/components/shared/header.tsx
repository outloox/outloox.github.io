import Link from "next/link";
import { Menu, Mail } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/lib/types";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import { AppSidebarNav } from "./app-sidebar-nav";

type HeaderProps = {
  dictionary: Dictionary;
  lang: string;
};

export function Header({ dictionary, lang }: HeaderProps) {
  const sheetSide = lang === 'ar' ? 'right' : 'left';

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        
        {/* Left Section (in LTR) */}
        <div className="flex items-center gap-2">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side={sheetSide} className="p-0" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <div className="flex h-16 items-center border-b px-6">
                        <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold">
                            <Mail className="h-6 w-6 text-primary" />
                            <span>Outloox</span>
                        </Link>
                    </div>
                    <div className="mt-6">
                        <AppSidebarNav dictionary={dictionary.header} lang={lang} isMobile={true} />
                    </div>
                </SheetContent>
            </Sheet>
             <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold md:hidden">
                <Mail className="h-6 w-6 text-primary" />
                <span>Outloox</span>
            </Link>
        </div>

        {/* Right Section (in LTR) */}
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>

      </div>
    </header>
  );
}
