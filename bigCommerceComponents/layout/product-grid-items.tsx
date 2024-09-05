import Grid from 'bigCommerceComponents/grid';
import { GridTileImage } from 'bigCommerceComponents/grid/tile';
import Button from 'components/Button';
import { getFilteredProductsProxy } from 'lib/bigcommerce';
import { VercelProduct as Product } from 'lib/bigcommerce/types';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function ProductGridItems({
  products,
  collection,
  sortKey,
  searchValue,
  reverse,
  length,
  selectedCheckboxes,
  endCursor
}: {
  collection?: string;
  length: number;
  sortKey?: string;
  searchValue?:string;
  products: Product[];
  reverse?: boolean;
  selectedCheckboxes?: any;
  endCursor?: string;
}) {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(products);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [after, setAfter] = useState(endCursor ?? '');

  useEffect(() => {
    setDisplayedProducts(products);
    //setIsLoading && setIsLoading(true);
  }, [products]);

  const handleLoadMore = useCallback(async () => {
    try {
      setIsLoadMoreLoading(true);
      const filteredProducts = await getFilteredProductsProxy({
        collection: collection,
        sortKey,
        query:searchValue,
        reverse,
        filter: selectedCheckboxes,
        first: 1,
        after: after
      });

      setDisplayedProducts((old) => [...old, ...filteredProducts.body.productList]);
      setAfter(filteredProducts.body.endCursor);
      setIsLoadMoreLoading(false);
    } catch (err) {
      setIsLoadMoreLoading(false);
    }
  }, [
    displayedProducts,
    setDisplayedProducts,
    getFilteredProductsProxy,
    setIsLoadMoreLoading,
    setDisplayedProducts,
    setAfter,
    after,
    length
  ]);
  return (
    <>
      {displayedProducts.map((product) => (
        <Grid.Item
          key={product.handle}
          className="animate-fadeIn rounded-lg border-[1px] border-neutral-200 p-[20px]"
        >
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product.entityId}`}
          >
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode
              }}
              src={product.featuredImage?.url}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
      <div className="text-center">
        {' '}
        {length > displayedProducts?.length ? (
          <Button
            type="button"
            size="small"
            priority="secondary"
            disabled={isLoadMoreLoading}
            onClick={handleLoadMore}
            classes={{
              root: 'mt-[62px] rounded-[6px] border-[2px] border-teal px-[32px] py-[12px] bg-white hover:bg-white',
              content: 'font-bold !text-teal text-[14px]'
            }}
          >
            {isLoadMoreLoading ? 'Loading...' : 'Load More'}
          </Button>
        ) : null}{' '}
      </div>
    </>
  );
}
