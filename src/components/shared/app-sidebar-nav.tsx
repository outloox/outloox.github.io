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
  Send
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
  { href: "https://t.me/OutlooxBot", label: "telegram", icon: Send, external: true },
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
    const baseClasses = "flex items-center gap-3 px-4 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 rounded-lg";
    const activeClasses = "bg-primary/10 font-semibold text-primary";
    
    const getLinkClass = (href: string) => {
        const currentPath = pathname.replace(`/${lang}`, '') || '/';
        const itemPath = href || '/';
        // Make sure the docs link is highlighted correctly
        if (itemPath === '/docs' && currentPath.startsWith('/docs')) {
            return cn(baseClasses, activeClasses);
        }
        return cn(baseClasses, currentPath === itemPath ? activeClasses : "");
    }
    
    const Wrapper = isMobile ? 'div' : 'nav';
    const wrapperProps = isMobile 
      ? { className: "grid gap-2 text-lg font-medium p-4" }
      : { className: "grid items-start gap-1 px-4 text-sm font-medium" };

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
