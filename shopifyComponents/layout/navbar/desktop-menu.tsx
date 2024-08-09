'use client';

import { VercelMagentoMenu } from 'lib/magento/types';
import Link from 'next/link';
import { useState } from 'react';
import MobileMenu from './mobile-menu';

export default function DesktopMenu({ menu }: { menu: VercelMagentoMenu[] }) {
  const [active, setActive] = useState<VercelMagentoMenu | null>(null);

  return (
    <div>
      {menu.length ? (
        <>
          <ul className="nav-level-0 relative top-[10px] hidden md:gap-[15px] lg:!flex xl:gap-[52px]">
            {menu.map((item, index) => (
              <li
                key={`desktop-nav-level-0-${item.title}-${index + 1}`}
                className={`item-level-0 group h-[50px] md:relative ${
                  active == item && item.hasChildren && 'active'
                }`}
                onClick={() => setActive(active == item ? null : item)}
              >
                {item?.hasChildren ? (
                  <Link
                    href={item.path}
                    className={`text-mediumGray flex items-center gap-[9px] border-b-[2px] border-white text-[12px] font-bold uppercase ${
                      active == item && 'active'
                    } group-hover:border-teal group-hover:text-teal`}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {item.title}
                    <span className="menu-caret">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="6"
                        viewBox="0 0 11 6"
                        fill="none"
                      >
                        <path
                          className={`${active == item && 'active'} group-hover:stroke-teal`}
                          d="M10 1L5.5 5L1 1"
                          stroke="#636569"
                          strokeWidth="1.4"
                        />
                      </svg>
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={item.path}
                    className="text-mediumGray group-hover:border-teal group-hover:text-teal flex items-center gap-[9px] border-b-[2px] border-white text-[12px] font-bold uppercase"
                  >
                    {item.title}
                  </Link>
                )}
                {item.hasChildren && item.children?.length ? (
                  <div
                    className={`submenu absolute left-[-112px] top-[50px] z-[3] hidden w-[768px] bg-white pb-[30px] pl-[55px] pr-[55px] pt-[25px] shadow-menuShadow md:left-[-50px] group-hover:md:block lg:w-max`}
                  >
                    <ul className="nav-level-1 flex flex-wrap gap-[20px] md:grid md:grid-cols-custom lg:auto-cols-auto lg:gap-0">
                      {item.hasChildren &&
                        item.children.map((subItem, index) => {
                          // previous item will be used for displaying style of current item
                          const previousItem = item?.children?.[index - 1];
                          // filtering all same level categories for items with no children to stack them
                          const filterNextItems = (currentIndex: number) => {
                            // looking for next item with children
                            const nextWithChildren =
                              item?.children?.findIndex(
                                (item, index) => index > currentIndex && item.hasChildren
                              ) || -1;
                            // when no items with children index would be -1 -> we change it to never block results from coming
                            const improvedIndex = nextWithChildren > -1 ? nextWithChildren : 1000;
                            // item needs to have index bigger than current, smaller then next item with children and has to have no children.
                            return item?.children?.filter((itemToStack, indexItems) => {
                              return (
                                indexItems > currentIndex &&
                                indexItems < improvedIndex &&
                                !itemToStack.hasChildren
                              );
                            });
                          };

                          // if current item has no children then we need to find all other items next in queue with not children
                          const currentNoChildren = !subItem.hasChildren;
                          const listOfItemsToStack = currentNoChildren
                            ? filterNextItems(index)
                            : [];

                          // create items in menu under conditions - items has children, previous item does not exist or previous item had children
                          return (
                            (previousItem?.hasChildren || !previousItem || subItem.hasChildren) && (
                              <li
                                key={`desktop-nav-level-1-${subItem.title}-${(index + 1) * 100}`}
                                className={`item-level-1 min-w-[150px] shrink-0 grow-0`}
                              >
                                <Link
                                  className="text-teal mb-[15px] block text-[16px] font-bold"
                                  href={subItem.path}
                                >
                                  {subItem.title}
                                </Link>
                                {subItem.hasChildren && subItem.children?.length ? (
                                  <div className="submenu block">
                                    <ul className="nav-level-2">
                                      {subItem.children.map((subChildItem, index) => (
                                        <li
                                          key={`desktop-nav-level-2-${subChildItem.title}-${
                                            (index + 1) * 1000
                                          }`}
                                          className="item-level-2"
                                        >
                                          <Link
                                            className="text-mediumGray text-[13px] capitalize"
                                            href={subChildItem.path}
                                          >
                                            {subChildItem.title}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}
                                {/* displaying all stacked same level category items */}
                                {listOfItemsToStack?.map((stackedItem) => (
                                  <Link
                                    key={stackedItem.path}
                                    className="text-teal mb-[15px] block text-[16px] font-bold"
                                    href={stackedItem.path}
                                  >
                                    {stackedItem.title}
                                  </Link>
                                ))}
                              </li>
                            )
                          );
                        })}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <MobileMenu menu={menu} />
        </>
      ) : null}
    </div>
  );
}
