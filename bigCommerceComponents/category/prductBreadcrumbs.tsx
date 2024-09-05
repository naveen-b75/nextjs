import Link from 'next/link';

export default function Breadcrumbs({
  collection,
  productName
}: {
  collection: Array<{ name: string; path: string }>;
  productName: string;
}) {
  return (
    <div className="mb-[30px] mt-[20px] hidden md:block">
      <ul className="flex items-center [&>*:last-child]:pointer-events-none [&>*:last-child]:cursor-default [&>*:last-child]:text-[12px] [&>*:last-child]:text-lightGrey">
        <li className="flex items-center">
          <Link className="text-[12px] text-mediumGray" href={'/'}>
            Home
          </Link>
          <svg
            className="mx-[10px]"
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="10"
            viewBox="0 0 7 10"
            fill="none"
          >
            <path d="M1 0.5L5.5 5L1 9.5" stroke="#636569" />
          </svg>
        </li>
        {collection?.map((breadcrumb, index) => (
          <li className="flex items-center text-[12px] text-mediumGray" key={index}>
            <Link className="flex items-center" href={breadcrumb.path}>
              {breadcrumb.name}
            </Link>
            <svg
              className="mx-[10px]"
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="10"
              viewBox="0 0 7 10"
              fill="none"
            >
              \n' + ' <path d="M1 0.5L5.5 5L1 9.5" stroke="#636569" />
              \n' + '
            </svg>
          </li>
        ))}
        <li>{productName}</li>
      </ul>
    </div>
  );
}
