"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/types";
import {
  Home,
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Newspaper
} from "lucide-react";

type NavItem = {
  href: string;
  label: keyof Omit<Dictionary["header"], 'title'>;
  icon: React.ElementType;
  external?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "home", icon: Home },
  { href: "/dashboard", label: "dashboard", icon: LayoutDashboard },
  { href: "/docs", label: "docs", icon: BookOpen },
  { href: "/contact", label: "contact", icon: MessageSquare },
  { href: "https://t.me/Outloo_X", label: "news", icon: Newspaper, external: true },
];

type AppSidebarNavProps = {
  dictionary: Dictionary["header"];
  lang: string;
  isMobile?: boolean;
};

export function AppSidebarNav({
  dictionary,
  lang,
  isMobile = false,
}: AppSidebarNavProps) {
    const pathname = usePathname();
    const baseClasses = "flex items-center gap-4 px-4 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 rounded-lg";
    const activeClasses = "bg-primary/10 font-semibold text-primary";
    
    const getLinkClass = (href: string) => {
        const currentPath = pathname.replace(`/${lang}`, '') || '/';
        const itemPath = href || '/';
        return cn(baseClasses, currentPath === itemPath ? activeClasses : "");
    }
    
    const Wrapper = isMobile ? 'div' : 'nav';
    const wrapperProps = isMobile 
      ? { className: "grid gap-2 text-lg font-medium p-4" }
      : { className: "grid items-start gap-2 px-4 text-sm font-medium" };

  return (
    <Wrapper {...wrapperProps}>
      {navItems.map(({ href, label, icon: Icon, external }) => {
        if (!dictionary[label]) return null;
        
        if (external) {
            return (
                <a 
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={baseClasses}
                >
                    <Icon className="h-5 w-5" />
                    {dictionary[label]}
                </a>
            )
        }

        const finalHref = `/${lang}${href === '/' ? '' : href}`;
        return (
            <Link key={label} href={finalHref} className={getLinkClass(href)}>
              <Icon className="h-5 w-5" />
              {dictionary[label]}
            </Link>
        )
      })}
    </Wrapper>
  );
}
