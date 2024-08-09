'use client';
import { MagentoCartOP } from 'lib/magento/types';
import Price from '../price';

export function TotalSummary({ cartData }: { cartData: MagentoCartOP }) {
  return (
    <>
      <div className="total-summary">
        <strong className="mb-2 block">Order Summary</strong>
        {cartData.cost.subtotalAmount.amount ? (
          <div className="subtotal-section mb-1 flex items-center justify-between pb-1 pt-1 text-sm dark:border-neutral-700">
            <p>Sub Total</p>
            <Price
              className="text-base text-sm text-black dark:text-white"
              amount={cartData.cost.subtotalAmount.amount}
              currencyCode={cartData.cost.subtotalAmount.currencyCode || 'USD'}
            />
          </div>
        ) : (
          ''
        )}

        {cartData?.cost?.discountAmout?.amount ? (
          <div className="shipping-section mb-1 flex items-center justify-between pb-1 pt-1 text-sm dark:border-neutral-700">
            <p>{cartData.cost.discountAmout.label ? cartData.cost.discountAmout.label : ''}</p>{' '}
            <Price
              className="text-base text-sm text-black dark:text-white"
              amount={cartData.cost.discountAmout.amount.toString()}
              currencyCode={cartData.cost.discountAmout.currencyCode || 'USD'}
            />{' '}
          </div>
        ) : (
          ''
        )}

        {cartData?.cost?.selected_shipping_method?.amount ? (
          <div className="shipping-section mb-1 flex items-center justify-between pb-1 pt-1 text-sm dark:border-neutral-700">
            <p>Shipping</p>{' '}
            <Price
              className="text-base text-sm text-black dark:text-white"
              amount={cartData.cost.selected_shipping_method.amount.toString()}
              currencyCode={cartData.cost.selected_shipping_method.currencyCode || 'USD'}
            />{' '}
          </div>
        ) : (
          ''
        )}

        {cartData.cost.totalTaxAmount.amount ? (
          <div className="tax-section mb-1 flex items-center justify-between pb-1 text-sm dark:border-neutral-700">
            <p>Taxes</p>
            <Price
              className="text-right text-base text-sm text-black dark:text-white"
              amount={cartData.cost.totalTaxAmount.amount}
              currencyCode={cartData.cost.totalTaxAmount.currencyCode || 'USD'}
            />{' '}
          </div>
        ) : (
          ''
        )}
        {cartData.cost.totalAmount.amount ? (
          <div className="grandtotal-section mb-3 mt-2 flex items-center justify-between border-b border-neutral-200 pb-2 text-sm dark:border-neutral-700">
            <p>Order Total</p>
            <Price
              className="text-right text-base text-sm text-black dark:text-white"
              amount={cartData.cost.totalAmount.amount}
              currencyCode={cartData.cost.totalAmount.currencyCode || 'USD'}
            />{' '}
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
