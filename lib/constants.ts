export enum BigCommerceSortKeys {
  A_TO_Z = 'A_TO_Z',
  BEST_REVIEWED = 'BEST_REVIEWED',
  BEST_SELLING = 'BEST_SELLING',
  RELEVANCE = 'RELEVANCE',
  FEATURED = 'FEATURED',
  HIGHEST_PRICE = 'HIGHEST_PRICE',
  LOWEST_PRICE = 'LOWEST_PRICE',
  NEWEST = 'NEWEST',
  Z_TO_A = 'Z_TO_A'
}

export enum VercelSortKeys {
  RELEVANCE = 'RELEVANCE',
  BEST_SELLING = 'BEST_SELLING',
  CREATED_AT = 'CREATED_AT',
  PRICE = 'PRICE'
}

export enum vercelToBigCommerceSortKeys {
  RELEVANCE = 'RELEVANCE',
  BEST_SELLING = 'BEST_SELLING',
  CREATED_AT = 'NEWEST',
  PRICE = 'LOWEST_PRICE',
  PRICE_ON_REVERSE = 'HIGHEST_PRICE'
}

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'POSITION' | 'CREATED_AT' | 'PRICE' | 'PRODUCT_NAME';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Best Match',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Position', slug: 'sort_position-ASC', sortKey: 'POSITION', reverse: false }, // asc
  // { title: 'Latest arrivals', slug: 'sort_created_at-DESC', sortKey: 'CREATED_AT', reverse: true },
  { title: 'Product Name', slug: 'sort_name-ASC', sortKey: 'PRODUCT_NAME', reverse: false },
  { title: 'Price: Low to high', slug: 'sort_price-ASC', sortKey: 'PRICE', reverse: false }, // asc
  { title: 'Price: High to low', slug: 'sort_price-DESC', sortKey: 'PRICE', reverse: true }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-01/graphql.json';

export const MAGENTO_GRAPHQL_API_ENDPOINT = '/graphql';

export const BUILDER_KEY = 'de92fccbe0cb441dbfcb024f472bb9d5';
