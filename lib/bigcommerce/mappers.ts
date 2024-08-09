import { BigCommerceSortKeys, VercelSortKeys, vercelToBigCommerceSortKeys } from 'lib/constants';
import {
  BigCommerceCart,
  BigCommerceCheckout,
  BigCommerceCollection,
  BigCommercePage,
  BigCommerceProduct,
  BigCommerceProductOption,
  BigCommerceProductVariant,
  CartCustomItem,
  DigitalOrPhysicalItem,
  VercelCart,
  VercelCartItem,
  VercelCollection,
  VercelPage,
  VercelProduct,
  VercelProductOption,
  VercelProductVariant
} from './types';

type ProductsList = { productId: number; productData: BigCommerceProduct }[];

const vercelFromBigCommerceLineItems = (lineItems: BigCommerceCart['lineItems']) => {
  const { physicalItems, digitalItems, customItems } = lineItems;
  const cartItemMapper = ({
    entityId,
    quantity,
    productEntityId
  }: DigitalOrPhysicalItem | CartCustomItem) => ({
    merchandiseId: productEntityId ? productEntityId.toString() : entityId.toString(),
    quantity
  });

  return [physicalItems, digitalItems, customItems].flatMap((list) => list.map(cartItemMapper));
};

const bigCommerceToVercelOptions = (options: BigCommerceProductOption[]): VercelProductOption[] => {
  return options.map((option) => {
    return {
      id: option.entityId.toString(),
      name: option.displayName.toString(),
      values: option.values ? option.values.edges.map(({ node: value }) => value.label) : []
    };
  });
};
export const bigCommerceToVercelVariants = (
  variants: { product: BigCommerceProductVariant; cursor: any }[],
  productId: number,
  cursor?: string[]
): VercelProductVariant[] => {
  const createVercelProductImage = (img: { url: string; altText: string }) => {
    return {
      url: img?.url,
      altText: img?.altText,
      width: 2048,
      height: 2048
    };
  };
  return variants?.map((variant) => {
    return {
      parentId: productId.toString(),
      id: variant.product.entityId.toString(),
      sku: variant.product.sku,
      cursor: variant.cursor,
      title: '',
      availableForSale: variant.product.isPurchasable,
      selectedOptions: variant.product.options?.edges.map(({ node: option }) => ({
        name: option.displayName ?? '',
        value: option.values.edges.map(({ node }) => node.label)[0] ?? ''
      })) || [
        {
          name: '',
          value: ''
        }
      ],
      defaultImage: createVercelProductImage(variant.product.defaultImage),
      basePrice: {
        amount:
          variant.product.prices?.basePrice?.value?.toString() ||
          variant.product.prices?.priceRange.max.value.toString() ||
          '0',
        currencyCode:
          variant.product.prices?.price.currencyCode ||
          variant.product.prices?.priceRange.max.currencyCode ||
          ''
      },
      price: {
        amount:
          variant.product.prices?.price.value.toString() ||
          variant.product.prices?.priceRange.max.value.toString() ||
          '0',
        currencyCode:
          variant.product.prices?.price.currencyCode ||
          variant.product.prices?.priceRange.max.currencyCode ||
          ''
      }
    };
  });
};

const bigCommerceToVercelProduct = (product: {
  node: BigCommerceProduct;
  cursor: string;
}): VercelProduct => {
  const createVercelProductImage = (img: { url: string; altText: string }) => {
    return {
      url: img?.url,
      altText: img?.altText,
      width: 2048,
      height: 2048
    };
  };
  const options = product?.node?.productOptions?.edges.length
    ? bigCommerceToVercelOptions(product.node.productOptions.edges.map((item) => item.node))
    : [];
  const colorsOptions = product?.node?.productOptions?.edges?.find(
    (value) => value?.node?.displayName === 'Colors'
  );
  const defaultColor = colorsOptions?.node?.values?.edges?.find(
    (value) => value.node?.isDefault === true
  );
  const variants = product?.node?.variants?.edges.length
    ? bigCommerceToVercelVariants(
        product?.node?.variants.edges.map((item) => ({ product: item.node, cursor: item.cursor })),
        product?.node?.entityId,
        product?.node?.variants.edges.map((item) => item.cursor)
      )
    : [];
  return {
    id: product?.node?.id.toString(),
    sku: product?.node?.sku,
    entityId: product?.node?.entityId.toString(),
    brand: typeof product?.node?.brand !== 'string' ? product?.node?.brand?.name! : '',
    basePrice: {
      amount: product?.node?.prices?.basePrice?.value.toString(),
      currencyCode: product?.node?.prices?.basePrice?.currencyCode
    },
    handle: product?.node?.path,
    defaultColor: defaultColor || null,
    availableForSale: product?.node?.availabilityV2.status === 'Available' ? true : false,
    customFields: product?.node?.customFields!,
    title: product?.node?.name,
    description: product?.node?.plainTextDescription || '',
    descriptionHtml: product?.node?.description ?? '',
    options,
    priceRange: {
      maxVariantPrice: {
        amount:
          product?.node?.prices.priceRange.max.value.toString() ||
          product?.node?.prices.price.value.toString() ||
          '0',
        currencyCode:
          product?.node?.prices.priceRange.max.currencyCode ||
          product?.node?.prices.price.currencyCode ||
          ''
      },
      minVariantPrice: {
        amount:
          product?.node?.prices.priceRange.min.value.toString() ||
          product?.node?.prices.price.value.toString() ||
          '0',
        currencyCode:
          product?.node?.prices.priceRange.min.currencyCode ||
          product?.node?.prices.price.currencyCode ||
          ''
      }
    },
    variants,
    images: product?.node?.images
      ? product?.node?.images.edges.map(({ node: img }) => createVercelProductImage(img))
      : [],
    featuredImage: createVercelProductImage(product?.node?.defaultImage),
    seo: {
      title: product?.node?.seo?.pageTitle || product?.node?.name,
      description: product?.node?.seo?.metaDescription || ''
    },
    tags: [],
    updatedAt: product?.node?.createdAt?.utc?.toString(),
    cursor: product?.cursor
  };
};

const bigCommerceToVercelProducts = (
  products: Array<{ node: BigCommerceProduct; cursor: string }>
) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product.node) {
      const reshapedProduct = bigCommerceToVercelProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }
  return reshapedProducts;
};

const bigCommerceToVercelCartProduct = (product: BigCommerceProduct): VercelProduct => {
  const createVercelProductImage = (img: { url: string; altText: string }) => {
    return {
      url: img?.url,
      altText: img?.altText,
      width: 200,
      height: 200
    };
  };
  const options = product?.productOptions?.edges?.length
    ? bigCommerceToVercelOptions(product.productOptions.edges.map((item) => item.node))
    : [];
  const variants = product?.variants?.edges?.length
    ? bigCommerceToVercelVariants(
        product?.variants.edges.map((item) => ({ product: item.node, cursor: item.cursor })),
        product?.entityId,
        product?.variants.edges.map((item) => item.cursor)
      )
    : [];

  const breadcrumbs =
    product?.categories?.edges &&
    product?.categories?.edges[0] &&
    product?.categories?.edges[0]?.node?.breadcrumbs.edges.map((edge) => {
      const node = edge?.node;
      const pathSegments = node?.path?.split('/'); // Split the path into an array
      const lastPath = pathSegments[pathSegments?.length - 2]; // Get the second-to-last element
      const parentPath = pathSegments[pathSegments?.length - 3];
      return {
        name: node?.name,
        path: parentPath ? `/search/${parentPath}/${lastPath}` : `/search/${lastPath}`
      };
    });
  //moving default image to the top
  const edges = product.images?.edges || [];
  const defaultIndex = edges.findIndex((edge) => edge.node.isDefault);
  if (defaultIndex > -1) {
    const [defaultImage] = edges.splice(defaultIndex, 1);
    edges.unshift(defaultImage!);
  }
  return {
    id: product.id.toString(),
    sku: product.sku,
    entityId: product.entityId.toString(),
    handle: product.path,
    brand: typeof product.brand !== 'string' ? product.brand?.name! : '',
    availableForSale: product.availabilityV2.status === 'Available' ? true : false,
    customFields: product.customFields!,
    title: product.name,
    description: product.plainTextDescription || '',
    descriptionHtml: product.description ?? '',
    options,
    basePrice: {
      amount: product.prices?.basePrice?.value.toString(),
      currencyCode: product.prices?.basePrice?.currencyCode
    },
    breadcrumbs: breadcrumbs,
    priceRange: {
      maxVariantPrice: {
        amount:
          product.prices.priceRange.max.value.toString() ||
          product.prices.price.value.toString() ||
          '0',
        currencyCode:
          product.prices.priceRange.max.currencyCode || product.prices.price.currencyCode || ''
      },
      minVariantPrice: {
        amount:
          product.prices.priceRange.min.value.toString() ||
          product.prices.price.value.toString() ||
          '0',
        currencyCode:
          product.prices.priceRange.min.currencyCode || product.prices.price.currencyCode || ''
      }
    },
    variants,
    images: product.images
      ? product.images.edges.map(({ node: img }) => createVercelProductImage(img))
      : [],
    featuredImage: createVercelProductImage(product.defaultImage),
    seo: {
      title: product?.seo?.pageTitle || product.name,
      description: product?.seo?.metaDescription || ''
    },
    tags: [],
    updatedAt: product.createdAt.utc.toString()
  };
};

export const bigCommerceToVercelProductsItems = (products: BigCommerceProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = bigCommerceToVercelCartProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

const bigCommerceToVercelCartItems = (
  lineItems: BigCommerceCart['lineItems'],
  products: ProductsList
) => {
  const getItemMapper = (products: ProductsList, isCustomItem: boolean = false) => {
    return (item: CartCustomItem | DigitalOrPhysicalItem): VercelCartItem => {
      const vercelProductFallback = {
        id: '',
        entityId: '',
        handle: '',
        sku: '',
        basePrice: { amount: '', currencyCode: '' },
        availableForSale: false,
        title: '',
        description: '',
        descriptionHtml: '',
        options: [],
        priceRange: {
          maxVariantPrice: { amount: '', currencyCode: '' },
          minVariantPrice: { amount: '', currencyCode: '' }
        },
        variants: [],
        featuredImage: {
          url: '',
          altText: '',
          width: 0,
          height: 0
        },
        images: [
          {
            url: '',
            altText: '',
            width: 0,
            height: 0
          }
        ],
        seo: { title: '', description: '' },
        tags: [],
        updatedAt: '',
        customFields: {
          edges: []
        }
      };
      let product;
      let selectedOptions;

      if (isCustomItem) {
        product = vercelProductFallback;
        selectedOptions = [{ name: '', value: '' }];
      } else {
        const productData = products.filter(
          ({ productId }) => productId === (item as DigitalOrPhysicalItem).productEntityId
        )[0]?.productData;

        product = productData
          ? bigCommerceToVercelProduct({ node: productData, cursor: '' })
          : vercelProductFallback;
        selectedOptions = (item as DigitalOrPhysicalItem).selectedOptions.map((option) => ({
          name: option.name,
          value: option.value || option.text || option.number?.toString() || option.fileName || ''
        }));
      }

      return {
        id: item.entityId.toString(), // NOTE: used as lineId || lineItemId
        quantity: item.quantity,
        cost: {
          totalAmount: {
            amount:
              item.extendedListPrice.value.toString() || item.listPrice.value.toString() || '0',
            currencyCode: item.extendedListPrice.currencyCode || item.listPrice.currencyCode || ''
          }
        },
        merchandise: {
          id: isCustomItem
            ? item.entityId.toString()
            : (item as DigitalOrPhysicalItem).variantEntityId!.toString(),
          title: `${item.name}`,
          selectedOptions,
          product
        }
      };
    };
  };

  const { physicalItems, digitalItems, customItems } = lineItems;
  const areCustomItemsInCart = customItems.length > 0;
  const line1 = physicalItems.map((item) => getItemMapper(products)(item));
  const line2 = digitalItems.map((item) => getItemMapper(products)(item));
  const line3 = areCustomItemsInCart
    ? customItems.map((item) => getItemMapper(products, areCustomItemsInCart)(item))
    : [];

  return [...line1, ...line2, ...line3];
};

const bigCommerceToVercelCart = (
  cart: BigCommerceCart,
  products: ProductsList,
  checkout: BigCommerceCheckout,
  checkoutUrl?: string
): VercelCart => {
  return {
    id: cart.entityId,
    checkoutUrl: checkoutUrl ?? '',
    cost: {
      subtotalAmount: {
        amount: checkout.subtotal.value.toString(),
        currencyCode: checkout.subtotal.currencyCode
      },
      totalAmount: {
        amount: checkout.grandTotal.value.toString(),
        currencyCode: checkout.grandTotal.currencyCode
      },
      totalTaxAmount: {
        amount: checkout.taxTotal.value.toString(),
        currencyCode: checkout.taxTotal.currencyCode
      }
    },
    lines: bigCommerceToVercelCartItems(cart.lineItems, products),
    totalQuantity: cart.lineItems.totalQuantity
  };
};

const bigCommerceToVercelCollection = (collection: BigCommerceCollection): VercelCollection => {
  if (!collection) {
    return {
      handle: '',
      title: '',
      description: '',
      seo: {
        title: '',
        description: ''
      },
      updatedAt: '',
      path: ''
    };
  }

  return {
    handle: collection.entityId.toString() || collection.name,
    title: collection.name,
    description: collection.description,
    seo: {
      title: collection.seo.pageTitle,
      description: collection.seo.metaDescription
    },
    updatedAt: new Date().toISOString(),
    path: `/search${collection.path}`
  };
};

export {
  bigCommerceToVercelCart,
  bigCommerceToVercelCollection,
  bigCommerceToVercelProduct,
  bigCommerceToVercelProducts,
  vercelFromBigCommerceLineItems
};

export const vercelToBigCommerceSorting = (
  isReversed: boolean,
  sortKey?: string
): keyof typeof BigCommerceSortKeys | null => {
  const VercelSorting: Record<string, string> = {
    RELEVANCE: 'RELEVANCE',
    BEST_SELLING: 'BEST_SELLING',
    CREATED_AT: 'CREATED_AT',
    PRICE: 'PRICE'
  };

  if (!sortKey || VercelSorting[sortKey] === undefined) {
    return null;
  }

  if (sortKey === VercelSortKeys.PRICE) {
    return isReversed
      ? vercelToBigCommerceSortKeys.PRICE_ON_REVERSE
      : vercelToBigCommerceSortKeys.PRICE;
  }

  return vercelToBigCommerceSortKeys[sortKey as keyof typeof VercelSortKeys];
};

export const bigCommerceToVercelPageContent = (page: BigCommercePage): VercelPage => {
  return {
    id: page.entityId.toString(),
    title: page.name,
    handle: page.path.slice(1),
    body: page.htmlBody ?? '',
    bodySummary: page.plainTextSummary ?? '',
    seo: {
      title: page.seo.pageTitle,
      description: page.seo.metaDescription
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
