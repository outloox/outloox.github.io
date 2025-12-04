import Link from "next/link";
import { Menu, Mail } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/lib/types";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import { AppSidebarNav } from "./app-sidebar-nav";
import { ModeToggle } from "../mode-toggle";

type HeaderProps = {
  dictionary: Dictionary;
  lang: string;
};

export function Header({ dictionary, lang }: HeaderProps) {
  const sheetSide = lang === 'ar' ? 'right' : 'left';

  return (
    <header className="sticky top-0 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 z-50">
       
        {/* Desktop Nav */}
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
                href={`/${lang}`}
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
                <Mail className="h-6 w-6 text-primary" />
                <span className="whitespace-nowrap">Outloox</span>
            </Link>
            <AppSidebarNav dictionary={dictionary.header} contactDictionary={dictionary.contact} lang={lang} isMobile={false} />
        </nav>

        {/* Mobile Nav Trigger */}
        <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                  <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                  </Button>
              </SheetTrigger>
              <SheetContent side={sheetSide} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                   <Link href={`/${lang}`} className="flex items-center gap-2 text-lg font-semibold mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                      <span>Outloox</span>
                    </Link>
                  <AppSidebarNav dictionary={dictionary.header} contactDictionary={dictionary.contact} lang={lang} isMobile={true} />
              </SheetContent>
            </Sheet>
        </div>
      
      <div className="flex w-full items-center justify-end gap-2">
          <ModeToggle />
          <LanguageSwitcher />
      </div>
    </header>
  );
}
