'use client';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { MagentoCartOP } from 'lib/magento/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CouponCode } from './coupon-code';
import { DeleteCartItem } from './delete-item-button';
import { UpdateCartQuantity } from './edit-item-quantity-button';
import { EstimateShippingCart } from './estimate-shipping-cart';
import { TotalSummary } from './total-summary';

export default function CartPageView({
  cartData,
  getShippingMethodsData,
  cartId
}: {
  cartData: MagentoCartOP;
  getShippingMethodsData: MagentoCartOP;
  cartId: string;
}) {
  const [cartDetails, setCartDetails] = useState<MagentoCartOP>(getShippingMethodsData);
  const [lineItems, setLineItems] = useState<MagentoCartOP>(cartData);
  return (
    <div className="mx-auto max-w-[1100px] px-4">
      <h1 className="mb-5 text-3xl font-bold">Shopping Cart Page</h1>
      <div className="justify-between gap-10 md:flex">
        <div className="w-full">
          <div className="mb-6 border border-solid border-slate-300 p-4">
            {lineItems &&
              lineItems.lines?.map((item, i) => {
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
                  <div key={i} className="mb-3 border-b border-solid border-slate-300 pb-3">
                    <div className="flex justify-between">
                      <div className="flex">
                        <Link
                          href={`/product/${item.merchandise.product.handle}`}
                          className="space-x-4"
                        >
                          <Image
                            className=""
                            width={64}
                            height={64}
                            alt={
                              item.merchandise.product.featuredImage.altText ||
                              item.merchandise.product.title
                            }
                            src={item.merchandise.product.featuredImage.url}
                          />
                        </Link>
                        <div>
                          <div>
                            <span>{item.merchandise.product.title}</span>
                            {item.merchandise.title !== DEFAULT_OPTION ? (
                              <p className="text-sm md:text-base">{item.merchandise.title}</p>
                            ) : null}
                          </div>
                          <div className="my-2 text-sm">
                            {item.merchandise?.selectedOptionslabels?.map((option) => (
                              <p className="mb-1" key={option.name}>
                                <strong>{option.name}</strong> {option.name ? ':' : ''}{' '}
                                {option.value}
                              </p>
                            ))}
                          </div>
                          <Price
                            className="text-sm md:text-base"
                            amount={item.cost.totalAmount.amount}
                            currencyCode={item.cost.totalAmount.currencyCode}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="ml-auto flex flex h-9 flex-row items-center items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                          <UpdateCartQuantity
                            cartId={cartId}
                            setLineItems={setLineItems}
                            item={item}
                            type="minus"
                          />
                          <p>
                            <span className="inline-block w-6 text-center">{item.quantity}</span>
                          </p>
                          <UpdateCartQuantity
                            cartId={cartId}
                            setLineItems={setLineItems}
                            item={item}
                            type="plus"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <DeleteCartItem setLineItems={setLineItems} cartId={cartId} item={item} />
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="border border-solid border-slate-300 p-4 md:mb-10">
            <EstimateShippingCart
              cartId={cartId!}
              getShippingMethods={cartDetails!}
              setCurrentShipping={setCartDetails}
              setLineItems={setLineItems}
            />
            <CouponCode cartData={cartDetails!} />
          </div>
        </div>
        <div className="my-6 h-fit min-w-72 border border-solid border-slate-300 p-4 md:my-0">
          <TotalSummary cartData={lineItems} />
          <a
            href={cartDetails.checkoutUrl}
            className="block rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
          >
            Proceed to Checkout
          </a>
        </div>
      </div>
    </div>
  );
}
