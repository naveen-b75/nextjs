'use client';
import Button from 'elements/Button/button';
import { Field, Formik } from 'formik';
import { Node } from 'lib/bigcommerce/types';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function FilterComponent({
  filters,
  setFiltersList,
  setIsLoading
}: {
  filters: Node[];
  setFiltersList: (value: any) => void;
  setIsLoading: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [showAttributes, setShowAttributes] = useState<{ [key: string]: boolean }>({});
  const [visibleCheckboxes, setVisibleCheckboxes] = useState<{ [key: string]: number }>({});

  const q = searchParams.get('q');

  const handleCheckboxChange = (value: string | number, isChecked: boolean, filterName: string) => {
    const updatedCheckboxes = isChecked
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
        updatedSearchParams.append(paramName, paramValue!);
      }
    });
    const href = createUrl(pathname, updatedSearchParams);
    isChecked && setIsLoading && setIsLoading(isChecked);
    router.push(href);

    setFiltersList && setFiltersList(updatedCheckboxes);
    setSelectedCheckboxes(updatedCheckboxes);
  };

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
        updatedSearchParams.append(paramName, paramValue!);
      }
    });

    return createUrl(pathname, updatedSearchParams);
  };

  //Keep checkboxes checked if user refreshed the page.
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
      setFiltersList && setFiltersList(convertedArray);
    }
  }, [searchParams]);

  const handleClearAll = useCallback(() => {
    setSelectedCheckboxes([]);

    // Clear the query string by removing the "filter" parameter from the URL
    const updatedSearchParams = new URLSearchParams({
      ...(q && { q }) // Keep other query parameters
    });
    updatedSearchParams.delete('filter');
    setFiltersList && setFiltersList([]);

    // Create the new URL with the updated query parameters
    const href = createUrl(pathname, updatedSearchParams);

    setIsLoading && setIsLoading(true);
    // Update the URL in the browser
    router.push(href);
  }, [pathname, q]);

  const handleFilterToggle = useCallback(
    (filterName: string) => {
      setShowAttributes((prevState) => ({
        ...prevState,
        [filterName]: !prevState[filterName]
      }));
    },
    [setShowAttributes]
  );

  const handleUncheckCheckbox = useCallback(
    (value: string) => {
      setSelectedCheckboxes((prevSelected) => prevSelected.filter((val) => val !== value));
      setFiltersList &&
        setFiltersList((prevSelected: any) => prevSelected.filter((val: any) => val !== value));

      // Create a new URLSearchParams object with the updated query parameters
      const updatedSearchParams = new URLSearchParams();

      // Iterate over the existing searchParams and append to the updatedSearchParams
      searchParams.forEach((value, key) => {
        updatedSearchParams.append(key, value);
      });

      // Get the filterName and checkboxValue from the unchecked value
      const [filterName, checkboxValue] = value.split(',');

      // Get the existing values for the specific filterName
      const existingValues = updatedSearchParams.getAll(`${filterName}[filter]`);

      // Remove the unchecked checkbox value from the query string
      const updatedValues = existingValues.filter((v) => v !== checkboxValue);

      // Update the query string with the filtered values
      updatedSearchParams.delete(`${filterName}[filter]`);
      updatedValues.forEach((v) => updatedSearchParams.append(`${filterName}[filter]`, v));

      // Create the new URL with the updated query parameters
      const href = createUrl(pathname, updatedSearchParams);
      setIsLoading && setIsLoading(true);
      // Update the URL in the browser
      router.push(href);
    },
    [pathname, q, router, searchParams]
  );

  const handleViewAll = useCallback(
    (filterName: string, length: number) => {
      setVisibleCheckboxes((prevVisibleCheckboxes) => ({
        ...prevVisibleCheckboxes,
        [filterName]: length
      }));
    },
    [setVisibleCheckboxes]
  );

  return (
    <div>
      <div className="search-title text-darkGray mt-[13px] text-[24px] font-semibold">Filters</div>
      <div className="border-b-filterBorder mb-[17px] border-b pb-[13px]">
        {selectedCheckboxes.length > 0 && (
          <div>
            <ul className="mt-[10px] flex flex-wrap gap-[10px]">
              {selectedCheckboxes.map((value) => {
                const parts = value.split(',');
                const filterValue = parts[parts.length - 1];

                // Add a type check to ensure filterValue is not undefined and is a valid number
                const parsedFilterValue =
                  typeof filterValue === 'string' && !isNaN(Number(filterValue))
                    ? parseInt(filterValue, 10)
                    : null;

                function getBrandName(entityId: number, filters: Node[]) {
                  for (const filter of filters) {
                    if (filter.node.__typename === 'BrandSearchFilter' && filter.node.brands) {
                      for (const brandEdge of filter.node.brands.edges) {
                        if (brandEdge.node.entityId === entityId) {
                          return brandEdge.node.name;
                        }
                      }
                    }
                  }
                  return null; // Return null if the brand is not found
                }

                const isNumber = parsedFilterValue !== null; // Check if parsedFilterValue is a valid number
                const displayValue = isNumber
                  ? getBrandName(parsedFilterValue, filters)
                  : filterValue;

                return (
                  <li
                    className="text-mediumGray w-auto max-w-[fit-content] rounded-[4px] bg-[#f9f9f9] px-[14px] py-[9px] text-[14px]"
                    key={value}
                  >
                    {displayValue?.startsWith('#') ? (
                      <span
                        style={{
                          background: displayValue,
                          width: '18px',
                          height: '18px',
                          display: 'inline-block',
                          borderRadius: '3px',
                          border: '1px solid #e2e2e2'
                        }}
                      ></span>
                    ) : (
                      displayValue
                    )}{' '}
                    <button className="ml-[12px]" onClick={() => handleUncheckCheckbox(value)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                      >
                        <path
                          d="M9.80314 10.7983L5.50393 6.49912L1.31786 10.6852L0.299623 9.66696L4.48569 5.48089L0.186485 1.18168L1.15946 0.2087L5.45867 4.50791L9.66737 0.29921L10.6856 1.31744L6.47691 5.52614L10.7761 9.82535L9.80314 10.7983Z"
                          fill="#636569"
                        />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button onClick={handleClearAll} className="mt-[10px] text-[12px] text-black underline">
              Clear All
            </button>
          </div>
        )}
      </div>
      <div>
        {filters?.map(({ node }, index) => {
          const filterNameId = `filterName_${node.filterName}`;
          const isAttributeShown = showAttributes[node.filterName];
          const eachFilterLength = node.attributes?.edges?.length || 0;
          const brandsLength = node.brands?.edges?.length || 0;
          return (
            <div key={index} className="border-b-filterBorder border-b empty:border-0">
              {node.name !== 'Price' && node.name !== 'Others' && node.name !== 'Other' && (
                <label
                  htmlFor={filterNameId}
                  onClick={() => handleFilterToggle(node.filterName)}
                  className="text-darkGray relative mb-[15px] mt-[15px] block cursor-pointer text-[16px] font-bold uppercase"
                  style={{ cursor: 'pointer' }}
                >
                  {node.name}
                  {isAttributeShown ? (
                    <svg
                      width="12"
                      height="4"
                      viewBox="0 0 12 4"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-0 top-[10px]"
                    >
                      <path d="M0.32325 3.104V0.128H11.2433V3.104H0.32325Z" fill="#454849" />
                    </svg>
                  ) : (
                    <span className="text-darkGray absolute right-0 top-[-7px] text-[26px]">+</span>
                  )}
                </label>
              )}
              {isAttributeShown && (
                <ul className={`${node.name} [.Colors&]:flex [.Colors&]:flex-wrap`}>
                  {node.attributes?.edges?.map(({ node: attribute }, index) => (
                    <li key={attribute.value} className={`mb-[17px] ${attribute.value}`}>
                      {index < (visibleCheckboxes[node.filterName] || 7) && (
                        <Formik
                          initialValues={{ checkboxes: selectedCheckboxes }}
                          onSubmit={(values) => {
                            //onSubmit and initialValues are required props for the Formik
                          }}
                        >
                          <label
                            className={`text-mediumGray relative flex cursor-pointer gap-[11px] text-[14px] ${attribute.value} ${node.name} [.Colors&]:border-filterBorder [.Colors&]:h-[18px] [.Colors&]:w-[18px] [.Colors&]:rounded-[3px] [.Colors&]:border-[1px] [.Colors&]:text-[0]`}
                            style={{ backgroundColor: `${attribute.value}` }}
                          >
                            <Field
                              type="checkbox"
                              className="border-filterBorder checked:border-teal peer relative h-[18px] w-[18px] appearance-none rounded-[2px] border-[1px] bg-white"
                              name={filterNameId}
                              value={`${node.filterName},${attribute.value}`}
                              checked={selectedCheckboxes.includes(
                                `${node.filterName},${attribute.value}`
                              )}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleCheckboxChange(
                                  attribute.value,
                                  e.target.checked,
                                  node.filterName
                                )
                              }
                            />
                            <svg
                              className="absolute left-[3px] top-[3px] hidden peer-checked:block"
                              xmlns="http://www.w3.org/2000/svg"
                              width="11"
                              height="10"
                              viewBox="0 0 11 10"
                              fill="none"
                            >
                              <path d="M1 5.37457L4.12598 8.5L10 1" stroke="#57B6B2" />
                            </svg>
                            <Link href={handleFilterUrlCreation(attribute.value, node.filterName)}>
                              {attribute.value}
                            </Link>
                          </label>
                        </Formik>
                      )}
                    </li>
                  ))}
                  {node.attributes?.edges?.length > (visibleCheckboxes[node.filterName] || 7) && (
                    <li>
                      <Button
                        type="button"
                        size="small"
                        priority="secondary"
                        disabled={false}
                        onClick={() => handleViewAll(node.filterName, eachFilterLength)}
                        classes={{
                          root: 'text-teal text-[14px] underline border-0',
                          content: 'font-normal text-teal'
                        }}
                      >
                        View More
                      </Button>
                    </li>
                  )}
                  {node.brands?.edges?.map(({ node: brands }) => (
                    <li key={brands.entityId} className="mb-[17px]">
                      {index < (visibleCheckboxes[node.filterName] || 7) && (
                        <Formik
                          initialValues={{ checkboxes: selectedCheckboxes }}
                          onSubmit={(values) => {
                            //onSubmit and initialValues are required props for the Formik
                          }}
                        >
                          <label className="text-mediumGray relative flex gap-[11px] text-[14px]">
                            <Field
                              className="border-filterBorder checked:border-teal peer relative h-[18px] w-[18px] appearance-none rounded-[2px] border-[1px] bg-white"
                              type="checkbox"
                              name={filterNameId}
                              value={`${brands.entityId}`}
                              checked={selectedCheckboxes.includes(
                                `${node.name},${brands.entityId}`
                              )}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleCheckboxChange(brands.entityId, e.target.checked, node.name)
                              }
                            />
                            <svg
                              className="absolute left-[3px] top-[3px] hidden peer-checked:block"
                              xmlns="http://www.w3.org/2000/svg"
                              width="11"
                              height="10"
                              viewBox="0 0 11 10"
                              fill="none"
                            >
                              <path d="M1 5.37457L4.12598 8.5L10 1" stroke="#57B6B2" />
                            </svg>
                            <Link href={handleFilterUrlCreation(brands.entityId, node.name)}>
                              {brands.name}
                            </Link>
                          </label>
                        </Formik>
                      )}
                    </li>
                  ))}
                  {node.brands?.edges?.length > (visibleCheckboxes[node.filterName] || 7) && (
                    <li>
                      <Button
                        type="button"
                        size="small"
                        priority="secondary"
                        disabled={false}
                        onClick={() => handleViewAll(node.filterName, brandsLength)}
                        classes={{
                          root: 'text-teal text-[14px] underline border-0',
                          content: 'font-normal text-teal'
                        }}
                      >
                        View All
                      </Button>
                    </li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
