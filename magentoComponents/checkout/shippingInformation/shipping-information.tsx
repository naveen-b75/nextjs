'use client';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import { isRequired } from 'lib/helpers/formValidator';
import { getCheckoutDetailsProxy, getRegionsProxy, setGuestShippingProxy } from 'lib/magento/index';
import { MagentoCartOP } from 'lib/magento/types';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import ShowAddressView from './viewAddress';

export default function ShippingInformation({
  cartId,
  setIsLoading,
  getShippingMethods,
  setCurrentShipping
}: {
  cartId: string;
  setIsLoading: (value: boolean) => void;
  getShippingMethods: MagentoCartOP;
  setCurrentShipping: (value: MagentoCartOP) => void;
}) {
  const router = useRouter();
  let orderPlacedData;
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: ''
  });
  const [regions, setRegions] = useState([]);
  const [showForm, setShowForm] = useState<boolean>(true);
  const getRegions = useCallback(async (getShippingMethods: MagentoCartOP) => {
    try {
      const countryCode = getShippingMethods?.shipping_addresses?.[0]?.country?.code;
      const response = await getRegionsProxy(countryCode!);
      setRegions(response);
    } catch (e) {
      setRegions([]);
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (
      getShippingMethods &&
      getShippingMethods.email &&
      getShippingMethods?.shipping_addresses?.[0]?.firstname
    ) {
      setShowForm(false);
    }
  }, [getShippingMethods]);

  useEffect(() => {
    if (
      getShippingMethods &&
      getShippingMethods.email &&
      getShippingMethods?.shipping_addresses?.[0]?.firstname
    ) {
      getRegions(getShippingMethods);
    }
  }, [showForm]);

  const handleChange = useCallback(
    async (e: React.FocusEvent<any>) => {
      try {
        const { name, value } = e.target;
        setIsLoading && setIsLoading(true);
        setFormData({
          ...formData,
          [name]: value
        });
        if (name == 'country') {
          if (value.length > 1) {
            const response = await getRegionsProxy(value);
            setRegions(response);
          } else {
            setRegions([]);
          }
        }
        setIsLoading && setIsLoading(false);
      } catch (e) {
        setIsLoading && setIsLoading(false);
      }
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (field: any) => {
      try {
        let guestShippingProxy;
        const addressData = {
          city: field.city,
          firstname: field.firstName,
          lastname: field.lastname,
          street: [field.addressLine1, field.addressLine2 || ''],
          telephone: field.phoneNumber,
          country_code: 'US',
          postcode: field.postalCode,
          region: field.state
        };
        const email = field.email;
        if (cartId) {
          setIsLoading(true);
          const res = (guestShippingProxy = await setGuestShippingProxy(
            cartId,
            email,
            addressData
          ));
          if (res?.body?.setShippingAddressesOnCart?.cart) {
            const checkoutDetails = await getCheckoutDetailsProxy(cartId);
            setCurrentShipping(checkoutDetails?.body!);
            setShowForm(false);
          }
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
      }
    },
    [cartId]
  );

  return (
    <>
      <h3 className="bold mb-3 text-[18px] md:font-[700]">Shipping Information</h3>
      {!showForm ? (
        <ShowAddressView setShowForm={setShowForm} getShippingMethods={getShippingMethods} />
      ) : (
        <Formik
          initialValues={{
            firstName: getShippingMethods?.shipping_addresses?.[0]?.firstname,
            email: getShippingMethods?.email,
            lastname: getShippingMethods?.shipping_addresses?.[0]?.lastname,
            country: getShippingMethods?.shipping_addresses?.[0]?.country?.code,
            addressLine1: getShippingMethods?.shipping_addresses?.[0]?.street?.[0],
            addressLine2: getShippingMethods?.shipping_addresses?.[0]?.street?.[1],
            city: getShippingMethods?.shipping_addresses?.[0]?.city,
            state: getShippingMethods?.shipping_addresses?.[0]?.region?.region_id,
            postalCode: getShippingMethods?.shipping_addresses?.[0]?.postcode,
            phoneNumber: getShippingMethods?.shipping_addresses?.[0]?.telephone
          }}
          validateOnChange={true}
          validateOnBlur={true}
          validate={(value) => {
            const errors: any = {};
            errors.firstName = isRequired(value.firstName);
            errors.lastname = isRequired(value.lastname);
            errors.email = isRequired(value.email);
            errors.country = isRequired(value.country);
            errors.addressLine1 = isRequired(value.addressLine1);
            errors.city = isRequired(value.city);
            errors.state = isRequired(value.state);
            errors.postalCode = isRequired(value.postalCode);
            errors.phoneNumber = isRequired(value.phoneNumber);
            if (
              errors.firstName ||
              errors.lastname ||
              errors.email ||
              errors.country ||
              errors.addressLine1 ||
              errors.city ||
              errors.state ||
              errors.postalCode ||
              errors.phoneNumber
            ) {
              return errors;
            }
          }}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <Form>
              <label className="text-mediumGray mb-[14px] mt-[25px] block">Email</label>
              <Field
                type="text"
                name="email"
                className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:max-w-[600px]"
              ></Field>
              <ErrorMessage className="text-[12px] text-red-700" name="email" component="div" />
              <label className="text-mediumGray mb-[14px] mt-[25px] block">First Name</label>
              <Field
                type="text"
                name="firstName"
                className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:max-w-[600px]"
              ></Field>
              <ErrorMessage className="text-[12px] text-red-700" name="firstName" component="div" />
              <label className="text-mediumGray mb-[14px] mt-[25px] block">Last Name</label>
              <Field
                type="text"
                name="lastname"
                className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:max-w-[600px]"
              ></Field>
              <ErrorMessage className="text-[12px] text-red-700" name="lastname" component="div" />
              <label className="text-mediumGray mb-[14px] mt-[25px] block">Select Country</label>
              <Field
                className="border-filterBorder bg-select-caret text-mediumGray h-[40px] w-full cursor-pointer appearance-none rounded-[6px] border-[1px] bg-white bg-[right_15px_center] bg-no-repeat px-[10px] md:max-w-[600px]"
                as="select"
                name="country"
                onChange={(e: React.FocusEvent<any>) => {
                  handleChange(e), formikProps.setFieldValue('country', e.target.value);
                }}
              >
                <option value="">Select an option</option>
                <option value="US">United States</option>
              </Field>
              <ErrorMessage className="text-[12px] text-red-700" name="country" component="div" />
              <label className="text-mediumGray mb-[14px] mt-[25px] block">Street Address</label>
              <Field
                type="text"
                name="addressLine1"
                className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:max-w-[600px]"
              ></Field>
              <ErrorMessage
                className="text-[12px] text-red-700"
                name="addressLine1"
                component="div"
              />
              <label className="text-mediumGray mb-[14px] mt-[25px] block">Street Address 2</label>
              <Field
                type="text"
                name="addressLine2"
                className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:max-w-[600px]"
              ></Field>
              <label className="text-mediumGray mb-[14px] mt-[25px] block">City</label>
              <Field
                type="text"
                name="city"
                className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:max-w-[600px]"
              ></Field>
              <ErrorMessage className="text-[12px] text-red-700" name="city" component="div" />
              <label className="text-mediumGray mb-[14px] mt-[25px] block">State</label>
              <Field
                className="border-filterBorder bg-select-caret text-mediumGray h-[40px] w-full cursor-pointer appearance-none rounded-[6px] border-[1px] bg-white bg-[right_15px_center] bg-no-repeat px-[10px] md:max-w-[600px]"
                as="select"
                name="state"
              >
                <option value="">Select State</option>
                {regions?.map((region: { id: number; name: string }) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage className="text-[12px] text-red-700" name="state" component="div" />
              <label className="text-mediumGray mb-[14px] mt-[25px] block">ZIP / Postal Code</label>
              <Field
                type="text"
                name="postalCode"
                className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:max-w-[600px]"
              ></Field>
              <ErrorMessage
                className="text-[12px] text-red-700"
                name="postalCode"
                component="div"
              />
              <label className="text-mediumGray mb-[14px] mt-[25px] block">Phone Number</label>
              <Field
                type="text"
                name="phoneNumber"
                className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:max-w-[600px]"
              ></Field>
              <ErrorMessage
                className="text-[12px] text-red-700"
                name="phoneNumber"
                component="div"
              />
              <br></br>
              <button
                className="mt-4  inline-flex w-full max-w-[400px] items-center justify-center gap-2.5 rounded-full bg-lightBlack px-8 py-3 text-[14px] text-white duration-200"
                type="submit"
              >
                <span className="text-center font-bold">Continue to Shipping Method</span>
              </button>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}
