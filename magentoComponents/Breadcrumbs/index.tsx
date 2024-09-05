'use client';

import Link from 'next/link';
import { Fragment, useMemo } from 'react';

export default function Breadcrumbs({
  currentCategoryPath,
  currentCategory,
  breadcrumb,
  productName
}: {
  currentCategoryPath: string;
  currentCategory: string;
  productName?: string;
  breadcrumb?: {
    category: {
      id: number;
      name: string;
      url_path: string;
      breadcrumbs: {
        category_id: number;
        category_level: number;
        category_name: string;
        category_url_path: string;
      }[];
    };
  };
}) {
    console.log(breadcrumb)
  const sortCrumbs = (
    a: { category_level: number; text: string; path: string },
    b: { category_level: number; text: string; path: string }
  ) => a.category_level - b.category_level;

  const normalizedData = useMemo(() => {
    if (breadcrumb) {
      const breadcrumbData = breadcrumb?.category.breadcrumbs;
      return (
        breadcrumbData &&
        breadcrumbData
          .map((category) => ({
            category_level: category.category_level,
            text: category.category_name,
            path: category.category_url_path.startsWith('/')
              ? category.category_url_path.slice(1)
              : category.category_url_path
          }))
          .sort(sortCrumbs)
      );
    }
  }, [breadcrumb]);

  const links = useMemo(() => {
    return normalizedData?.map(({ text, path }) => {
      return (
        <Fragment key={text}>
          <span> {'>'} </span>
          <Link href={`/search/${path}.html`}>{text}</Link>
        </Fragment>
      );
    });
  }, [normalizedData]);
  const currentCategoryLink = productName ? (
    <Link href={`/search/${currentCategoryPath}.html`}>{currentCategory}</Link>
  ) : (
    <span>{currentCategory}</span>
  );
  const currentProductNode = productName ? (
    <Fragment>
      <span> {'>'} </span>
      <span>{productName}</span>
    </Fragment>
  ) : null;
  return (
    <div>
      <Link href={'/'}>Home</Link>
      {links}
      <span> {'>'} </span>
      {currentCategoryLink}
      {currentProductNode}
    </div>
  );
}
