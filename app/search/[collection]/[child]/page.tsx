import { getCollectionProducts, getResolverData } from 'lib/magento';
import MagentoProductGallery from 'magentoComponents/productGallery';
import { notFound } from 'next/navigation';

// export const runtime = 'edge';

type SearchParams = {
  [key: string]: string | undefined;
};

type Params = {
  collection: string;
  child: string;
};

type Filters = {
  category_uid?: { eq: string };
  [key: string]: any;
};

type ProductData = {
  items: any[];
  total_count: number;
};
const platformType = process.env.ECOMMERCE_PLATFORM;

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
  if (platformType?.toLocaleLowerCase() === 'magento') {
    const { page } = searchParams || {};
    const parentKey = params.collection;
    const childKey = params.child ? `/${params.child}` : '';
    const completeUrl = `${parentKey}${childKey}`;

    const pageResolverData = await getResolverData(completeUrl);
    const pageSize = 12;

    const transformSearchParams = () => {
      const transformedParams: any = {};
      for (const key in searchParams) {
        if (searchParams.hasOwnProperty(key)) {
          if (key === 'collection' || key === 'child' || key === 'page') {
            continue; // Skip these keys
          }
          const newKey = key.replace('[filter]', '');
          if (newKey === 'price') {
            // Check if searchParams[key] is an array or a string
            const paramValue = searchParams[key];

            if (Array.isArray(paramValue)) {
              // If it's an array, map through each element and split it
              transformedParams[newKey] = paramValue.map((value) => {
                const [from, to] = decodeURIComponent(value).split('_');
                return { from, to };
              });
            } else {
              // If it's a string, just split it
              const [from, to] = decodeURIComponent(paramValue!).split('_');
              transformedParams[newKey] = { from, to };
            }
          } else if (newKey !== '[object Object]') {
            const values = decodeURIComponent(searchParams[key]!)?.split(',');
            transformedParams[newKey] = { in: values };
          }
        }
      }
      return transformedParams;
    };
    const filters = transformSearchParams();
    const transformedFilters = { ...filters };
    delete transformedFilters?.q;
    delete transformedFilters?.sort;
    delete transformedFilters?.image;

    if (Object.keys(transformedFilters).includes('category_uid')) {
      transformedFilters.category_uid = filters['category_uid'];
    } else {
      transformedFilters.category_uid = { eq: pageResolverData?.route?.uid! };
    }

    const appliedSort = searchParams?.sort || '';
    let sendSort: { [key: string]: string } = { relevance: 'ASC' };

    if (appliedSort.length > 0) {
      sendSort =
        searchParams &&
        Object.values(searchParams!)
          .filter((value) => typeof value === 'string' && value.startsWith('sort_'))
          .reduce(
            (sorting: any, key) => {
              const newKey = key?.replace('sort_', '');
              const [sortField, sortOrder] = newKey?.split('-') || [];
              sorting[sortField!] = sortOrder;
              return sorting;
            },
            {} as { [key: string]: string }
          );
    }

    const productsData = await getCollectionProducts({
      currentPage: parseInt(page || '1'),
      sort: sendSort,
      collection: pageResolverData?.route?.uid || '',
      pageSize,
      filters: transformedFilters
    });
    const products = productsData.items;
    return (
      <section>
        {products?.length === 0 ? (
          <ul>
            <p className="py-3 text-lg">No products found in this collection</p>
          </ul>
        ) : (
          <MagentoProductGallery products={productsData} searchParams={searchParams} />
        )}
      </section>
    );
  }

  return notFound();
}
