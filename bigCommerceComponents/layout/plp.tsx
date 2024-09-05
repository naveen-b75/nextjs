'use client';
import Grid from 'bigCommerceComponents/grid';
import FilterSidebar from 'bigCommerceComponents/layout/filter';
import ProductGridItems from 'bigCommerceComponents/layout/product-grid-items';
import FilterList from 'bigCommerceComponents/layout/search/filter';
import { sorting } from 'lib/constants';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import FilterComponent from './filter/filter';

interface PlpProps {
  filters?: any;
  filteredProducts?: any;
  products?: any;
  categoryTitle?: string;
  selectedCheckboxes: any;
  collection: string;
  sortKey: string;
  page: string;
  pageSize: string;
  reverse: boolean;
  endCursor?: string;
}

const Plp: React.FC<PlpProps> = ({
  filters,
  pageSize,
  endCursor,
  filteredProducts,
  products,
  categoryTitle,
  selectedCheckboxes,
  collection,
  sortKey,
  page,
  reverse
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductsList] = useState(null);
  const [filtersList, setFiltersList] = useState([]);
  const [totolProducts, setTotalProducts] = useState<number>(0);
  const [filter, setFilters] = useState([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(parseInt(page) || 1);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productsData = useMemo(() => {
    return (
      <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ProductGridItems
          length={filteredProducts?.totalItems}
          reverse={reverse}
          selectedCheckboxes={selectedCheckboxes}
          endCursor={endCursor}
          sortKey={sortKey}
          collection={collection}
          products={filteredProducts?.productList!}
        />
      </Grid>
    );
  }, [productList, isLoading, filteredProducts]);

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
    <div className="mt-8 flex justify-between md:gap-[20px] lg:gap-[40px]">
      <div className="md:shrink-0 md:grow-0 md:basis-[18%]">
        <div className="hidden md:block">
          {filters?.length > 0 && (
            <FilterComponent
              filters={filters!}
              setIsLoading={setIsLoading}
              setFiltersList={setFiltersList}
            />
          )}
        </div>
      </div>
      <div className="mt-[20px] shrink-0 grow-0 basis-full md:mt-0 md:basis-[79%]">
        <div className="text-teal mb-[15px] mt-[20px] text-center text-[30px] font-bold leading-normal md:mt-0 md:text-left md:text-[40px] md:font-extrabold">
          {categoryTitle}
        </div>
        <FilterSidebar setFiltersList={setFiltersList} filters={filters} />
        <div>
          <div className="mb-[20px] flex items-center justify-end gap-[23px]">
            <div className="text-mediumGray text-[14px]">
              {filteredProducts?.totalItems} results
            </div>
            <div className="border-filterBorder relative z-[1] flex items-center gap-[10px] rounded-[6px] border">
              <FilterList list={sorting} title="Sort by" />
            </div>
          </div>
        </div>
        <div className="relative">{productsData}</div>
        <div className="my-[20px] text-center">
          {/* <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            itemsPerPage={parseInt(pageSize)}
            totalItems={filteredProducts?.totalItems}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Plp;
