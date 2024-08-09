'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { MagentoProductVariant, MagentoVercelProduct } from 'lib/magento/types';
import { useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      <div className="absolute left-0 ml-4">
        {pending ? <LoadingDots className="mb-3 bg-white" /> : <PlusIcon className="h-5" />}
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({
  productData,
  variants,
  availableForSale
}: {
  productData: MagentoVercelProduct;
  variants: MagentoProductVariant[];
  availableForSale: string;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const [qty, setQty] = useState('1');
  const searchParams = useSearchParams();
  let selectedProductId = productData.sku;
  let selectedVariantId = productData.sku;
  let stock_status = productData.availableForSale === 'IN_STOCK';

  const optionSearchParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('image');
    return params;
  }, [searchParams]);

  const optionsearchParamskeys = useMemo(
    () => Array.from(optionSearchParams.values()),
    [optionSearchParams]
  );

  const attributeIdToValuesMap = useMemo(() => {
    const map = new Map();
    const options = productData.options || [];
    for (const { attribute_id, values } of options) {
      map.set(attribute_id, values);
    }
    return map;
  }, [productData.options]);

  const selectedOptionsArray = useMemo(() => {
    const selectedOptions: any[] = [];
    Array.from(optionSearchParams.entries()).filter(([key, value]) => {
      const values = attributeIdToValuesMap.get(key);
      const selectedValue =
        values?.find((item: { value_index: number }) => item.value_index === parseInt(value)) || {};
      if (selectedValue) {
        selectedOptions.push(selectedValue?.uid!);
      }
    });
    return selectedOptions;
  }, [optionSearchParams, attributeIdToValuesMap]);

  const matchingProduct: any = useMemo(() => {
    return variants.find((variant: any) => {
      return optionsearchParamskeys.every((optionToFind) => {
        return variant.attributes.some((selectedOption: { value: string; value_index: string }) => {
          if (selectedOption.value_index === optionToFind) {
            return variant;
          }
        });
      });
    });
  }, [variants, optionsearchParamskeys]);

  selectedVariantId = matchingProduct?.product?.sku || productData.sku;
  selectedProductId = productData.sku;

  if (matchingProduct?.product.stock_status === 'IN_STOCK') {
    stock_status = true;
  }

  const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'qty') {
      setQty(value);
    }
  };

  const actionWithVariant = formAction.bind(null, {
    selectedOptionsArray,
    selectedProductId,
    selectedVariantId,
    qty
  });

  return (
    <form action={actionWithVariant}>
      <label className="mb-6 block">
        Qty:
        <input
          className="ml-2 w-10 border py-1 text-center text-sm"
          type="text"
          name="qty"
          value={qty || '1'}
          onChange={handleChange}
        />
      </label>
      <SubmitButton availableForSale={stock_status} selectedVariantId={selectedVariantId} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
