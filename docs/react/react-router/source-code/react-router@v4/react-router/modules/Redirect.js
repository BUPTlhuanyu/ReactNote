import React from "react";
import PropTypes from "prop-types";
import { createLocation, locationsAreEqual } from "history";
import invariant from "tiny-invariant";

import Lifecycle from "./Lifecycle";
import RouterContext from "./RouterContext";
import generatePath from "./generatePath";

/**
 * The public API for navigating programmatically with a component.
 */
function Redirect({ computedMatch, to, push = false }) {
  return (
    <RouterContext.Consumer>
      {context => {
        invariant(context, "You should not use <Redirect> outside a <Router>");

        const { history, staticContext } = context;

        const method = push ? history.push : history.replace;
        const location = createLocation(
            //当redirect是switch的子组件，则存在computedMatch
          computedMatch  //如果存在computedMatch，根据to的数据类型产生对应的路径。如果不存在则返回to用于产生location
            ? typeof to === "string"  //如果to为字符串类型，结合computedMatch中的parmas产生路径
              ? generatePath(to, computedMatch.params)
              : {
                  ...to,
                  pathname: generatePath(to.pathname, computedMatch.params)
                }
            : to
        );

        // When rendering in a static context,
        // set the new location immediately.
        if (staticContext) {
          method(location);
          return null;
        }

        return (
          <Lifecycle
              //在onMount在Lifecycle组件componentDidMount调用
            onMount={() => {
              method(location);
            }}
              //在onMount在Lifecycle组件componentDidUpdate调用
            onUpdate={(self, prevProps) => {
              if (!locationsAreEqual(prevProps.to, location)) {
                method(location);
              }
            }}
            to={to}
          />
        );
      }}
    </RouterContext.Consumer>
  );
}

if (__DEV__) {
  Redirect.propTypes = {
    push: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
  };
}

export default Redirect;
