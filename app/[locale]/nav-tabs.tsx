'use client';

import { usePathname } from 'next/navigation';
import { Link } from '../lib/navigation';

interface Tab {
  href: string;
  label: string;
}

export function NavTabs({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {tabs.map((tab) => {
        const active = tab.href === '/'
          ? /^\/[a-z]{2}\/?$/.test(pathname)           // home: match /en or /fr exactly
          : pathname.includes(tab.href.replace(/^\//, ''));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[
              'px-3 py-1.5 rounded-md text-sm transition-colors',
              active
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
            ].join(' ')}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
