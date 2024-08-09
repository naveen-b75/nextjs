'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getAutocompleteProductsProxy } from 'lib/magento';
import { createUrl } from 'lib/utils';
import Price from 'magentoComponents/price';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ aggregation: [], items: [] });
  const [showNoResults, setShowNoResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef: any = useRef(null);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    const newParams = new URLSearchParams(searchParams.toString());

    if (searchValue) {
      newParams.set('q', searchValue);
    } else {
      newParams.delete('q');
    }

    router.push(createUrl('/search', newParams));
  };

  const handleChange = async (e: React.FocusEvent<HTMLInputElement>) => {
    const queryKey = e.target.value;
    setQuery(queryKey);
    setShowNoResults(false);

    if (queryKey.length > 3) {
      const response = await getAutocompleteProductsProxy(queryKey);
      if (response.body.items.length > 0 || response.body.aggregation.length > 0) {
        setResults(response.body);
      } else {
        setResults({ aggregation: [], items: [] });
        setShowNoResults(true);
      }
    } else {
      setResults({ aggregation: [], items: [] });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef?.current?.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    setResults({ aggregation: [], items: [] });
    setShowNoResults(false);
    setQuery('');
    setIsFocused(false);
  }, [pathname, searchParams]);

  return (
    <div className="min-w-[220px] lg:min-w-[350px]">
      <form onSubmit={onSubmit} className="relative w-full">
        <input
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          key={searchParams?.get('q')}
          type="text"
          name="search"
          placeholder="Search for products..."
          autoComplete="off"
          className="w-full rounded-lg border bg-white px-4 py-2 text-[16px] text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        />
        <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
          <MagnifyingGlassIcon className="h-4" />
        </div>
      </form>
      {(isFocused || query.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute left-auto right-0 top-[100%] z-10 mt-1 max-h-[300px] min-w-[350px] overflow-auto border bg-white p-4 shadow"
        >
          {results.aggregation.length === 0 && results.items.length === 0 && !showNoResults && (
            <label className="mb-2 block font-bold">Search For a Product</label>
          )}
          {results.aggregation.length > 0 || results.items.length > 0 ? (
            <>
              <ul className="mb-2 border-b empty:mb-0 empty:border-0">
                {results.aggregation.map((result: { label: string; value: string }, index) => (
                  <li className="p-2 hover:bg-gray-200" key={index}>
                    <strong className="inline">{query}</strong> in
                    <Link
                      //onClick={() => {setIsFocused(false);setQuery('');}}
                      className="ml-1 inline text-blue-600 hover:underline"
                      href={`/search?q=${query}&category_uid=${encodeURIComponent(result.value)}`}
                    >
                      {result.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul>
                <label className="mb-2 block font-bold">Product Suggestions</label>
                {results.items.map(
                  (
                    result: {
                      title: string;
                      priceRange: { maxVariantPrice: { currencyCode: string; amount: number } };
                      handle: string;
                      featuredImage: { url: string };
                    },
                    index
                  ) => (
                    <li key={index} className="mb-2 border-b pb-2">
                      <Link
                        className="flex"
                        href={`/product/${result.handle}`}
                        onClick={() => setIsFocused(false)}
                      >
                        <Image
                          alt="product"
                          className="border"
                          src={result.featuredImage?.url}
                          width={60}
                          height={60}
                        />
                        <div className="ml-2">
                          {result.title}
                          <Price
                            className="mt-2 text-sm"
                            amount={result?.priceRange?.maxVariantPrice?.amount?.toString()}
                            currencyCode={result?.priceRange?.maxVariantPrice?.currencyCode}
                          />
                        </div>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </>
          ) : (
            showNoResults &&
            query.length > 3 && <label className="mb-2 block font-bold">No results found</label>
          )}
        </div>
      )}
    </div>
  );
}
