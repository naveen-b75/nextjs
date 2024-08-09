import { builder } from '@builder.io/sdk';

import { BUILDER_KEY } from 'lib/constants';
import { useEffect, useState } from 'react';
import { RenderBuilderContent } from './builderComponent';

builder.init(BUILDER_KEY);

export default function CustomBuilderSection(props: { modal: string; path: string }) {
  const [navigationContent, setNavigationContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const modal = props.modal || 'blocks';
        const path = props.path || '/?footer';
        const content = await builder
          .get(modal, {
            userAttributes: {
              urlPath: path
            },
            prerender: false
          })
          .toPromise();
        setNavigationContent(content);
      } catch (error) {
        console.error('Error fetching content from Builder:', error);
      }
    };

    fetchContent();
  }, [props.modal, props.path]);

  if (!navigationContent) {
    return <div className="loader"></div>; // or any other loading indicator
  }

  return <RenderBuilderContent model={props.modal} content={navigationContent} />;
}
