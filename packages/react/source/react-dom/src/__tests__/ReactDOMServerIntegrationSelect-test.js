/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

const ReactDOMServerIntegrationUtils = require('./utils/ReactDOMServerIntegrationTestUtils');

let React;
let ReactDOM;
let ReactDOMServer;

function initModules() {
  // Reset warning cache.
  jest.resetModuleRegistry();
  React = require('react');
  ReactDOM = require('react-dom');
  ReactDOMServer = require('react-dom/server');

  // Make them available to the helpers.
  return {
    ReactDOM,
    ReactDOMServer,
  };
}

const {
  resetModules,
  itRenders,
  itThrowsWhenRendering,
} = ReactDOMServerIntegrationUtils(initModules);

describe('ReactDOMServerIntegrationSelect', () => {
  let options;
  beforeEach(() => {
    resetModules();

    options = [
      <option key={1} value="foo" id="foo">
        Foo
      </option>,
      <option key={2} value="bar" id="bar">
        Bar
      </option>,
      <option key={3} value="baz" id="baz">
        Baz
      </option>,
    ];
  });

  // a helper function to test the selected value of a <select> element.
  // takes in a <select> DOM element (element) and a value or array of
  // values that should be selected (selected).
  const expectSelectValue = (element, selected) => {
    if (!Array.isArray(selected)) {
      selected = [selected];
    }
    // the select DOM element shouldn't ever have a value or defaultValue
    // attribute; that is not how select values are expressed in the DOM.
    expect(element.getAttribute('value')).toBe(null);
    expect(element.getAttribute('defaultValue')).toBe(null);

    ['foo', 'bar', 'baz'].forEach(value => {
      const expectedValue = selected.indexOf(value) !== -1;
      const option = element.querySelector(`#${value}`);
      expect(option.selected).toBe(expectedValue);
    });
  };

  itRenders('a select with a value and an onChange', async render => {
    const e = await render(
      <select value="bar" onChange={() => {}}>
        {options}
      </select>,
    );
    expectSelectValue(e, 'bar');
  });

  itRenders('a select with a value and readOnly', async render => {
    const e = await render(
      <select value="bar" readOnly={true}>
        {options}
      </select>,
    );
    expectSelectValue(e, 'bar');
  });

  itRenders('a select with a multiple values and an onChange', async render => {
    const e = await render(
      <select value={['bar', 'baz']} multiple={true} onChange={() => {}}>
        {options}
      </select>,
    );
    expectSelectValue(e, ['bar', 'baz']);
  });

  itRenders('a select with a multiple values and readOnly', async render => {
    const e = await render(
      <select value={['bar', 'baz']} multiple={true} readOnly={true}>
        {options}
      </select>,
    );
    expectSelectValue(e, ['bar', 'baz']);
  });

  itRenders('a select with a value and no onChange/readOnly', async render => {
    // this configuration should raise a dev warning that value without
    // onChange or readOnly is a mistake.
    const e = await render(<select value="bar">{options}</select>, 1);
    expectSelectValue(e, 'bar');
  });

  itRenders('a select with a defaultValue', async render => {
    const e = await render(<select defaultValue="bar">{options}</select>);
    expectSelectValue(e, 'bar');
  });

  itRenders('a select value overriding defaultValue', async render => {
    const e = await render(
      <select value="bar" defaultValue="baz" readOnly={true}>
        {options}
      </select>,
      1,
    );
    expectSelectValue(e, 'bar');
  });

  itRenders(
    'a select with options that use dangerouslySetInnerHTML',
    async render => {
      const e = await render(
        <select defaultValue="baz" value="bar" readOnly={true}>
          <option
            id="foo"
            value="foo"
            dangerouslySetInnerHTML={{
              __html: 'Foo',
            }}>
            {undefined}
          </option>
          <option
            id="bar"
            value="bar"
            dangerouslySetInnerHTML={{
              __html: 'Bar',
            }}>
            {null}
          </option>
          <option
            id="baz"
            value="baz"
            dangerouslySetInnerHTML={{
              __html: 'Baz',
            }}
          />
        </select>,
        1,
      );
      expectSelectValue(e, 'bar');
    },
  );

  itThrowsWhenRendering(
    'a select with option that uses dangerouslySetInnerHTML and 0 as child',
    async render => {
      await render(
        <select defaultValue="baz" value="foo" readOnly={true}>
          <option
            id="foo"
            value="foo"
            dangerouslySetInnerHTML={{
              __html: 'Foo',
            }}>
            {0}
          </option>
        </select>,
        1,
      );
    },
    'Can only set one of `children` or `props.dangerouslySetInnerHTML`.',
  );

  itThrowsWhenRendering(
    'a select with option that uses dangerouslySetInnerHTML and empty string as child',
    async render => {
      await render(
        <select defaultValue="baz" value="foo" readOnly={true}>
          <option
            id="foo"
            value="foo"
            dangerouslySetInnerHTML={{
              __html: 'Foo',
            }}>
            {''}
          </option>
        </select>,
        1,
      );
    },
    'Can only set one of `children` or `props.dangerouslySetInnerHTML`.',
  );

  itRenders(
    'a select value overriding defaultValue no matter the prop order',
    async render => {
      const e = await render(
        <select defaultValue="baz" value="bar" readOnly={true}>
          {options}
        </select>,
        1,
      );
      expectSelectValue(e, 'bar');
    },
  );

  itRenders('a select option with flattened children', async render => {
    const e = await render(
      <select value="bar" readOnly={true}>
        <option value="bar">A {'B'}</option>
      </select>,
    );
    const option = e.options[0];
    expect(option.childNodes.length).toBe(1);
    expect(option.childNodes[0].nodeType).toBe(3);
    expect(option.childNodes[0].nodeValue).toBe('A B');
  });

  itRenders(
    'a select option with flattened children and a warning',
    async render => {
      const e = await render(
        <select readOnly={true} value="bar">
          <option value="bar">
            {['Bar', false, 'Foo', <div key="1" />, 'Baz']}
          </option>
        </select>,
        1,
      );
      expect(e.getAttribute('value')).toBe(null);
      expect(e.getAttribute('defaultValue')).toBe(null);
      expect(e.firstChild.innerHTML).toBe('BarFoo[object Object]Baz');
      expect(e.firstChild.selected).toBe(true);
    },
  );
});
