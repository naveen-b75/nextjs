import FilterList from 'components/layout/search/filter';
import { sorting } from 'lib/constants';

import { default as MagentoFilterList } from 'magentoComponents/layout/search/filter';
import { Suspense } from 'react';
const platformType = process.env.ECOMMERCE_PLATFORM;

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  if (platformType?.toLocaleLowerCase() === 'magento') {
    return (
      <Suspense>
        <div className="mx-auto flex max-w-screen-2xl flex-col flex-wrap px-4 pb-4 text-black md:flex-row dark:text-white">
          {/*<div className="order-first w-full flex-none md:max-w-[125px]">
            <Collections />
          </div>*/}
          <div className="order-last min-h-screen w-full">{children}</div>
          <div className="order-none mb-[-20px] mt-8 flex shrink-0 grow-0 basis-full justify-end">
            <MagentoFilterList list={sorting} title="Sort by" />
          </div>
        </div>
      </Suspense>
    );
  }

  if (platformType?.toLocaleLowerCase() === 'bigcommerce') {
    return (
      <Suspense>
        <div className="mx-auto flex max-w-screen-2xl flex-col flex-wrap px-4 pb-4 text-black md:flex-row dark:text-white">
          {/*<div className="order-first w-full flex-none md:max-w-[125px]">
            <Collections />
          </div>*/}
          <div className="order-last min-h-screen w-full">{children}</div>
        </div>
      </Suspense>
    );
  }
  return (
    <Suspense>
      <div className="mx-auto flex max-w-screen-2xl flex-col flex-wrap px-4 pb-4 text-black md:flex-row dark:text-white">
        {/*<div className="order-first w-full flex-none md:max-w-[125px]">
          <Collections />
        </div>*/}
        <div className="order-last min-h-screen w-full">{children}</div>
        <div className="order-none mb-[-20px] mt-8 flex shrink-0 grow-0 basis-full justify-end">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
    </Suspense>
  );
}
