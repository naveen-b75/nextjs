'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createEmptyCart, removeFromCart, updateCart } from 'lib/magento';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function createAndSetCookie() {
  const cartId = await createEmptyCart();
  cookies().set('magento-cartid', cartId);
  return cartId;
}

export async function addItem(
  prevState: any,
  {
    selectedOptionsArray,
    selectedProductId,
    selectedVariantId,
    qty
  }: {
    selectedOptionsArray: string[];
    selectedProductId: string | undefined;
    selectedVariantId: string | undefined;
    qty: string;
  }
) {
  //const cartId = cookies().get('cartId')?.value;
  let cartId = cookies().get('magento-cartid')?.value;
  let cartdIdvalue;
  if (!cartId) {
    cartId = await createEmptyCart();
    cartdIdvalue = cartId;
    cookies().set('magento-cartid', cartdIdvalue);
  }

  if (cartId === undefined) {
    cartId = await createEmptyCart();
    cartdIdvalue = cartId;
    cookies().set('magento-cartid', cartId);
  }

  if (!selectedVariantId) {
    return 'Missing product variant ID';
  }

  try {
    await addToCart(cartdIdvalue || cartId, [
      { quantity: parseInt(qty), sku: selectedProductId!, selected_options: selectedOptionsArray }
    ]);
    revalidateTag(TAGS.cart);
    return 'successfully added';
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  const cartId = cookies().get('magento-cartid')?.value;
  if (!cartId) {
    return 'Missing cart ID';
  }
  try {
    const response = await removeFromCart(cartId, lineId);
    revalidateTag(TAGS.cart);
    //update minicart
    if (!response && cartId) {
      cookies().delete('cartId');
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    productSlug: string;
    variantId: string;
    quantity: number;
  }
) {
  const cartId = cookies().get('magento-cartid')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, productSlug, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      const response = await removeFromCart(cartId, lineId);
      revalidateTag(TAGS.cart);

      if (!response && cartId) {
        cookies().delete('cartId');
      }

      return;
    }

    await updateCart(cartId, [
      {
        cart_item_uid: lineId,
        quantity
      }
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
