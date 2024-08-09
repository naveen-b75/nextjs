import he from 'he'; // HTML entities decoder library
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppliedFilters from './appliedFilters';

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

interface FilterBlockProps {
  appliedParams: any;
  filterData: Filter[];
  setIsLoading: (value: boolean) => void;
}

const FilterBlock = ({ appliedParams, filterData, setIsLoading }: FilterBlockProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [visibleFilters, setVisibleFilters] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const handleCheckboxChangeInternal = (
    value: string | number,
    isChecked: boolean,
    filterName: string
  ) => {
    setIsLoading(true);
    const updatedCheckboxes = isChecked
      ? [...selectedCheckboxes, `${filterName},${value}`]
      : selectedCheckboxes.filter((val) => val !== `${filterName},${value}`);

    const updatedSearchParams = new URLSearchParams(searchParams.toString());

    // Clear existing params for the current filterName
    const paramKeysToRemove = updatedSearchParams
      .getAll(`${filterName}[filter]`)
      .filter(
        (paramValue) =>
          !updatedCheckboxes.includes(`${filterName},${decodeURIComponent(paramValue)}`)
      );

    paramKeysToRemove.forEach((paramValue) => {
      updatedSearchParams.delete(`${filterName}[filter]`);
    });

    // Append updated checkboxes to the params
    updatedCheckboxes.forEach((checkboxValue) => {
      const [paramKey, paramValue] = checkboxValue.split(',');
      const paramName = `${paramKey}[filter]`;
      if (!updatedSearchParams.getAll(paramName).includes(paramValue!)) {
        updatedSearchParams.append(paramName, encodeURIComponent(paramValue!));
      }
    });

    const href = createUrl(pathname, updatedSearchParams);
    router.push(href);
    setSelectedCheckboxes(updatedCheckboxes);
    setIsLoading(false);
  };

  const handleRemoveFilter = (filterName: string, value: string) => {
    handleCheckboxChangeInternal(value, false, filterName);
  };

  const handleClearAll = useCallback(() => {
    setIsLoading(true);
    setSelectedCheckboxes([]);
    // Clear the query string by removing the "filter" parameter from the URL
    const updatedSearchParams = new URLSearchParams({
      ...(q && { q }) // Keep other query parameters
    });
    updatedSearchParams.delete('filter');
    // Create the new URL with the updated query parameters
    const href = createUrl(pathname, updatedSearchParams);
    // Update the URL in the browser
    router.push(href);
    setIsLoading(false);
  }, [pathname, q]);

  const toggleVisibility = (title: string) => {
    setVisibleFilters((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  useEffect(() => {
    const queryParams = searchParams.toString();
    if (queryParams) {
      const decodedParams = decodeURIComponent(queryParams);
      const paramEntries = decodedParams.split('&');
      const updatedCheckboxes: string[] = [];

      paramEntries.forEach((param: string) => {
        const [paramKey, paramValue]: string[] | undefined = param.split('=');
        if (paramKey!.endsWith('[filter]')) {
          const filterName = paramKey!.replace('[filter]', '');
          const decodedValue = decodeURIComponent(paramValue!);
          updatedCheckboxes.push(`${filterName},${decodedValue}`);
        }
      });

      const convertedArray = updatedCheckboxes?.map((item: string) => item.replace(/\+/g, ' '));
      setSelectedCheckboxes(convertedArray);
    }
  }, [searchParams]);

  const handleFilterUrlCreation = (value: string | number, filterName: string) => {
    // check if filter exist
    const isFilterActive = !!selectedCheckboxes.filter((val) => val === `${filterName},${value}`)
      .length;

    const updatedCheckboxes = !isFilterActive
      ? [...selectedCheckboxes, `${filterName},${value}`]
      : selectedCheckboxes.filter((val) => val !== `${filterName},${value}`);

    const updatedSearchParams = new URLSearchParams(searchParams.toString());

    // Clear existing params for the current filterName
    const paramKeysToRemove = updatedSearchParams
      .getAll(`${filterName}[filter]`)
      .filter((paramValue) => !updatedCheckboxes.includes(`${filterName},${paramValue}`));

    paramKeysToRemove.forEach((paramValue) => {
      updatedSearchParams.delete(`${filterName}[filter]`);
    });

    // Append updated checkboxes to the params
    updatedCheckboxes.forEach((checkboxValue) => {
      const [paramKey, paramValue] = checkboxValue.split(',');
      const paramName = `${paramKey}[filter]`;

      if (!updatedSearchParams.getAll(paramName).includes(paramValue!)) {
        updatedSearchParams.append(paramName, encodeURIComponent(paramValue!));
      }
    });
    return createUrl(pathname, updatedSearchParams);
  };

  const filterBlockContent = useMemo(() => {
    return filterData.map((filter) => (
      <ul key={filter.title} className="border-b border-neutral-200 py-2">
        <strong
          onClick={() => toggleVisibility(filter.title)}
          className="relative my-[24px] cursor-pointer font-bold"
        >
          <li>
            {filter.title}
            {visibleFilters[filter.title] ? (
              <svg
                width="12"
                height="4"
                viewBox="0 0 12 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-[1px] top-[11px]"
              >
                <path d="M0.32325 3.104V0.128H11.2433V3.104H0.32325Z" fill="#454849" />
              </svg>
            ) : (
              <span className="absolute right-0 top-[-8px] text-[26px]">+</span>
            )}
          </li>
        </strong>
        {visibleFilters[filter.title] &&
          filter.options.map((option) => (
            <div className="my-[10px]" key={option.value}>
              <label htmlFor={`${filter.type}_${option.value}`}>
                <input
                  type="checkbox"
                  id={`${filter.type}_${option.value}`}
                  checked={selectedCheckboxes.includes(`${filter.type},${option.value}`)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleCheckboxChangeInternal(option.value, e.target.checked, filter.type)
                  }
                  className="mr-[5px]"
                />
                <Link href={handleFilterUrlCreation(option.value,filter.type)}>
                  {option.label === '1'
                    ? 'Yes'
                    : option.label === '0'
                    ? 'No'
                    : he.decode(option.label)}
                  &nbsp;({option.count})
                </Link>
              </label>
            </div>
          ))}
      </ul>
    ));
  }, [filterData, searchParams, selectedCheckboxes, visibleFilters]);

  return (
    <div>
      {selectedCheckboxes.length > 0 && (
        <div>
          <strong>Applied Filters</strong>
          <AppliedFilters
            searchParams={appliedParams}
            filterData={filterData}
            handleRemoveFilter={handleRemoveFilter}
            handleClearAll={handleClearAll}
          />
        </div>
      )}
      {filterBlockContent}
    </div>
  );
};

export default FilterBlock;
