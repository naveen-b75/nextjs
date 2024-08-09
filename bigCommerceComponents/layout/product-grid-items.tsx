import Grid from 'bigCommerceComponents/grid';
import { GridTileImage } from 'bigCommerceComponents/grid/tile';
import { VercelProduct as Product } from 'lib/bigcommerce/types';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
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
    </>
  );
}
