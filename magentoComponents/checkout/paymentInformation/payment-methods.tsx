'use client';

import {
  PlaceOrderProxy,
  getCheckoutDetailsProxy,
  setBillingAddressProxy,
  setPaymentMethodProxy
} from 'lib/magento/index';
import { MagentoCartOP } from 'lib/magento/types';
import { useUserContext } from 'lib/userContext';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import BillingAddress from './billingAddressForm';

const PaymentMethodForm = ({
  getShippingMethods,
  setIsLoading,
  orderPlacedData,
  setCurrentShipping
}: {
  getShippingMethods: MagentoCartOP;
  setIsLoading: (value: boolean) => void;
  orderPlacedData: any;
  setCurrentShipping: (value: MagentoCartOP) => void;
}) => {
  const selectedPayment = getShippingMethods?.selected_payment_method?.code;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(selectedPayment);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFields, setShowFields] = useState<boolean>(false);
  const carrierCode =
    getShippingMethods?.shipping_addresses?.[0]?.selected_shipping_method?.carrier_code;
  const router = useRouter();
  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLFormElement>) => {
      let guestPaymentProxy;
      setIsLoading(true);
      const name = event?.target?.name;
      const value = event?.target?.value;
      const cartId = getShippingMethods.id;
      if (cartId && value && name === 'paymentmethod') {
        guestPaymentProxy = await setPaymentMethodProxy(cartId, value);
        const checkoutDetails = await getCheckoutDetailsProxy(cartId);
        setCurrentShipping(checkoutDetails?.body!);
      }
      name === 'paymentmethod' && setSelectedPaymentMethod(value);
      name === 'sameAsShipping' && setShowFields(!showFields);
      setIsLoading(false);
    },
    [getShippingMethods, showFields]
  );
  const { setUpdateCart } = useUserContext();

  const handlePlaceOrder = useCallback(
    async (value: any) => {
      setIsLoading(true);
      let placeOrderRequest;
      const validatePaymentMethod = getShippingMethods.selected_payment_method?.code;
      const validateShippingMethod =
        getShippingMethods?.shipping_addresses?.[0]?.selected_shipping_method.carrier_code;
      const cartId = getShippingMethods.id;
      const sameAsShippingAddress = {
        firstname: getShippingMethods.shipping_addresses?.[0]?.firstname!,
        lastname: getShippingMethods.shipping_addresses?.[0]?.lastname || '',
        street1: getShippingMethods.shipping_addresses?.[0]?.street?.[0] || '',
        street2: getShippingMethods.shipping_addresses?.[0]?.street?.[1]
          ? getShippingMethods.shipping_addresses[0]?.street[1]
          : '',
        telephone: getShippingMethods.shipping_addresses?.[0]?.telephone || '',
        country_code: getShippingMethods.shipping_addresses?.[0]?.country?.code || '',
        postcode: getShippingMethods.shipping_addresses?.[0]?.postcode || '',
        city: getShippingMethods.shipping_addresses?.[0]?.city || '',
        region: getShippingMethods.shipping_addresses?.[0]?.region?.code || ''
      };
      const newBilledAddress = {
        firstname: value.firstName,
        lastname: value.lastname,
        street1: value.addressLine1,
        street2: value.addressLine2 || '',
        telephone: value.phoneNumber,
        country_code: value.country,
        postcode: value.postalCode,
        city: value.city,
        region: value.state
      };
      const sendAddressToBilling = !showFields ? sameAsShippingAddress : newBilledAddress;
      const setBillingAddress = await setBillingAddressProxy(cartId, sendAddressToBilling);
      if (
        validatePaymentMethod &&
        selectedPaymentMethod !== null &&
        validateShippingMethod !== null &&
        setBillingAddress?.body?.setBillingAddressOnCart?.cart
      ) {
        setErrorMessage('');
        placeOrderRequest = await PlaceOrderProxy(cartId);
        orderPlacedData({ placeOrderRequest });
        setUpdateCart(true);
      } else {
        setErrorMessage('Please selection Shipping Method / Payment Method');
      }
      setIsLoading(false);
    },
    [getShippingMethods, showFields]
  );

  return (
    <>
      <div className="payment-section">
        {carrierCode === undefined ? (
          ''
        ) : (
          <>
            <h2 className="bold mb-3 text-[18px] md:font-[700]">Payment Method</h2>
            <BillingAddress
              handleFormChange={handleChange}
              handlePlaceOrder={handlePlaceOrder}
              selectedPaymentMethod={selectedPaymentMethod}
              getShippingMethods={getShippingMethods}
              errorMessage={errorMessage}
              showFields={showFields}
            />
          </>
        )}
      </div>
    </>
  );
};
export default PaymentMethodForm;
