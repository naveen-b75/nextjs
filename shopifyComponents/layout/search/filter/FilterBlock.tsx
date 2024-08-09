import he from 'he'; // HTML entities decoder library
import { createUrl } from 'lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import AppliedFilters from './appliedFilters';

interface Option {
  value: string;
  label: string;
  count: string;
}

interface Filter {
  title: string;
  type: string;
  options: Option[];
}

interface FilterBlockProps {
  appliedParams: any;
  filterData: Filter[];
}

const FilterBlock = ({ appliedParams, filterData }: FilterBlockProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [visibleFilters, setVisibleFilters] = useState<Record<string, boolean>>({});

  const handleCheckboxChangeInternal = (
    value: string | number,
    isChecked: boolean,
    filterName: string
  ) => {
    const updatedCheckboxes = isChecked
      ? [...selectedCheckboxes, `${filterName},${value}`]
      : selectedCheckboxes.filter((val) => val !== `${filterName},${value}`);

    const updatedSearchParams = new URLSearchParams(appliedParams.toString());

    // Clear existing params for the current filterName
    const paramKeysToRemove: string[] = [];
    updatedSearchParams.forEach((paramValue, paramKey) => {
      if (paramKey.startsWith(`${filterName}[filter]`)) {
        if (!updatedCheckboxes.includes(`${filterName},${paramValue}`)) {
          paramKeysToRemove.push(paramKey);
        }
      }
    });

    paramKeysToRemove.forEach((paramKey) => {
      updatedSearchParams.delete(paramKey);
    });

    // Append updated checkboxes to the params
    updatedCheckboxes.forEach((checkboxValue) => {
      const [paramKey, paramValue] = checkboxValue.split(',');
      const paramName = `${paramKey}[filter]`;

      if (!updatedSearchParams.getAll(paramName).includes(paramValue!)) {
        updatedSearchParams.append(paramName, paramValue!);
      }
    });

    const href = createUrl(pathname, updatedSearchParams);
    router.push(href);
    setSelectedCheckboxes(updatedCheckboxes);
  };

  const handleRemoveFilter = (filterName: string, value: string) => {
    handleCheckboxChangeInternal(value, false, filterName);
  };

  const toggleVisibility = (title: string) => {
    setVisibleFilters((prev) => ({ ...prev, [title]: !prev[title] }));
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
                className="absolute right-[3px] top-[12px]"
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
              <input
                type="checkbox"
                checked={selectedCheckboxes.includes(`${filter.type},${option.value}`)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCheckboxChangeInternal(option.value, e.target.checked, filter.type)
                }
                className="mr-[5px]"
              />
              <label>
                {option.label === '1'
                  ? 'Yes'
                  : option.label === '0'
                  ? 'No'
                  : he.decode(option.label)}
                &nbsp;({option.count})
              </label>
            </div>
          ))}
      </ul>
    ));
  }, [filterData, selectedCheckboxes, visibleFilters]);

  // function convertParams(params) {
  //   const result = [];

  //   Object.keys(params).forEach(key => {
  //     if (Array.isArray(params[key])) {
  //       params[key].forEach(value => {
  //         result.push(`${key.replace('[filter]', '')},${value}`);
  //       });
  //     } else {
  //       result.push(`${key.replace('[filter]', '')},${params[key]}`);
  //     }
  //   });

  //   return result;
  // }

  // const convertedParams = convertParams(appliedParams);
  return (
    <div>
      {selectedCheckboxes.length > 0 && (
        <div>
          <strong>Applied Filters</strong>
          <AppliedFilters
            searchParams={appliedParams}
            filterData={filterData}
            handleRemoveFilter={handleRemoveFilter}
          />
        </div>
      )}
      {filterBlockContent}
    </div>
  );
};

export default FilterBlock;
