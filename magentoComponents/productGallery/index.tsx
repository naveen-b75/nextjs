'use client';
import Button from 'components/Button';
import { getCollectionProductsProxy } from 'lib/magento';
import { MagentoProductsFilter, MagentoVercelProduct } from 'lib/magento/types';
import { default as MagentoGrid } from 'magentoComponents/grid';
import { default as MagentoProductGridItems } from 'magentoComponents/layout/product-grid-items';
import { LayeredNav as MagentoLayeredNav } from 'magentoComponents/layout/search/filter/LayeredNav';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export default function MagentoProductGallery({
  products,
  collection,
  searchParams,
  transformedFilters,
  pageSize,
  currentPage,
  searchValue,
  sort
}: {
  pageSize: number;
  products: {
    items: MagentoVercelProduct[];
    sort_fields: {
      options: {
        label: string;
        value: string;
      }[];
    };
    total_count: number;
    aggregations: MagentoProductsFilter[];
  };
  sort: {
    [key: string]: string;
  };
  collection?: string;
  transformedFilters: any;
  currentPage: string;
  searchValue?: string;
  searchParams:
    | {
        [key: string]: string | undefined;
      }
    | undefined;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [displayProducts, setDisplayProducts] = useState<{
    items: MagentoVercelProduct[];
    sort_fields: {
      options: {
        label: string;
        value: string;
      }[];
    };
    total_count: number;
    aggregations: MagentoProductsFilter[];
  }>(products);
  const [isActive, setIsActive] = useState(false);
  const [pageNo, setPageNo] = useState<string>(searchParams?.['page'] || '1');
  const router = useRouter();

  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  const loadMoreProducts = useCallback(async (pageNo: number) => {
    try {
      setIsLoading(true);
      if (collection) {
        const response = await getCollectionProductsProxy({
          collection: collection,
          filters: transformedFilters,
          pageSize: pageSize * pageNo,
          currentPage: 1,
          sort: sort
        });
        // Get the current URL and append the page query parameter
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page', pageNo.toString());
        router.push(`${window.location.pathname}?${searchParams.toString()}`, { scroll: false });
        setPageNo(pageNo.toString());
        setDisplayProducts(response.body);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }
  }, []);

  return (
    <section>
      {isLoading && (
        <div className="fixed left-0 top-0 flex h-[100vh] w-full items-center justify-center">
          <div
            className="text-secondary inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
      <section className="flex flex-wrap justify-between">
        <div
          className={`hidden shrink-0 grow-0 basis-full md:block md:basis-[18%] [&.active]:fixed [&.active]:left-0 [&.active]:top-0 [&.active]:z-10 [&.active]:block [&.active]:h-screen [&.active]:w-full [&.active]:overflow-auto [&.active]:bg-white [&.active]:p-[10px] ${
            isActive ? 'active' : ''
          }`}
        >
          <span onClick={toggleActiveClass} className="absolute right-[10px] top-[10px] md:hidden">
            <svg
              width="18"
              height="18"
              viewBox="0 0 22 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="1"
                y1="-1"
                x2="26.3636"
                y2="-1"
                transform="matrix(0.730887 0.682499 -0.730887 0.682499 0 1.3241)"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="1"
                y1="-1"
                x2="26.3636"
                y2="-1"
                transform="matrix(-0.730887 0.682499 -0.730887 -0.682499 20 0)"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <MagentoLayeredNav
            setIsLoading={setIsLoading}
            filtersData={displayProducts?.aggregations}
            searchParams={searchParams}
          />
        </div>
        <div className="mt-[20px] shrink-0 grow-0 basis-full md:mt-0 md:basis-[79%]">
          <button
            className="mb-[20px] mt-[20px] w-full rounded-[6px] border-[2px] border-lightBlack p-[5px] text-center md:hidden"
            onClick={toggleActiveClass}
          >
            Filter
          </button>
          <h2 className="mb-[10px]">{displayProducts.total_count} Results</h2>
          <MagentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <MagentoProductGridItems products={displayProducts.items} />
          </MagentoGrid>
          {displayProducts.total_count > displayProducts?.items?.length && (
            <div className="text-center">
              {' '}
              <Button
                type="button"
                size="small"
                priority="secondary"
                disabled={isLoading}
                onClick={() => {
                  loadMoreProducts(parseInt(pageNo) + 1);
                }}
                classes={{
                  root: 'mt-[62px] rounded-[6px] border-[2px] border-teal px-[32px] py-[12px] bg-white hover:bg-white',
                  content: 'font-bold !text-teal text-[14px]'
                }}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
