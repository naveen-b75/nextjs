import clsx from 'clsx';
import Price from './price';

const Label = ({
  title,
  amount,
  currencyCode,
  position = 'bottom'
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: 'bottom' | 'center';
}) => {
  return (
    <div
      className={clsx('w-full', {
        'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="text-md mt-[20px] text-center font-semibold text-black dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="text-md line-clamp-2 flex-grow leading-none tracking-tight">{title}</h3>
        <Price
          className="mt-[10px] flex-none"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  );
};

export default Label;
