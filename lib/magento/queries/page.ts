import seoFragment from '../fragments/seo';

const pageFragment = /* GraphQL */ `
  fragment page on Page {
    ... on Page {
      id
      title
      handle
      body
      bodySummary
      seo {
        ...seo
      }
      createdAt
      updatedAt
    }
  }
  ${seoFragment}
`;

export const getHomePageQuery = `
query GetCmsPage($identifier:String!){
    cmsPage(identifier:$identifier){
        url_key 
        content 
        content_heading 
        title 
        page_layout 
        meta_title 
        meta_keywords 
        meta_description
    }
}

`;

export const getPageQuery = /* GraphQL */ `
  query getPage($handle: String!) {
    pageByHandle(handle: $handle) {
      ...page
    }
  }
  ${pageFragment}
`;

export const getPagesQuery = /* GraphQL */ `
  query getPages {
    pages(first: 100) {
      edges {
        node {
          ...page
        }
      }
    }
  }
  ${pageFragment}
`;

export const getAutoCompleteQuery = `
query getAutocompleteResults($inputText: String!) {
  products(search: $inputText, currentPage: 1, pageSize: 3) {
    aggregations {
      label
      count
      attribute_code
      options {
        label
        value
        __typename
      }
      position
      __typename
    }
    items {
      id
      uid
      sku
      name
      small_image {
        url
        __typename
      }
      url_key
      url_suffix
      price {
        regularPrice {
          amount {
            value
            currency
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
      __typename
    }
    page_info {
      total_pages
      __typename
    }
    total_count
    __typename
  }
}

`;
