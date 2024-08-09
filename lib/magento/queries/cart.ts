export const removeCouponFromCartMutation = `
mutation removeCouponFromCart($cartId: String!) {
  removeCouponFromCart(input: {cart_id: $cartId}) {
    cart {
      id
      ...CartPageFragment
      available_payment_methods {
        code
        title
        __typename
      }
      __typename
    }
    __typename
  }
}

fragment CartPageFragment on Cart {
  id
  total_quantity
  ...AppliedCouponsFragment
  ...GiftCardFragment
  ...ProductListingFragment
  ...PriceSummaryFragment
  __typename
}

fragment AppliedCouponsFragment on Cart {
  id
  applied_coupons {
    code
    __typename
  }
  __typename
}

fragment GiftCardFragment on Cart {
  __typename
  id
}

fragment ProductListingFragment on Cart {
  id
  items {
    uid
    product {
      uid
      name
      sku
      url_key
      thumbnail {
        url
        __typename
      }
      small_image {
        url
        __typename
      }
      stock_status
      ... on ConfigurableProduct {
        variants {
          attributes {
            uid
            code
            value_index
            __typename
          }
          product {
            uid
            stock_status
            small_image {
              url
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
    prices {
      price {
        currency
        value
        __typename
      }
      row_total {
        value
        __typename
      }
      total_item_discount {
        value
        __typename
      }
      __typename
    }
    quantity
    errors {
      code
      message
      __typename
    }
    ... on ConfigurableCartItem {
      configurable_options {
        id
        configurable_product_option_uid
        option_label
        configurable_product_option_value_uid
        value_label
        value_id
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}

fragment PriceSummaryFragment on Cart {
  id
  items {
    uid
    quantity
    __typename
  }
  ...ShippingSummaryFragment
  prices {
    ...TaxSummaryFragment
    ...DiscountSummaryFragment
    ...GrandTotalFragment
    subtotal_excluding_tax {
      currency
      value
      __typename
    }
    subtotal_including_tax {
      currency
      value
      __typename
    }
    __typename
  }
  ...GiftCardSummaryFragment
  ...GiftOptionsSummaryFragment
  __typename
}

fragment DiscountSummaryFragment on CartPrices {
  discounts {
    amount {
      currency
      value
      __typename
    }
    label
    __typename
  }
  __typename
}

fragment GiftCardSummaryFragment on Cart {
  id
  __typename
}

fragment GiftOptionsSummaryFragment on Cart {
  id
  __typename
}

fragment GrandTotalFragment on CartPrices {
  grand_total {
    currency
    value
    __typename
  }
  __typename
}

fragment ShippingSummaryFragment on Cart {
  id
  shipping_addresses {
    selected_shipping_method {
      amount {
        currency
        value
        __typename
      }
      __typename
    }
    street
    __typename
  }
  __typename
}

fragment TaxSummaryFragment on CartPrices {
  applied_taxes {
    amount {
      currency
      value
      __typename
    }
    __typename
  }
  __typename
}

`;

export const setCouponToCartMutation = `
mutation applyCouponToCart($cartId: String!, $couponCode: String!) {
  applyCouponToCart(input: {cart_id: $cartId, coupon_code: $couponCode}) {
    cart {
      id
      ...CartPageFragment
      available_payment_methods {
        code
        title
        
      }
      
    }
    
  }
}

fragment CartPageFragment on Cart {
  id
  total_quantity
  ...AppliedCouponsFragment
  ...GiftCardFragment
  ...ProductListingFragment
  ...PriceSummaryFragment
  
}

fragment AppliedCouponsFragment on Cart {
  id
  applied_coupons {
    code
    
  }
  
}

fragment GiftCardFragment on Cart {
  
  id
}

fragment ProductListingFragment on Cart {
  id
  items {
    uid
    product {
      uid
      name
      sku
      url_key
      thumbnail {
        url
        
      }
      small_image {
        url
        
      }
      stock_status
      ... on ConfigurableProduct {
        variants {
          attributes {
            uid
            code
            value_index
            
          }
          product {
            uid
            stock_status
            small_image {
              url
              
            }
            
          }
          
        }
        
      }
      
    }
    prices {
      price {
        currency
        value
        
      }
      row_total {
        value
        
      }
      total_item_discount {
        value
        
      }
      
    }
    quantity
    errors {
      code
      message
      
    }
    ... on ConfigurableCartItem {
      configurable_options {
        id
        configurable_product_option_uid
        option_label
        configurable_product_option_value_uid
        value_label
        value_id
        
      }
      
    }
    
  }
  
}

fragment PriceSummaryFragment on Cart {
  id
  items {
    uid
    quantity
    
  }
  ...ShippingSummaryFragment
  prices {
    ...TaxSummaryFragment
    ...DiscountSummaryFragment
    ...GrandTotalFragment
    subtotal_excluding_tax {
      currency
      value
      
    }
    subtotal_including_tax {
      currency
      value
      
    }
    
  }
  ...GiftCardSummaryFragment
  ...GiftOptionsSummaryFragment
  
}

fragment DiscountSummaryFragment on CartPrices {
  discounts {
    amount {
      currency
      value
      
    }
    label
    
  }
  
}

fragment GiftCardSummaryFragment on Cart {
  id
  
}

fragment GiftOptionsSummaryFragment on Cart {
  id
  
}

fragment GrandTotalFragment on CartPrices {
  grand_total {
    currency
    value
    
  }
  
}

fragment ShippingSummaryFragment on Cart {
  id
  shipping_addresses {
    selected_shipping_method {
      amount {
        currency
        value
        
      }
      
    }
    street
    
  }
  
}

fragment TaxSummaryFragment on CartPrices {
  applied_taxes {
    amount {
      currency
      value
      
    }
    
  }
  
}

`;

export const setShippingMethodMutation = `
mutation SetShippingMethodForEstimate($cartId: String!, $shippingMethod: ShippingMethodInput!) {
  setShippingMethodsOnCart(
    input: {cart_id: $cartId, shipping_methods: [$shippingMethod]}
  ) {
    cart {
      id
      available_payment_methods {
        code
        title
        __typename
      }
      ...CartPageFragment
      ...SelectedShippingMethodCartFragment
      __typename
    }
    __typename
  }
}

fragment CartPageFragment on Cart {
  id
  total_quantity
  ...AppliedCouponsFragment
  ...GiftCardFragment
  ...ProductListingFragment
  ...PriceSummaryFragment
  __typename
}

fragment AppliedCouponsFragment on Cart {
  id
  applied_coupons {
    code
    __typename
  }
  __typename
}

fragment GiftCardFragment on Cart {
  __typename
  id
}

fragment ProductListingFragment on Cart {
  id
  items {
    uid
    product {
      uid
      name
      sku
      url_key
      thumbnail {
        url
        __typename
      }
      small_image {
        url
        __typename
      }
      stock_status
      ... on ConfigurableProduct {
        variants {
          attributes {
            uid
            code
            value_index
            __typename
          }
          product {
            uid
            stock_status
            small_image {
              url
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
    
    prices {
      price {
        currency
        value
        __typename
      }
      row_total {
        value
        __typename
      }
      total_item_discount {
        value
        __typename
      }
      __typename
    }
    quantity
    errors {
      code
      message
      __typename
    }
    ... on ConfigurableCartItem {
      configurable_options {
        id
        configurable_product_option_uid
        option_label
        configurable_product_option_value_uid
        value_label
        value_id
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}

fragment PriceSummaryFragment on Cart {
  id
  items {
    uid
    quantity
    __typename
  }
  ...ShippingSummaryFragment
  prices {
    ...TaxSummaryFragment
    ...DiscountSummaryFragment
    ...GrandTotalFragment
    subtotal_excluding_tax {
      currency
      value
      __typename
    }
    subtotal_including_tax {
      currency
      value
      __typename
    }
    __typename
  }
  ...GiftCardSummaryFragment
  ...GiftOptionsSummaryFragment
  __typename
}

fragment DiscountSummaryFragment on CartPrices {
  discounts {
    amount {
      currency
      value
      __typename
    }
    label
    __typename
  }
  __typename
}

fragment GiftCardSummaryFragment on Cart {
  id
  __typename
}

fragment GiftOptionsSummaryFragment on Cart {
  id
  __typename
}

fragment GrandTotalFragment on CartPrices {
  grand_total {
    currency
    value
    __typename
  }
  __typename
}

fragment ShippingSummaryFragment on Cart {
  id
  shipping_addresses {
    selected_shipping_method {
      amount {
        currency
        value
        __typename
      }
      __typename
    }
    street
    __typename
  }
  __typename
}

fragment TaxSummaryFragment on CartPrices {
  applied_taxes {
    amount {
      currency
      value
      __typename
    }
    __typename
  }
  __typename
}

fragment SelectedShippingMethodCartFragment on Cart {
  id
  shipping_addresses {
    selected_shipping_method {
      carrier_code
      method_code
      carrier_title
      method_title
      __typename
    }
    street
    __typename
  }
  __typename
}
`;

export const getShippingMethodsQuery = `
query GetShippingMethods($cartId: String!) {
  cart(cart_id: $cartId) {
    id
    prices {
    ...TaxSummaryFragment
    ...DiscountSummaryFragment
    ...GrandTotalFragment
    subtotal_excluding_tax {
      currency
      value
      __typename
    }
    subtotal_including_tax {
      currency
      value
      __typename
    }
    __typename
  }
    available_payment_methods {
        code
        is_deferred
        title
        __typename
    }
    selected_payment_method {
      code
      purchase_order_number
      title
    }
    ...ShippingMethodsCartFragment
    __typename
  }
}
  fragment GrandTotalFragment on CartPrices {
  grand_total {
    currency
    value
    __typename
  }
  __typename
}
  fragment DiscountSummaryFragment on CartPrices {
  discounts {
    amount {
      currency
      value
      __typename
    }
    label
    __typename
  }
  __typename
}
  fragment TaxSummaryFragment on CartPrices {
  applied_taxes {
    amount {
      currency
      value
      __typename
    }
    __typename
  }
  __typename
}
fragment ShippingMethodsCartFragment on Cart {
  id
  email
  ...AvailableShippingMethodsCartFragment
  ...SelectedShippingMethodCartFragment
  shipping_addresses {
    city
    country {
      code
      label
      __typename
    }
    firstname
    lastname
    postcode
    company
    region {
      code
      label
      region_id
      __typename
    }
    street
    telephone
    __typename
  }
  __typename
}
fragment AvailableShippingMethodsCartFragment on Cart {
  id
  shipping_addresses {
    available_shipping_methods {
      amount {
        currency
        value
        __typename
      }
      available
      carrier_code
      carrier_title
      method_code
      method_title
      __typename
    }
    street
    __typename
  }
  __typename
}
fragment SelectedShippingMethodCartFragment on Cart {
  id
  shipping_addresses {
    selected_shipping_method {
      carrier_code
      amount{
      currency
      value
      }
      method_code
      carrier_title
      method_title
      __typename
    }
    street
    __typename
  }
  __typename
}

`;

export const getAvailableShippingMethodsquery = `
mutation SetShippingAddressForEstimate($cartId: String!, $address: CartAddressInput!) {
  setShippingAddressesOnCart(
    input: {cart_id: $cartId, shipping_addresses: [{address: $address}]}
  ) {
    cart {
      id
      ...CartPageFragment
      ...ShippingMethodsCartFragment
      ...ShippingInformationFragment
      __typename
    }
    __typename
  }
}

fragment CartPageFragment on Cart {
  id
  total_quantity
  ...AppliedCouponsFragment
  ...GiftCardFragment
  ...ProductListingFragment
  ...PriceSummaryFragment
  __typename
}

fragment AppliedCouponsFragment on Cart {
  id
  applied_coupons {
    code
    __typename
  }
  __typename
}

fragment GiftCardFragment on Cart {
  __typename
  id
}

fragment ProductListingFragment on Cart {
  id
  items {
    uid
    product {
      uid
      name
      sku
      url_key
     
      thumbnail {
        url
        __typename
      }
      small_image {
        url
        __typename
      }
      stock_status
      ... on ConfigurableProduct {
        variants {
          attributes {
            uid
            code
            value_index
            __typename
          }
          product {
            uid
            stock_status
            small_image {
              url
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
    
    prices {
      price {
        currency
        value
        __typename
      }
      row_total {
        value
        __typename
      }
      total_item_discount {
        value
        __typename
      }
      __typename
    }
    quantity
    errors {
      code
      message
      __typename
    }
    ... on ConfigurableCartItem {
      configurable_options {
        id
        configurable_product_option_uid
        option_label
        configurable_product_option_value_uid
        value_label
        value_id
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}

fragment PriceSummaryFragment on Cart {
  id
  items {
    uid
    quantity
    __typename
  }
  ...ShippingSummaryFragment
  prices {
    ...TaxSummaryFragment
    ...DiscountSummaryFragment
    ...GrandTotalFragment
   
    subtotal_excluding_tax {
      currency
      value
      __typename
    }
    subtotal_including_tax {
      currency
      value
      __typename
    }
    __typename
  }
  ...GiftCardSummaryFragment
  ...GiftOptionsSummaryFragment
  __typename
}

fragment DiscountSummaryFragment on CartPrices {
  discounts {
    amount {
      currency
      value
      __typename
    }
    label
    __typename
  }
  __typename
}

fragment GiftCardSummaryFragment on Cart {
  id
  __typename
}

fragment GiftOptionsSummaryFragment on Cart {
  id
  __typename
}

fragment GrandTotalFragment on CartPrices {
  grand_total {
    currency
    value
    __typename
  }
  __typename
}

fragment ShippingSummaryFragment on Cart {
  id
  shipping_addresses {
    selected_shipping_method {
      amount {
        currency
        value
        __typename
      }
      __typename
    }
    street
    __typename
  }
  __typename
}

fragment TaxSummaryFragment on CartPrices {
  applied_taxes {
    amount {
      currency
      value
      __typename
    }
    __typename
  }
  __typename
}

fragment ShippingMethodsCartFragment on Cart {
  id
  ...AvailableShippingMethodsCartFragment
  ...SelectedShippingMethodCartFragment
  shipping_addresses {
    country {
      code
      __typename
    }
    postcode
    region {
      code
      __typename
    }
    street
    __typename
  }
  __typename
}

fragment AvailableShippingMethodsCartFragment on Cart {
  id
  shipping_addresses {
    available_shipping_methods {
      amount {
        currency
        value
        __typename
      }
      available
      carrier_code
      carrier_title
      method_code
      method_title
      __typename
    }
    street
    __typename
  }
  __typename
}

fragment SelectedShippingMethodCartFragment on Cart {
  id
  shipping_addresses {
    selected_shipping_method {
      carrier_code
      method_code
      carrier_title
      method_title
      __typename
    }
    street
    __typename
  }
  __typename
}

fragment ShippingInformationFragment on Cart {
  id
  email
  shipping_addresses {
    city
    country {
      code
      label
      __typename
    }
    firstname
    lastname
    postcode
    company
    region {
      code
      label
      region_id
      __typename
    }
    street
    telephone
    __typename
  }
  __typename
}
`;

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: String!) {
    cart(cart_id: $cartId) {
      id
      ...MiniCartFragment
      ...AppliedCouponsFragment
      ...GiftCardFragment
      shipping_addresses {
        firstname
        lastname
        street
        city
        region {
          code
          label
        }
        country {
          code
          label
        }
        telephone
        available_shipping_methods {
          amount {
            currency
            value
          }
          available
          carrier_code
          carrier_title
          error_message
          method_code
          method_title
          price_excl_tax {
            value
            currency
          }
          price_incl_tax {
            value
            currency
          }
        }
        selected_shipping_method {
          amount {
            value
            currency
          }
          carrier_code
          carrier_title
          method_code
          method_title
        }
      }
    }
  }
  fragment AppliedCouponsFragment on Cart {
    id
    applied_coupons {
      code
    }
  }

  fragment GiftCardFragment on Cart {
    id
  }
  fragment MiniCartFragment on Cart {
    id
    total_quantity
    prices {
      ...DiscountSummaryFragment
      subtotal_excluding_tax {
        currency
        value
      }
      subtotal_including_tax {
        currency
        value
      }
      grand_total {
        currency
        value
      }
      subtotal_with_discount_excluding_tax {
        currency
        value
      }
    }
    ...ProductListFragment
    ...GiftCardSummaryFragment
    ...GiftOptionsSummaryFragment
  }
  fragment DiscountSummaryFragment on CartPrices {
    discounts {
      amount {
        currency
        value
      }
      label
    }
  }

  fragment GiftCardSummaryFragment on Cart {
    id
  }

  fragment GiftOptionsSummaryFragment on Cart {
    id
  }
  fragment ProductListFragment on Cart {
    id
    email
    items {
      uid
      product {
        uid
        name
        sku

        url_key
        thumbnail {
          url
        }
        stock_status
        ... on ConfigurableProduct {
          variants {
            attributes {
              uid
            }
            product {
              uid
              thumbnail {
                url
              }
            }
          }
        }
      }

      prices {
        price {
          currency
          value
        }
        total_item_discount {
          value
        }
      }
      quantity
      ... on ConfigurableCartItem {
        configurable_options {
          configurable_product_option_uid
          option_label
          configurable_product_option_value_uid
          value_label
          id
          value_id
        }
      }
    }
  }
`;
