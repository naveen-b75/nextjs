'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { MagentoProductVariant, MagentoVercelProduct } from 'lib/magento/types';
import { useUserContext } from 'lib/userContext';
import { addItem } from 'magentoComponents/cart/actions';
import LoadingDots from 'magentoComponents/loading-dots';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({
  availableForSale,
  qty,
  selectedVariantId
}: {
  availableForSale: boolean;
  qty: string;
  selectedVariantId: string | undefined;
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-[#222222] p-4 tracking-wide text-white';
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
        disabled={parseInt(qty) === 0}
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
      disabled={parseInt(qty) === 0}
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
  availableForSale,
  selectedOption
}: {
  productData: MagentoVercelProduct;
  variants: MagentoProductVariant[];
  availableForSale: string;
  selectedOption: { [key: string]: string };
}) {
  const { setUpdateCart } = useUserContext();
  const handleSubmit = useCallback(
    async (
      prevState: any,
      data: {
        selectedOptionsArray: string[];
        selectedProductId: string | undefined;
        selectedVariantId: string | undefined;
        qty: string;
      }
    ) => {
      const res = await addItem(prevState, data);
      setUpdateCart(true);
      return res;
    },
    []
  );
  const [message, formAction] = useFormState(handleSubmit, null);
  const [qty, setQty] = useState('1');
  const searchParams = useSearchParams();
  let selectedProductId = productData.sku;
  let selectedVariantId = productData.sku;
  let stock_status = productData.availableForSale === 'IN_STOCK';

  const optionsearchParamskeys = useMemo(() => Object.values(selectedOption), [selectedOption]);

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
    Object.entries(selectedOption)?.filter(([key, value]) => {
      const values = attributeIdToValuesMap.get(key);
      const selectedValue =
        values?.find((item: { value_index: number }) => item.value_index === parseInt(value)) || {};
      if (selectedValue) {
        selectedOptions.push(selectedValue?.uid!);
      }
    });
    return selectedOptions;
  }, [selectedOption, attributeIdToValuesMap]);

  const matchingProduct: any = useMemo(() => {
    if (optionsearchParamskeys.length < productData?.options?.length) {
      return {}; // Return an empty object if optionsearchParamskeys is empty
    }
    return (
      variants.find((variant: any) => {
        return optionsearchParamskeys.every((optionToFind) => {
          return variant.attributes.some(
            (selectedOption: { value: string; value_index: string }) => {
              return selectedOption.value_index === optionToFind;
            }
          );
        });
      }) || {}
    ); // Return an empty object if no matching variant is found
  }, [variants, optionsearchParamskeys]);

  selectedVariantId =
    productData?.type === 'ConfigurableProduct' ? matchingProduct?.product?.sku : productData.sku;
  selectedProductId = productData.sku;
  if (matchingProduct?.product?.stock_status === 'IN_STOCK') {
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
          placeholder="0"
          value={qty}
          onChange={handleChange}
        />
      </label>
      <SubmitButton
        availableForSale={stock_status}
        qty={qty}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
