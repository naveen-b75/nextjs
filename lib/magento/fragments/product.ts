import imageFragment from './image';
import seoFragment from './seo';

const productFragment = /* GraphQL */ `
  fragment products on Products {
	items {
	id,
    name,
    sku,
    url_key,
    description{
      html
    },
    only_x_left_in_stock,
    stock_status,
    media_gallery {
        url,
        label
    },
    small_image {
        url
      },
    custom_attributes {
        attribute_metadata {
            attribute_labels {
              label
              store_code
            }
            code
            data_type
            entity_type
            is_system
            label
            sort_order
            ui_input {
              is_html_allowed
              ui_input_type
            }
            uid
        }
      entered_attribute_value { value }
       selected_attribute_options {
            attribute_option {
              is_default
              label
              uid
            }
        }
    },
    price_range {
        minimum_price {
          regular_price {
            ...MoneyFields
          }
        }
    }
  }
    page_info {
    total_pages
    __typename
  }
  total_count
  __typename
} 
fragment MoneyFields on Money {
    value
    currency
  }
`;

export default productFragment;
