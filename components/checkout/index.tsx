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
      <div className="mx-auto mb-[40px] max-w-[1440px] px-4">
        <h1 className="my-10 text-3xl font-bold">Checkout </h1>
        <div className="flex flex-wrap justify-between">
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
          <div className="md:shrink-0 md:grow-0 md:basis-[39%]">
            <ItemsList cartData={cartData} />
            <div className="border-filterBorder relative mt-[20px] max-w-screen-2xl overflow-auto rounded-[6px] border-[1px] p-[20px] px-4 py-4">
              <div>
                <span className="inline-block w-full max-w-[200px]">Subtotal :</span>
                <span>${currentShipping?.prices?.subtotal_including_tax?.value}</span>
              </div>
              {currentShipping?.shipping_addresses?.[0]?.selected_shipping_method?.amount
                ?.value && (
                <div>
                  <span className="inline-block w-full max-w-[200px]">Shipping Method :</span>
                  <span>
                    $
                    {
                      currentShipping?.shipping_addresses?.[0]?.selected_shipping_method?.amount
                        ?.value
                    }
                  </span>
                </div>
              )}
              <div>
                <span className="inline-block w-full max-w-[200px]">Grandtotal :</span>
                <span>${currentShipping?.prices?.grand_total?.value}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
