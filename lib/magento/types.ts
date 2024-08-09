export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<VercelCart, 'lines'> & {
  lines: VercelCartItem[];
};

export type VercelCartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptionslabels: Array<{
      name: string;
      value: string;
    }>;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
};

export type Collection = MagentoCollection & {
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Resolver = {
  relative_url?: string;
  redirect_code?: string;
  type?: string;
  route?: {
    uid: string;
  };
  uid?: string;
};

export type HomePage = {
  url_key: string;
  content: string;
  content_heading: string;
  title: string;
  page_layout: string;
  meta_title: string;
  meta_keywords: string;
  meta_description: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<MagentoProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
  handle: string;
  featuredImage: {
    altText: string;
    title: string;
    url: string;
  };
  title: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type SEO = {
  title: string;
  description: string;
};

export type VercelCart = {
  id: string;
  checkoutUrl: string;
  items: [];
  prices: {
    subtotal_including_tax: {
      value: number;
      currency: string;
    };
    grand_total: {
      value: number;
      currency: string;
    };
    discounts: {
      label: string;
      amount: {
        value: number;
        currency: string;
      };
    }[];
  };
  total_quantity: number;
  shipping_addresses: {
    selected_shipping_method: {
      carrier_code: string;
      carrier_title: string;
      method_code: string;
      method_title: string;
      amount: {
        value: number;
        currency: string;
      };
    };
  }[];
  applied_coupons: {
    code: string;
  }[];
  cost: {
    selected_shipping_method?: {
      amount: number;
      carrier_code: string;
      carrier_title: string;
      method_code: string;
      method_title: string;
    };
    discountAmout?: {
      amount: number;
      currencyCode: string;
      label: string;
      appliedCouponCode: string;
    };
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: VercelCartItem[];
  totalQuantity: number;
};

export type MagentoCart = {
  id: string;
  total_quantity: string;
  prices: {
    subtotal_excluding_tax: {
      currency: string;
      value: string;
    };
    subtotal_including_tax: {
      currency: string;
      value: string;
    };
  };
  isTaxIncluded: boolean;
  baseAmount: Money;
  discountedAmount: Money;
  amount: Money;
  items: CartLineItems[];
  createdAt: '';
  updatedAt: '';
  locale: '';
};

export type CartLineItems = {
  uid: number;
  sku: string;
  name: string;
  url_key: string;
  thumbnail: {
    url: string;
  };
  quantity: number;
  prices: {
    price: {
      currency: string;
      value: string;
    };
    total_item_discount: {
      value: string;
    };
  };
};

type CartDiscount = {
  entityId: string;
  discountedAmount: {
    currency: string;
    value: string;
  };
};
export type MagentoCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

export type MagentoProduct = {
  id: string;
  name: string;
  sku: string;
};

export type MagentoCartOperation = {
  data: {
    createProductReview: { review: MagentoProductReview };
  };
  variables: {
    sku: string;
    nickname: string;
    ratings: { id: string; value_id: string }[];
    summary: string;
    text: string;
  };
};

export type MagentoCartGetRegionOperations = {
  data: {
    country: MagentoCartOP;
  };
  variables: {
    countryCode: string;
  };
};

export type MagentoCartSetGuestShippingOperations = {
  data: {
    cart: MagentoCartOP;
  };
  variables: {
    cartId: string;
    email?: string;
    city?: string;
    firstname?: string;
    lastname?: string;
    street1?: string;
    street2?: string;
    telephone?: string;
    country_code?: string;
    postcode?: string;
    region?: string;
    address?: {
      city: string;
      firstname: string;
      lastname: string;
      street: string[];
      telephone: string;
      country_code: string;
      postcode: string;
      region: string;
    }[];
  };
};

export type MagentoCartSetGuestBillingOperations = {
  data: {
    cart: MagentoCartOP;
  };
  variables: {
    cartId: string;
    city?: string;
    firstName?: string;
    lastName?: string;
    street1?: string;
    street2?: string;
    phoneNumber?: string;
    country?: string;
    postcode?: string;
    region?: string;
  };
};

export type MagentoCartSetPaymethodOperations = {
  data: {
    cart: MagentoCartOP;
  };
  variables: {
    paymentMethod: { code: string };
    cartId: string;
    city?: string;
    firstName?: string;
    lastName?: string;
    street1?: string;
    street2?: string;
    phoneNumber?: string;
    country?: string;
    postcode?: string;
    region?: string;
  };
};

export type MagentoPlaceOrdeOperations = {
  data: {
    placeOrder: {
      order: { order_number: string };
    };
  };
  variables: {
    cartId: string;
  };
};

export type MagentoCartQuery = {
  data: {
    cart: MagentoCartOP;
  };
  variables: {
    cartId?: string;
    address?: {
      city: string;
      firstname: string;
      lastname: string;
      street: string[];
      telephone: string;
      country_code: string;
      postcode: string;
      region: string;
    }[];
    shippingMethod?: { carrier_code: string; method_code: string }[];
  };
};

export type MagentoCartApplyCoupen = {
  data: {
    applyCouponToCart: MagentoCartOP;
    removeCouponFromCart: MagentoCartOP;
  };
  variables: {
    cartId?: string;
    couponCode?: string;
    shippingMethod?: { carrier_code: string; method_code: string }[];
  };
};

export type MagentoProductReview = {
  average_rating: string;
  created_at: string;
  nickname: string;
  ratings_breakdown: {
    name: string;
    value: string;
  };
  summary: string;
  text: string;
  product: MagentoProductsList;
};

export type EmptyCart = {
  createEmptyCart: string;
};

export type MagentoCreateEmptyCartOperation = {
  data: { createEmptyCart: string };
};

export type MagentoCreateCartOperation = {
  data: { cartCreate: { cart: VercelCart } };
};

export type MagentoAddToCartOperation = {
  data: {
    addProductsToCart: {
      cart: MagentoCartOP;
    };
  };
  variables: {
    cartId: string;
    cartItems: {
      sku: string;
      quantity: number;
    }[];
  };
};

export type MagentoRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: MagentoCartOP;
    };
  };
  variables: {
    cartId: string;
    lineIds: string;
  };
};

export type MagentoUpdateCartOperation = {
  data: {
    updateCartItems: {
      cart: MagentoCartOP;
    };
  };
  variables: {
    cartId: string;
    lines?: any;
    cart_items?: {
      cart_item_uid: string;
      quantity: number;
    }[];
  };
};

export type MagentoCollectionOperation = {
  data: {
    products: {
      aggregations: { attribute_code: string; label: string; count: string; options: [] }[];
    };
  };
  variables: {
    search?: string;
    categoryIdFilter?: {
      eq: string | undefined;
    };
  };
};
export type MagentoGetCollectionOperation = {
  data: {
    collection: Collection;
  };
  variables: {
    handle: string;
  };
};

export type MagentoSortMethodOperation = {
  data: MagentoProductsList[];
  variables: {
    categoryIdFilter: string;
  };
};

export type MagentoProductFilter = {
  products: {
    aggregations: {
      label: string;
      count: number;
      attribute_code: string;
      options: {
        label: string;
        value: string;
        count: number;
      }[];
      position: string | null;
    }[];
  };
};

export type MagentoCollectionProductsOperation = {
  data: {
    products: {
      items: MagentoProductsList[];
      sort_fields: { options: { label: string; value: string }[] };
      total_count: number;
      aggregations: MagentoProductsFilter[];
    };
  };
  variables: {
    id: string;
    reverse?: boolean;
    sort?: any;
    sortKey?: string;
    filters?: [];
    pageSize?: number;
    currentPage?: number;
  };
};

export type MagentoProductsFilter = {
  attribute_code: string;
  count: number;
  label: string;
  options: [
    {
      count: number;
      label: string;
      value: string;
    }
  ];
  position: number;
};

export type MagentoCollectionsOperation = {
  data: {
    collections: Connection<MagentoCollection>;
  };
};

export type MagentoMenuOperation = {
  data: {
    productReviewRatingsMetadata?: any;
    categoryList?: any;
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type MagentoResolverOperation = {
  data: {
    route?: {
      relative_url: string;
      redirect_code: string;
      type: string;
      uid: string;
    };
  };
  variables: {
    url: string;
  };
};

export type MagentoPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type MagentoProductRequest = {
  data: {
    products: {
      items: MagentoProductsList[];
    };
  };
  variables: { urlKey: string };
};

export type MagentoPageCmsBlockOperation = {
  data: CmsBlocks;
  variables: { identifier: string };
};

export type CmsBlocks = { cmsPage: { content: string } };

export type MagentoPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type MagentoProductOperation = {
  data: { product: MagentoProduct };
  variables: {
    handle: string;
  };
};

export type MagentoProductRecommendationsOperation = {
  data: {
    productRecommendations: { items: MagentoProductsList[]; total_count: number };
  };
  variables: {
    productId: string;
  };
};

export type MagentoProductsOperation = {
  data: {
    products: {
      items: MagentoProductsList[];
      total_count: number;
      aggregations: MagentoProductsFilter[];
      sort_fields: { options: { label: string; value: string }[] };
    };
  };
  variables: {
    search?: string | undefined;
    filter?: [];
    pageSize?: Number;
    currentPage?: Number;
    sort?: {};
    inputText?: String;
  };
};

export type MagentoShippingMethod = {
  id: string;
  email?: string;
  selected_payment_method?: {
    code: string;
  };
  available_payment_methods: {
    title: string;
    code: string;
    carrier_code: string;
    method_title: string;
    method_code: string;
    amount: { value: number };
  }[];
  shipping_addresses: {
    firstname: string;
    country: { code: string; label: string };
    street: string[];
    telephone: string;
    city: string;
    postcode: string;
    region: { code: string; label: string };
    lastname: string;
    selected_shipping_method: { method_title: string; carrier_title: string; carrier_code: string };
    available_shipping_methods: {
      carrier_code: string;
      method_title: string;
      method_code: string;
      amount: { value: number };
    }[];
  }[];
};
export type MagentoCartOP = {
  id: string;
  email: string;
  checkoutUrl: string;
  cartUrl?: string;
  selected_payment_method?: {
    code: string;
  };
  available_payment_methods?: {
    title: string;
    code: string;
    carrier_code: string;
    method_title: string;
    method_code: string;
    amount: { value: number };
  }[];
  prices?: {
    subtotal_including_tax: {
      value: number;
      currency: string;
    };
    grand_total: {
      value: number;
      currency: string;
    };
    discounts: {
      label: string;
      amount: {
        value: number;
        currency: string;
      };
    }[];
  };
  total_quantity?: number;
  shipping_addresses?: {
    firstname: string;
    street?: string[];
    telephone: string;
    lastname: string;
    city?: string;
    region?: { label: string; code: string; region_id: number };
    postcode?: string;
    country?: { label: string; code: string };
    available_shipping_methods: {
      carrier_code: string;
      method_code: string;
      method_title: string;
      amount: { value: number };
    }[];
    selected_shipping_method: {
      carrier_code: string;
      carrier_title: string;
      method_code: string;
      method_title: string;
      amount: {
        value: number;
        currency: string;
      };
    };
  }[];
  applied_coupons?: {
    code: string;
  }[];
  cost: {
    selected_shipping_method?: {
      amount: number;
      carrier_code: string;
      carrier_title: string;
      method_code: string;
      currencyCode: string;
      method_title: string;
    };
    discountAmout?: {
      amount: number;
      currencyCode: string;
      label: string;
      appliedCouponCode: string;
    };
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: MagentoCartLineItems[];
  totalQuantity: number;
  items: [];
};

export type MagentoCartLineItems = {
  id: any;
  quantity: any;
  cost: {
    totalAmount: {
      amount: any;
      currencyCode: any;
    };
  };
  merchandise: {
    id: string;
    title: string;
    handle: any;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
    product: any;
    selectedOptionslabels: Array<{
      name: string;
      value: string;
    }>;
  };
};

export type MagentoProductsList = {
  id: string;
  __typename: string;
  productId?: string;
  sku: string;
  name: string;
  plainTextDescription: string;
  handle: string;
  availableForSale: boolean;
  featuredImage: {
    url: string;
  };
  review_count: number;
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  title: string;
  description: {
    html: string;
  };
  short_description: {
    html: string;
  };
  stock_status: string;
  configurable_options: [];
  small_image: {
    url: string;
  };
  media_gallery: { url: string }[];
  prices: {
    price: {
      currencyCode: string;
    };
  };
  rating_summary: string;
  reviews: any;
  price_range: {
    maximum_price: {
      final_price: {
        amount: string;
        value: number;
        currency: string;
      };
    };
    minimum_price: {
      regular_price: {
        value: number;
        currency: string;
      };
    };
  };
  url_key: string;
  descriptionHtml: string;
  options: [];
  productData?: any;
  images: {
    url: string;
  }[];
  aggregations: [];
  variants: MagentoProductVariant[];
};
export type MagentoVercelProduct = {
  id: string;
  type: string;
  handle: string;
  name: string;
  plainTextDescription: string;
  short_description: string;
  configurable_options: any;
  small_image?: string;
  media_gallery?: any;
  reviews?: any;
  price_range?: any;
  prices?: any;
  stock_status?: string;
  sku: string;
  url_key: string;
  short_descriptionHtml: string;
  rating_summary: string;
  review_count: number;
  reviewsList?: {
    items: MagentoProductReview[];
  };
  availableForSale: string;
  title: string;
  description: string;
  descriptionHtml: string;
  options: [];
  priceRange: {
    maxVariantPrice: { amount: string; currencyCode: string };
    minVariantPrice: { amount: string; currencyCode: string };
  };
  variants: MagentoProductVariant[];
  featuredImage: Image;
  images: { url: string }[];
  tags?: string[];
  updatedAt?: string;
};

export type MagentoProductVariant = {
  product?: { media_gallery_entries: { url: string; file: string }[] };
  id: number;
  availableForSale: string;
  attributes?: {
    code: string;
    value_index: string;
  }[];
};

export type MagentoProductOption = {
  label: string;
  attribute_id: string;
  values: {
    value_index: string;
    store_label: string;
    label: string;
  }[];
};

export type VercelMagentoMenu = {
  title: string;
  path: string;
  hasChildren: boolean | null;
  children: [
    {
      hasChildren: boolean;
      title: string;
      path: string;
      children: [
        {
          title: string;
          path: string;
          children: [];
        }
      ];
    }
  ];
};
