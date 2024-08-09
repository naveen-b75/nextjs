'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import { getCartProxy, updateCartProxy } from 'lib/magento';
import { MagentoCartLineItems, MagentoCartOP } from 'lib/magento/types';
import { useUserContext } from 'lib/userContext';
import { updateItemQuantity } from 'magentoComponents/cart/actions';
import LoadingDots from 'magentoComponents/loading-dots';
import { useCallback } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({ type, disabled }: { type: 'plus' | 'minus'; disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      aria-disabled={pending}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'cursor-not-allowed': pending,
          'ml-auto': type === 'minus'
        }
      )}
    >
      {pending ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : type === 'plus' ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  setLineItems
}: {
  item: MagentoCartLineItems;
  type: 'plus' | 'minus';
  setLineItems?: (value: MagentoCartOP) => void;
}) {
  const { setUpdateCart } = useUserContext();

  const handleSubmit = useCallback(
    async (
      prevState: any,
      payload: {
        lineId: string;
        productSlug: string;
        variantId: string;
        quantity: number;
      }
    ) => {
      const res = await updateItemQuantity(prevState, payload);
      setUpdateCart(true);
      return res;
    },
    []
  );
  const [message, formAction] = useFormState(handleSubmit, null);
  const payload = {
    lineId: item.id,
    productSlug: item.merchandise.product.handle,
    variantId: item.merchandise.id,
    quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
  };
  const actionWithVariant = formAction.bind(null, payload);

  return (
    <form action={actionWithVariant}>
      <SubmitButton type={type} disabled={type === 'minus' && item.quantity === 1} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}

export function UpdateCartQuantity({
  item,
  type,
  setLineItems,
  cartId
}: {
  item: MagentoCartLineItems;
  type: 'plus' | 'minus';
  cartId: string;
  setLineItems: (value: MagentoCartOP) => void;
}) {
  const { setUpdateCart } = useUserContext();
  const actionWithVariant = useCallback(async () => {
    const payload = {
      lineId: item.id,
      productSlug: item.merchandise.product.handle,
      variantId: item.merchandise.id,
      quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
    };
    await updateCartProxy(cartId, [
      {
        cart_item_uid: payload.lineId,
        quantity: payload.quantity
      }
    ]);
    const cartResponse = await getCartProxy(cartId);
    setUpdateCart(true);
    setLineItems(cartResponse.body);
  }, [item, cartId, type]);
  return (
    <Formik initialValues={{}} onSubmit={actionWithVariant}>
      <Form>
        <SubmitButton type={type} disabled={type === 'minus' && item.quantity === 1} />
      </Form>
    </Formik>
  );
}
