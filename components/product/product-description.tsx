import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { MagentoVercelProduct } from 'lib/magento/types';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: MagentoVercelProduct }) {
  // we will create a state
  // const [simple, setSimple] = useState('');
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="reviews-actions">
          <a className="action view mb-4 inline-block" href="#reviews">
            <span itemProp="reviewCount">{product.review_count}</span>&nbsp;
            <span>Reviews </span>
          </a>
          <a className="action add ml-2 text-[#222222] underline" href="#review-form">
            Add Your Review{' '}
          </a>
        </div>
        <div className="mr-auto w-auto rounded-full bg-[#222222] p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />

      {product.descriptionHtml ? (
        <Prose
          className="mb-6 mt-6 text-base leading-normal dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}

      <AddToCart
        productData={product}
        variants={product.variants}
        availableForSale={product.availableForSale}
      />
    </>
  );
}
