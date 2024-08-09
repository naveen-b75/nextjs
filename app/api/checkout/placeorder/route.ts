import { PlaceOrder, createEmptyCart, getCart, getShippingMethods } from 'lib/magento';
import { isVercelCommerceError } from 'lib/type-guards';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

function formatErrorMessage(err: Error): string {
  return JSON.stringify(err, Object.getOwnPropertyNames(err));
}
export async function POST(req: NextRequest): Promise<Response> {
  const { cartId } = await req.json();
  try {
    const cart = await getCart(cartId);
    const getShippingMethodsData = await getShippingMethods(cartId);
    const response = await PlaceOrder(cartId);
    if (response?.placeOrder?.order?.order_number) {
      const cartId = await createEmptyCart();
      cookies().set('magento-cartid', cartId);
    }
    const responseData = {
      response: response,
      cart: cart,
      getShippingMethodsData: getShippingMethodsData
    };
    return NextResponse.json({ status: 204, body: responseData });
  } catch (e) {
    if (isVercelCommerceError(e)) {
      return NextResponse.json({ message: formatErrorMessage(e.message) }, { status: e.status });
    }
    // Use status 500 (Internal Server Error) for other server-related errors
    // we can't directly pass the error message coming from the api.
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
