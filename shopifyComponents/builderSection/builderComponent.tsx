// components/builder.tsx
'use client';
// Import BuilderComponent and useIsPreviewing hooks from React
// and DefaultErrorPage from Next
import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import { builder } from '@builder.io/sdk';
import '@builder.io/widgets';
import { BUILDER_KEY } from 'lib/constants';
import './config';

builder.init(BUILDER_KEY);

interface BuilderPageProps {
  content: any;
  model: string;
}

export function RenderBuilderContent({ content, model }: BuilderPageProps) {
  // Call the useIsPreviewing hook to determine if
  // the page is being previewed in Builder
  const isPreviewing = useIsPreviewing();
  // If `content` has a value or the page is being previewed in Builder,
  // render the BuilderComponent with the specified content and model props.
  if (content || isPreviewing) {
    return <BuilderComponent content={content} model={model} />;
  }
  return null;
}
