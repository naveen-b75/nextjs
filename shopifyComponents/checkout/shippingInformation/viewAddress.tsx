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
        onClick={() => {
          setShowForm(true);
        }}
      >
        edit
      </button>
      <section>
        <h3 className="text-mediumGray mb-[10px] block text-[14px] font-bold">Email</h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.email}
        </span>
      </section>
      <section>
        <h3 className="text-mediumGray mb-[10px] block text-[14px] font-bold">First Name</h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.firstname}
        </span>
      </section>
      <section>
        <h3 className="text-mediumGray mb-[10px] block text-[14px] font-bold">Last Name</h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.lastname}
        </span>
      </section>
      <section>
        <h3 className="text-mediumGray mb-[10px] block text-[14px] font-bold">Phone</h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.telephone}
        </span>
      </section>
      <section>
        <h3 className="text-mediumGray mb-[10px] block text-[14px] font-bold">Street</h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.street?.[0]} <br></br>
          {getShippingMethods?.shipping_addresses?.[0]?.street?.[1]
            ? getShippingMethods?.shipping_addresses[0].street[1]
            : ''}
        </span>
      </section>
      <section>
        <h3 className="text-mediumGray mb-[10px] block text-[14px] font-bold">City</h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.city}
        </span>
      </section>
      <section>
        <h3 className="text-mediumGray mb-[10px] block text-[14px] font-bold">Region</h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.region?.label}
        </span>
      </section>
      <section>
        <h3 className="text-mediumGray mb-[10px] block text-[14px] font-bold">Postcode</h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.postcode}
        </span>
      </section>
      <section>
        <h3 className="text-mediumGray mb-[10px] block text-[14px] font-bold">Country</h3>
        <span className="text-mediumGray mb-[15px] block text-[12px]">
          {getShippingMethods?.shipping_addresses?.[0]?.country?.label}
        </span>
      </section>
    </section>
  );
}
