'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import CloseIcon from '../../icons/close';
import MenuIcon from '../../icons/menu';

import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { VercelMagentoMenu } from 'lib/magento/types';

export default function MobileMenu({ menu }: { menu: VercelMagentoMenu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [active, setActive] = useState<VercelMagentoMenu | null>(null);
  const [isactive, issetActive] = useState<VercelMagentoMenu | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuIsOpen]);

  useEffect(() => {
    setMobileMenuIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={() => {
          setMobileMenuIsOpen(!mobileMenuIsOpen);
        }}
        aria-label="Open mobile menu"
        className="menu-toggle relative top-[5px] lg:hidden"
        data-testid="open-mobile-menu"
      >
        <MenuIcon className="h-6" />
      </button>
      <AnimatePresence initial={false}>
        {mobileMenuIsOpen && (
          <Dialog
            as={motion.div}
            initial="closed"
            animate="open"
            exit="closed"
            key="dialog"
            static
            open={mobileMenuIsOpen}
            onClose={() => {
              //setMobileMenuIsOpen(false);
            }}
            className="fixed left-0 top-0 z-50 h-[90vh] w-full overflow-auto bg-white"
          >
            <motion.div
              variants={{
                open: { opacity: 1, backdropFilter: 'blur(0.5px)' },
                closed: { opacity: 0, backdropFilter: 'blur(0px)' }
              }}
              className="fixed inset-0 left-0 right-0 h-full w-full bg-white"
              aria-hidden="true"
            />
            <div className="inset-0 flex h-full justify-end bg-white" data-testid="mobile-menu">
              <Dialog.Panel
                as={motion.div}
                variants={{
                  open: { translateX: 0 },
                  closed: { translateX: '-100%' }
                }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                className="flex w-full flex-col bg-white pb-6 dark:bg-black"
              >
                <div className="">
                  <button
                    className="close-menu text-mediumGray flex w-full items-center gap-[12px] border-b border-[#e2e2e2] pb-[22px] pl-[26px] pr-0 pt-[22px] text-[14px] font-semibold capitalize"
                    onClick={() => {
                      setMobileMenuIsOpen(false);
                    }}
                    aria-label="Close mobile menu"
                    data-testid="close-mobile-menu"
                  >
                    <CloseIcon className="h-6" />
                    <span>close</span>
                  </button>

                  {menu.length ? (
                    <ul className="nav-level-0 flex flex-col">
                      {menu.map((item, index) => (
                        <>
                          <li
                            key={`nav-level-0-${item.title}-${index + 1}`}
                            className={`item-level-0 ${active == item && 'active'}`}
                          >
                            {item.hasChildren ? (
                              <Link
                                href={item.path}
                                className="text-teal flex items-center justify-between border-b border-[#e2e2e2] px-[26px] py-[14px] text-[14px] font-semibold uppercase leading-normal"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setActive(active == item ? null : item);
                                }}
                              >
                                {item.title}
                                <span className="menu-caret">
                                  <svg
                                    className={`${
                                      active == item && 'active'
                                    } [.active&]:rotate-180`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="11"
                                    height="6"
                                    viewBox="0 0 11 6"
                                    fill="none"
                                  >
                                    <path d="M10 1L5.5 5L1 1" stroke="#636569" strokeWidth="1.4" />
                                  </svg>
                                </span>
                              </Link>
                            ) : (
                              <Link
                                href={item.path}
                                className="text-teal flex items-center justify-between border-b border-[#e2e2e2] px-[26px] py-[14px] text-[14px] font-semibold uppercase leading-normal"
                              >
                                {item.title}
                              </Link>
                            )}
                            {item.children?.length ? (
                              <div
                                className={`${active == item && 'active'} hidden [.active&]:block`}
                              >
                                <ul className="nav-level-1 flex flex-col">
                                  {item.hasChildren &&
                                    item.children.map((subItem, index) => (
                                      <>
                                        <li
                                          key={`nav-level-1-${subItem.title}-${(index + 1) * 100}`}
                                          className="item-level-1 active [.active&]:border-[#e2e2e2]] [.active&]:border-b"
                                        >
                                          <Link
                                            href={subItem.path}
                                            className="item-level-1 active text-teal flex items-center justify-between border-b border-[#e2e2e2] py-[14px] pl-[45px] pr-[26px] text-[14px] font-semibold uppercase leading-normal [.active&]:border-b-0"
                                          >
                                            {subItem.title}
                                          </Link>
                                          {subItem.hasChildren && subItem.children?.length ? (
                                            <div className="submenu active hidden [.active&]:block">
                                              <ul className="nav-level-2 flex flex-col">
                                                {subItem.children.map((subChildItem, index) => (
                                                  <li
                                                    key={`nav-level-2-${subChildItem.title}-${
                                                      (index + 1) * 1000
                                                    }`}
                                                    className="item-level-2"
                                                  >
                                                    <Link
                                                      href={subChildItem.path}
                                                      className="text-mediumGray border-0 py-0 pl-[60px] pr-0 text-[13px] font-normal capitalize leading-[32px]"
                                                    >
                                                      {subChildItem.title}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          ) : null}
                                        </li>
                                      </>
                                    ))}
                                </ul>
                              </div>
                            ) : null}
                          </li>
                        </>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
