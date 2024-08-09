'use client';
// import { StoryblokComponent, useStoryblokState } from '@storyblok/react';
import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
// import { BuilderContent } from "@builder.io/sdk";

interface RunViewProps {
  storyData: {};
}

export function View(props: React.PropsWithChildren<RunViewProps>) {
  const { storyData } = props;

  const isPreviewing = useIsPreviewing();

  //   const story = useStoryblokState(storyData);

  return (
    <>{storyData ? <BuilderComponent model="page" content={storyData || undefined} /> : null}</>
  );
}
