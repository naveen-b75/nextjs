'use client';
import he from 'he'; // HTML entities decoder library
import { FC, useEffect, useState } from 'react';

interface Option {
  value: string;
  label: string;
  count: string;
}

interface Filter {
  type: string;
  title: string;
  options:
    | []
    | [
        {
          count: number;
          label: string;
          value: string;
        }
      ];
  count: number;
}

interface AppliedFiltersProps {
  searchParams?: any; // Adjust this type if you have a more specific type for searchParams
  filterData?: Filter[];
  handleRemoveFilter?: (filterName: string, value: string) => void;
  appliedFilter?: any;
}

const AppliedFilters: FC<AppliedFiltersProps> = ({
  searchParams,
  filterData,
  handleRemoveFilter,
  appliedFilter
}) => {
  const [filteredSearchParams, setFilteredSearchParams] = useState<string[]>([]);

  // Function to convert params into an array of strings
  function convertParams(params: Record<string, any>): string[] {
    const result: string[] = [];
    const excludeKeys = new Set(['[object Object]', 'collection', 'child', 'path']);

    params &&
      Object.keys(params).forEach((key) => {
        if (excludeKeys.has(key)) {
          return;
        }

        if (Array.isArray(params[key])) {
          params[key].forEach((value: any) => {
            result.push(`${key.replace('[filter]', '')},${value}`);
          });
        } else {
          result.push(`${key.replace('[filter]', '')},${params[key]}`);
        }
      });

    return result;
  }

  // UseEffect to update filtered search params
  useEffect(() => {
    const convertedParams = searchParams && convertParams(searchParams);
    convertedParams && setFilteredSearchParams(convertedParams);
  }, [searchParams]);

  // Create a mapping of applied filters
  const appliedFilters: { [key: string]: string[] } = filteredSearchParams?.reduce(
    (acc, checkboxValue) => {
      const [filterName, value] = checkboxValue.split(',');
      if (!acc[filterName!]) {
        acc[filterName!] = [];
      }
      acc[filterName!]?.push(value!);
      return acc;
    },
    {} as { [key: string]: string[] }
  );

  const appliedFiltersContent = Object.entries(appliedFilters).map(([filterName, values]) => {
    const filter = filterData && filterData.find((filter) => filter.type === filterName);
    if (!filter) return null;

    return (
      <div key={filterName} className="applied-filter">
        <strong>{filter.title}:</strong>
        {values.map((value, index) => {
          const option = filter.options.find((option) => option.value === value);
          const optionLabel = option?.label;
          return (
            <span
              key={index}
              onClick={() => handleRemoveFilter && handleRemoveFilter(filterName, value)}
              className="cursor-pointer text-blue-500"
            >
              {optionLabel === '1'
                ? 'Yes'
                : optionLabel === '0'
                ? 'No'
                : he.decode(optionLabel || '')}
              {index < values.length - 1 ? ', ' : ''}
            </span>
          );
        })}
      </div>
    );
  });

  return <div className="applied-filters">{appliedFiltersContent}adfasfd</div>;
};

export default AppliedFilters;
