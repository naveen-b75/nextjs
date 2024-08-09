'use client';

import { MagentoProductsFilter } from 'lib/magento/types';
import FilterBlock from './FilterBlock';

export function LayeredNav({
  filtersData,
  setIsLoading,
  searchParams
}: {
  searchParams:
    | {
        [key: string]: string | undefined;
      }
    | undefined;
  filtersData: MagentoProductsFilter[];
  setIsLoading: (value: boolean) => void;
}) {
  const itemdata = filtersData;
  const uniqueAttributes = new Set(itemdata.map((item) => item));
  const filterTypesData = Array.from(uniqueAttributes).map((attribute) => {
    return {
      type: attribute.attribute_code,
      title: attribute.label, // Capitalize the first letter
      options:
        itemdata.find((item) => item.attribute_code === attribute.attribute_code)?.options || [],
      count: attribute.count
    };
  });

  return (
    <div>
      {/* <div>
        <ul>
          {Object.entries(searchParams!)?.map((item, index) => (
            <AppliedFilters key={index} appliedFilter={item} />
          ))}
        </ul>
      </div> */}
      <h1 className="mb-2 text-[18px] font-bold">Filters</h1>
      <FilterBlock
        setIsLoading={setIsLoading}
        appliedParams={searchParams!}
        filterData={filterTypesData}
      />
    </div>
  );
}
