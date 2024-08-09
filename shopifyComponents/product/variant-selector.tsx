'use client';

import clsx from 'clsx';
import { MagentoProductOption, MagentoProductVariant } from 'lib/magento/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean; // ie. { color: 'Red', size: 'Large', ... }
};

export function VariantSelector({
  options,
  variants
}: {
  options: MagentoProductOption[];
  variants: MagentoProductVariant[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedconfig, setSelectedconfig] = useState([]);
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: MagentoProductVariant[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    // Adds key / value pairs for each variant (ie. "color": "Black" and "size": 'M").
    ...variant?.attributes?.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.code.toLowerCase()]: option.value_index
      }),
      {}
    )
  }));

  return options?.map((option, i) => (
    <dl className="mb-4" key={i}>
      <dt className="mb-4 text-sm uppercase tracking-wide">{option.label}</dt>
      <dd className="flex flex-wrap gap-3">
        {option.values.map((value) => {
          const optionNameLowerCase = option.label.toLowerCase();
          const optionId = option.attribute_id;

          // Base option params on current params so we can preserve any other param state in the url.
          const optionSearchParams = new URLSearchParams(searchParams.toString());

          // Update the option params using the current option to reflect how the url *would* change,
          // if the option was clicked.
          optionSearchParams.set(optionId, value.value_index);
          optionSearchParams.set('image', '0');
          const optionUrl = createUrl(pathname, optionSearchParams);

          // In order to determine if an option is available for sale, we need to:
          //
          // 1. Filter out all other param state
          // 2. Filter out invalid options
          // 3. Check if the option combination is available for sale
          //
          // This is the "magic" that will cross check possible variant combinations and preemptively
          // disable combinations that are not available. For example, if the color gray is only available in size medium,
          // then all other sizes should be disabled.

          const filtered = Array.from(optionSearchParams.entries()).filter(([key, value]) =>
            options.find(
              (option) =>
                option.label.toLowerCase() === key &&
                option.values.some((val) => val.value_index === value)
            )
          );
          const isAvailableForSale = combinations.find((combination: any) =>
            filtered.every(
              ([key, value]) => combination[key] === value && combination.availableForSale
            )
          );
          //const isAvailableForSale = true;

          // The option is active if it's in the url params.
          const isActive = searchParams.get(optionId) == value.value_index;

          return (
            <button
              key={value.value_index}
              aria-disabled={!isAvailableForSale}
              disabled={!isAvailableForSale}
              onClick={() => {
                router.replace(optionUrl, { scroll: false });
              }}
              title={`${option.label} ${value.store_label}${
                !isAvailableForSale ? ' (Out of Stock)' : ''
              }`}
              className={clsx(
                'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                {
                  'cursor-default ring-2 ring-blue-600': isActive,
                  'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ':
                    !isActive && isAvailableForSale,
                  'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                    !isAvailableForSale
                }
              )}
            >
              {value.store_label}
            </button>
          );
        })}
      </dd>
      {option.values.map((value) => {
        const OptionValue = searchParams.get(option.attribute_id);
        if (OptionValue == value.value_index) {
          return (
            <span className="mt-3 block text-sm" key={`${value.value_index}${i}`}>
              <strong>Selected {option.label} :</strong> {value.store_label}
            </span>
          );
        }
      })}
    </dl>
  ));
}
