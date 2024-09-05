import { default as BigcommerceProductBreadcrumbs } from 'bigCommerceComponents/category/prductBreadcrumbs';
import { Gallery as BigcommerceGallery } from 'bigCommerceComponents/product/gallery';
import { ProductDescription as BigcommerceDescription } from 'bigCommerceComponents/product/product-description';
import { getProduct as bigCommerceGetProduct } from 'lib/bigcommerce';
import { getBreadcumbsList, getProduct, getReviewsMetaData } from 'lib/magento';
import { default as MagentoBreadcrumbs } from 'magentoComponents/Breadcrumbs';
import { default as MagentoReviewForm } from 'magentoComponents/product/ReviewForm';
import { Gallery as MagentoGallery } from 'magentoComponents/product/gallery';
import { ProductDescription as MagentoProductDescription } from 'magentoComponents/product/product-description';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// export const runtime = 'edge';
const platformType = process.env.ECOMMERCE_PLATFORM;

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  //const product = await getProduct(params.handle);

  //if (!product) return notFound();
  return {
    title: ''
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  if (platformType?.toLocaleLowerCase() === 'magento') {
    const product = await getProduct(params.handle);
    const reviewsmetadata = await getReviewsMetaData();
    if (!product) return notFound();
    const getBreadcrumbCategoryId = (
      categories: {
        uid: string;
        id: number;
        breadcrumbs: { category_uid: string; category_id: number }[];
      }[]
    ) => {
      // Exit if there are no categories for this product.
      if (!categories || !categories.length) {
        return;
      }
      const breadcrumbSet = new Set();
      categories.forEach(({ breadcrumbs }) => {
        // breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) => breadcrumbSet.add(category_id));
      });

      // Until we can get the single canonical breadcrumb path to a product we
      // will just return the first category id of the potential leaf categories.
      const leafCategory = categories.find((category) => !breadcrumbSet.has(category.id));

      // If we couldn't find a leaf category then just use the first category
      // in the list for this product.
      return leafCategory?.id || categories[0]?.id;
    };
    const breadcrumb = await getBreadcumbsList(getBreadcrumbCategoryId(product?.categories)!);
    const currentCategory = (breadcrumb?.data && breadcrumb?.data.category.name) || '';
    const currentCategoryPath =
      (breadcrumb?.data && `${breadcrumb?.data.category.url_path}`) || '#';
    return (
      <>
      <MagentoBreadcrumbs
          currentCategory={currentCategory}
          currentCategoryPath={currentCategoryPath}
          breadcrumb={breadcrumb?.data}
          productName={product.name}
        />
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="flex flex-col p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
            <div className="h-full w-full basis-full lg:basis-3/6">
              <MagentoGallery
                product={product}
                images={product.images.map((image) => ({
                  src: image.url,
                  altText: product.title
                }))}
              />
            </div>
            <div className="basis-full lg:basis-3/6">
              <MagentoProductDescription product={product} />
            </div>
          </div>
          <MagentoReviewForm product={product} reviewsmetadata={reviewsmetadata} />
        </div>
      </>
    );
  } else if (platformType?.toLocaleLowerCase() === 'bigcommerce') {
    const product = await bigCommerceGetProduct(params.handle);
    if (!product) return notFound();
    return (
      <>
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="mx-auto max-w-[1440px] lg:pl-[40px] lg:pr-[40px] xl:gap-[78px] xl:pl-[73px]">
            <BigcommerceProductBreadcrumbs
              collection={product?.breadcrumbs!}
              productName={product?.title}
            />
          </div>
          <div className="flex flex-col bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
            <div className="h-full w-full basis-full lg:basis-3/6">
              <BigcommerceGallery
                images={product?.images?.map((image: any) => ({
                  src: image.url,
                  altText: image.altText,
                  width: 100,
                  height: 100
                }))}
              />
            </div>

            <div className="basis-full lg:basis-3/6">
              <BigcommerceDescription product={product} />
            </div>
          </div>
        </div>
      </>
    );
  }
  return notFound();
}

// async function ProductReviews({ product }: { product: string }) {
//     const [rating, setRating] = useState(0);
//     const handleStarClick = (nextValue, prevValue, name) => {
//         setRating(nextValue);
//     };
//     return (
//          <div className="py-8">
//              <span>You're reviewing:</span> <strong> {product.title}</strong>
//
//          </div>
//     );
// }
// async function RelatedProducts({ id }: { id: string }) {
//     const relatedProducts = await getProductRecommendations(id);
//
//     if (!relatedProducts.length) return null;
//
//     return (
//         <div className="py-8">
//             <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
//             <ul className="flex w-full gap-4 overflow-x-auto pt-1">
//                 {relatedProducts.map((product) => (
//                     <li
//                         key={product.handle}
//                         className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
//                     >
//                         <Link className="relative h-full w-full" href={`${product.handle}`}>
//                             <GridTileImage
//                                 alt={product.title}
//                                 label={{
//                                     title: product.title,
//                                     amount: product.priceRange.maxVariantPrice.amount,
//                                     currencyCode: product.priceRange.maxVariantPrice.currencyCode
//                                 }}
//                                 src={product.featuredImage?.url}
//                                 fill
//                                 sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
//                             />
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
