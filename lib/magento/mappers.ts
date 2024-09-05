import { BigCommerceProduct } from 'lib/bigcommerce/types';
import { BigCommerceSortKeys, VercelSortKeys, vercelToBigCommerceSortKeys } from 'lib/constants';
import {
  MagentoCart,
  MagentoCartLineItems,
  MagentoCartOP,
  MagentoProductsList,
  MagentoVercelProduct
} from './types';

type ProductsList = { productId: number; productData: BigCommerceProduct }[];

const vercelFromMagentoLineItems = (lineItems: MagentoCart['items']) => {
  /* const { physicalItems, digitalItems, customItems } = lineItems;
  const cartItemMapper = ({ entityId, quantity, productEntityId }: DigitalOrPhysicalItem | CartCustomItem) => ({
    merchandiseId: productEntityId ? productEntityId.toString() : entityId.toString(),
    quantity
  });
  return lineItems.flatMap((list) => list.map(cartItemMapper)); */
  return lineItems;
};

// const magentoToVercelOptions = (options: BigCommerceProductOption[]): VercelProductOption[] => {
//   return options.map((option) => {
//     return {
//       id: option.entityId.toString(),
//       name: option.displayName.toString(),
//       values: option.values ? option.values.edges.map(({ node: value }) => value.label) : []
//     };
//   });
// };
// const magentoToVercelVariants = (
//   variants: BigCommerceProductVariant[],
//   productId: number
// ): VercelProductVariant[] => {
//   return variants.map((variant) => {
//     return {
//       parentId: productId.toString(),
//       id: variant.entityId.toString(),
//       title: '',
//       availableForSale: variant.isPurchasable,
//       selectedOptions: variant.options?.edges.map(({ node: option }) => ({
//         name: option.displayName ?? '',
//         value: option.values.edges.map(({ node }) => node.label)[0] ?? ''
//       })) || [
//         {
//           name: '',
//           value: ''
//         }
//       ],
//       price: {
//         amount:
//           variant.price_range.minimum_price.regular_price.value.toString() ||
//           variant.price_range.minimum_price.regular_price.value.toString() ||
//           '0',
//         currencyCode:
//           variant.price_range.minimum_price.regular_price.currency ||
//           variant.prices.price.currencyCode ||
//           ''
//       }
//     };
//   });
// };

const magentoToVercelProduct = (product: MagentoProductsList): MagentoVercelProduct => {
  console.log(JSON.stringify(product?.categories))
  return {
    id: product.id.toString(),
    name: product.name,
    categories:product?.categories,
    type: product.__typename,
    configurable_options: '',
    plainTextDescription: product.plainTextDescription,
    short_description: product.short_description?.html,
    sku: product.sku.toString(),
    handle: product.url_key,
    title: product.name,
    url_key: product.url_key,
    description: product.plainTextDescription || '',
    descriptionHtml: product.description ? product.description?.html : '',
    short_descriptionHtml: product.short_description ? product.short_description?.html : '',
    availableForSale: product.stock_status,
    options: product.configurable_options ? product.configurable_options : [],
    variants: product.variants || [],
    featuredImage: {
      url: product.small_image.url ? product.small_image.url : '',
      altText: product.small_image.url ? product.small_image.url : product.name,
      width: 500,
      height: 500
    },
    images: product.media_gallery ? product.media_gallery : [],
    priceRange: {
      maxVariantPrice: {
        amount:
          product.price_range.minimum_price.regular_price.value.toString() ||
          product.price_range.minimum_price.regular_price.value.toString() ||
          '0',
        currencyCode:
          product.price_range.minimum_price.regular_price.currency ||
          product.prices.price.currencyCode ||
          ''
      },
      minVariantPrice: {
        amount:
          product.price_range.minimum_price.regular_price.value.toString() ||
          product.price_range.minimum_price.regular_price.value.toString() ||
          '0',
        currencyCode:
          product.price_range.minimum_price.regular_price.currency ||
          product.prices.price.currencyCode ||
          ''
      }
    },
    rating_summary: product.rating_summary,
    review_count: product.review_count,
    reviewsList: product.reviews,
  };
};

const magentoToVercelProducts = (products: MagentoProductsList[]) => {
  const reshapedProducts = [];
  for (const product of products) {
    if (product) {
      const reshapedProduct = magentoToVercelProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }
  return reshapedProducts;
};

const magentoToVercelAutocomplete = (product: MagentoProductsList): MagentoVercelProduct => {
  return {
    id: product.id.toString(),
    type: product.__typename,
    categories:product.categories,
    name: product.name,
    plainTextDescription: product.plainTextDescription,
    url_key: product.url_key,
    rating_summary: '',
    description: product.description?.html,
    descriptionHtml: product.description?.html,
    availableForSale: `${product.availableForSale}`,
    variants: [],
    options: [],
    images: [{ url: '' }],
    configurable_options: '',
    short_descriptionHtml: product.short_description?.html,
    review_count: product.review_count,
    short_description: product.short_description?.html,
    sku: product.sku.toString(),
    title: product.name,
    handle: product.url_key,
    featuredImage: {
      url: product.small_image.url ? product.small_image.url : '',
      height: 100,
      width: 100,
      altText: product.name
    },
    priceRange: {
      minVariantPrice: {
        amount:
          product.price_range.maximum_price.final_price.value.toString() ||
          product.price_range.maximum_price.final_price.value.toString() ||
          '0',
        currencyCode: product.price_range.maximum_price.final_price.currency || 'USD'
      },
      maxVariantPrice: {
        amount:
          product.price_range.maximum_price.final_price.value.toString() ||
          product.price_range.maximum_price.final_price.value.toString() ||
          '0',
        currencyCode: product.price_range.maximum_price.final_price.currency || 'USD'
      }
    }
  };
};

const magentoToVercelAutocompleteData = (products: {
  items: MagentoProductsList[];
  total_count: number;
  aggregations?: any;
}) => {
  const reshapedProducts = [];
  const reshapedData = [];

  for (const product of products.items) {
    if (product) {
      const reshapedProduct = magentoToVercelAutocomplete(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }
  const aggregationsData = products.aggregations;
  const result = aggregationsData
    .filter((item: { attribute_code: string }) => item.attribute_code === 'category_uid')
    .map((item: any) => ({
      options: item.options
    }));
  return {
    items: reshapedProducts ? reshapedProducts : '',
    aggregation: result?.[0] ? result?.[0]?.options : []
  };
  // reshapedData.items = reshapedProducts;
  // reshapedData.aggregation = result;
  // return reshapedData;
};

const magentoToVercelCartItems = (
  lineItems: MagentoCartOP,
  products: MagentoProductsList[]
): MagentoCartLineItems[] => {
  const getItemMapper = (products: MagentoProductsList[], isCustomItem: boolean = false) => {
    return (
      item: any
    ): {
      id: any;
      quantity: any;
      cost: { totalAmount: { amount: any; currencyCode: any } };
      merchandise: {
        selectedOptionslabels: Array<{
          name: string;
          value: string;
        }>;
        id: string;
        title: string;
        handle: string;
        selectedOptions: { name: string; value: string }[];
        product: any;
      };
    } => {
      const vercelProductFallback = {
        id: '',
        handle: '',
        availableForSale: false,
        title: '',
        description: '',
        url_key: '',
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
        updatedAt: ''
      };
      let product;
      let selectedOptions = [{ name: '', value: '' }];
      let selectedOptionslabels = [{ name: '', value: '' }];
      if (isCustomItem) {
        product = vercelProductFallback;
        selectedOptions = [{ name: '', value: '' }];
      } else {
        const productData = products.filter(
          ({ productId }) => productId === (item as any).productEntityId
        )[0]?.productData;

        product = productData ? magentoToVercelProduct(productData) : vercelProductFallback;
        // selectedOptions = (item as DigitalOrPhysicalItem).selectedOptions.map((option) => ({
        //   name: option.name,
        //   value: option.value || option.text || option.number?.toString() || option.fileName || ''
        // }));

        selectedOptions =
          item.configurable_options &&
          Array.from(item.configurable_options).map((attribute: any) => ({
            name: attribute.id.toString(),
            value: attribute.value_id.toString()
          }));

        selectedOptionslabels =
          item.configurable_options &&
          Array.from(item.configurable_options).map((attribute: any) => ({
            name: attribute.option_label.toString(),
            value: attribute.value_label.toString()
          }));

        if (selectedOptions === undefined) {
          selectedOptions = [{ name: '0'.toString(), value: '0'.toString() }];
          selectedOptionslabels = [{ name: '', value: '' }];
        }
      }
      product = item.product;
      product.handle = item.product.url_key;
      item.product.featuredImage = { altText: '', url: '' };
      item.product.featuredImage.altText = item.product.name;
      item.product.featuredImage.url = item.product.thumbnail.url;
      return {
        id: item.uid.toString(), // NOTE: used as lineId || lineItemId
        quantity: item.quantity,
        cost: {
          totalAmount: {
            amount: item.prices.price.value.toString() || '0',
            currencyCode: item.prices.price.currency || ''
          }
        },
        merchandise: {
          id: item.uid.toString(), // NOTE: used as lineId || lineItemId,
          title: `${item.product.name}`,
          handle: item.product.url_key,
          selectedOptions,
          product,
          selectedOptionslabels
        }
      };
    };
  };

  const physicalItems = lineItems.items;
  const line1 = physicalItems.map((item) => getItemMapper(products)(item));
  return [...line1];
};

const magentoToVercelCart = (
  cart: MagentoCartOP,
  products: MagentoProductsList[],
  checkoutUrl?: string
): MagentoCartOP => {
  return {
    id: cart.id!,
    email: '',
    items: [],
    cartUrl: '/cart',
    checkoutUrl: checkoutUrl ?? '',
    cost: {
      subtotalAmount: {
        amount: cart.prices?.subtotal_including_tax.value.toString() || '',
        currencyCode: cart.prices?.subtotal_including_tax.currency || ''
      },
      totalAmount: {
        amount: cart.prices?.grand_total.value.toString() || '',
        currencyCode: cart.prices?.grand_total.currency || ''
      },
      totalTaxAmount: {
        amount: '',
        currencyCode: ''
      },
      discountAmout: {
        amount: cart.prices?.discounts[0]?.amount.value
          ? cart.prices.discounts[0]?.amount.value * -1
          : 0,
        currencyCode: cart.prices?.discounts[0]?.amount.currency
          ? cart.prices.discounts[0]?.amount.currency
          : '',
        label: cart.prices?.discounts[0]?.label ? cart.prices.discounts[0]?.label : '',
        appliedCouponCode: cart.applied_coupons?.[0]?.code ? cart.applied_coupons[0].code : ''
      },
      selected_shipping_method: {
        currencyCode: 'USD',
        amount: cart.shipping_addresses?.[0]
          ? cart.shipping_addresses[0].selected_shipping_method?.amount.value
          : 0,
        carrier_code: cart.shipping_addresses?.[0]
          ? cart.shipping_addresses[0].selected_shipping_method?.carrier_code
          : '',
        carrier_title: cart.shipping_addresses?.[0]
          ? cart.shipping_addresses?.[0].selected_shipping_method?.carrier_title
          : '',
        method_code: cart.shipping_addresses?.[0]
          ? cart.shipping_addresses[0].selected_shipping_method?.method_code
          : '',
        method_title: cart.shipping_addresses?.[0]
          ? cart.shipping_addresses[0].selected_shipping_method?.method_title
          : ''
      }
    },
    lines: magentoToVercelCartItems(cart, products),
    totalQuantity: cart.total_quantity || 0
  };
};

const bigCommerceToVercelCollection = (collection: any): any => {
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
  bigCommerceToVercelCollection,
  magentoToVercelAutocompleteData,
  magentoToVercelCart,
  magentoToVercelProduct,
  magentoToVercelProducts,
  vercelFromMagentoLineItems
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

export const bigCommerceToVercelPageContent = (page: any): any => {
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
