import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { MagentoCartOP } from 'lib/magento/types';
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
    <div className="order-success border-filterBorder relative m-4 mx-4 mb-[20px] max-w-screen-2xl overflow-auto rounded-[6px] border-[1px] p-[20px] px-4 py-4">
      <h2 className="bold text-[24px] text-green-900 md:font-[700]">Order Success</h2>
      <p>Thank you for your order! </p>
      <br />
      <p> Order Number: {orderData} </p>
      <br />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="shipping-section">
          <label>Shipping Information</label> <br />
          <div className="shipping-information">
            <br />
            <span className="ship-to-email">{currentShipping.email}</span>
            <br />
            <span className="shipfirstname">
              {currentShipping.shipping_addresses?.[0]?.firstname}
            </span>{' '}
            &nbsp;
            <span className="shiplastname">
              {currentShipping.shipping_addresses?.[0]?.lastname}
            </span>
            <br />
            <span className="shipphoneno">
              {currentShipping.shipping_addresses?.[0]?.telephone}
            </span>
            <br />
            <span className="shipstreet1">
              {currentShipping.shipping_addresses?.[0]?.street?.[0]}
            </span>
            <br />
            <span className="shipstreet2">
              {currentShipping.shipping_addresses?.[0]?.street?.[1]
                ? currentShipping.shipping_addresses[0].street[1]
                : ''}
            </span>
            <span className="shipcity">{currentShipping?.shipping_addresses?.[0]?.city}</span>
            ,&nbsp;
            <span className="shipregion">
              {currentShipping?.shipping_addresses?.[0]?.region?.label}
            </span>
            &nbsp;
            <span className="shipzipcode">
              {currentShipping?.shipping_addresses?.[0]?.postcode}
            </span>
            &nbsp;
            <span className="shipcountry">
              {/* {currentShipping.shipping_addresses[0]?.country.label} */}
            </span>
            &nbsp;
          </div>
        </div>
        <div>
          <br /> <label>Shipping Method</label> <br />
          <span>
            {currentShipping.shipping_addresses?.[0]?.selected_shipping_method?.carrier_title} -
            &nbsp;
            {currentShipping.shipping_addresses?.[0]?.selected_shipping_method?.method_title}
          </span>
        </div>
        <ul className="flex-grow overflow-auto py-4">
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
                <li key={i} className="flex w-full">
                  <div className="relative ">
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

                    <div className="flex flex-1 flex-col text-base">
                      <span className="leading-tight">{item.merchandise.product.title}</span>
                      {item.merchandise.title !== DEFAULT_OPTION ? (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {item.merchandise.title}
                        </p>
                      ) : null}
                    </div>

                    <div className="selected-options">
                      <ul className="flex-grow overflow-auto py-4">
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
                    <div className="flex h-16 flex-col justify-between">
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
      <p>
        You will also receive an email with the details and we will let you know when your order has
        shipped.
      </p>
    </div>
  );
}
