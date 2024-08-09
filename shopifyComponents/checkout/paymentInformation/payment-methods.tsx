'use client';

import { Field, Form, Formik } from 'formik';
import {
  PlaceOrderProxy,
  getCheckoutDetailsProxy,
  setBillingAddressProxy,
  setPaymentMethodProxy
} from 'lib/magento/index';
import { MagentoCartOP } from 'lib/magento/types';
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
        //setBillingAddress = await setBillingAddressProxy(cartId, addressData);
        const checkoutDetails = await getCheckoutDetailsProxy(cartId);
        setCurrentShipping(checkoutDetails?.body!);
      }
      name === 'paymentmethod' && setSelectedPaymentMethod(value);
      name === 'sameAsShipping' && setShowFields(!showFields);
      setIsLoading(false);
    },
    [getShippingMethods, showFields]
  );

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
        const params = new URLSearchParams(window.location.search);
        router.push(`${window.location.pathname}?${params.toString()}`, undefined);
        router.refresh();
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
            <br />
            <h2 className="bold md:font-[700]">Payment Method</h2>
            <br />
            <Formik
              initialValues={{ paymentmethod: selectedPaymentMethod }}
              onSubmit={handlePlaceOrder}
            >
              <Form onChange={handleChange}>
                {getShippingMethods?.available_payment_methods?.map((paymentMethods) => (
                  <div
                    className="relative mb-[10px] basis-5/12 cursor-pointer items-center gap-[6px]"
                    key={paymentMethods.title}
                  >
                    <div className="flex">
                      <Field
                        type="radio"
                        name="paymentmethod"
                        id={paymentMethods.code}
                        value={paymentMethods.code}
                      />
                      <label
                        className="text-mediumGray cursor-pointer text-[12px]"
                        htmlFor={paymentMethods.code}
                      >
                        {paymentMethods.title}
                      </label>
                    </div>
                    {selectedPaymentMethod === paymentMethods.code && (
                      <BillingAddress showFields={showFields} />
                    )}
                  </div>
                ))}
                <span>{errorMessage}</span>
                <button
                  className="block rounded-full bg-blue-600 p-3 text-sm font-medium text-white opacity-90 hover:opacity-100"
                  type="submit"
                  data-cy="placeorder-submit"
                >
                  <span className="button-content-TD8 inline-grid grid-flow-col items-center justify-center justify-items-center gap-1.5">
                    Place Order
                  </span>
                </button>
              </Form>
            </Formik>
          </>
        )}
      </div>
    </>
  );
};
export default PaymentMethodForm;
