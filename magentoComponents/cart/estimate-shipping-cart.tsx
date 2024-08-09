'use client';
import { Field, Form, Formik } from 'formik';
import { getAvailableShippingMethodsProxy, getRegionsProxy } from 'lib/magento';
import { MagentoCartOP } from 'lib/magento/types';
import { SelectedShippingMethod } from 'magentoComponents/cart/selected-shipping-method';
import { useCallback, useState } from 'react';

export function EstimateShippingCart({
  cartId,
  getShippingMethods,
  setCurrentShipping,
  setLineItems
}: {
  cartId: string;
  setCurrentShipping: (value: MagentoCartOP) => void;
  getShippingMethods: MagentoCartOP;
  setLineItems: (value: MagentoCartOP) => void;
}) {
  const [inputs, setInputs] = useState<{ zipcode: string; region: string }>({
    zipcode: '',
    region: ''
  });
  const [regions, setRegions] = useState([]);

  const [shipmethods, setShipmethods] = useState({});
  const handleChange = (event: React.FocusEvent<any>) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async () => {
    let shippingMethods;
    const addressData = {
      city: 'city',
      firstname: 'firstname',
      lastname: 'lastname',
      street: ['street'],
      telephone: 'telephone',
      country_code: 'US',
      postcode: inputs.zipcode,
      region: inputs.region
    };
    if (cartId) {
      shippingMethods = await getAvailableShippingMethodsProxy(cartId, addressData);
    }
    setShipmethods(shippingMethods);
  };
  const selectedCarrierCode =
    getShippingMethods.shipping_addresses?.[0]?.selected_shipping_method?.carrier_code;
  const buttonClasses =
    'relative flex items-center justify-center w-full rounded-full bg-lightBlack py-2.5 px-5 mb-4 tracking-wide text-white';

  const handleCountryChange = useCallback(async (e: React.FocusEvent<any>) => {
    const { name, value } = e.target;
    if (name == 'country') {
      if (value.length > 1) {
        const response = await getRegionsProxy(value);
        setRegions(response);
      } else {
        setRegions([]);
      }
    }
  }, []);
  return (
    <>
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        <Form>
          <div className="mb-4 flex flex-wrap items-center">
            <label className="mb-1 w-[170px] min-w-[170px] md:mb-0">Select Country:</label>
            <Field
              className="border-filterBorder bg-select-caret text-mediumGray h-[40px] w-[392px] cursor-pointer appearance-none rounded-[6px] border-[1px] bg-white bg-[right_15px_center] bg-no-repeat px-[10px]"
              as="select"
              name="country"
              onBlur={handleCountryChange}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="US">United States</option>
            </Field>
          </div>
          <div className="mb-4 flex flex-wrap items-center">
            <label className="text-mediumGray mb-1 w-[170px] min-w-[170px] md:mb-0">State :</label>
            <Field
              className="border-filterBorder bg-select-caret text-mediumGray h-[40px] w-[392px] cursor-pointer appearance-none rounded-[6px] border-[1px] bg-white bg-[right_15px_center] bg-no-repeat px-[10px]"
              as="select"
              name="region"
              onChange={handleChange}
            >
              <option value="">Select State</option>
              {regions?.map((region: { id: number; name: string }) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </Field>
          </div>
          <div className="mb-4 flex flex-wrap items-center">
            <label className="mb-1 w-[170px] min-w-[170px] md:mb-0">Enter your Zip Code:</label>
            <Field
              type="text"
              onChange={handleChange}
              name="zipcode"
              className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
            ></Field>
          </div>
          {selectedCarrierCode ? (
            ''
          ) : (
            <button aria-label="Please select an option" className={buttonClasses}>
              Get Shipping Options
            </button>
          )}
        </Form>
      </Formik>
      <SelectedShippingMethod
        setCurrentShipping={setCurrentShipping}
        getShippingMethods={getShippingMethods}
        setLineItems={setLineItems}
      />
    </>
  );
}
