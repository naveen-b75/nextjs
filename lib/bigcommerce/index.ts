import { isVercelCommerceError } from 'lib/type-guards';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { BIGCOMMERCE_GRAPHQL_API_ENDPOINT } from './constants';

import {
  bigCommerceToVercelCart,
  bigCommerceToVercelCollection,
  bigCommerceToVercelPageContent,
  bigCommerceToVercelProduct,
  bigCommerceToVercelProducts,
  bigCommerceToVercelProductsItems,
  vercelFromBigCommerceLineItems,
  vercelToBigCommerceSorting
} from './mappers';
import {
  addCartLineItemMutation,
  createCartMutation,
  deleteCartLineItemMutation,
  updateCartLineItemMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import { getCategoryQuery, getStoreCategoriesQuery } from './queries/category';
import { getCheckoutQuery } from './queries/checkout';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getFeaturedProductsQuery,
  getFilters,
  getNewestProductsQuery,
  getProductQuery,
  getProductsCollectionQuery,
  getProductsRecommedationsQuery,
  getStoreProductsQuery,
  searchProductsQuery
} from './queries/product';
import { getEntityIdByRouteQuery } from './queries/route';
import { memoizedCartRedirectUrl } from './storefront-config';
import {
  BigCommerceAddToCartOperation,
  BigCommerceCart,
  BigCommerceCartOperation,
  BigCommerceCategoryTreeItem,
  BigCommerceCheckoutOperation,
  BigCommerceCollectionOperation,
  BigCommerceCollectionsOperation,
  BigCommerceCreateCartOperation,
  BigCommerceDeleteCartItemOperation,
  BigCommerceEntityIdOperation,
  BigCommerceFeaturedProductsOperation,
  BigCommerceMenuOperation,
  BigCommerceNewestProductsOperation,
  BigCommercePage,
  BigCommercePageOperation,
  BigCommercePagesOperation,
  BigCommerceProduct,
  BigCommerceProductOperation,
  BigCommerceProductsCollectionOperation,
  BigCommerceProductsFilter,
  BigCommerceProductsOperation,
  BigCommerceRecommendationsOperation,
  BigCommerceSearchProductsOperation,
  BigCommerceUpdateCartItemOperation,
  BrandAttributes,
  Filter,
  ProductListResult,
  VercelCart,
  VercelCollection,
  VercelMenu,
  VercelPage,
  VercelProduct
} from './types';

const channelIdSegment =
  parseInt(process.env.BIGCOMMERCE_CHANNEL_ID!) !== 1
    ? `-${process.env.BIGCOMMERCE_CHANNEL_ID}`
    : '';
const domain = `https://store-${process.env.BIGCOMMERCE_STORE_HASH!}${channelIdSegment}`;
const endpoint = `${domain}.${BIGCOMMERCE_GRAPHQL_API_ENDPOINT}`;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

const getEntityIdByHandle = async (entityHandle: string) => {
  const res = await bigCommerceFetch<BigCommerceEntityIdOperation>({
    query: getEntityIdByRouteQuery,
    variables: {
      path: `/${entityHandle}`
    }
  });

  return res.body.data.site.route.node?.entityId;
};

export async function bigCommerceFetch<T>({
  query,
  variables,
  headers,
  cache = 'force-cache',
  next
}: {
  query: string;
  variables?: ExtractVariables<T>;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}): Promise<{ status: number; body: T } | never> {
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
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN}`,
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      ...cacheable
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isVercelCommerceError(e)) {
      throw {
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

const getCategoryEntityIdbyHandle = async (handle: string) => {
  const resp = await bigCommerceFetch<BigCommerceMenuOperation>({
    query: getMenuQuery,
    next: {
      tags: ['plp']
    }
  });
  const recursiveFindCollectionId = (list: BigCommerceCategoryTreeItem[], slug: string): number => {
    const collectionId = list
      .flatMap((item): number | null => {
        if (item.path.includes(slug!)) {
          return item.entityId;
        }

        if (item.children && item.children.length) {
          return recursiveFindCollectionId(item.children!, slug);
        }

        return null;
      })
      .filter((id) => typeof id === 'number')[0];

    return collectionId!;
  };

  return recursiveFindCollectionId(resp.body.data.site.categoryTree, handle);
};

const getBigCommerceProductsWithCheckout = async (
  cartId: string,
  lines: { merchandiseId: string; quantity: number; productId?: string }[]
) => {
  const productIds = lines.map(({ merchandiseId, productId }) =>
    parseInt(productId ?? merchandiseId, 10)
  );
  const bigCommerceProductListRes = await bigCommerceFetch<BigCommerceProductsOperation>({
    query: getStoreProductsQuery,
    variables: {
      entityIds: productIds
    },
    next: {
      tags: ['plp']
    }
  });
  const bigCommerceProductList = bigCommerceProductListRes.body.data.site.products.edges.map(
    (product) => product.node
  );

  const createProductList = (idList: number[], products: BigCommerceProduct[]) => {
    return idList.map((productId) => {
      const productData = products.find(({ entityId }) => entityId === productId)!;

      return {
        productId,
        productData
      };
    });
  };
  const bigCommerceProducts = createProductList(productIds, bigCommerceProductList);

  const resCheckout = await bigCommerceFetch<BigCommerceCheckoutOperation>({
    query: getCheckoutQuery,
    variables: {
      entityId: cartId
    },
    next: {
      tags: ['plp']
    }
  });
  const checkout = resCheckout.body.data.site.checkout ?? {
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

  const checkoutUrlRes = await memoizedCartRedirectUrl(cartId);
  const checkoutUrl = checkoutUrlRes.data?.embedded_checkout_url;

  return {
    productsByIdList: bigCommerceProducts,
    checkoutUrl,
    checkout
  };
};

export async function createCart(): Promise<VercelCart> {
  // NOTE: on BigCommerce side we can't create cart
  // w/t item params as quantity, productEntityId
  return {
    id: '',
    checkoutUrl: '',
    cost: {
      subtotalAmount: {
        amount: '',
        currencyCode: ''
      },
      totalAmount: {
        amount: '',
        currencyCode: ''
      },
      totalTaxAmount: {
        amount: '',
        currencyCode: ''
      }
    },
    lines: [],
    totalQuantity: 0
  };
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number; productId?: string }[]
): Promise<VercelCart> {
  let bigCommerceCart: BigCommerceCart;

  if (cartId) {
    const res = await bigCommerceFetch<BigCommerceAddToCartOperation>({
      query: addCartLineItemMutation,
      variables: {
        addCartLineItemsInput: {
          cartEntityId: cartId,
          data: {
            lineItems: lines.map(({ merchandiseId, quantity, productId }) => ({
              productEntityId: parseInt(productId!, 10),
              variantEntityId: parseInt(merchandiseId, 10),
              quantity
            }))
          }
        }
      },
      cache: 'no-store'
    });

    bigCommerceCart = res.body.data.cart.addCartLineItems.cart;
  } else {
    const res = await bigCommerceFetch<BigCommerceCreateCartOperation>({
      query: createCartMutation,
      variables: {
        createCartInput: {
          lineItems: lines.map(({ merchandiseId, quantity, productId }) => ({
            productEntityId: parseInt(productId!, 10),
            variantEntityId: parseInt(merchandiseId, 10),
            quantity
          }))
        }
      },
      cache: 'no-store'
    });

    bigCommerceCart = res.body.data.cart.createCart.cart;
  }

  const { productsByIdList, checkout, checkoutUrl } = await getBigCommerceProductsWithCheckout(
    bigCommerceCart.entityId,
    lines
  );

  return bigCommerceToVercelCart(bigCommerceCart, productsByIdList, checkout, checkoutUrl);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<VercelCart | undefined> {
  let cartState: { status: number; body: BigCommerceDeleteCartItemOperation };
  const removeCartItem = async (itemId: string) => {
    const res = await bigCommerceFetch<BigCommerceDeleteCartItemOperation>({
      query: deleteCartLineItemMutation,
      variables: {
        deleteCartLineItemInput: {
          cartEntityId: cartId,
          lineItemEntityId: itemId
        }
      },
      cache: 'no-store'
    });

    return res;
  };

  if (lineIds.length === 1) {
    cartState = await removeCartItem(lineIds[0]!);
  } else if (lineIds.length > 1) {
    // NOTE: can it happen at all??
    let operations = lineIds.length;

    while (operations > 0) {
      operations--;
      cartState = await removeCartItem(lineIds[operations]!);
    }
  }

  const cart = cartState!.body.data.cart.deleteCartLineItem.cart;

  if (cart === null) {
    return undefined;
  }

  const lines = vercelFromBigCommerceLineItems(cart.lineItems);
  const { productsByIdList, checkout, checkoutUrl } = await getBigCommerceProductsWithCheckout(
    cartId,
    lines
  );

  return bigCommerceToVercelCart(cart, productsByIdList, checkout, checkoutUrl);
}

// NOTE: update happens on product & variant levels w/t optionEntityId
export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number; productSlug?: string }[]
): Promise<VercelCart> {
  let cartState: { status: number; body: BigCommerceUpdateCartItemOperation } | undefined;

  for (let updates = lines.length; updates > 0; updates--) {
    const { id, merchandiseId, quantity, productSlug } = lines[updates - 1]!;
    const productEntityId = (await getProductIdBySlug(productSlug!))?.entityId!;

    const res = await bigCommerceFetch<BigCommerceUpdateCartItemOperation>({
      query: updateCartLineItemMutation,
      variables: {
        updateCartLineItemInput: {
          cartEntityId: cartId,
          lineItemEntityId: id,
          data: {
            lineItem: {
              variantEntityId: parseInt(merchandiseId, 10),
              productEntityId,
              quantity
            }
          }
        }
      },
      cache: 'no-store'
    });

    cartState = res;
  }

  const updatedCart = cartState!.body.data.cart.updateCartLineItem.cart;
  const { productsByIdList, checkout, checkoutUrl } = await getBigCommerceProductsWithCheckout(
    cartId,
    lines
  );

  return bigCommerceToVercelCart(updatedCart, productsByIdList, checkout, checkoutUrl);
}

export async function getCart(cartId: string): Promise<VercelCart | undefined> {
  const res = await bigCommerceFetch<BigCommerceCartOperation>({
    query: getCartQuery,
    variables: { entityId: cartId },
    cache: 'no-store'
  });

  if (!res.body.data.site.cart) {
    return undefined;
  }

  const cart = res.body.data.site.cart;
  const lines = vercelFromBigCommerceLineItems(cart.lineItems);
  const { productsByIdList, checkout, checkoutUrl } = await getBigCommerceProductsWithCheckout(
    cartId,
    lines
  );

  return bigCommerceToVercelCart(cart, productsByIdList, checkout, checkoutUrl);
}

export async function getCollection(handle: string): Promise<VercelCollection> {
  const entityId = await getCategoryEntityIdbyHandle(handle);
  const res = await bigCommerceFetch<BigCommerceCollectionOperation>({
    query: getCategoryQuery,
    variables: {
      entityId
    },
    next: {
      tags: ['plp']
    }
  });

  return bigCommerceToVercelCollection(res.body.data.site.category);
}

export async function getCollectionProducts({
  collection,
  parent,
  reverse,
  sortKey
}: {
  collection: string;
  parent?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<{ totalItems: number; productList: VercelProduct[] }> {
  const expectedCollectionBreakpoints: Record<string, string> = {
    'hidden-homepage-carousel': 'carousel_collection',
    'hidden-homepage-featured-items': 'featured_collection'
  };

  if (expectedCollectionBreakpoints[collection] === 'carousel_collection') {
    const pageSize = process.env.PLP_PAGE_SIZE || '6';

    const res = await bigCommerceFetch<BigCommerceNewestProductsOperation>({
      query: getNewestProductsQuery,
      variables: {
        first: parseInt(pageSize)
      },
      next: {
        tags: ['plp']
      }
    });

    if (!res.body.data.site.newestProducts) {
      return { totalItems: 0, productList: [] };
    }
    const productList = res.body.data.site.newestProducts.edges.map((item) => item.node);

    return {
      totalItems: 0,
      productList: bigCommerceToVercelProductsItems(productList)
    };
  }

  if (expectedCollectionBreakpoints[collection] === 'featured_collection') {
    const pageSize = process.env.PLP_PAGE_SIZE || '6';

    const res = await bigCommerceFetch<BigCommerceFeaturedProductsOperation>({
      query: getFeaturedProductsQuery,
      variables: {
        first: parseInt(pageSize)
      },
      next: {
        tags: ['plp']
      }
    });

    if (!res.body.data.site.featuredProducts) {
      return { totalItems: 0, productList: [] };
    }
    const productList = res.body.data.site.featuredProducts.edges.map((item) => item.node);

    return {
      totalItems: 0,
      productList: bigCommerceToVercelProductsItems(productList)
    };
  }

  const entityId = await getCategoryEntityIdbyHandle(collection);

  const sortBy = vercelToBigCommerceSorting(reverse ?? false, sortKey);
  const pageSize = process.env.PLP_PAGE_SIZE || '6';

  const res = await bigCommerceFetch<BigCommerceProductsCollectionOperation>({
    query: getProductsCollectionQuery,
    variables: {
      entityId,
      first: parseInt(pageSize),
      hideOutOfStock: false,
      sortBy: sortBy === 'RELEVANCE' ? 'DEFAULT' : sortBy
    },
    next: {
      tags: ['plp']
    }
  });

  if (!res.body.data.site.category) {
    return { totalItems: 0, productList: [] };
  }
  const productList = res.body.data.site.category.products.edges.map((item) => item.node);
  const totalItems: any = res.body.data.site.category.products?.collectionInfo?.totalItems;
  return { totalItems, productList: bigCommerceToVercelProductsItems(productList) };
}

export async function getCollections(): Promise<VercelCollection[]> {
  const res = await bigCommerceFetch<BigCommerceCollectionsOperation>({
    query: getStoreCategoriesQuery
  });
  const collectionIdList = res.body.data.site.categoryTree.map(({ entityId }) => entityId);
  const collections = await Promise.all(
    collectionIdList.map(async (entityId) => {
      const res = await bigCommerceFetch<BigCommerceCollectionOperation>({
        query: getCategoryQuery,
        variables: {
          entityId
        },
        next: {
          tags: ['plp']
        }
      });
      return bigCommerceToVercelCollection(res.body.data.site.category);
    })
  );

  return collections;
}

export async function getMenu(handle: string): Promise<VercelMenu[]> {
  const configureMenuPath = (path: string) =>
    path
      .split('/')
      .filter((item) => item.length)
      .pop();
  const createVercelCollectionPath = (title: string, menuType: 'footer' | 'header') =>
    menuType === 'header' ? `/search/${title}` : `/${title}`;
  const configureVercelMenu = (
    menuData: BigCommerceCategoryTreeItem[] | BigCommercePage[],
    isMenuData: boolean,
    menuType?: 'footer' | 'header'
  ): VercelMenu[] => {
    if (isMenuData) {
      return menuData
        .flatMap((item) => {
          let vercelMenuItem;

          if (menuType === 'header') {
            const { name, path, hasChildren, children } = item as BigCommerceCategoryTreeItem;
            const vercelTitle = configureMenuPath(path ?? '');
            // NOTE: keep only high level categories for NavBar
            // if (hasChildren && children) {
            //   return configureVercelMenu(children, hasChildren);
            // }

            vercelMenuItem = {
              title: name,
              path: createVercelCollectionPath(vercelTitle!, menuType ?? 'header')
            };

            return [vercelMenuItem];
          }

          if (menuType === 'footer') {
            const { isVisibleInNavigation, name, path } = item as BigCommercePage;
            const vercelTitle = configureMenuPath(path ?? '');

            vercelMenuItem = {
              title: name,
              path: createVercelCollectionPath(vercelTitle!, menuType ?? 'footer')
            };
            // NOTE: blog has different structure & separate mapper
            return vercelMenuItem.title === 'Blog' || !isVisibleInNavigation
              ? []
              : [vercelMenuItem];
          }

          return [];
        })
        .slice(0, 4);
    }

    return [];
  };

  if (handle === 'next-js-frontend-footer-menu') {
    const res = await bigCommerceFetch<BigCommercePagesOperation>({
      query: getPagesQuery
    });
    const webPages = res.body.data.site.content.pages.edges.map((item) => item.node);

    return configureVercelMenu(webPages, true, 'footer');
  }

  if (handle === 'next-js-frontend-header-menu') {
    const res = await bigCommerceFetch<BigCommerceMenuOperation>({
      query: getMenuQuery
    });

    return configureVercelMenu(res.body.data.site.categoryTree, true, 'header');
  }

  return [];
}

export async function getPage(handle: string): Promise<VercelPage> {
  const entityId = await getEntityIdByHandle(handle);

  if (!entityId) {
    notFound();
  }

  const res = await bigCommerceFetch<BigCommercePageOperation>({
    query: getPageQuery,
    variables: {
      entityId
    }
  });

  return bigCommerceToVercelPageContent(res.body.data.site.content.page);
}

export async function getPages(): Promise<VercelPage[]> {
  const res = await bigCommerceFetch<BigCommercePagesOperation>({
    query: getPagesQuery
  });

  const pagesList = res.body.data.site.content.pages.edges.map((item) => item.node);

  return pagesList.map((page) => bigCommerceToVercelPageContent(page));
}

export async function getProduct(handle: string): Promise<VercelProduct | undefined> {
  const res = await bigCommerceFetch<BigCommerceProductOperation>({
    query: getProductQuery,
    variables: {
      productId: parseInt(handle, 10)
    },
    next: {
      tags: ['plp']
    }
  });
  return bigCommerceToVercelProduct({ node: res.body.data.site.product, cursor: '' });
}

export async function getProductIdBySlug(path: string): Promise<
  | {
      __typename:
        | 'Product'
        | 'Category'
        | 'Brand'
        | 'NormalPage'
        | 'ContactPage'
        | 'RawHtmlPage'
        | 'BlogIndexPage';
      entityId: number;
    }
  | undefined
> {
  const res = await bigCommerceFetch<BigCommerceEntityIdOperation>({
    query: getEntityIdByRouteQuery,
    variables: {
      path
    },
    next: {
      tags: ['plp']
    }
  });

  return res.body.data.site.route.node;
}

export async function getProductRecommendations(productId: string): Promise<VercelProduct[]> {
  const res = await bigCommerceFetch<BigCommerceRecommendationsOperation>({
    query: getProductsRecommedationsQuery,
    variables: {
      productId: productId
    },
    next: {
      tags: ['plp']
    }
  });

  const productList = res.body.data.site.product.relatedProducts.edges.map((item) => item.node);

  return bigCommerceToVercelProductsItems(productList);
}

// Function to extract brand attributes from the filter object
function getBrandAttributes(filter: Filter): BrandAttributes {
  const brandAttributes: BrandAttributes = {};
  if (filter && filter.Brand) {
    brandAttributes['Brand'] = filter.Brand;
  }
  return brandAttributes;
}

export async function getbigCommerceFiltersList({
  collection,
  parent,
  filter,
  query
}: {
  collection?: string;
  parent?: string;
  query?: string;
  filter?: { [key: string]: string[] };
}) {
  const entityId = collection && (await getCategoryEntityIdbyHandle(collection));

  //getting product attributes by filtering the filter data
  const productAttributes = Object.entries(filter || {})
    .filter(([attribute]) => attribute !== 'Brand')
    .map(([attribute, values]) => ({
      attribute,
      values
    }));

  // Getting the brand attributes
  const brandAttributes = filter ? getBrandAttributes(filter) : undefined;

  const brandEntityIds = brandAttributes?.Brand?.map(Number);

  const bigCommerceProductFilter = await bigCommerceFetch<BigCommerceProductsFilter>({
    query: getFilters,
    variables: {
      filters: {
        searchTerm: query || '',
        categoryEntityId: entityId ? entityId : null,
        productAttributes: productAttributes,
        brandEntityIds: brandEntityIds
      }
    },
    next: {
      tags: ['plp']
    }
  });
  const filterResult = bigCommerceProductFilter.body.data.site.search.searchProducts.filters.edges;
  return filterResult;
}

export async function getCategoryProducts(
  {
    query,
    reverse,
    sortKey,
    collection,
    filter,
    first,
    after = ''
  }: {
    collection?: string;
    query?: string;
    reverse?: boolean;
    sortKey?: string;
    filter?: { [key: string]: string[] };
    first: string | number;
    after?: string;
  },
  previousProductList: VercelProduct[] = []
): Promise<ProductListResult> {
  const sort = vercelToBigCommerceSorting(reverse ?? false, sortKey);
  const entityId = collection && (await getCategoryEntityIdbyHandle(collection));

  // Convert 'first' to a number
  const parsedFirst = typeof first === 'string' ? parseInt(first, 10) : first;

  // Get the product attributes other than Brand
  const productAttributes = Object.entries(filter || {})
    .filter(([attribute]) => attribute !== 'Brand')
    .map(([attribute, values]) => ({
      attribute,
      values
    }));

  // Get the brand attributes
  const brandAttributes = filter ? getBrandAttributes(filter) : undefined;
  const brandEntityIds = brandAttributes?.Brand?.map(Number); // Assuming the brand IDs are numbers, adjust if they are not
  const filters: any = {};
  if (query) {
    filters.searchTerm = query;
  }
  if (entityId) {
    filters.categoryEntityId = entityId;
  }

  if (productAttributes.length) {
    filters.productAttributes = productAttributes;
  }

  if (brandEntityIds) {
    filters.brandEntityIds = brandEntityIds;
  }
  const pageSize = process.env.PLP_PAGE_SIZE || '6';
  const res = await bigCommerceFetch<BigCommerceSearchProductsOperation>({
    query: searchProductsQuery,
    variables: {
      filters,
      sort,
      first: parseInt(pageSize) * parsedFirst,
      after
    },
    next: {
      tags: ['plp']
    }
  });

  const productList = res.body.data.site.search.searchProducts.products.edges.map((item) => ({
    node: item.node,
    cursor: item.cursor
  }));
  const totalItems = res.body.data.site.search.searchProducts.products.collectionInfo.totalItems;
  const endCursor = res.body.data.site.search.searchProducts.products.pageInfo.endCursor;
  const startCursor = res.body.data.site.search.searchProducts.products.pageInfo.startCursor;

  const listOfItems = bigCommerceToVercelProducts(productList);

  return {
    startCursor,
    endCursor,
    totalItems,
    productList: listOfItems
  };
}

export async function getFilteredProductsProxy({
  query,
  reverse,
  sortKey,
  collection,
  filter,
  first,
  after = ''
}: {
  collection?: string;
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  filter?: { [key: string]: string[] };
  first: string | number;
  after: string;
}) {
  try {
    const response = await fetch(`/api/category/products`, {
      method: 'POST',
      body: JSON.stringify({
        collection: collection,
        query: query,
        reverse: reverse,
        sortKey: sortKey,
        filter: filter,
        first: first,
        after: after
      }),
      cache: 'no-cache'
    });
    const data = await response.json();
    return data;
  } catch (e) {
    return e;
  }
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<VercelProduct[]> {
  const sort = vercelToBigCommerceSorting(reverse ?? false, sortKey);
  const res = await bigCommerceFetch<BigCommerceSearchProductsOperation>({
    query: searchProductsQuery,
    variables: {
      filters: {
        searchTerm: query || ''
      },
      sort
    },
    next: {
      tags: ['plp']
    }
  });

  const productList = res.body.data.site.search.searchProducts.products.edges.map(
    (item) => item.node
  );
  return bigCommerceToVercelProductsItems(productList);
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
// eslint-disable-next-line no-unused-vars
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export async function getFiltersList({
  collection,
  parent,
  filter,
  query
}: {
  collection?: string;
  parent?: string;
  query?: string;
  filter?: { [key: string]: string[] };
}) {
  const entityId = collection && (await getCategoryEntityIdbyHandle(collection));

  //getting product attributes by filtering the filter data
  const productAttributes = Object.entries(filter || {})
    .filter(([attribute]) => attribute !== 'Brand')
    .map(([attribute, values]) => ({
      attribute,
      values
    }));

  // Getting the brand attributes
  const brandAttributes = filter ? getBrandAttributes(filter) : undefined;

  const brandEntityIds = brandAttributes?.Brand?.map(Number);

  const bigCommerceProductFilter = await bigCommerceFetch<BigCommerceProductsFilter>({
    query: getFilters,
    variables: {
      filters: {
        searchTerm: query || '',
        categoryEntityId: entityId ? entityId : null,
        productAttributes: productAttributes,
        brandEntityIds: brandEntityIds
      }
    },
    next: {
      tags: ['plp']
    }
  });
  const filterResult = bigCommerceProductFilter.body.data.site.search.searchProducts.filters.edges;
  return filterResult;
}

export async function getFilteredProducts(
  {
    query,
    reverse,
    sortKey,
    collection,
    parent,
    filter,
    first,
    after = ''
  }: {
    collection?: string;
    parent?: string;
    query?: string;
    reverse?: boolean;
    sortKey?: string;
    filter?: { [key: string]: string[] };
    first: string | number;
    after?: string;
  },
  previousProductList: VercelProduct[] = []
): Promise<ProductListResult> {
  const sort = vercelToBigCommerceSorting(reverse ?? false, sortKey);
  const entityId = collection && (await getCategoryEntityIdbyHandle(collection));

  // Convert 'first' to a number
  const parsedFirst = typeof first === 'string' ? parseInt(first, 10) : first;

  // Get the product attributes other than Brand
  const productAttributes = Object.entries(filter || {})
    .filter(([attribute]) => attribute !== 'Brand')
    .map(([attribute, values]) => ({
      attribute,
      values
    }));

  // Get the brand attributes
  const brandAttributes = filter ? getBrandAttributes(filter) : undefined;
  const brandEntityIds = brandAttributes?.Brand?.map(Number); // Assuming the brand IDs are numbers, adjust if they are not
  let filters: any = {};
  if (query) {
    filters.searchTerm = query;
  }
  if (entityId) {
    filters.categoryEntityId = entityId;
  }

  if (productAttributes.length) {
    filters.productAttributes = productAttributes;
  }

  if (brandEntityIds) {
    filters.brandEntityIds = brandEntityIds;
  }

  const res = await bigCommerceFetch<BigCommerceSearchProductsOperation>({
    query: searchProductsQuery,
    variables: {
      filters,
      sort,
      first: 12 * parsedFirst,
      after
    },
    next: {
      tags: ['plp']
    }
  });

  const productList = res.body.data.site.search.searchProducts.products.edges.map((item) => ({
    node: item.node,
    cursor: item.cursor
  }));
  const totalItems = res.body.data.site.search.searchProducts.products.collectionInfo.totalItems;
  const endCursor = res.body.data.site.search.searchProducts.products.pageInfo.endCursor;
  const startCursor = res.body.data.site.search.searchProducts.products.pageInfo.startCursor;

  const listOfItems = bigCommerceToVercelProducts(productList);
  return {
    startCursor,
    endCursor,
    totalItems,
    productList: listOfItems
  };
}
