'use client';
import FilterSidebar from 'bigCommerceComponents/layout/filter';
import ProductGridItems from 'bigCommerceComponents/layout/product-grid-items';
import FilterList from 'bigCommerceComponents/layout/search/filter';
import Pagination from 'bigCommerceComponents/pagination';
import { sorting } from 'lib/constants';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import FilterComponent from '../filter/filter';

export default function Search({
  products,
  searchValue,
  filters,
  pageSize,
  page
}: {
  products: any;
  filters: any;
  searchValue: any;
  pageSize: string;
  page: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [filtersList, setFiltersList] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(parseInt(page) || 1);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resultsText = products?.productList?.length > 1 ? 'results' : 'result';

  const handlePageChange = useCallback(
    async (page: number) => {
      await setCurrentPage(page);
      // Create a new URLSearchParams object with the updated query parameters
      const updatedSearchParams = new URLSearchParams();
      searchParams.forEach((value, key) => {
        updatedSearchParams.append(key, value);
      });
      // Update the 'page' query parameter
      updatedSearchParams.set('page', page.toString());
      // Create the new URL with the updated query parameters
      const href = createUrl(pathname, updatedSearchParams);
      // Update the URL in the browser
      router.push(href);
    },
    [setCurrentPage]
  );
  return (
    <div className="flex justify-between md:gap-[20px] lg:gap-[40px]">
      <div className="md:w-full md:max-w-[200px] lg:max-w-[280px]">
        {products?.productList?.length > 0 && (
          <div className="search-filter hidden md:block">
            <FilterComponent
              setIsLoading={setIsLoading}
              filters={filters}
              setFiltersList={setFiltersList}
            />
          </div>
        )}
      </div>
      <div className="mb-[40px] w-full md:max-w-[975px]">
        <div className="text-teal mb-[15px] mt-[20px] text-center text-[30px] font-bold leading-normal md:mt-[20px] md:text-left md:text-[40px] md:font-extrabold">
          Search
        </div>
        {products?.productList?.length > 0 && (
          <div className="search-filter my-[20px]">
            <FilterSidebar filters={filters} />
          </div>
        )}
        <div
          className={`flex flex-wrap items-center justify-end gap-[23px] [&.search-empty]:justify-start ${
            products?.productList?.length === 0 ? 'search-empty' : ''
          }`}
        >
          <div className="text-mediumGray text-[14px]">
            {searchValue ? (
              <p className={isLoading ? 'blur' : ''}>
                {products?.productList?.length === 0
                  ? 'There are no products that match '
                  : `${products?.productList?.length} ${resultsText} for `}
                <span className="font-bold">&quot;{searchValue}&quot;</span>
              </p>
            ) : null}
          </div>
          {products?.productList?.length > 0 && (
            <div className="border-filterBorder relative z-[1] flex items-center gap-[10px] rounded-[6px] border">
              <FilterList list={sorting} title="Sort by" />
            </div>
          )}
        </div>
        <div className="relative">
          {products?.productList?.length > 0 ? (
            <ProductGridItems products={products?.productList} />
          ) : null}
        </div>
        <div>
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            itemsPerPage={parseInt(pageSize)}
            totalItems={products?.productList?.length}
          />
        </div>
      </div>
    </div>
  );
}
