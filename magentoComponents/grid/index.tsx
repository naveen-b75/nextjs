import clsx from 'clsx';

function Grid(props: React.ComponentProps<'ul'>) {
  return (
    <ul {...props} className={clsx('grid grid-flow-row gap-4', props.className)}>
      {props.children}
    </ul>
  );
}

function GridItem(props: React.ComponentProps<'li'>) {
  return (
    <li
      {...props}
      className={clsx(
        'aspect-square rounded-lg border-[1px] border-neutral-200 p-[15px] transition-opacity',
        props.className
      )}
    >
      {props.children}
    </li>
  );
}

Grid.Item = GridItem;

export default Grid;
