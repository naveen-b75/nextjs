'use client';
import { AddToCart } from 'bigCommerceComponents/cart/add-to-cart';
import Price from 'bigCommerceComponents/price';
import Prose from 'bigCommerceComponents/prose';
import { VercelProduct as Product } from 'lib/bigcommerce/types';
import { useState } from 'react';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  const [selectedOption, setSelectedOptions] = useState<{ [key: string]: string }>({});
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-lightBlack p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector
        setSelectedOptions={setSelectedOptions}
        options={product.options}
        variants={product.variants}
      />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}

      <AddToCart
        selectedOption={selectedOption}
        variants={product.variants}
        availableForSale={product.availableForSale}
      />
    </>
  );
}
