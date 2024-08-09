export const getCheckoutQuery = /* GraphQL */ `
  query getCheckout($cartId: String!) {
      cart(cart_id: $cartId) {
          id
          total_quantity
          prices {
            subtotal_excluding_tax {
              currency
              value
              
            }
            subtotal_including_tax {
              currency
              value
              
            }
          }
      }
  }
`;

export const GET_REGIONS_QUERY = `
    query GetRegions($countryCode: String!) {
        country(id: $countryCode) {
            id
            available_regions {
                id
                code
                name
            }
        }
    }
`;

export const PLACE_ORDER = `
mutation placeOrder($cartId: String!) {
  placeOrder(input: {cart_id: $cartId}) {
    order {
      order_number
      __typename
    }
    __typename
  }
}

`;

export const SET_BILLING_ADDRESS = `
mutation setBillingAddress($cartId: String!, $firstName: String!, $lastName: String!, $street1: String!, $street2: String, $city: String!, $region: String!, $postcode: String!, $country: String!, $phoneNumber: String!) {
  setBillingAddressOnCart(
    input: {cart_id: $cartId, billing_address: {address: {firstname: $firstName, lastname: $lastName, street: [$street1, $street2], city: $city, region: $region, postcode: $postcode, country_code: $country, telephone: $phoneNumber, save_in_address_book: false}}}
  ) {
    cart {
      id
      billing_address {
        firstname
        lastname
        country {
          code
          __typename
        }
        street
        city
        region {
          code
          __typename
        }
        postcode
        telephone
        __typename
      }
      ...PriceSummaryFragment
      ...AvailablePaymentMethodsFragment
      __typename
    }
    __typename
  }
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

fragment AvailablePaymentMethodsFragment on Cart {
  id
  available_payment_methods {
    code
    title
    __typename
  }
  __typename
}

`;

export const SET_PAYMENT_METHOD_ON_CART = `
mutation setPaymentMethodOnCart($cartId: String!, $paymentMethod: PaymentMethodInput!) {
  setPaymentMethodOnCart(
    input: {cart_id: $cartId, payment_method: $paymentMethod}
  ) {
    cart {
      id
      selected_payment_method {
        code
        title
        __typename
      }
      __typename
    }
    __typename
  }
}

`;

export const GET_AVAILABLE_SHIPPING_METHODS = `
query getSelectedAndAvailableShippingMethods($cartId: String!) {
  cart(cart_id: $cartId) {
    id
    ...AvailableShippingMethodsCheckoutFragment
    ...SelectedShippingMethodCheckoutFragment
    ...ShippingInformationFragment
    __typename
  }
}
fragment AvailableShippingMethodsCheckoutFragment on Cart {
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
fragment SelectedShippingMethodCheckoutFragment on Cart {
  id
  shipping_addresses {
    selected_shipping_method {
      amount {
        currency
        value
        __typename
      }
      carrier_code
      method_code
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

export const SET_GUEST_SHIPPING = `
mutation SetGuestShipping($cartId: String!, $email: String!, $address: CartAddressInput!) {
  setGuestEmailOnCart(input: {cart_id: $cartId, email: $email}) {
    cart {
      id
      __typename
    }
    __typename
  }
  setShippingAddressesOnCart(
    input: {cart_id: $cartId, shipping_addresses: [{address: $address}]}
  ) {
    cart {
      id
      ...ShippingInformationFragment
      ...ShippingMethodsCheckoutFragment
      ...PriceSummaryFragment
      ...AvailablePaymentMethodsFragment
      __typename
    }
    __typename
  }
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

fragment ShippingMethodsCheckoutFragment on Cart {
  id
  ...AvailableShippingMethodsCheckoutFragment
  ...SelectedShippingMethodCheckoutFragment
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

fragment AvailableShippingMethodsCheckoutFragment on Cart {
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

fragment SelectedShippingMethodCheckoutFragment on Cart {
  id
  shipping_addresses {
    selected_shipping_method {
      amount {
        currency
        value
        __typename
      }
      carrier_code
      method_code
      method_title
      __typename
    }
    street
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

fragment AvailablePaymentMethodsFragment on Cart {
  id
  available_payment_methods {
    code
    title
    __typename
  }
  __typename
}

`;