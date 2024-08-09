import { getCart } from 'lib/magento';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const cartId = cookies().get('magento-cartid')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
    // if(cart.errorMsg != undefined && cart.errorMsg.message == 'The cart isn\'t active.'){
    //     return (
    //         <>
    //             <div className="empty-shopping-cart">
    //                 <p>You have no items in your shopping cart.</p>
    //             </div>
    //         </>
    //     );
    // } else {
    //     return <CartModal cart={cart} />;
    // }
  }
  return <CartModal cart={cart} />;
}
