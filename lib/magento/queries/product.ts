import productFragment from '../fragments/product';

export const getProductReviewRatingsMetadataquery = /* GraphQL */ `
  query getProductReviewRatingsMetadata {
    productReviewRatingsMetadata {
      items {
        id
        name
        values {
          value
          value_id
        }
      }
    }
  }
`;

export const CreateProductReview = /* GraphQL */ `
  mutation submitProductReview(
    $nickname: String!
    $sku: String!
    $summary: String!
    $text: String!
    $ratings: [ProductReviewRatingInput]!
  ) {
    createProductReview(
      input: { nickname: $nickname, ratings: $ratings, sku: $sku, summary: $summary, text: $text }
    ) {
      review {
        average_rating
        created_at
        nickname
        ratings_breakdown {
          name
          value
        }
        summary
        text
        product {
          uid
          attribute_set_id
          canonical_url
          created_at
          id
          image {
            disabled
            label
            position
            url
          }
          name
          new
          new_from_date
          new_to_date
          only_x_left_in_stock
          price_range {
            maximum_price {
              discount {
                amount_off
                percent_off
              }
              final_price {
                currency
                value
              }
              fixed_product_taxes {
                amount {
                  currency
                  value
                }
                label
              }
              regular_price {
                currency
                value
              }
            }
            minimum_price {
              discount {
                amount_off
                percent_off
              }
              final_price {
                currency
                value
              }
              fixed_product_taxes {
                amount {
                  currency
                  value
                }
                label
              }
              regular_price {
                currency
                value
              }
            }
          }
          rating_summary
          review_count

          sku

          small_image {
            disabled
            label
            position
            url
          }

          special_price
          special_to_date
          stock_status

          swatch_image
          type_id
          uid
          updated_at

          url_key
          url_path
          url_suffix
        }
      }
    }
  }
`;

export const getProductQuery = /* GraphQL */ `
  query getProductDetailForProductPage($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        id
        uid
        ...ProductDetailsFragment
        __typename
      }
      __typename
    }
  }
  fragment ProductDetailsFragment on ProductInterface {
    __typename
    categories {
      uid
      breadcrumbs {
        category_uid
        __typename
      }
      __typename
    }
    description {
      html
      __typename
    }
    short_description {
      html
      __typename
    }
    media_gallery {
      url
      label
    }
    id
    uid
    media_gallery_entries {
      uid
      label
      position
      disabled
      file
      __typename
    }
    meta_description
    name
    price {
      regularPrice {
        amount {
          currency
          value
          __typename
        }
        __typename
      }
      __typename
    }
    price_range {
      maximum_price {
        regular_price {
          currency
          value
          __typename
        }
        discount {
          amount_off
          __typename
        }
        __typename
      }
      minimum_price {
        regular_price {
          currency
          value
          __typename
        }
        discount {
          amount_off
          __typename
        }
        __typename
      }
      __typename
    }
    sku
    small_image {
      url
      __typename
    }
    stock_status
    url_key
    rating_summary
    review_count
    reviews(pageSize: 20, currentPage: 1) {
      items {
        average_rating
        created_at
        nickname
        summary
        text
      }
      page_info {
        current_page
        page_size
        total_pages
      }
    }
    custom_attributes {
      selected_attribute_options {
        attribute_option {
          uid
          label
          is_default
          __typename
        }
        __typename
      }
      entered_attribute_value {
        value
        __typename
      }
      attribute_metadata {
        uid
        code
        label
        attribute_labels {
          store_code
          label
          __typename
        }
        data_type
        is_system
        entity_type
        ui_input {
          ui_input_type
          is_html_allowed
          __typename
        }
        ... on ProductAttributeMetadata {
          used_in_components
          __typename
        }
        __typename
      }
      __typename
    }
    ... on ConfigurableProduct {
      configurable_options {
        attribute_code
        attribute_id
        uid
        label
        product_id
        values {
          uid
          default_label
          label
          store_label
          use_default_value
          value_index
          swatch_data {
            ... on ImageSwatchData {
              thumbnail
              __typename
            }
            value
            __typename
          }
          __typename
        }
        __typename
      }
      variants {
        attributes {
          code
          value_index
          __typename
        }
        product {
          uid
          media_gallery_entries {
            uid
            disabled
            file
            label
            position
            __typename
          }
          sku
          stock_status
          price {
            regularPrice {
              amount {
                currency
                value
                __typename
              }
              __typename
            }
            __typename
          }
          price_range {
            maximum_price {
              final_price {
                currency
                value
                __typename
              }
              discount {
                amount_off
                __typename
              }
              __typename
            }
            __typename
          }
          custom_attributes {
            selected_attribute_options {
              attribute_option {
                uid
                label
                is_default
                __typename
              }
              __typename
            }
            entered_attribute_value {
              value
              __typename
            }
            attribute_metadata {
              uid
              code
              label
              attribute_labels {
                store_code
                label
                __typename
              }
              data_type
              is_system
              entity_type
              ui_input {
                ui_input_type
                is_html_allowed
                __typename
              }
              ... on ProductAttributeMetadata {
                used_in_components
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts(
    $search: String
    $filter: ProductAttributeFilterInput
    $pageSize: Int
    $currentPage: Int
    $sort: ProductAttributeSortInput
  ) {
    products(
      search: $search
      filter: $filter
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
    ) {
      ...products
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
      sort_fields {
        options {
          label
          value
          __typename
        }
        __typename
      }
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;
