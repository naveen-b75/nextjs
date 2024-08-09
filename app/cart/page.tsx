import { getCart, getShippingMethods } from 'lib/magento';
import { MagentoCartOP } from 'lib/magento/types';
import { default as MagentoCartPageView } from 'magentoComponents/cart/cartPage';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
const platformType = process.env.ECOMMERCE_PLATFORM;

export default async function CartPage() {
  if (platformType?.toLocaleLowerCase() === 'magento') {
    const cartId = cookies().get('magento-cartid')?.value;
    let cart;
    let getShippingMethodsData: MagentoCartOP | undefined;
    if (cartId) {
      cart = await getCart(cartId)!;
      getShippingMethodsData = await getShippingMethods(cartId);
    }
    if (cart === undefined) {
      return (
        <>
          <div className="empty-shopping-cart">
            <p>You have no items in your shopping cart.</p>
          </div>
        </>
      );
    }
    return (
      <>
        <MagentoCartPageView
          cartData={cart}
          getShippingMethodsData={getShippingMethodsData!}
          cartId={cartId!}
        />
      </>
    );
  }

  return notFound();
}
