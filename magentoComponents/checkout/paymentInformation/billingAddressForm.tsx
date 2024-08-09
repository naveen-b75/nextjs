import { ErrorMessage, Field, Form, Formik } from 'formik';
import { isRequired } from 'lib/helpers/formValidator';
import { getRegionsProxy } from 'lib/magento';
import { MagentoCartOP } from 'lib/magento/types';
import { useCallback, useState } from 'react';

export default function BillingAddress({
  showFields,
  errorMessage,
  getShippingMethods,
  selectedPaymentMethod,
  handlePlaceOrder,
  handleFormChange
}: {
  errorMessage: string;
  getShippingMethods: MagentoCartOP;
  showFields: boolean;
  selectedPaymentMethod?: string;
  handlePlaceOrder: (value: any) => void;
  handleFormChange: (value: any) => void;
}) {
  const [regions, setRegions] = useState([]);

  const handleChange = useCallback(async (e: React.FocusEvent<any>) => {
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
      <Formik
        initialValues={{
          email: '',
          firstName: '',
          paymentmethod: selectedPaymentMethod,
          lastname: '',
          addressLine1: '',
          country: '',
          city: '',
          state: '',
          postalCode: '',
          phoneNumber: ''
        }}
        onSubmit={handlePlaceOrder}
        validate={(value: any) => {
          const errors: any = {};
          errors.paymentmethod = isRequired(value.paymentmethod);
          errors.firstName = isRequired(value.firstName);
          errors.lastname = isRequired(value.lastname);
          errors.email = isRequired(value.email);
          errors.country = isRequired(value.country);
          errors.addressLine1 = isRequired(value.addressLine1);
          errors.city = isRequired(value.city);
          errors.state = isRequired(value.city);
          errors.postalCode = isRequired(value.postalCode);
          errors.phoneNumber = isRequired(value.phoneNumber);
          if (errors.paymentmethod) {
            return errors;
          }
          if (
            showFields &&
            (errors.firstName ||
              errors.lastname ||
              errors.email ||
              errors.country ||
              errors.addressLine1 ||
              errors.city ||
              errors.state ||
              errors.postalCode ||
              errors.phoneNumber)
          ) {
            return errors;
          }
        }}
      >
        <Form onChange={handleFormChange}>
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
                  className="mr-2"
                />
                <label className="text-mediumGray cursor-pointer" htmlFor={paymentMethods.code}>
                  {paymentMethods.title}
                </label>
              </div>
              {selectedPaymentMethod === paymentMethods.code && (
                <>
                  <Field
                    type="checkbox"
                    name="sameAsShipping"
                    id="sameAsShipping"
                    value="sameAsShipping"
                    checked={!showFields}
                    className="mr-2"
                  />
                  <label
                    className="sm:whitespace-wrap text-mediumGray w-[110px] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[12px] sm:w-auto"
                    htmlFor="sameAsShipping"
                  >
                    Same as Shipping
                  </label>
                  {showFields && (
                    <>
                      <label className="text-mediumGray mb-[14px] mt-[25px] block">Email</label>
                      <Field
                        type="text"
                        name="email"
                        className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
                      ></Field>
                      <ErrorMessage
                        className="text-[12px] text-red-700"
                        name="email"
                        component="div"
                      />
                      <label className="text-mediumGray mb-[14px] mt-[25px] block">
                        First Name
                      </label>
                      <Field
                        type="text"
                        name="firstName"
                        className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
                      ></Field>
                      <ErrorMessage
                        className="text-[12px] text-red-700"
                        name="firstName"
                        component="div"
                      />
                      <label className="text-mediumGray mb-[14px] mt-[25px] block">Last Name</label>
                      <Field
                        type="text"
                        name="lastname"
                        className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
                      ></Field>
                      <ErrorMessage
                        className="text-[12px] text-red-700"
                        name="lastname"
                        component="div"
                      />
                      <label className="text-mediumGray mb-[14px] mt-[25px] block">
                        Select Country
                      </label>
                      <Field
                        className="border-filterBorder bg-select-caret text-mediumGray h-[40px] w-[392px] cursor-pointer appearance-none rounded-[6px] border-[1px] bg-white bg-[right_15px_center] bg-no-repeat px-[10px]"
                        as="select"
                        name="country"
                        onBlur={handleChange}
                      >
                        <option value="">Select an option</option>
                        <option value="US">United States</option>
                      </Field>
                      <ErrorMessage
                        className="text-[12px] text-red-700"
                        name="country"
                        component="div"
                      />
                      <label className="text-mediumGray mb-[14px] mt-[25px] block">
                        Street Address
                      </label>
                      <Field
                        type="text"
                        name="addressLine1"
                        className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
                      ></Field>
                      <ErrorMessage
                        className="text-[12px] text-red-700"
                        name="addressLine1"
                        component="div"
                      />
                      <label className="text-mediumGray mb-[14px] mt-[25px] block">
                        Street Address 2
                      </label>
                      <Field
                        type="text"
                        name="addressLine2"
                        className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
                      ></Field>
                      <label className="text-mediumGray mb-[14px] mt-[25px] block">City</label>
                      <Field
                        type="text"
                        name="city"
                        className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
                      ></Field>
                      <ErrorMessage
                        className="text-[12px] text-red-700"
                        name="city"
                        component="div"
                      />
                      <label className="text-mediumGray mb-[14px] mt-[25px] block">State</label>
                      <Field
                        className="border-filterBorder bg-select-caret text-mediumGray h-[40px] w-[392px] cursor-pointer appearance-none rounded-[6px] border-[1px] bg-white bg-[right_15px_center] bg-no-repeat px-[10px]"
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
                      <ErrorMessage
                        className="text-[12px] text-red-700"
                        name="state"
                        component="div"
                      />
                      <label className="text-mediumGray mb-[14px] mt-[25px] block">
                        ZIP / Postal Code
                      </label>
                      <Field
                        type="text"
                        name="postalCode"
                        className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
                      ></Field>
                      <ErrorMessage
                        className="text-[12px] text-red-700"
                        name="postalCode"
                        component="div"
                      />
                      <label className="text-mediumGray mb-[14px] mt-[25px] block">
                        Phone Number
                      </label>
                      <Field
                        type="text"
                        name="phoneNumber"
                        className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
                      ></Field>
                      <ErrorMessage
                        className="text-[12px] text-red-700"
                        name="phoneNumber"
                        component="div"
                      />
                    </>
                  )}
                </>
              )}
            </div>
          ))}
          <ErrorMessage className="text-[12px] text-red-700" name="paymentmethod" component="div" />
          <span>{errorMessage}</span>
          <button
            className="mt-[20px] block w-full max-w-[400px] rounded-full bg-lightBlack p-3 text-[16px] font-medium text-white opacity-90 hover:opacity-100"
            type="submit"
            data-cy="placeorder-submit"
          >
            <span className="button-content-TD8 inline-grid grid-flow-col items-center justify-center justify-items-center gap-1.5 font-bold">
              Place Order
            </span>
          </button>
        </Form>
      </Formik>
    </>
  );
}
