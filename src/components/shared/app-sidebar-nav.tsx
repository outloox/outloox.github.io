"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/types";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContactForm } from "@/components/contact-form";
import { Button } from "../ui/button";

type NavItem = {
  href: string;
  label: keyof Omit<Dictionary["header"], 'title' | 'contact'>;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { href: "/", label: "home", icon: Home },
  { href: "/dashboard", label: "dashboard", icon: LayoutDashboard },
  { href: "/docs", label: "docs", icon: BookOpen },
];

type AppSidebarNavProps = {
  dictionary: Dictionary['header'];
  contactDictionary: Dictionary['contact'];
  lang: string;
  isMobile?: boolean;
};

export function AppSidebarNav({
  dictionary,
  contactDictionary,
  lang,
  isMobile = false,
}: AppSidebarNavProps) {
    const pathname = usePathname();
    const [isContactOpen, setContactOpen] = React.useState(false);

    const desktopClasses = "transition-colors hover:text-foreground text-muted-foreground whitespace-nowrap";
    const mobileClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary whitespace-nowrap";
    const activeDesktopClasses = "text-foreground font-semibold";
    const activeMobileClasses = "bg-muted text-primary";
    
    const getLinkClass = (href: string) => {
        const currentPath = pathname.replace(`/${lang}`, '') || '/';
        const itemPath = href || '/';
        const isActive = (currentPath === itemPath) || (itemPath !== '/' && currentPath.startsWith(itemPath));
        
        if (isMobile) {
            return cn(mobileClasses, isActive ? activeMobileClasses : "");
        }
        return cn(desktopClasses, isActive ? activeDesktopClasses : "");
    }
    
    const Wrapper = isMobile ? 'div' : 'nav';
    const wrapperProps = isMobile 
      ? { className: "grid gap-2 text-lg font-medium" }
      : { className: "flex items-center gap-6 text-sm" };

    const ContactTrigger = isMobile ? 'div' : Button;
    const contactTriggerProps = isMobile 
        ? { className: cn(mobileClasses) }
        : { variant: "ghost", className: cn(desktopClasses, 'p-0 h-auto') };

  return (
    <Wrapper {...wrapperProps}>
      {navItems.map(({ href, label, icon: Icon }) => {
        if (!dictionary[label]) return null;
        
        const finalHref = `/${lang}${href === '/' ? '' : href}`;
        return (
            <Link key={label} href={finalHref} className={getLinkClass(href)}>
              {isMobile && <Icon className="h-5 w-5" />}
              {dictionary[label]}
            </Link>
        )
      })}
       <Dialog open={isContactOpen} onOpenChange={setContactOpen}>
        <DialogTrigger asChild>
            <ContactTrigger {...contactTriggerProps}>
              {isMobile && <MessageSquare className="h-5 w-5" />}
              {dictionary.contact}
            </ContactTrigger>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{contactDictionary.title}</DialogTitle>
                <DialogDescription>{contactDictionary.description}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
               <ContactForm dictionary={contactDictionary} lang={lang} setOpen={setContactOpen} />
            </div>
        </DialogContent>
      </Dialog>
    </Wrapper>
  );
}
