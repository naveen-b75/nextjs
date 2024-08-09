import { createEmptyCart, getCart, getShippingMethods } from 'lib/magento';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
const CheckoutContent = dynamic(() => import('components/checkout'), { ssr: false });
const MagentoCheckoutContent = dynamic(() => import('magentoComponents/checkout'), { ssr: false });

const platformType = process.env.ECOMMERCE_PLATFORM;

export default async function CheckoutPage() {
  if (platformType?.toLocaleLowerCase() === 'magento') {
    const cartId = cookies().get('magento-cartid')?.value;
    let creatEmptyCart;
    let cart;
    let getShippingMethodsData;
    if (cartId) {
      cart = await getCart(cartId);
      if (cart === undefined) {
        creatEmptyCart = await createEmptyCart();
      }
      getShippingMethodsData = await getShippingMethods(cartId);
    }

    if (cart == undefined) {
      return (
        <>
          <p>You have no items in your shopping cart.</p>
        </>
      );
    }
    return (
      cart && (
        <>
          <MagentoCheckoutContent
            cartData={cart}
            cartId={cartId!}
            getShippingMethods={getShippingMethodsData!}
          />
        </>
      )
    );
  }
  return notFound();
}
