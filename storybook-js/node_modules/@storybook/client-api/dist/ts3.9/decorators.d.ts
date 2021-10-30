import { StoryContext, LegacyStoryFn } from '@storybook/addons';
import { DecoratorFunction } from './types';
export declare const decorateStory: (storyFn: LegacyStoryFn, decorator: DecoratorFunction, getStoryContext: () => StoryContext) => LegacyStoryFn;
export declare const defaultDecorateStory: (storyFn: LegacyStoryFn, decorators: DecoratorFunction[]) => LegacyStoryFn;
