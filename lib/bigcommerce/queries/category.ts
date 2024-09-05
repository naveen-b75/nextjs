export const getCategoryQuery = /* GraphQL */ `
  query getCategory($entityId: Int!) {
    site {
      category(entityId: $entityId) {
        entityId
        name
        path
        description
        seo {
          metaDescription
          metaKeywords
          pageTitle
        }
        breadcrumbs(depth: 4) {
          edges {
            node {
              entityId
              name
              path
            }
          }
        }
      }
    }
  }
`;

export const getStoreCategoriesQuery = /* GraphQL */ `
  query getStoreCategories {
    site {
      categoryTree {
        entityId
        name
      }
    }
  }
`;
