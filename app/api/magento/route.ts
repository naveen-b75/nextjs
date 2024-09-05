import { getFiltersList } from 'lib/bigcommerce';
import { getCollectionProducts } from 'lib/magento';
import { isVercelCommerceError } from 'lib/type-guards';
import { NextRequest, NextResponse } from 'next/server';

function formatErrorMessage(err: Error): string {
  return JSON.stringify(err, Object.getOwnPropertyNames(err));
}

export async function POST(req: NextRequest): Promise<Response> {
  const { filters, pageSize, currentPage, collection, sort } = await req.json();

  try {
    const response = await getCollectionProducts({
      collection: collection,
      filters: filters,
      pageSize: pageSize,
      currentPage: currentPage,
      sort: sort
    });

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
  const { query, reverse, sortKey, collection, filter, first } = await req.json();

  try {
    const response = await getFiltersList({
      collection: collection,
      query: query,
      filter: filter
    });

    return NextResponse.json({ status: 204, body: response });
  } catch (e) {
    if (isVercelCommerceError(e)) {
      return NextResponse.json({ message: formatErrorMessage(e.message) }, { status: e.status });
    }
    // Use status 500 (Internal Server Error) for other server-related errors
    // we can't directly pass the error message coming from the api.
    return NextResponse.json(
      { error: `Internal server error ${JSON.stringify(e)}` },
      { status: 500 }
    );
  }
}
