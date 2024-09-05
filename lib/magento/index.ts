import { MAGENTO_GRAPHQL_API_ENDPOINT, TAGS } from 'lib/constants';
import { isMagentoError } from 'lib/type-guards';
import { ensureStartsWith } from 'lib/utils';
import { NextRequest, NextResponse } from 'next/server';

import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  emptyCartQuery,
  removeFromCartMutation
} from './mutations/cart';
import {
  getAvailableShippingMethodsquery,
  getCartQuery,
  getShippingMethodsQuery,
  removeCouponFromCartMutation,
  setCouponToCartMutation,
  setShippingMethodMutation
} from './queries/cart';

import {
  GET_REGIONS_QUERY,
  PLACE_ORDER,
  SET_BILLING_ADDRESS,
  SET_GUEST_SHIPPING,
  SET_PAYMENT_METHOD_ON_CART
} from './queries/checkout';

import {
  getBreadcrumbs,
  getCollectionProductsQuery,
  getCollectionQuery,
  getProductFiltersByCategoryQuery,
  getProductFiltersBySearchQuery,
  getSortMethods,
  ResolverURLQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import {
  getAutoCompleteQuery,
  getHomePageQuery,
  getPageQuery,
  getPagesQuery
} from './queries/page';
import {
  CreateProductReview,
  getProductQuery,
  getProductRecommendationsQuery,
  getProductReviewRatingsMetadataquery,
  getProductsQuery
} from './queries/product';

import {
  magentoToVercelAutocompleteData,
  magentoToVercelCart,
  magentoToVercelProducts
} from './mappers';

import {
  Collection,
  Connection,
  Image,
  MagentoAddToCartOperation,
  MagentoBreadcrumbsOperation,
  MagentoCartApplyCoupen,
  MagentoCartGetRegionOperations,
  MagentoCartOP,
  MagentoCartOperation,
  MagentoCartQuery,
  MagentoCartSetGuestBillingOperations,
  MagentoCartSetGuestShippingOperations,
  MagentoCartSetPaymethodOperations,
  MagentoCollection,
  MagentoCollectionOperation,
  MagentoCollectionProductsOperation,
  MagentoCreateCartOperation,
  MagentoCreateEmptyCartOperation,
  MagentoGetCollectionOperation,
  MagentoMenuOperation,
  MagentoPageCmsBlockOperation,
  MagentoPageOperation,
  MagentoPagesOperation,
  MagentoPlaceOrdeOperations,
  MagentoProductRecommendationsOperation,
  MagentoProductRequest,
  MagentoProductReview,
  MagentoProductsFilter,
  MagentoProductsList,
  MagentoProductsOperation,
  MagentoRemoveFromCartOperation,
  MagentoResolverOperation,
  MagentoSortMethodOperation,
  MagentoUpdateCartOperation,
  MagentoVercelProduct,
  Menu,
  Page,
  Resolver
} from './types';
//import {bigCommerceToVercelCart} from "../magento/mappers";
//import {getStoreProductsQuery} from "../magento/queries/product";
//import {memoizedCartRedirectUrl} from "../magento/storefront-config";

const domain = process.env.MAGENTO_STORE_URL
  ? ensureStartsWith(process.env.MAGENTO_STORE_URL, 'https://')
  : '';
const endpoint = `${domain}${MAGENTO_GRAPHQL_API_ENDPOINT}`;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function magentoFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables,
  next
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}): Promise<{ status: number; body: T; errorMsg?: { message: any } } | never> {
  let cacheable: {
    cache?: RequestCache;
    next?: {
      revalidate?: number;
      tags?: string[];
    };
  } = {};

  if (next) {
    cacheable.next = next;
  } else {
    cacheable.cache = cache;
  }
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      ...cacheable
    });

    const body = await result.json();
    if (body.errors) {
      return {
        status: 500,
        body,
        errorMsg: { message: body.errors }
      };
    }

    return {
      errorMsg: {
        message: ''
      },
      status: result.status,
      body
    };
  } catch (e) {
    if (isMagentoError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: any): { cartItems: MagentoCartOP } => {
  return {
    ...cart,
    cartItems: cart
  };
};

const reshapeCollection = (collection: MagentoCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeCollections = (collections: MagentoCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

// const reshapeProduct = (product: MagentoProduct, filterHiddenProducts: boolean = true) => {
//   /*if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
//       return undefined;
//     }*/
//   const { small_image, configurable_options, ...rest } = product.items[0];

//   return {
//     ...rest,
//     images: small_image.url,
//     variants: configurable_options
//   };
// };

const reshapeProducts = (products: {
  items: MagentoProductsList[];
  sort_fields: { options: { label: string; value: string }[] };
  total_count: number;
  aggregations: MagentoProductsFilter[];
}) => {
  const reshapedProducts = [];

  /*for (const product of products) {
      if (product) {
        const reshapedProduct = reshapeProduct(product);

        if (reshapedProduct) {
          reshapedProducts.push(reshapedProduct);
        }
      }
    }*/
  const reshapedProduct = {
    items: magentoToVercelProducts(products.items),
    total_count: products.total_count ? products.total_count : 0,
    aggregations: products.aggregations,
    sort_fields: products.sort_fields
  };
  return reshapedProduct;
};

const reshapeProductsRecommendations = (products: {
  items: MagentoProductsList[];
  total_count: number;
}) => {
  const reshapedProducts = [];

  /*for (const product of products) {
      if (product) {
        const reshapedProduct = reshapeProduct(product);

        if (reshapedProduct) {
          reshapedProducts.push(reshapedProduct);
        }
      }
    }*/
  const reshapedProduct = {
    items: magentoToVercelProducts(products.items),
    total_count: products.total_count ? products.total_count : 0
  };
  return reshapedProduct;
};

export async function createEmptyCart(): Promise<string> {
  const res = await magentoFetch<MagentoCreateEmptyCartOperation>({
    query: emptyCartQuery
  });
  return res.body.data.createEmptyCart;
}

export async function createCart(): Promise<{ cartItems: MagentoCartOP }> {
  const res = await magentoFetch<MagentoCreateCartOperation>({
    query: createCartMutation
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  cartItems: { sku: string; quantity: number; selected_options: string[] }[]
): Promise<MagentoCartOP> {
  const res = await magentoFetch<MagentoAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      cartItems
    }
  });
  return res.body.data.addProductsToCart.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string
): Promise<{ cartItems: MagentoCartOP }> {
  const res = await magentoFetch<MagentoRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    }
  });
  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function removeFromCartProxy(cartId: string, lineIds: string) {
  try {
    const response = await fetch(`/api/checkout/getCart`, {
      method: 'DELETE',
      body: JSON.stringify({
        cartId: cartId,
        lineIds: lineIds
      })
    });
    const shippingData = await response.json();
    return shippingData;
  } catch (e) {
    return e;
  }
}

export async function updateCart(
  cartId: string,
  lines: { cart_item_uid: string; quantity: number }[]
): Promise<{ cartItems: MagentoCartOP }> {
  const res = await magentoFetch<MagentoUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    }
  });
  return reshapeCart(res.body.data.updateCartItems.cart);
}

export async function updateCartProxy(
  cartId: string,
  lines: { cart_item_uid: string; quantity: number }[]
) {
  try {
    const response = await fetch(`/api/checkout/getCart`, {
      method: 'PUT',
      body: JSON.stringify({
        cartId: cartId,
        lines: lines
      })
    });
    const shippingData = await response.json();
    return shippingData;
  } catch (e) {
    return e;
  }
}

export async function getCart(cartId: string): Promise<MagentoCartOP | undefined> {
  const res = await magentoFetch<MagentoCartQuery>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
    next: {
      tags: ['cart']
    }
  });
  if (res?.errorMsg?.message && res?.errorMsg?.message?.length > 2) {
    return undefined;
    //return res.body.data.createEmptyCart;
  }
  if (!res.body.data.cart) {
    return undefined;
  }
  const cart = res.body.data.cart;
  /* const { productsByIdList, checkout, checkoutUrl } = await getMagentoProductsWithCheckout(
        cartId,
        lines
    ); */
  const checkoutUrl = '/checkout';
  const productsByIdList: MagentoProductsList[] = [];
  return magentoToVercelCart(cart, productsByIdList, checkoutUrl);
}

export async function getCartProxy(cartId: string) {
  try {
    const response = await fetch(`/api/checkout/getCart`, {
      method: 'POST',
      body: JSON.stringify({
        cartId: cartId
      })
    });
    const shippingData = await response.json();
    return shippingData;
  } catch (e) {
    return e;
  }
}

export async function getAvailableShippingMethodsProxy(
  cartId: string,
  address: {
    city: string;
    firstname: string;
    lastname: string;
    street: string[];
    telephone: string;
    country_code: string;
    postcode: string;
    region: string;
  }
) {
  try {
    const response = await fetch(`/api/shipping`, {
      method: 'POST',
      body: JSON.stringify({
        cartId: cartId,
        address: address
      })
    });
    const shippingData = await response.json();
    return shippingData;
  } catch (e) {
    return e;
  }
}

export async function getAvailableShippingMethods(
  cartId: string,
  address: {
    city: string;
    firstname: string;
    lastname: string;
    street: string[];
    telephone: string;
    country_code: string;
    postcode: string;
    region: string;
  }[]
): Promise<{ status: number; body: MagentoCartQuery }> {
  const response = await magentoFetch<MagentoCartQuery>({
    query: getAvailableShippingMethodsquery,
    variables: { cartId, address },
    tags: [TAGS.cart],
    next: {
      tags: ['plp']
    }
  });

  return response;
}

export async function setShippingMethodsProxy(
  cartId: string,
  shippingMethod: { carrier_code: string; method_code: string }
) {
  try {
    const response = await fetch(`/api/saveship`, {
      method: 'POST',
      body: JSON.stringify({
        cartId: cartId,
        shippingMethod: shippingMethod
      })
    });
    const shippingData = await response.json();
    return shippingData;
  } catch (e) {
    return e;
  }
}

export async function setShippingMethods(
  cartId: string,
  shippingMethod: { carrier_code: string; method_code: string }[]
): Promise<{ status: number; body: MagentoCartQuery }> {
  const response = await magentoFetch<MagentoCartQuery>({
    query: setShippingMethodMutation,
    variables: { cartId, shippingMethod },
    tags: [TAGS.cart]
  });

  return response;
}

export async function getShippingMethods(cartId: string): Promise<MagentoCartOP | undefined> {
  const response = await magentoFetch<MagentoCartQuery>({
    query: getShippingMethodsQuery,
    variables: { cartId },
    next: {
      tags: ['plp']
    }
  });
  return response.body.data.cart;
}

export async function getCheckoutDetailsProxy(
  cartId: string
): Promise<{ status: number; body: MagentoCartOP } | undefined> {
  try {
    const response = await fetch(`/api/checkout/getCheckoutDetails`, {
      method: 'POST',
      body: JSON.stringify({
        cartId: cartId
      })
    });
    const couponCodeData = await response.json();
    return couponCodeData;
  } catch (e) {
    console.error(e);
  }
}

export async function setCouponToCartProxy(cartId: string, couponCode: string) {
  try {
    const response = await fetch(`/api/coupon`, {
      method: 'POST',
      body: JSON.stringify({
        cartId: cartId,
        couponCode: couponCode
      })
    });
    const couponCodeData = await response.json();
    return couponCodeData;
  } catch (e) {
    return e;
  }
}

export async function setCouponToCart(
  cartId: string,
  couponCode: string
): Promise<MagentoCartOP | undefined> {
  const response = await magentoFetch<MagentoCartApplyCoupen>({
    query: setCouponToCartMutation,
    variables: { cartId, couponCode },
    tags: [TAGS.cart]
  });
  return response.body.data.applyCouponToCart;
}

export async function removeCouponToCartProxy(cartId: string) {
  try {
    const response = await fetch(`/api/coupon/removecoupon`, {
      method: 'POST',
      body: JSON.stringify({
        cartId: cartId
      })
    });
    const removecouponCodeData = await response.json();
    return removecouponCodeData;
  } catch (e) {
    return e;
  }
}

export async function removeCouponToCart(cartId: string): Promise<MagentoCartOP | undefined> {
  const response = await magentoFetch<MagentoCartApplyCoupen>({
    query: removeCouponFromCartMutation,
    variables: { cartId },
    tags: [TAGS.cart]
  });
  return response.body.data.removeCouponFromCart;
}

export async function getRegionsProxy(countryCode: string) {
  try {
    const response = await fetch(`/api/checkout`, {
      method: 'POST',
      body: JSON.stringify({
        countryCode: countryCode
      })
    });
    const regionsData = await response.json();
    return regionsData.body.available_regions;
  } catch (e) {
    return e;
  }
}

export async function getRegions(countryCode: string): Promise<MagentoCartOP | undefined> {
  const response = await magentoFetch<MagentoCartGetRegionOperations>({
    query: GET_REGIONS_QUERY,
    variables: { countryCode },
    next: {
      tags: ['plp']
    }
  });
  return response.body.data.country;
}

export async function setGuestShipping(
  cartId: string,
  email: string,
  address: {
    city: string;
    firstname: string;
    lastname: string;
    street: string[];
    telephone: string;
    country_code: string;
    postcode: string;
    region: string;
  }[]
): Promise<{ cart: MagentoCartOP }> {
  const response = await magentoFetch<MagentoCartSetGuestShippingOperations>({
    query: SET_GUEST_SHIPPING,
    variables: { cartId, email, address },
    tags: [TAGS.cart]
  });
  return response.body.data;
}

export async function setGuestShippingProxy(
  cartId: string,
  email: string,
  address: {
    city: string;
    firstname: string;
    lastname: string;
    street: string[];
    telephone: string;
    country_code: string;
    postcode: string;
    region: string;
  }
) {
  try {
    const response = await fetch(`/api/checkout/shipping`, {
      method: 'POST',
      body: JSON.stringify({
        cartId: cartId,
        email: email,
        address: address
      })
    });
    const shippingData = await response.json();
    return shippingData;
  } catch (e) {
    return e;
  }
}

export async function setBillingAddress(
  cartId: string,
  city: string,
  firstname: string,
  lastname: string,
  street1: string,
  street2: string,
  telephone: string,
  country_code: string,
  postcode: string,
  region: string
): Promise<{ cart: MagentoCartOP } | undefined> {
  const response = await magentoFetch<MagentoCartSetGuestBillingOperations>({
    query: SET_BILLING_ADDRESS,
    variables: {
      cartId: cartId,
      firstName: firstname,
      lastName: lastname,
      city: city,
      street1: street1,
      street2: street2,
      phoneNumber: telephone,
      country: country_code,
      postcode: postcode,
      region: region
    },
    tags: [TAGS.cart]
  });
  return response.body.data;
}

export async function setBillingAddressProxy(
  cartId: string,
  address: {
    city: string;
    firstname: string;
    lastname: string;
    street1: string;
    street2: string;
    telephone: string;
    country_code: string;
    postcode: string;
    region: string;
  }
) {
  try {
    const response = await fetch(`/api/checkout/billingaddress`, {
      method: 'POST',
      body: JSON.stringify({
        cartId: cartId,
        firstname: address.firstname,
        lastname: address.lastname,
        city: address.city,
        street1: address.street1,
        street2: address.street2,
        telephone: address.telephone,
        country_code: address.country_code,
        postcode: address.postcode,
        region: address.region
      })
    });
    const billingData = await response.json();
    return billingData;
  } catch (e) {
    return e;
  }
}

export async function setPaymentMethod(
  cartId: string,
  paymentMethod: string
): Promise<{ cart: MagentoCartOP } | undefined> {
  const response = await magentoFetch<MagentoCartSetPaymethodOperations>({
    query: SET_PAYMENT_METHOD_ON_CART,
    variables: {
      cartId,
      paymentMethod: {
        code: paymentMethod
      }
    },
    tags: [TAGS.cart]
  });
  return response.body.data;
}

export async function setPaymentMethodProxy(cartId: string, paymentMethod: string) {
  try {
    const response = await fetch(`/api/checkout/payment`, {
      method: 'POST',
      body: JSON.stringify({
        cartId: cartId,
        paymentMethod: paymentMethod
      })
    });
    const paymentMethodData = await response.json();
    return paymentMethodData;
  } catch (e) {
    return e;
  }
}

export async function PlaceOrder(cartId: string): Promise<
  | {
      placeOrder: {
        order: { order_number: string };
      };
    }
  | undefined
> {
  const response = await magentoFetch<MagentoPlaceOrdeOperations>({
    query: PLACE_ORDER,
    variables: { cartId },
    tags: [TAGS.cart]
  });
  return response.body.data;
}

export async function PlaceOrderProxy(cartId: string) {
  try {
    const response = await fetch(`/api/checkout/placeorder`, {
      method: 'POST',
      body: JSON.stringify({
        cartId: cartId
      })
    });
    const placeorderData = await response.json();
    return placeorderData;
  } catch (e) {
    return e;
  }
}

export async function setReviewsData(
  sku: string,
  nickname: string,
  ratings: { id: string; value_id: string }[],
  summary: string,
  text: string
): Promise<MagentoProductReview> {
  const response = await magentoFetch<MagentoCartOperation>({
    query: CreateProductReview,
    variables: { sku, nickname, ratings, summary, text },
    tags: [TAGS.collections]
  });
  return response.body.data.createProductReview.review;
}

export async function setReviewsDataProxy(reviewsData: {
  sku: string;
  nickname: string;
  ratings: { id: string; value_id: string }[];
  summary: string;
  text: string;
}) {
  try {
    const response = await fetch(`/api/review/`, {
      method: 'POST',
      body: JSON.stringify({
        sku: reviewsData.sku,
        nickname: reviewsData.nickname,
        ratings: reviewsData.ratings,
        summary: reviewsData.summary,
        text: reviewsData.text
      })
    });
    const reviewData = await response.json();
    return reviewData;
  } catch (e) {
    return e;
  }
}

export async function getReviewsMetaData() {
  const res = await magentoFetch<MagentoMenuOperation>({
    query: getProductReviewRatingsMetadataquery,
    next: {
      tags: ['plp']
    }
  });
  return res.body.data.productReviewRatingsMetadata;
}

/*const getMagentoProductsWithCheckout = async (
    cartId: string,
    lines: { merchandiseId: string; quantity: number; productId?: string }[]
) => {
    const productIds = lines.map(({merchandiseId, productId}) =>
        parseInt(productId ? merchandiseId : 0, 10)
    );
    const bigCommerceProductListRes = await magentoFetch<MagentoProductsOperation>({
        query: getStoreProductsQuery,
        variables: {
            entityIds: productIds
        },
    });
    const bigCommerceProductList = bigCommerceProductListRes.body.data.site.products.edges.map(
        (product) => product.node
    );

    const createProductList = (idList: number[], products: MagentoProduct[]) => {
        return idList.map((productId) => {
            const productData = products.find(({entityId}) => entityId === productId)!;

            return {
                productId,
                productData
            };
        });
    };
    const bigCommerceProducts = createProductList(productIds, bigCommerceProductList);

    const resCheckout = await magentoFetch<MagentoCheckoutOperation>({
        query: getCheckoutQuery,
        variables: {
            entityId: cartId
        },
    });
    const checkout = resCheckout.body.data.site.checkout ? ? {
        subtotal: {
            value: 0,
            currencyCode: ''
        },
        grandTotal: {
            value: 0,
            currencyCode: ''
        },
        taxTotal: {
            value: 0,
            currencyCode: ''
        }
    };

    //const checkoutUrlRes = await memoizedCartRedirectUrl(cartId);
    const checkoutUrl = '/checkout';

    return {
        productsByIdList: bigCommerceProducts,
        checkoutUrl,
        checkout
    };
};*/

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await magentoFetch<MagentoGetCollectionOperation>({
    query: getCollectionQuery,
    next: {
      tags: ['plp']
    },
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getResolverData(handle: string): Promise<Resolver | undefined> {
  const response = await magentoFetch<MagentoResolverOperation>({
    query: ResolverURLQuery,
    variables: {
      url: handle
    },
    next: {
      tags: ['plp']
    }
  });
  return response.body.data;
}

export async function getSortMethodsByCategory({
  categoryIdFilter
}: {
  categoryIdFilter: string;
}): Promise<MagentoProductsList[]> {
  const res = await magentoFetch<MagentoSortMethodOperation>({
    query: getSortMethods,
    next: {
      tags: ['plp']
    },
    variables: {
      categoryIdFilter
    }
  });

  return res.body.data;
}

export async function getProductFiltersByCategory({
  categoryIdFilter
}: {
  categoryIdFilter: {
    eq: string | undefined;
  };
}): Promise<{
  products: {
    aggregations: { attribute_code: string; label: string; count: string; options: [] }[];
  };
}> {
  const res = await magentoFetch<MagentoCollectionOperation>({
    query: getProductFiltersByCategoryQuery,
    variables: {
      categoryIdFilter
    },
    next: {
      tags: ['plp']
    }
  });

  return res.body.data;
}

export async function getProductFiltersBySearch({ search }: { search: string }): Promise<{
  products: {
    aggregations: { attribute_code: string; label: string; count: string; options: [] }[];
  };
}> {
  const res = await magentoFetch<MagentoCollectionOperation>({
    query: getProductFiltersBySearchQuery,
    variables: {
      search
    },
    next: {
      tags: ['plp']
    }
  });
  return res.body.data;
}

export async function getCollectionProducts({
  collection,
  filters,
  pageSize,
  currentPage,
  sort
}: {
  collection: string;
  filters?: any;
  pageSize?: number;
  currentPage?: number;
  sort?: { name?: string; position?: string };
}): Promise<{
  items: MagentoVercelProduct[];
  sort_fields: { options: { label: string; value: string }[] };
  total_count: number;
  aggregations: MagentoProductsFilter[];
}> {
  const res = await magentoFetch<MagentoCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    next: {
      tags: ['plp']
    },
    variables: {
      id: collection,
      filters,
      pageSize,
      currentPage,
      sort: sort
    }
  });

  if (!res?.body?.data?.products?.items) {
    console.error(`No collection found for \`${collection}\``);
    return { items: [], total_count: 0, aggregations: [], sort_fields: { options: [] } };
  }
  return reshapeProducts(res.body.data.products);
}

export async function getCollectionProductsProxy({
  collection,
  filters,
  pageSize,
  currentPage,
  sort
}: {
  collection: string;
  filters?: any;
  pageSize?: number;
  currentPage?: number;
  sort?: { name?: string; position?: string };
}) {
  try {
    const response = await fetch(`/api/magento/category`, {
      method: 'POST',
      body: JSON.stringify({
        collection: collection,
        filters: filters,
        pageSize: pageSize,
        currentPage: currentPage,
        sort: sort
      })
    });
    const autocompleteData = await response.json();
    return autocompleteData;
  } catch (e) {
    console.error('error = ', e);
    return e;
  }
}

export async function getCollections(): Promise<Collection[]> {
  /*const res = await magentoFetch<MagentoCollectionsOperation>({
      query: getCollectionsQuery,
      tags: [TAGS.collections]
    });
    const MagentoCollections = removeEdgesAndNodes(res.body?.data?.collections);*/
  // Separate base collections
  const baseCollections: any = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    }
  ];

  // Get reshaped collections and filter out hidden ones
  const reshapedCollections = reshapeCollections(baseCollections).filter(
    (collection) => !collection.handle.startsWith('hidden')
  );

  // Combine the base collections with the reshaped collections
  const collections: any = [...baseCollections, ...reshapedCollections];

  return [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(collections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];
}

export async function getHomePageHtml(handle: string): Promise<MagentoPageCmsBlockOperation> {
  const response = await magentoFetch<MagentoPageCmsBlockOperation>({
    query: getHomePageQuery,
    next: {
      tags: ['plp']
    },
    variables: {
      identifier: handle
    }
  });
  return response.body;
}

export async function getDesktopMenu(handle: string): Promise<Menu[]> {
  const res = await magentoFetch<MagentoMenuOperation>({
    query: getMenuQuery,
    next: {
      tags: ['plp']
    },
    variables: {
      handle
    }
  });
  return res.body.data.categoryList;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await magentoFetch<MagentoMenuOperation>({
    query: getMenuQuery,
    next: {
      tags: ['plp']
    },
    variables: {
      handle
    }
  });
  return (
    res.body?.data?.categoryList.map((item: { name: string; url_path: string }) => ({
      title: item.name,
      path: item.url_path ? undefined : ''
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await magentoFetch<MagentoPageOperation>({
    query: getPageQuery,
    variables: { handle },
    next: {
      tags: ['plp']
    }
  });

  return res.body?.data?.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await magentoFetch<MagentoPagesOperation>({
    query: getPagesQuery,
    next: {
      tags: ['plp']
    }
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<MagentoVercelProduct | undefined> {
  const filter = {
    filter: {
      url_key: handle
    }
  };
  const res = await magentoFetch<MagentoProductRequest>({
    query: getProductQuery,
    next: {
      tags: ['plp']
    },
    variables: {
      urlKey: handle
    }
  });
  //return res.body.data.products; //reshapeProduct(res.body.data.products, false);
  //return reshapeProduct(res.body.data.products, false);
  const productData = magentoToVercelProducts(res.body.data.products.items);
  return productData[0];
}

export async function getProductRecommendations(
  productId: string
): Promise<{ items: MagentoVercelProduct[]; total_count: number }> {
  const res = await magentoFetch<MagentoProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    next: {
      tags: ['plp']
    },
    variables: {
      productId
    }
  });

  return reshapeProductsRecommendations(res.body.data.productRecommendations);
}

export async function getProducts({
  search,
  filter,
  pageSize,
  currentPage,
  sort
}: {
  search: string;
  filter: [];
  pageSize: number;
  currentPage: number;
  sort: { relevance?: string };
}): Promise<{
  items: MagentoVercelProduct[];
  total_count: number;
  aggregations: MagentoProductsFilter[];
  sort_fields: { options: { label: string; value: string }[] };
}> {
  const res = await magentoFetch<MagentoProductsOperation>({
    query: getProductsQuery,
    next: {
      tags: ['plp']
    },
    variables: {
      search,
      filter,
      pageSize,
      currentPage,
      sort
    }
  });
  // return reshapeProducts(res.body.data.products.items);
  const productData = res.body?.data?.products;
  const reshapedProduct = {
    items: magentoToVercelProducts(productData?.items),
    total_count: productData.total_count ? productData.total_count : 0,
    aggregations: productData.aggregations,
    sort_fields: productData.sort_fields
  };
  return reshapedProduct;
  //return magentoToVercelProducts(res.body.data.products.items);
}

export async function getAutocompleteProductsProxy(inputText: string) {
  try {
    const response = await fetch(`/api/search`, {
      method: 'POST',
      body: JSON.stringify({
        inputText: inputText
      })
    });
    const autocompleteData = await response.json();
    return autocompleteData;
  } catch (e) {
    console.error('error = ', e);
    return e;
  }
}

//export async function getHomePageHtml(handle: string): Promise<HomePage[]> {

export async function getAutocompleteProducts(inputText: String): Promise<any> {
  const res = await magentoFetch<MagentoProductsOperation>({
    query: getAutoCompleteQuery,
    next: {
      tags: ['plp']
    },
    variables: {
      inputText: inputText
    }
  });

  return magentoToVercelAutocompleteData(res.body.data.products);
  // return reshapeProducts(res.body.data.products.items);
  //return magentoToVercelProducts(res.body.data.products.items);
}

export async function getBreadcumbsList(categoryId: number) {
  const res = await magentoFetch<MagentoBreadcrumbsOperation>({
    query: getBreadcrumbs,
    next: {
      tags: ['plp']
    },
    variables: {
      category_id: categoryId
    }
  });
  return res?.body;
}
// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Magento,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  //const topic = headers().get('x-Magento-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  //const isCollectionUpdate = collectionWebhooks.includes(topic);
  //const isProductUpdate = productWebhooks.includes(topic);

  /*if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
      console.error('Invalid revalidation secret.');
      return NextResponse.json({ status: 200 });
    }*/

  //   if (!isCollectionUpdate && !isProductUpdate) {
  //     // We don't need to revalidate anything for any other topics.
  //     return NextResponse.json({ status: 200 });
  //   }

  //   if (isCollectionUpdate) {
  //     revalidateTag(TAGS.collections);
  //   }

  //   if (isProductUpdate) {
  //     revalidateTag(TAGS.products);
  //   }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
