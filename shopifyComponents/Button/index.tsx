import clsx from 'clsx';

interface ButtonProps {
  id?: string | undefined;
  type: 'submit' | 'reset' | 'button';
  classes?: {
    root?: string;
    content?: string;
  };
  priority: 'primary' | 'secondary' | 'tertiary' | 'default';
  disabled: boolean;
  size: 'small' | 'medium' | 'large';
  onClick?: (() => void) | ((e: any) => void);
}

const Button = (props: React.PropsWithChildren<ButtonProps>) => {
  const { type, classes, priority, size, ...restProps } = props;

  const priorityButton = {
    primary: 'bg-orange hover:bg-orangeDark',
    secondary: 'border border border border border-black',
    tertiary: 'bg-teal hover:bg-tealDark',
    default: ''
  };

  const sizeButton = {
    small: 'px-6 py-[9px]',
    medium: 'px-8 py-3',
    large: 'px-8 py-[18px]'
  };

  const priorityContent = {
    primary: 'text-white',
    secondary: 'text-black',
    tertiary: 'text-white',
    default: ''
  };

  const sizeContent = {
    small: 'text-[13px]',
    medium: 'text-[14px]',
    large: 'text-[16px]'
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2.5 rounded-md duration-200',
        priorityButton[priority],
        sizeButton[size],
        classes?.root ? classes.root : ''
      )}
      type={type}
      {...restProps}
    >
      <span
        className={clsx(
          'text-center font-bold',
          priorityContent[priority],
          sizeContent[size],
          classes?.content ? classes.content : ''
        )}
      >
        {restProps.children}
      </span>
    </button>
  );
};

export default Button;
