import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

//export const runtime = 'edge';

// We always need to respond with a 200 status code,
// otherwise it will continue to retry the request.
export async function POST(req: NextRequest): Promise<Response> {
  revalidateTag('plp');
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export async function GET(req: NextRequest): Promise<Response> {
  revalidateTag('plp');
  const timestamp = new Date().toUTCString();

  console.log('revalidated cache tags', timestamp);

  return NextResponse.json({ status: 200, revalidated: true, now: timestamp });
}

export const revalidate = 0;
