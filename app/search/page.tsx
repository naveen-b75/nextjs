import { getbigCommerceFiltersList, getCategoryProducts } from 'lib/bigcommerce';
import { getProducts } from 'lib/magento';

import Search from 'bigCommerceComponents/layout/search/search';
import { defaultSort, sorting } from 'lib/constants';
import MagentoProductGallery from 'magentoComponents/productGallery';
import { notFound } from 'next/navigation';
export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

const platformType = process.env.ECOMMERCE_PLATFORM;

type Filters = {
  category_uid?: { eq: string };
  [key: string]: any;
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const { page } = searchParams || {};

  if (platformType?.toLocaleLowerCase() === 'magento') {
    const { q: searchValue } = searchParams as { [key: string]: string };
    //const products = await getProducts({ sortKey, reverse, query: searchValue });
    const appliedSort = searchParams?.sort ? searchParams.sort : '';
    let sendSort: { relevance?: string } = {
      relevance: 'ASC'
    };
    if (appliedSort.length > 0) {
      sendSort = Object.values(searchParams!)
        .filter((values) => typeof values === 'string' && values?.startsWith('sort_'))
        .reduce((sorting: any, key) => {
          const newKey = typeof key === 'string' && key?.replace('sort_', '');
          const removeLabel: string[] = newKey ? newKey?.split('-') : [];
          sorting[removeLabel[0]!] = removeLabel ? removeLabel[1] : '';
          return sorting;
        }, {});
    }
    const pageSize = 12;
    const transformSearchParams = () => {
      const transformedParams: any = {};
      for (const key in searchParams) {
        if (searchParams.hasOwnProperty(key)) {
          if (key === 'collection' || key === 'q' || key === 'child' || key === 'page') {
            continue; // Skip these keys
          }
          if (key.includes('filter_')) {
            const newKey = key.replace('filter_', '');
            transformedParams[newKey] = { eq: decodeURIComponent(searchParams[key]!) };
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
    const productsData = await getProducts({
      search: searchValue || '',
      filter: transformedFilters,
      pageSize: pageSize * parseInt(page || '1'),
      currentPage: 1,
      sort: sendSort
    });
    const products = productsData.items;
    const resultsText = products.length > 1 ? 'results' : 'result';
    return (
      <>
        <p className="mb-4">
          Showing {productsData.total_count} {resultsText} for{' '}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
        {products.length > 0 ? (
          <MagentoProductGallery
            transformedFilters={transformedFilters}
            pageSize={12}
            searchValue={searchValue}
            sort={sendSort}
            currentPage={'1'}
            products={productsData}
            searchParams={searchParams}
          />
        ) : (
          <p className="mb-4">There are no products that match.</p>
        )}
      </>
    );
  } else if (platformType?.toLocaleLowerCase() === 'bigcommerce') {
    const { sort, q: searchValue } = searchParams as { [key: string]: string };
    const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

    const filtersRequest = async (selectedFilters: { [key: string]: string[] }) => {
      const filteredProducts = await getbigCommerceFiltersList({
        filter: selectedFilters,
        query: searchValue
      });
      return filteredProducts;
    };

    const filterProducts = async (selectedFilters: { [key: string]: string[] }) => {
      const filteredProducts = await getCategoryProducts({
        query: searchValue,
        sortKey,
        reverse,
        filter: selectedFilters,
        first: 1
      });
      return filteredProducts;
    };
    // Get the selected checkboxes from the searchParams and convert them into the required format
    const selectedCheckboxes: { [key: string]: string[] } = {};
    if (searchParams) {
      Object.keys(searchParams).forEach((key) => {
        if (key.endsWith('[filter]')) {
          const filterName = key.replace('[filter]', '');
          const filterValue = searchParams[key];
          if (Array.isArray(filterValue)) {
            selectedCheckboxes[filterName] = filterValue.filter((value) => value !== 'undefined');
          } else {
            selectedCheckboxes[filterName] = filterValue!
              .split(',')
              .filter((value) => value !== 'undefined');
          }
        }
      });
    }
    const filteredProducts = await filterProducts(selectedCheckboxes);
    const resultsText = filteredProducts?.productList?.length ? 'results' : 'result';
    const filtersLists = await filtersRequest(selectedCheckboxes);
    const filters: Node[] = JSON.parse(JSON.stringify(filtersLists));
    const { page } = searchParams as { [key: string]: string };
    const pageSize = process.env.PLP_PAGE_SIZE || '6';

    return (
      <>
        {searchValue ? (
          <p className="mb-4">
            {filteredProducts?.productList?.length === 0
              ? 'There are no products that match '
              : `Showing ${filteredProducts?.productList?.length} ${resultsText} for `}
            <span className="font-bold">&quot;{searchValue}&quot;</span>
          </p>
        ) : null}
        {filteredProducts?.productList?.length > 0 ? (
          <Search
            page={page || '1'}
            reverse={reverse}
            selectedCheckboxes={selectedCheckboxes}
            filters={filters}
            products={filteredProducts}
            searchValue={searchValue}
            sortKey={sortKey}
            pageSize={pageSize || '6'}
          />
        ) : null}
      </>
    );
  }

  return notFound();
}
