'use client';
import { MagentoCartOP } from 'lib/magento/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getCartProxy, getCheckoutDetailsProxy, setShippingMethodsProxy } from '../../lib/magento';

export function SelectedShippingMethod({
  getShippingMethods,
  setCurrentShipping,
  setLineItems,
  setIsLoading
}: {
  getShippingMethods: MagentoCartOP;
  setIsLoading?: (value: boolean) => void;
  setCurrentShipping: (value: MagentoCartOP) => void;
  setLineItems?: (value: MagentoCartOP) => void;
}) {
  const carrierCode =
    getShippingMethods?.shipping_addresses?.[0]?.selected_shipping_method?.carrier_code;
  const [selectedMethod, setSelectedMethod] = useState(carrierCode);
  const router = useRouter();
  const handleChange = async (event: React.FocusEvent<HTMLInputElement>) => {
    let aftersetshippingMethods;
    const name = event.target.name;
    const value = event.target.value;
    const cartId = getShippingMethods.id;
    const shippingValue = value.split('||');
    const selectedShippingmethod = {
      carrier_code: shippingValue[0] || '',
      method_code: shippingValue[1] || ''
    };
    if (cartId) {
      setIsLoading && setIsLoading(true);
      aftersetshippingMethods = await setShippingMethodsProxy(cartId, selectedShippingmethod);
      if (
        aftersetshippingMethods.body.body.data.setShippingMethodsOnCart.cart.shipping_addresses[0]
          .selected_shipping_method.carrier_code
      ) {
        setSelectedMethod(
          aftersetshippingMethods.body.body.data.setShippingMethodsOnCart.cart.shipping_addresses[0]
            .selected_shipping_method.carrier_code
        );
        const checkoutDetails = await getCheckoutDetailsProxy(cartId);
        const lineItemsResponse = await getCartProxy(cartId);
        setCurrentShipping(checkoutDetails?.body!);
        setLineItems && setLineItems(lineItemsResponse?.body);
      }
      setIsLoading && setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="mb-3 font-bold">
          {getShippingMethods.shipping_addresses?.[0] ? 'Shipping Method' : ''}
        </h2>
        <form>
          {getShippingMethods.shipping_addresses?.[0]
            ? getShippingMethods.shipping_addresses?.[0]?.available_shipping_methods?.map(
                (cartData) => {
                  return (
                    <div key={cartData.carrier_code} id={cartData.carrier_code}>
                      <input
                        checked={selectedMethod === cartData.carrier_code}
                        onChange={handleChange}
                        key={cartData.carrier_code}
                        className="radio-input-xBC mr-2"
                        name="shippingmethod"
                        id={cartData.carrier_code}
                        type="radio"
                        value={`${cartData.carrier_code}||${cartData.method_code}`}
                      />
                      <span>{cartData.method_title}</span>
                      <span> - $</span>
                      <span>{cartData.amount.value}</span>
                    </div>
                  );
                }
              )
            : null}
        </form>
      </div>
    </>
  );
}
