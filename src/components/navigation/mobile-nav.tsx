'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';

export function MobileNav(): React.ReactElement {
  const pathname = usePathname();

  return (
    <div className="md:hidden flex gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
            title={item.label}
          >
            <Icon className="w-4 h-4" />
          </Link>
        );
      })}
    </div>
  );
}
