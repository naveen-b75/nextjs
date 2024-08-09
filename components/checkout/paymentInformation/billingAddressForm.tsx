import { Field } from 'formik';
import { getRegionsProxy } from 'lib/magento';
import { useCallback, useState } from 'react';

export default function BillingAddress({ showFields }: { showFields: boolean }) {
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
          <label className="text-mediumGray mb-[14px] mt-[25px] block">First Name</label>
          <Field
            type="text"
            name="firstName"
            className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
          ></Field>
          <label className="text-mediumGray mb-[14px] mt-[25px] block">Last Name</label>
          <Field
            type="text"
            name="lastname"
            className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
          ></Field>
          <label className="text-mediumGray mb-[14px] mt-[25px] block">Select Country</label>
          <Field
            className="border-filterBorder bg-select-caret text-mediumGray h-[40px] w-[392px] cursor-pointer appearance-none rounded-[6px] border-[1px] bg-white bg-[right_15px_center] bg-no-repeat px-[10px]"
            as="select"
            name="country"
            onBlur={handleChange}
          >
            <option value="">Select an option</option>
            <option value="US">United States</option>
          </Field>
          <label className="text-mediumGray mb-[14px] mt-[25px] block">Street Address</label>
          <Field
            type="text"
            name="addressLine1"
            className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
          ></Field>
          <label className="text-mediumGray mb-[14px] mt-[25px] block">Street Address 2</label>
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
          <label className="text-mediumGray mb-[14px] mt-[25px] block">ZIP / Postal Code</label>
          <Field
            type="text"
            name="postalCode"
            className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
          ></Field>
          <label className="text-mediumGray mb-[14px] mt-[25px] block">Phone Number</label>
          <Field
            type="text"
            name="phoneNumber"
            className="placeholder:opacity-1 border-filterBorder text-mediumGray placeholder-mediumGray h-[42px] w-full rounded-[6px] border-[1px] pl-[14px] text-[13px] md:w-[393px]"
          ></Field>
        </>
      )}
    </>
  );
}
