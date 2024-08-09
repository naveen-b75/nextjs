import cartFragment from '../fragments/cart';

export const emptyCartQuery = /* GraphQL */ `
  mutation {
    createEmptyCart(input: {})
  }
`;

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
      cart {
        email
        id
        is_virtual
        total_quantity
        items {
          id
          uid
          product {
            name
            sku
          }
          quantity
        }
      }
      user_errors {
        code
        message
      }
    }
  }
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const editCartItemsMutation = /* GraphQL */ `
  mutation editCartItems($cartId: String!, $lines: [CartItemUpdateInput!]!) {
    updateCartItems(input: { cart_id: $cartId, cart_items: $lines }) {
      cart {
        applied_coupon {
          code
        }
        applied_coupons {
          code
        }
        available_payment_methods {
          code
          is_deferred
          title
        }
        email
        id
        is_virtual
        items {
          errors {
            code
            message
          }
          id
          prices {
            discounts {
              amount {
                currency
                value
              }
              label
            }
            fixed_product_taxes {
              amount {
                currency
                value
              }
              label
            }
            price {
              currency
              value
            }
            price_including_tax {
              currency
              value
            }
            row_total {
              currency
              value
            }
            row_total_including_tax {
              currency
              value
            }
            total_item_discount {
              currency
              value
            }
          }
          product {
            small_image {
              disabled
              label
              position
              url
            }
            id
            uid
            url_key
            url_path
          }

          quantity
          uid
        }

        prices {
          applied_taxes {
            amount {
              currency
              value
            }
            label
          }
          discount {
            amount {
              currency
              value
            }
            label
          }
          discounts {
            amount {
              currency
              value
            }
            label
          }
          grand_total {
            currency
            value
          }
          subtotal_excluding_tax {
            currency
            value
          }
          subtotal_including_tax {
            currency
            value
          }
          subtotal_with_discount_excluding_tax {
            currency
            value
          }
        }
        total_quantity
      }
    }
  }
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: String!, $lineIds: ID!) {
    removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $lineIds }) {
      cart {
        applied_coupon {
          code
        }
        applied_coupons {
          code
        }
        available_payment_methods {
          code
          is_deferred
          title
        }
        email
        id
        is_virtual
        items {
          errors {
            code
            message
          }
          id
          prices {
            discounts {
              amount {
                currency
                value
              }
              label
            }
            fixed_product_taxes {
              amount {
                currency
                value
              }
              label
            }
            price {
              currency
              value
            }
            price_including_tax {
              currency
              value
            }
            row_total {
              currency
              value
            }
            row_total_including_tax {
              currency
              value
            }
            total_item_discount {
              currency
              value
            }
          }
          product {
            small_image {
              disabled
              label
              position
              url
            }
            id
            uid
            url_key
            url_path
          }

          quantity
          uid
        }

        prices {
          applied_taxes {
            amount {
              currency
              value
            }
            label
          }
          discount {
            amount {
              currency
              value
            }
            label
          }
          discounts {
            amount {
              currency
              value
            }
            label
          }
          grand_total {
            currency
            value
          }
          subtotal_excluding_tax {
            currency
            value
          }
          subtotal_including_tax {
            currency
            value
          }
          subtotal_with_discount_excluding_tax {
            currency
            value
          }
        }
        total_quantity
      }
    }
  }
`;
