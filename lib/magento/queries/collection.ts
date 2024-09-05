import seoFragment from '../fragments/seo';

export const getSortMethods = `
query getCategoryAvailableSortMethods(
  $categoryIdFilter: FilterEqualTypeInput!
) {
  products(filter: { category_uid: $categoryIdFilter }) {
    sort_fields {
      options {
        label
        value
      }
    }
  }
}
`;

export const getBreadcrumbs = `
query getBreadcrumbs($category_id: Int!){
 category(id: $category_id) {
    breadcrumbs {
      category_id
      category_level
      category_name
      category_url_path
    }
    id
    name
    url_path
  }
}`;

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
  }
  ${seoFragment}
`;

export const getProductFiltersBySearchQuery = `
query getProductFiltersBySearch($search: String!) {
  products(search: $search) {
    aggregations {
      label
      count
      attribute_code
      options {
        label
        value
        count
        __typename
      }
      position
      __typename
    }
    __typename
  }
}
`;

export const getProductFiltersByCategoryQuery = `
query getProductFiltersByCategory($categoryIdFilter: FilterEqualTypeInput!) {
  products(filter: { category_uid: $categoryIdFilter }) {
    aggregations(filter: { category: { includeDirectChildrenOnly: true } }) {
      label
      count
      attribute_code
      options {
        label
        value
        count
      }
      position
    }
    sort_fields {
      options {
        label
        value
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

export const ResolverURLQuery = `
    query ResolveURL($url: String!) {
      route(url: $url) {
        relative_url
        redirect_code
        type
        ... on CmsPage {
          identifier
        }
        ... on ProductInterface {
          uid
          id
        }
        ... on CategoryInterface {
          uid
          id
        }
      }
    }
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query GetCategories(
    $id: String!
    $pageSize: Int!
    $currentPage: Int!
    $filters: ProductAttributeFilterInput!
    $sort: ProductAttributeSortInput
  ) {
    categories(filters: { category_uid: { in: [$id] } }) {
      items {
        uid
        ...CategoryFragment
        __typename
      }
      __typename
    }
    products(pageSize: $pageSize, currentPage: $currentPage, filter: $filters, sort: $sort) {
      aggregations {
        attribute_code
        count
        label
        options {
          count
          label
          value
        }
        position
      }
      sort_fields {
        options {
          label
          value
          __typename
        }
        __typename
      }
      ...ProductsFragment
      __typename
    }
  }
  fragment CategoryFragment on CategoryTree {
    uid
    meta_title
    meta_keywords
    meta_description
    __typename
  }
  fragment ProductsFragment on Products {
    items {
      id
      uid
      name
      price_range {
        minimum_price {
          final_price {
            currency
            value
          }
          regular_price {
            currency
            value
          }
          discount {
            amount_off
          }
        }
        maximum_price {
          final_price {
            currency
            value
          }
          regular_price {
            currency
            value
          }
          discount {
            amount_off
          }
        }
      }
      sku
      small_image {
        url
        __typename
      }
      stock_status
      rating_summary
      __typename
      url_key
    }
    page_info {
      total_pages
      __typename
    }
    total_count
    __typename
  }
`;
