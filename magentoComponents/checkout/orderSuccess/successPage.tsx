import { DEFAULT_OPTION } from 'lib/constants';
import { MagentoCartOP } from 'lib/magento/types';
import Price from 'magentoComponents/price';
import Image from 'next/image';

export default function OrderFunction({
  orderData,
  currentShipping,
  currentCart
}: {
  currentShipping: MagentoCartOP;
  orderData: string;
  currentCart: any;
}) {
  return (
    <div className="order-success relative mx-auto mb-[40px] max-w-[1440px]">
      <h2 className="bold my-[30px] text-[26px] text-lightBlack md:font-[700]">Order Success</h2>
      <div className="flex flex-wrap items-start justify-between">
        <div className="border-filterBorder mb-[40px] basis-full rounded-[6px] border-[1px] p-[20px] md:shrink-0 md:grow-0 md:basis-[59%]">
          <p className="text-[22px]">Thank you for your order! Your Order Number is: {orderData}</p>
          <p className="my-[20px]">
            You will also receive an email with the details and we will let you know when your order
            has shipped.
          </p>
          <div className="flex gap-[40px]">
            <div className="shipping-section">
              <h3 className="mb-[20px] text-[18px] font-bold">Shipping Information</h3>
              <div className="shipping-information">
                <div className="ship-to-email">{currentShipping.email}</div>
                <div>
                  <span className="shipfirstname">
                    {currentShipping.shipping_addresses?.[0]?.firstname}
                  </span>{' '}
                  &nbsp;
                  <span className="shiplastname">
                    {currentShipping.shipping_addresses?.[0]?.lastname}
                  </span>
                </div>
                <div className="shipphoneno">
                  {currentShipping.shipping_addresses?.[0]?.telephone}
                </div>
                <div className="shipstreet1">
                  {currentShipping.shipping_addresses?.[0]?.street?.[0]}
                </div>
                <span className="shipstreet2">
                  {currentShipping.shipping_addresses?.[0]?.street?.[1]
                    ? currentShipping.shipping_addresses[0].street[1]
                    : ''}
                </span>
                <div className="shipcity">{currentShipping?.shipping_addresses?.[0]?.city},</div>
                <div className="shipregion">
                  {currentShipping?.shipping_addresses?.[0]?.region?.label}
                </div>
                <div className="shipzipcode">
                  {currentShipping?.shipping_addresses?.[0]?.postcode}
                </div>
                <div className="shipcountry">
                  {/* {currentShipping.shipping_addresses[0]?.country.label} */}
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-[20px] text-[18px] font-bold">Shipping Method</h3>
              <div>
                {currentShipping.shipping_addresses?.[0]?.selected_shipping_method?.carrier_title} -
                &nbsp;
                {currentShipping.shipping_addresses?.[0]?.selected_shipping_method?.method_title}
              </div>
            </div>
          </div>
        </div>
        <div className="border-filterBorder basis-full rounded-[6px] border-[1px] p-[20px] md:shrink-0 md:grow-0 md:basis-[39%]">
          <h3 className="mb-[20px] text-[18px] font-bold">Order Summary</h3>
          <ul className="">
            {currentCart &&
              currentCart?.lines?.map((item: any, i: number) => {
                const merchandiseSearchParams: any = {};
                let subTitleWithSelectedOptions = '';

                item.merchandise.selectedOptions.forEach(
                  ({ name, value }: { name: string; value: string }) => {
                    subTitleWithSelectedOptions += `${name}: ${value} `;
                    if (value !== DEFAULT_OPTION) {
                      merchandiseSearchParams[name.toLowerCase()] = value;
                    }
                  }
                );

                return (
                  <li key={i} className="w-full border-b py-[20px] last:border-b-0">
                    <div className="flex gap-[20px]">
                      <div className="item-image">
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
                      </div>
                      <div className="flex-1">
                        <div className="text-[14px] font-bold text-lightBlack">
                          {item.merchandise.product.title}
                        </div>
                        {item.merchandise.title !== DEFAULT_OPTION ? (
                          <p className="text-[14px] font-bold text-lightBlack">
                            {item.merchandise.title}
                          </p>
                        ) : null}
                        <ul className="">
                          {item.merchandise.selectedOptionslabels.map(
                            (option: { name: string; value: string }, i: number) => {
                              return (
                                <li key={i} className="flex w-full">
                                  {option.name} : {option.value}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                      <div className="">
                        <Price
                          className="flex justify-end space-y-2 text-right text-sm"
                          amount={item.cost.totalAmount.amount}
                          currencyCode={item.cost.totalAmount.currencyCode}
                        />
                        <div className="ml-auto flex h-9 flex-row items-center rounded-full border-neutral-200 dark:border-neutral-700">
                          <p className="text-center">
                            <label>Qty: {item.quantity}</label>
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
