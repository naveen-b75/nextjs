// pages/index.js
'use client';
import { MagentoCartOP } from 'lib/magento/types';
import Image from 'next/image';
import Link from 'next/link';
import { DEFAULT_OPTION } from '../../lib/constants';
import { createUrl } from '../../lib/utils';
import Price from '../price';

export default function ItemsList({ cartData }: { cartData: MagentoCartOP }) {
  return (
    <>
      <div className="relative mx-auto flex max-w-screen-2xl flex-wrap">
        <ul className="relative m-4 mx-auto mb-[20px] flex max-w-screen-2xl flex-grow flex-wrap overflow-auto p-[20px] px-4 py-4">
          {cartData &&
            cartData.lines.map((item, i) => {
              const merchandiseSearchParams: any = {};
              let subTitleWithSelectedOptions = '';
              item.merchandise.selectedOptions.forEach(({ name, value }) => {
                subTitleWithSelectedOptions += `${name}: ${value} `;
                if (value !== DEFAULT_OPTION) {
                  merchandiseSearchParams[name.toLowerCase()] = value;
                }
              });
              const merchandiseUrl = createUrl(
                item.merchandise.product.handle,
                new URLSearchParams(merchandiseSearchParams)
              );
              return (
                <li key={i} className="flex w-full">
                  <div className="border-filterBorder relative m-4 mx-auto mb-[20px] flex max-w-screen-2xl flex-grow flex-wrap justify-between overflow-auto rounded-[6px] border-[1px] p-[20px] px-4 py-4">
                    <Link
                      href={`/product/${item.merchandise.product.handle}`}
                      className="space-x-4"
                    >
                      <div className="shrink-0 grow-0 basis-[24%] md:basis-[18%]">
                        <Image
                          className="w-[50px] md:w-[100px]"
                          width={64}
                          height={64}
                          alt={
                            item.merchandise.product.featuredImage.altText ||
                            item.merchandise.product.title
                          }
                          src={item.merchandise.product.featuredImage.url}
                        />
                      </div>
                      <div className="text-mediumGray mt-[10px] text-[14px] text-base font-bold md:mb-[4px] md:mt-0">
                        <span>{item.merchandise.product.title}</span>
                        {item.merchandise.title !== DEFAULT_OPTION ? (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {item.merchandise.title}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                    <div className="">
                      {item.merchandise.selectedOptionslabels.map((option) => (
                        <p
                          className="text-sm text-neutral-500 dark:text-neutral-400"
                          key={option.name}
                        >
                          {option.name} {option.name ? ':' : ''} {option.value}
                        </p>
                      ))}
                    </div>
                    <div className="flex h-16 flex-col justify-between">
                      <Price
                        className="flex justify-end space-y-2 text-right text-sm"
                        amount={item.cost.totalAmount.amount}
                        currencyCode={item.cost.totalAmount.currencyCode}
                      />
                      <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                        <p className="w-6 text-center">
                          <span className="w-full text-sm">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
