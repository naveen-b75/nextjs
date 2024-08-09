'use client';

import { SelectedShippingMethod } from 'components/cart/selected-shipping-method';
import { MagentoCartOP } from 'lib/magento/types';
import { Suspense, useState } from 'react';
import PaymentMethodForm from './paymentInformation/payment-methods';
import ShippingInformation from './shippingInformation/shipping-information';

export default function CheckoutDetails({
  cartData,
  setIsLoading,
  cartId,
  getShippingMethods,
  currentCart,
  setCurrentCart,
  setOrderData,
  orderData,
  setCurrentShipping,
  currentShipping
}: {
  cartData: MagentoCartOP;
  currentCart: any;
  setIsLoading: (value: boolean) => void;
  setCurrentShipping: (value: MagentoCartOP) => void;
  currentShipping: MagentoCartOP;
  setCurrentCart: (value: any) => void;
  orderData: any;
  cartId: string;
  setOrderData: (value: any) => void;
  getShippingMethods: MagentoCartOP;
}) {
  const [loadSuccess, setLoadSuccess] = useState<boolean>(false);
  const handleData = (orderPlacedData: {
    placeOrderRequest: {
      body: {
        cart: MagentoCartOP;
        getShippingMethodsData: MagentoCartOP;
        response: { placeOrder: { order: { order_number: string } } };
      };
    };
  }) => {
    const OrderId =
      orderPlacedData.placeOrderRequest?.body?.response?.placeOrder?.order?.order_number;
    setCurrentCart(orderPlacedData.placeOrderRequest?.body?.cart);
    setCurrentShipping(orderPlacedData.placeOrderRequest?.body?.getShippingMethodsData);
    setOrderData(OrderId);
    setLoadSuccess(true);
  };
  return (
    <Suspense fallback={null}>
      <div className="mb-[40px] basis-full md:shrink-0 md:grow-0 md:basis-[59%]">
        <div className="border-filterBorder relative max-w-screen-2xl overflow-auto rounded-[6px] border-[1px] p-[20px] px-4 py-4">
          <ShippingInformation
            setIsLoading={setIsLoading}
            setCurrentShipping={setCurrentShipping}
            cartId={cartId}
            getShippingMethods={getShippingMethods}
          />
        </div>
        {getShippingMethods?.email &&
          loadSuccess === false &&
          getShippingMethods?.shipping_addresses?.[0] && (
            <div className="border-filterBorder relative mt-[20px] max-w-screen-2xl overflow-auto rounded-[6px] border-[1px] p-[20px] px-4 py-4">
              <SelectedShippingMethod
                setIsLoading={setIsLoading}
                setCurrentShipping={setCurrentShipping}
                getShippingMethods={getShippingMethods}
              />
            </div>
          )}
        {loadSuccess === false &&
          getShippingMethods?.shipping_addresses?.[0]?.selected_shipping_method?.carrier_code && (
            <div className="border-filterBorder relative mt-[20px] max-w-screen-2xl overflow-auto rounded-[6px] border-[1px] p-[20px] px-4 py-4">
              <PaymentMethodForm
                getShippingMethods={getShippingMethods}
                setIsLoading={setIsLoading}
                orderPlacedData={handleData}
                setCurrentShipping={setCurrentShipping}
              />
            </div>
          )}
      </div>
    </Suspense>
  );
}
