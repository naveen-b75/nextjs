'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { MagentoVercelProduct } from 'lib/magento/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function Gallery({
  product,
  images
}: {
  product: MagentoVercelProduct;
  images: { src: string; altText: string }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imageSearchParam = searchParams.get('image');
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0;

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  nextSearchParams.set('image', nextImageIndex.toString());
  const nextUrl = createUrl(pathname, nextSearchParams);

  const previousSearchParams = new URLSearchParams(searchParams.toString());
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;
  previousSearchParams.set('image', previousImageIndex.toString());
  const previousUrl = createUrl(pathname, previousSearchParams);
  const router = useRouter();

  const optionSearchParams = new URLSearchParams(searchParams.toString());
  const searchParamskeys = Array.from(searchParams.values());

  optionSearchParams.delete('image');
  searchParamskeys.splice(2, 1);
  const variants = product.variants;
  const optionsearchParamskeys = Array.from(optionSearchParams.values());
  const matchingProduct = variants?.find((variant) => {
    return optionsearchParamskeys.every((optionToFind) => {
      return variant.attributes?.some((selectedOption) => {
        if (selectedOption.value_index == optionToFind) {
          return variant;
        }
      });
    });
  });
  const imagesData = matchingProduct?.product?.media_gallery_entries?.map((image) => ({
    src: 'https://vercel.kensiumcommerce.com/media/catalog/product' + image.file,
    altText: product.title
  }));
  imagesData?.forEach(function (item) {
    images.unshift(item);
  });

  //images.push(imagesData);
  // const combined = [...images, ...imagesData];
  // Function to remove duplicates

  const uniqueImages = images.reduce((acc: any, current: { src: string }) => {
    const x = acc.find((item: { src: string }) => item.src === current.src);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  images = uniqueImages;

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  return (
    <>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <Link
                aria-label="Previous product image"
                href={previousUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowLeftIcon className="h-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <Link
                aria-label="Next product image"
                href={nextUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowRightIcon className="h-5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex;
            const imageSearchParams = new URLSearchParams(searchParams.toString());

            imageSearchParams.set('image', index.toString());

            return (
              <li key={image.src} className="h-20 w-20">
                <Link
                  aria-label="Enlarge product image"
                  href={createUrl(pathname, imageSearchParams)}
                  scroll={false}
                  className="h-full w-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}
