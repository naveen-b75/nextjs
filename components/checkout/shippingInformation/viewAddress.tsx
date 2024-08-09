'use client';
import { MagentoCartOP } from 'lib/magento/types';

export default function ShowAddressView({
  getShippingMethods,
  setShowForm
}: {
  getShippingMethods: MagentoCartOP;
  setShowForm: (value: boolean) => void;
}) {
  return (
    <section>
      <button
        className="absolute right-3 top-3 underline"
        onClick={() => {
          setShowForm(true);
        }}
      >
        Edit
      </button>
      <section className="flex">
        <h3 className="text-mediumGray mb-[10px] block w-full max-w-[100px] text-[14px] font-bold">
          Email
        </h3>
        <span className="text-mediumGray mb-[15px] block text-[14px]">
          {getShippingMethods?.email}
        </span>
      </section>
      <section className="flex">
        <h3 className="text-mediumGray mb-[10px] block w-full max-w-[100px] text-[14px] font-bold">
          First Name
        </h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.firstname}
        </span>
      </section>
      <section className="flex">
        <h3 className="text-mediumGray mb-[10px] block w-full max-w-[100px] text-[14px] font-bold">
          Last Name
        </h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.lastname}
        </span>
      </section>
      <section className="flex">
        <h3 className="text-mediumGray mb-[10px] block w-full max-w-[100px] text-[14px] font-bold">
          Phone
        </h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.telephone}
        </span>
      </section>
      <section className="flex">
        <h3 className="text-mediumGray mb-[10px] block w-full max-w-[100px] text-[14px] font-bold">
          Street
        </h3>
        <span className="text-mediumGray mb-[15px] block text-[14px]">
          {getShippingMethods?.shipping_addresses?.[0]?.street?.[0]} <br></br>
          {getShippingMethods?.shipping_addresses?.[0]?.street?.[1]
            ? getShippingMethods?.shipping_addresses[0].street[1]
            : ''}
        </span>
      </section>
      <section className="flex">
        <h3 className="text-mediumGray mb-[10px] block w-full max-w-[100px] text-[14px] font-bold">
          City
        </h3>
        <span className="text-mediumGray mb-[15px] block text-[14px]">
          {getShippingMethods?.shipping_addresses?.[0]?.city}
        </span>
      </section>
      <section className="flex">
        <h3 className="text-mediumGray mb-[10px] block w-full max-w-[100px] text-[14px] font-bold">
          Region
        </h3>
        <span className="text-mediumGray mb-[15px] block text-[14px]">
          {getShippingMethods?.shipping_addresses?.[0]?.region?.label}
        </span>
      </section>
      <section className="flex">
        <h3 className="text-mediumGray mb-[10px] block w-full max-w-[100px] text-[14px] font-bold">
          Postcode
        </h3>
        <span className="text-mediumGray mb-[15px] block text-[14px]">
          {getShippingMethods?.shipping_addresses?.[0]?.postcode}
        </span>
      </section>
      <section className="flex">
        <h3 className="text-mediumGray mb-[10px] block w-full max-w-[100px] text-[14px] font-bold">
          Country
        </h3>
        <span className="text-mediumGray mb-[15px] block text-[14px]">
          {getShippingMethods?.shipping_addresses?.[0]?.country?.label}
        </span>
      </section>
    </section>
  );
}
