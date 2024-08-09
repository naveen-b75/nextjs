'use client';
import { setShippingMethodsProxy } from 'lib/magento';
import { useRouter } from 'next/navigation';

export function DisplayShippingMethods({
  shippingMethodsData,
  cartId
}: {
  shippingMethodsData: any;
  cartId: string;
}) {
  const router = useRouter();
  const handleChange = async (event: React.FocusEvent<HTMLInputElement>) => {
    let aftersetshippingMethods;
    const name = event.target.name;
    const value = event.target.value;
    const shippingValue = value.split('||');
    const selectedShippingmethod = {
      carrier_code: shippingValue[0] || '',
      method_code: shippingValue[1] || ''
    };
    if (cartId) {
      aftersetshippingMethods = await setShippingMethodsProxy(cartId, selectedShippingmethod);
    }
    const params = new URLSearchParams(window.location.search);
    router.push(`${window.location.pathname}?${params.toString()}`, undefined);
    router.refresh();
  };

  return (
    <>
      <div className="flex h-full flex-col justify-between overflow-hidden p-1">
        <form>
          {shippingMethodsData.body && shippingMethodsData.body?.body?.data
            ? shippingMethodsData.body.body.data.setShippingAddressesOnCart.cart.shipping_addresses[0].available_shipping_methods.map(
                (cartData: {
                  carrier_code: string;
                  method_code: string;
                  amount: { value: number };
                  method_title: string;
                }) => {
                  return (
                    <div key={cartData.carrier_code} id={cartData.carrier_code}>
                      <input
                        onChange={handleChange}
                        key={cartData.carrier_code}
                        className="radio-input-xBC"
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
