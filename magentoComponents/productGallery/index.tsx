'use client';
import { MagentoProductsFilter, MagentoVercelProduct } from 'lib/magento/types';
import { default as MagentoGrid } from 'magentoComponents/grid';
import { default as MagentoProductGridItems } from 'magentoComponents/layout/product-grid-items';
import { LayeredNav as MagentoLayeredNav } from 'magentoComponents/layout/search/filter/LayeredNav';
import { default as MagentoPagination } from 'magentoComponents/layout/search/filter/pagination';
import { useState } from 'react';

export default function MagentoProductGallery({
  products,
  searchParams
}: {
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
  searchParams:
    | {
        [key: string]: string | undefined;
      }
    | undefined;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isActive, setIsActive] = useState(false);

  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };
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
            filtersData={products?.aggregations}
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
          <h2 className="mb-[10px]">{products.total_count} Results</h2>
          <MagentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <MagentoProductGridItems products={products.items} />
          </MagentoGrid>
          <MagentoPagination TotalProducts={products.total_count} searchParams={searchParams} />
        </div>
      </section>
    </section>
  );
}
