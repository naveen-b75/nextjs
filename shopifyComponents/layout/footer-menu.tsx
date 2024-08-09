'use client';

import clsx from 'clsx';
import { VercelMenu as Menu } from 'lib/bigcommerce/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const FooterMenuItem = ({ item }: { item: Menu }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <li>
      <Link
        href={item.path}
        className={clsx(
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300',
          {
            'text-black dark:text-neutral-300': active
          }
        )}
      >
        {item.title}
      </Link>
    </li>
  );
};

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <nav className="w-full flex-wrap justify-around md:flex">
      <div className="mb-4 md:mb-0">
        <h3 className="mb-2 text-base font-bold text-black">Account</h3>
        <ul>
          <li className="mb-2">
            <Link href="" className="hover:underline">
              Sign In
            </Link>
          </li>
          <li className="mb-2">
            <Link href="" className="hover:underline">
              Register
            </Link>
          </li>
          <li className="mb-2">
            <Link href="" className="hover:underline">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
      <div className="mb-4 md:mb-0">
        <h3 className="mb-2 text-base font-bold text-black">About Us</h3>
        <ul>
          <li className="mb-2">
            <Link href="" className="hover:underline">
              About us
            </Link>
          </li>
          <li className="mb-2">
            <Link href="" className="hover:underline">
              Customer Service
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="mb-2 text-base font-bold text-black">Help</h3>
        <ul>
          <li className="mb-2">
            <Link href="" className="hover:underline">
              Privacy and Cookie Policy
            </Link>
          </li>
          <li className="mb-2">
            <Link href="" className="hover:underline">
              Search Terms
            </Link>
          </li>
          <li className="mb-2">
            <Link href="" className="hover:underline">
              Orders and Returns
            </Link>
          </li>
          <li className="mb-2">
            <Link href="" className="hover:underline">
              Advanced Search
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
