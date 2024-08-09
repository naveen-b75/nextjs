'use client';
import { MagentoCartOP } from 'lib/magento/types';
import { useMemo, useState } from 'react';
import CheckoutDetails from './checkoutDetailsSection';
import ItemsList from './items-list';
import OrderFunction from './orderSuccess/successPage';

export default function CheckoutContent({
  cartData,
  cartId,
  getShippingMethods
}: {
  getShippingMethods: MagentoCartOP;
  cartId: string;
  cartData: MagentoCartOP;
}) {
  const [currentCart, setCurrentCart] = useState(cartData);
  const [orderData, setOrderData] = useState('');
  const [currentShipping, setCurrentShipping] = useState<MagentoCartOP>(getShippingMethods);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkoutSection = useMemo(() => {
    return orderData ? (
      <OrderFunction
        currentCart={currentCart}
        orderData={orderData}
        currentShipping={currentShipping}
      />
    ) : (
      <>
        <ItemsList cartData={cartData} />
        <CheckoutDetails
          setIsLoading={setIsLoading}
          cartData={cartData}
          currentCart={currentCart}
          setCurrentCart={setCurrentCart}
          cartId={cartId}
          orderData={orderData}
          setOrderData={setOrderData}
          currentShipping={currentShipping}
          setCurrentShipping={setCurrentShipping}
          getShippingMethods={currentShipping}
        />
        <div className="border-filterBorder relative m-4 mx-4 mb-[20px] max-w-screen-2xl overflow-auto rounded-[6px] border-[1px] p-[20px] px-4 py-4">
          <div>
            <span>Subtotal :</span>
            <span>${currentShipping?.prices?.subtotal_including_tax?.value}</span>
          </div>
          {currentShipping?.shipping_addresses?.[0]?.selected_shipping_method?.amount?.value && (
            <div>
              <span>Shipping Method :</span>
              <span>
                ${currentShipping?.shipping_addresses?.[0]?.selected_shipping_method?.amount?.value}
              </span>
            </div>
          )}
          <div>
            <span>Grandtotal :</span>
            <span>${currentShipping?.prices?.grand_total?.value}</span>
          </div>
        </div>
      </>
    );
  }, [currentCart, currentShipping, getShippingMethods, cartData, orderData]);

  return (
    <>
      {' '}
      {isLoading && (
        <div className="fixed left-0 top-0 flex h-[100vh] w-full items-center justify-center">
          <div
            className="text-secondary inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}{' '}
      {checkoutSection}
    </>
  );
}
