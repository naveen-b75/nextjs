'use client';
import { removeCouponToCartProxy, setCouponToCartProxy } from 'lib/magento';
import { MagentoCartOP } from 'lib/magento/types';
import { useRouter } from 'next/navigation';

export function CouponCode({ cartData }: { cartData: MagentoCartOP }) {
  const router = useRouter();
  const handleSubmit = async (event: React.FocusEvent<HTMLFormElement>) => {
    let aftersetcoupon;
    event.preventDefault();
    var formData = new FormData(event?.target!);
    const form_values = Object.fromEntries(formData);
    const CartId = cartData.id;
    if (form_values?.couponCode) {
      aftersetcoupon = await setCouponToCartProxy(CartId, `${form_values?.couponCode}`);
    }
    const params = new URLSearchParams(window.location.search);
    router.push(`${window.location.pathname}?${params.toString()}`, undefined);
    router.refresh();
  };

  const handleRemoveClick = async () => {
    let removeCoupon;
    const CartId = cartData.id;
    if (
      cartData?.cost?.discountAmout?.appliedCouponCode &&
      cartData?.cost?.discountAmout?.appliedCouponCode?.length > 0
    ) {
      removeCoupon = await removeCouponToCartProxy(CartId);
    }
    const params = new URLSearchParams(window.location.search);
    router.push(`${window.location.pathname}?${params.toString()}`, undefined);
    router.refresh();
  };
  return (
    <>
      <div className="coupon-summary mt-8">
        <form
          onSubmit={handleSubmit}
          data-cy="CouponCode-form"
          className="couponCode-entryForm-a6A gap-x-sm grid-cols-autoLast grid"
        >
          <div className="field-root-fSe text-colorDefault grid content-start">
            <label
              className="field-label-zVe text-colorDefault flex items-center justify-between px-0.5 py-2.5 font-bold leading-none"
              htmlFor="couponCode"
            >
              Coupon Code
            </label>
            <div className="flex">
              <span className="fieldIcons-root-iHE h-[2.5rem] grid-flow-col">
                <span className="fieldIcons-input-8z9 flex items-center">
                  {cartData.cost?.discountAmout?.appliedCouponCode ? (
                    cartData.cost.discountAmout?.appliedCouponCode
                  ) : (
                    <input
                      type="text"
                      required
                      data-cy="CouponCode-couponCode"
                      placeholder="Enter code"
                      className="h-[34px] w-[250px] border bg-white p-2 text-sm !outline-none !ring-0 !ring-offset-0 md:w-[300px]"
                      id="couponCode"
                      name="couponCode"
                    />
                  )}
                </span>
                <span className="fieldIcons-before-tPg z-foreground pointer-events-none mx-0.5 my-0 flex w-[2.5rem] items-center justify-center">
                  {' '}
                </span>
                <span
                  className="fieldIcons-after-BeR z-foreground pointer-events-none mx-0.5 my-0 flex w-[2.5rem] items-center justify-center"
                  aria-hidden="false"
                >
                  {' '}
                </span>
                <p className="message-root-6k6 text-colorDefault text-sm font-normal leading-none">
                  {' '}
                </p>{' '}
              </span>
              <div className="field-root-fSe text-colorDefault content-start">
                {cartData?.cost?.discountAmout?.appliedCouponCode ? (
                  <a className="remove-coupon" onClick={handleRemoveClick}>
                    Remove
                  </a>
                ) : (
                  <button
                    className="inline h-[34px] bg-lightBlack p-1 px-3 text-center font-medium text-white opacity-90 hover:opacity-100"
                    type="submit"
                    data-cy="CouponCode-submit"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
