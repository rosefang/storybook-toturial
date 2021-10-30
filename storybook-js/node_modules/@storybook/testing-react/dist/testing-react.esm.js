import { defaultDecorateStory, combineParameters } from '@storybook/client-api';
import addons, { mockChannel } from '@storybook/addons';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

addons.setChannel(mockChannel());
var globalStorybookConfig = {};
/** Function that sets the globalConfig of your storybook. The global config is the preview module of your .storybook folder.
 *
 * It should be run a single time, so that your global config (e.g. decorators) is applied to your stories when using `composeStories` or `composeStory`.
 *
 * Example:
 *```jsx
 * // setup.js (for jest)
 * import { setGlobalConfig } from '@storybook/testing-react';
 * import * as globalStorybookConfig from './.storybook/preview';
 *
 * setGlobalConfig(globalStorybookConfig);
 *```
 *
 * @param config - e.g. (import * as globalConfig from '../.storybook/preview')
 */

function setGlobalConfig(config) {
  globalStorybookConfig = config;
}
/**
 * Function that will receive a story along with meta (e.g. a default export from a .stories file)
 * and optionally a globalConfig e.g. (import * from '../.storybook/preview)
 * and will return a composed component that has all args/parameters/decorators/etc combined and applied to it.
 *
 *
 * It's very useful for reusing a story in scenarios outside of Storybook like unit testing.
 *
 * Example:
 *```jsx
 * import { render } from '@testing-library/react';
 * import { composeStory } from '@storybook/testing-react';
 * import Meta, { Primary as PrimaryStory } from './Button.stories';
 *
 * const Primary = composeStory(PrimaryStory, Meta);
 *
 * test('renders primary button with Hello World', () => {
 *   const { getByText } = render(<Primary>Hello world</Primary>);
 *   expect(getByText(/Hello world/i)).not.toBeNull();
 * });
 *```
 *
 * @param story
 * @param meta - e.g. (import Meta from './Button.stories')
 * @param [globalConfig] - e.g. (import * as globalConfig from '../.storybook/preview') this can be applied automatically if you use `setGlobalConfig` in your setup files.
 */

function composeStory(story, meta, globalConfig) {
  var _globalConfig;

  if (globalConfig === void 0) {
    globalConfig = globalStorybookConfig;
  }

  if (typeof story !== 'function') {
    throw new Error("Cannot compose story due to invalid format. @storybook/testing-react expected a function but received " + typeof story + " instead.");
  }

  if (story.story !== undefined) {
    throw new Error("StoryFn.story object-style annotation is not supported. @storybook/testing-react expects hoisted CSF stories.\n       https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#hoisted-csf-annotations");
  }

  var finalStoryFn = function finalStoryFn(context) {
    var _context$parameters$p = context.parameters.passArgsFirst,
        passArgsFirst = _context$parameters$p === void 0 ? true : _context$parameters$p;

    if (!passArgsFirst) {
      throw new Error('composeStory does not support legacy style stories (with passArgsFirst = false).');
    }

    return story(context.args, context);
  };

  var combinedDecorators = [].concat(story.decorators || [], (meta == null ? void 0 : meta.decorators) || [], ((_globalConfig = globalConfig) == null ? void 0 : _globalConfig.decorators) || []);
  var decorated = defaultDecorateStory(finalStoryFn, combinedDecorators);
  var defaultGlobals = Object.entries(globalConfig.globalTypes || {}).reduce(function (acc, _ref) {
    var arg = _ref[0],
        defaultValue = _ref[1].defaultValue;

    if (defaultValue) {
      acc[arg] = defaultValue;
    }

    return acc;
  }, {});
  var combinedParameters = combineParameters(globalConfig.parameters || {}, meta.parameters || {}, story.parameters || {});

  var combinedArgs = _extends({}, meta.args, story.args);

  var composedStory = function composedStory(extraArgs) {
    var config = {
      id: '',
      kind: '',
      name: '',
      argTypes: globalConfig.argTypes || {},
      globals: defaultGlobals,
      parameters: combinedParameters,
      args: _extends({}, combinedArgs, extraArgs)
    };
    return decorated(config);
  };

  composedStory.args = combinedArgs;
  composedStory.decorators = combinedDecorators;
  composedStory.parameters = combinedParameters;
  return composedStory;
}
/**
 * Function that will receive a stories import (e.g. `import * as stories from './Button.stories'`)
 * and optionally a globalConfig (e.g. `import * from '../.storybook/preview`)
 * and will return an object containing all the stories passed, but now as a composed component that has all args/parameters/decorators/etc combined and applied to it.
 *
 *
 * It's very useful for reusing stories in scenarios outside of Storybook like unit testing.
 *
 * Example:
 *```jsx
 * import { render } from '@testing-library/react';
 * import { composeStories } from '@storybook/testing-react';
 * import * as stories from './Button.stories';
 *
 * const { Primary, Secondary } = composeStories(stories);
 *
 * test('renders primary button with Hello World', () => {
 *   const { getByText } = render(<Primary>Hello world</Primary>);
 *   expect(getByText(/Hello world/i)).not.toBeNull();
 * });
 *```
 *
 * @param storiesImport - e.g. (import * as stories from './Button.stories')
 * @param [globalConfig] - e.g. (import * as globalConfig from '../.storybook/preview') this can be applied automatically if you use `setGlobalConfig` in your setup files.
 */

function composeStories(storiesImport, globalConfig) {
  var meta = storiesImport["default"],
      stories = _objectWithoutPropertiesLoose(storiesImport, ["default", "__esModule"]); // Compose an object containing all processed stories passed as parameters


  var composedStories = Object.entries(stories).reduce(function (storiesMap, _ref2) {
    var key = _ref2[0],
        story = _ref2[1];
    storiesMap[key] = composeStory(story, meta, globalConfig);
    return storiesMap;
  }, {});
  return composedStories;
}

export { composeStories, composeStory, setGlobalConfig };
//# sourceMappingURL=testing-react.esm.js.map
