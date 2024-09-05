import { default as BigCommerceBreadCrumbs } from 'bigCommerceComponents/category/breadcrumbs';
import Plp from 'bigCommerceComponents/layout/plp';
import { getbigCommerceFiltersList, getCategoryProducts, getCollection } from 'lib/bigcommerce';
import { defaultSort, sorting } from 'lib/constants';
import { getBreadcumbsList, getCollectionProducts, getResolverData } from 'lib/magento';
import { default as MagentoBreadcrumbs } from 'magentoComponents/Breadcrumbs';
import MagentoProductGallery from 'magentoComponents/productGallery';
import { notFound } from 'next/navigation';
// export const runtime = 'edge';

/*export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
} */
const platformType = process.env.ECOMMERCE_PLATFORM;
type SearchParams = {
  [key: string]: string | undefined;
};

type Filters = {
  category_uid?: { eq: string };
  [key: string]: any;
};

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string; page: number };
  searchParams?: SearchParams;
}) {
  if (platformType?.toLocaleLowerCase() === 'magento') {
    const completeUrl = params.collection;
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
    const products = await getCollectionProducts({
      currentPage:1,
      sort: sendSort,
      collection: pageResolverData?.route?.uid!,
      pageSize: pageSize * params?.page ? params.page : 1,
      filters: transformedFilters
    });
    const breadcrumb = await getBreadcumbsList(pageResolverData?.route?.id!);
    const currentCategory = (breadcrumb?.data && breadcrumb?.data.category.name) || '';
    const currentCategoryPath =
      (breadcrumb?.data && `${breadcrumb?.data.category.url_path}`) || '#';
    return (
      <section>
        <MagentoBreadcrumbs
          currentCategory={currentCategory}
          currentCategoryPath={currentCategoryPath}
          breadcrumb={breadcrumb?.data}
        />
        {products?.items?.length === 0 ? (
          <p className="py-3 text-lg">{`No products found in this collection`}</p>
        ) : (
          <MagentoProductGallery
            transformedFilters={transformedFilters}
            pageSize={pageSize || 12}
            collection={pageResolverData?.route?.uid || ''}
            sort={sendSort}
            currentPage={params?.page ? params?.page?.toString() : '1'}
            products={products}
            searchParams={searchParams}
          />
        )}
      </section>
    );
  } else if (platformType?.toLocaleLowerCase() === 'bigcommerce') {
    const { sort } = searchParams as { [key: string]: string };
    const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
    const pages = searchParams?.page ? Number(searchParams.page) : 1;
    const { page } = searchParams as { [key: string]: string };
    const collection = await getCollection(params.collection);
    const filtersRequest = async (selectedFilters: { [key: string]: string[] }) => {
      const filteredProducts = await getbigCommerceFiltersList({
        collection: params.collection,
        filter: selectedFilters
      });
      return filteredProducts;
    };
    const filterProducts = async (selectedFilters: { [key: string]: string[] }) => {
      const filteredProducts = await getCategoryProducts({
        collection: params.collection,
        sortKey,
        reverse,
        filter: selectedFilters,
        first: pages
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
    const [filteredProducts, filtersLists] = await Promise.all([
      filterProducts(selectedCheckboxes),
      filtersRequest(selectedCheckboxes)
    ]);
    const filters: Node[] = JSON.parse(JSON.stringify(filtersLists));
    const pageSize = process.env.PLP_PAGE_SIZE;
    const breadcrumbs = collection?.breadcrumbs ?? [];

    return (
      <section>
        <BigCommerceBreadCrumbs collection={breadcrumbs} />
        {filteredProducts?.productList?.length === 0 ? (
          <p className="py-3 text-lg">{`No products found in this collection`}</p>
        ) : (
          <Plp
            categoryTitle={collection?.title}
            collection={params.collection}
            sortKey={sortKey}
            filters={filters}
            page={page || '1'}
            filteredProducts={filteredProducts}
            reverse={reverse}
            selectedCheckboxes={selectedCheckboxes}
            pageSize={pageSize || '6'}
            endCursor={filteredProducts?.endCursor}
          />
        )}
      </section>
    );
  }

  return notFound();
}
