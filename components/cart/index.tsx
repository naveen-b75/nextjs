import { getCart } from 'lib/magento';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const cartId = cookies().get('magento-cartid')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }
  return <CartModal cart={cart} />;
}
