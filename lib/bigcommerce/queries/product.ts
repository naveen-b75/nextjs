import { productFragment } from '../fragments/product';

export const getProductQuery = /* GraphQL */ `
  query productById($productId: Int!) {
    site {
      product(entityId: $productId) {
        ...product
      }
    }
  }
  ${productFragment}
`;

export const getStoreProductsQuery = /* GraphQL */ `
  query getStoreProducts($entityIds: [Int!]) {
    site {
      products(entityIds: $entityIds) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductsCollectionQuery = /* GraphQL */ `
  query getProductsCollection(
    $entityId: Int!
    $sortBy: CategoryProductSort
    $hideOutOfStock: Boolean
    $first: Int
  ) {
    site {
      category(entityId: $entityId) {
        products(sortBy: $sortBy, hideOutOfStock: $hideOutOfStock, first: $first) {
          edges {
            node {
              ...product
            }
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const searchProductsQuery = /* GraphQL */ `
  query searchProducts(
    $first: Int
    $filters: SearchProductsFiltersInput!
    $sort: SearchProductsSortInput
    $after: String
  ) {
    site {
      search {
        searchProducts(filters: $filters, sort: $sort) {
          products(first: $first, after: $after) {
            edges {
              node {
                availabilityV2 {
                  status
                  description
                }
                id
                entityId
                sku
                upc
                name
                createdAt {
                  utc
                }
                brand {
                  name
                }
                productOptions(first: 1) {
                  edges {
                    node {
                      __typename
                      entityId
                      displayName
                      ... on MultipleChoiceOption {
                        displayStyle
                        values {
                          edges {
                            node {
                              entityId
                              isDefault
                              ... on SwatchOptionValue {
                                hexColors
                                imageUrl(width: 20)
                                label
                                isSelected
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                customFields {
                  edges {
                    node {
                      name
                      value
                    }
                  }
                }
                path
                customFields {
                  edges {
                    node {
                      name
                      value
                    }
                  }
                }
                brand {
                  name
                }
                defaultImage {
                  url: url(width: 450)
                }
                images {
                  edges {
                    node {
                      url: url(width: 450)
                      altText
                    }
                  }
                }
                prices {
                  price {
                    value
                    currencyCode
                  }
                  basePrice {
                    value
                    currencyCode
                  }
                  priceRange {
                    min {
                      value
                      currencyCode
                    }
                    max {
                      value
                      currencyCode
                    }
                  }
                }
              }
              cursor
            }
            pageInfo {
              startCursor
              endCursor
              hasNextPage
              hasPreviousPage
            }
            collectionInfo {
              totalItems
            }
          }
        }
      }
    }
  }
`;

export const getProductsRecommedationsQuery = /* GraphQL */ `
  query getProductsRecommedations($productId: ID) {
    site {
      product(id: $productId) {
        relatedProducts {
          edges {
            node {
              ...product
            }
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const getNewestProductsQuery = /* GraphQL */ `
  query getNewestProducts($first: Int) {
    site {
      newestProducts(first: $first) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const getFeaturedProductsQuery = /* GraphQL */ `
  query getFeaturedProducts($first: Int) {
    site {
      featuredProducts(first: $first) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const getPopularProductsQuery = /* GraphQL */ `
  query bestSellingProducts($first: Int) {
    site {
      bestSellingProducts(first: $first) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const getFilters = /* GraphQL */ `
  query getFilters($filters: SearchProductsFiltersInput!) {
    site {
      search {
        searchProducts(filters: $filters) {
          filters {
            edges {
              node {
                __typename
                name
                isCollapsedByDefault
                ... on CategorySearchFilter {
                  name
                  displayProductCount
                  isCollapsedByDefault
                  categories {
                    edges {
                      node {
                        entityId
                        isSelected
                        productCount
                        subCategories {
                          edges {
                            node {
                              entityId
                              name
                            }
                          }
                        }
                      }
                    }
                  }
                }
                ... on ProductAttributeSearchFilter {
                  displayProductCount
                  filterName
                  name
                  isCollapsedByDefault
                  attributes {
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      startCursor
                      endCursor
                    }
                    edges {
                      node {
                        value
                        isSelected
                        productCount
                      }
                      cursor
                    }
                  }
                }
                ... on PriceSearchFilter {
                  selected {
                    minPrice
                    maxPrice
                  }
                  name
                  isCollapsedByDefault
                }
                ... on BrandSearchFilter {
                  displayProductCount
                  name
                  isCollapsedByDefault
                  brands {
                    edges {
                      node {
                        entityId
                        name
                        isSelected
                        productCount
                      }
                    }
                  }
                }
                ... on OtherSearchFilter {
                  name
                  displayProductCount
                  isCollapsedByDefault
                  freeShipping {
                    isSelected
                    productCount
                  }
                  isInStock {
                    isSelected
                    productCount
                  }
                  isFeatured {
                    isSelected
                    productCount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
