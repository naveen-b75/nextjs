import { builder } from '@builder.io/sdk';
import { Carousel } from 'bigCommerceComponents/carousel';
import { ThreeItemGrid } from 'bigCommerceComponents/grid/three-items';
import { RenderBuilderContent } from 'components/builder';
import { default as MagentoFooter } from 'magentoComponents/layout/footer';
import { Suspense } from 'react';

declare var process: {
  env: {
    BUILDER_PUBLIC_KEY: string;
    PLATFORM_TYPE: string;
    ECOMMERCE_PLATFORM: string;
  };
};
builder.init(process.env.BUILDER_PUBLIC_KEY);

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and BigCommerce.',
  openGraph: {
    type: 'website'
  }
};
const platformType = process.env.ECOMMERCE_PLATFORM;

export default async function HomePage() {
  //let homePageContent;
  //const identifier = 'home';
  //homePageContent = await getHomePageHtml(identifier);
  const content = await builder
    // Get the page content from Builder with the specified options
    .get('page', {
      options: {
        includeUnpublished: true
      },
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: '/'
      },
      // Set prerender to false to return JSON instead of HTML
      prerender: false
    })
    // Convert the result to a promise
    .toPromise();

  if (platformType?.toLocaleLowerCase() === 'magento') {
    <>
      {/* <div
        className="mx-auto min-h-screen w-full max-w-screen-2xl p-4"
        dangerouslySetInnerHTML={{ __html: homePageContent?.data?.cmsPage?.content }}
      /> */}
      <RenderBuilderContent content={content} model="page" />
      <Suspense>
        <MagentoFooter />
      </Suspense>
    </>;
  } else if (platformType?.toLocaleLowerCase() === 'bigcommerce') {
    <>
      <RenderBuilderContent content={content} model="page" />
      <ThreeItemGrid />
      <Suspense>
        <Carousel />
      </Suspense>
    </>;
  }

  return (
    <>
      {/* <div
        className="mx-auto min-h-screen w-full max-w-screen-2xl p-4"
        dangerouslySetInnerHTML={{ __html: homePageContent?.data?.cmsPage?.content }}
      /> */}
      <RenderBuilderContent content={content} model="page" />
    </>
  );
}
