import { TAGS } from 'lib/constants';
import { getCart, removeFromCart, updateCart } from 'lib/magento';
import { isVercelCommerceError } from 'lib/type-guards';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
function formatErrorMessage(err: Error): string {
  return JSON.stringify(err, Object.getOwnPropertyNames(err));
}
export async function POST(req: NextRequest): Promise<Response> {
  const { cartId } = await req.json();
  try {
    const response = await getCart(cartId);
    //const createEmptyCart = await createAndSetCookie();
    return NextResponse.json({ status: 204, body: response });
  } catch (e) {
    if (isVercelCommerceError(e)) {
      return NextResponse.json({ message: formatErrorMessage(e.message) }, { status: e.status });
    }
    // Use status 500 (Internal Server Error) for other server-related errors
    // we can't directly pass the error message coming from the api.
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest): Promise<Response> {
  const { cartId, lines } = await req.json();
  try {
    const response = await updateCart(cartId, lines);
    revalidateTag(TAGS.cart);
    //const createEmptyCart = await createAndSetCookie();
    return NextResponse.json({ status: 204, body: response });
  } catch (e) {
    if (isVercelCommerceError(e)) {
      return NextResponse.json({ message: formatErrorMessage(e.message) }, { status: e.status });
    }
    // Use status 500 (Internal Server Error) for other server-related errors
    // we can't directly pass the error message coming from the api.
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<Response> {
  const { cartId, lineIds } = await req.json();
  try {
    const response = await removeFromCart(cartId, lineIds);
    //const createEmptyCart = await createAndSetCookie();
    return NextResponse.json({ status: 204, body: response });
  } catch (e) {
    if (isVercelCommerceError(e)) {
      return NextResponse.json({ message: formatErrorMessage(e.message) }, { status: e.status });
    }
    // Use status 500 (Internal Server Error) for other server-related errors
    // we can't directly pass the error message coming from the api.
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
