/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');

describe('CSSPropertyOperations', () => {
  it('should automatically append `px` to relevant styles', () => {
    const styles = {
      left: 0,
      margin: 16,
      opacity: 0.5,
      padding: '4px',
    };
    const div = <div style={styles} />;
    const html = ReactDOMServer.renderToString(div);
    expect(html).toContain('"left:0;margin:16px;opacity:0.5;padding:4px"');
  });

  it('should trim values', () => {
    const styles = {
      left: '16 ',
      opacity: 0.5,
      right: ' 4 ',
    };
    const div = <div style={styles} />;
    const html = ReactDOMServer.renderToString(div);
    expect(html).toContain('"left:16;opacity:0.5;right:4"');
  });

  it('should not append `px` to styles that might need a number', () => {
    const styles = {
      flex: 0,
      opacity: 0.5,
    };
    const div = <div style={styles} />;
    const html = ReactDOMServer.renderToString(div);
    expect(html).toContain('"flex:0;opacity:0.5"');
  });

  it('should create vendor-prefixed markup correctly', () => {
    const styles = {
      msTransition: 'none',
      MozTransition: 'none',
    };
    const div = <div style={styles} />;
    const html = ReactDOMServer.renderToString(div);
    expect(html).toContain('"-ms-transition:none;-moz-transition:none"');
  });

  it('should set style attribute when styles exist', () => {
    const styles = {
      backgroundColor: '#000',
      display: 'none',
    };
    let div = <div style={styles} />;
    const root = document.createElement('div');
    div = ReactDOM.render(div, root);
    expect(/style=".*"/.test(root.innerHTML)).toBe(true);
  });

  it('should not set style attribute when no styles exist', () => {
    const styles = {
      backgroundColor: null,
      display: null,
    };
    const div = <div style={styles} />;
    const html = ReactDOMServer.renderToString(div);
    expect(/style=/.test(html)).toBe(false);
  });

  it('should warn when using hyphenated style names', () => {
    class Comp extends React.Component {
      static displayName = 'Comp';

      render() {
        return <div style={{'background-color': 'crimson'}} />;
      }
    }

    const root = document.createElement('div');

    expect(() => ReactDOM.render(<Comp />, root)).toWarnDev(
      'Warning: Unsupported style property background-color. Did you mean backgroundColor?' +
        '\n    in div (at **)' +
        '\n    in Comp (at **)',
    );
  });

  it('should warn when updating hyphenated style names', () => {
    class Comp extends React.Component {
      static displayName = 'Comp';

      render() {
        return <div style={this.props.style} />;
      }
    }

    const styles = {
      '-ms-transform': 'translate3d(0, 0, 0)',
      '-webkit-transform': 'translate3d(0, 0, 0)',
    };
    const root = document.createElement('div');
    ReactDOM.render(<Comp />, root);

    expect(() => ReactDOM.render(<Comp style={styles} />, root)).toWarnDev([
      'Warning: Unsupported style property -ms-transform. Did you mean msTransform?' +
        '\n    in div (at **)' +
        '\n    in Comp (at **)',
      'Warning: Unsupported style property -webkit-transform. Did you mean WebkitTransform?' +
        '\n    in div (at **)' +
        '\n    in Comp (at **)',
    ]);
  });

  it('warns when miscapitalizing vendored style names', () => {
    class Comp extends React.Component {
      static displayName = 'Comp';

      render() {
        return (
          <div
            style={{
              msTransform: 'translate3d(0, 0, 0)',
              oTransform: 'translate3d(0, 0, 0)',
              webkitTransform: 'translate3d(0, 0, 0)',
            }}
          />
        );
      }
    }

    const root = document.createElement('div');

    expect(() => ReactDOM.render(<Comp />, root)).toWarnDev([
      // msTransform is correct already and shouldn't warn
      'Warning: Unsupported vendor-prefixed style property oTransform. ' +
        'Did you mean OTransform?' +
        '\n    in div (at **)' +
        '\n    in Comp (at **)',
      'Warning: Unsupported vendor-prefixed style property webkitTransform. ' +
        'Did you mean WebkitTransform?' +
        '\n    in div (at **)' +
        '\n    in Comp (at **)',
    ]);
  });

  it('should warn about style having a trailing semicolon', () => {
    class Comp extends React.Component {
      static displayName = 'Comp';

      render() {
        return (
          <div
            style={{
              fontFamily: 'Helvetica, arial',
              backgroundImage: 'url(foo;bar)',
              backgroundColor: 'blue;',
              color: 'red;   ',
            }}
          />
        );
      }
    }

    const root = document.createElement('div');

    expect(() => ReactDOM.render(<Comp />, root)).toWarnDev([
      "Warning: Style property values shouldn't contain a semicolon. " +
        'Try "backgroundColor: blue" instead.' +
        '\n    in div (at **)' +
        '\n    in Comp (at **)',
      "Warning: Style property values shouldn't contain a semicolon. " +
        'Try "color: red" instead.' +
        '\n    in div (at **)' +
        '\n    in Comp (at **)',
    ]);
  });

  it('should warn about style containing a NaN value', () => {
    class Comp extends React.Component {
      static displayName = 'Comp';

      render() {
        return <div style={{fontSize: NaN}} />;
      }
    }

    const root = document.createElement('div');

    expect(() => ReactDOM.render(<Comp />, root)).toWarnDev(
      'Warning: `NaN` is an invalid value for the `fontSize` css style property.' +
        '\n    in div (at **)' +
        '\n    in Comp (at **)',
    );
  });

  it('should not warn when setting CSS custom properties', () => {
    class Comp extends React.Component {
      render() {
        return <div style={{'--foo-primary': 'red', backgroundColor: 'red'}} />;
      }
    }

    const root = document.createElement('div');
    ReactDOM.render(<Comp />, root);
  });

  it('should warn about style containing a Infinity value', () => {
    class Comp extends React.Component {
      static displayName = 'Comp';

      render() {
        return <div style={{fontSize: 1 / 0}} />;
      }
    }

    const root = document.createElement('div');

    expect(() => ReactDOM.render(<Comp />, root)).toWarnDev(
      'Warning: `Infinity` is an invalid value for the `fontSize` css style property.' +
        '\n    in div (at **)' +
        '\n    in Comp (at **)',
    );
  });

  it('should not add units to CSS custom properties', () => {
    class Comp extends React.Component {
      render() {
        return <div style={{'--foo': 5}} />;
      }
    }

    const root = document.createElement('div');
    ReactDOM.render(<Comp />, root);

    expect(root.children[0].style.Foo).toEqual('5');
  });
});
