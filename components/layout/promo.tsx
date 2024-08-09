import { BUILDER_KEY } from 'lib/constants';

import { builder } from '@builder.io/sdk';

import { RenderBuilderContent } from 'components/builderSection/builderComponent';

builder.init(BUILDER_KEY);

export default async function Promo() {
  const promoMessage = await builder
    // Get the page content from Builder with the specified options
    .get('header-promo', {
      options: {
        includeUnpublished: false
      },
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: '/?header-promo'
      },
      // Set prerender to false to prevent infinite rendering loops
      prerender: false
    })
    // Convert the result to a promise
    .toPromise();

  return (
    <div className="flex h-[32px] items-center justify-center bg-lightBlack text-center text-base font-medium text-white">
      <RenderBuilderContent model="header-promo" content={promoMessage} />
    </div>
  );
}
