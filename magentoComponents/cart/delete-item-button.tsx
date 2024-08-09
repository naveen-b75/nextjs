'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import { getCartProxy, removeFromCartProxy } from 'lib/magento';
import { MagentoCartLineItems, MagentoCartOP } from 'lib/magento/types';
import { useUserContext } from 'lib/userContext';
import { removeItem } from 'magentoComponents/cart/actions';
import LoadingDots from 'magentoComponents/loading-dots';
import { useCallback } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Remove cart item"
      aria-disabled={pending}
      className={clsx(
        'ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
        {
          'cursor-not-allowed px-0': pending
        }
      )}
    >
      {pending ? (
        <LoadingDots className="bg-white" />
      ) : (
        <XMarkIcon className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
      )}
    </button>
  );
}

export function DeleteItemButton({ item }: { item: MagentoCartLineItems }) {
  const { setUpdateCart } = useUserContext();

  const handleSubmit = useCallback(async (prevState: any, lineId: string) => {
    const res = await removeItem(prevState, lineId);
    setUpdateCart(true);
    return res;
  }, []);

  const [message, formAction] = useFormState(handleSubmit, null);
  const itemId = item.id;
  const actionWithVariant = formAction.bind(null, itemId);

  return (
    <form action={actionWithVariant}>
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}

export function DeleteCartItem({
  setLineItems,
  item,
  cartId
}: {
  setLineItems: (value: MagentoCartOP) => void;
  cartId: string;
  item: MagentoCartLineItems;
}) {
  const { setUpdateCart } = useUserContext();
  const deleteItem = useCallback(async () => {
    await removeFromCartProxy(cartId, item.id);
    const cartResponse = await getCartProxy(cartId);
    setLineItems(cartResponse.body);
    setUpdateCart(true);
  }, [item]);

  return (
    <Formik initialValues={{}} onSubmit={deleteItem}>
      <Form>
        <SubmitButton />
      </Form>
    </Formik>
  );
}
