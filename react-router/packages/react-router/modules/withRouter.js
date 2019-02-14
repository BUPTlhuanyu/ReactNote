import React from "react";
import PropTypes from "prop-types";
//用于将被包裹组件的非react静态方法复制到高阶组件产生的组件上
// hoistNonReactStatic(Enhance, WrappedComponent);
//Enhance:高阶组件产生的增强组件，WrappedComponent:传入高阶组件中的被包裹组件
import hoistStatics from "hoist-non-react-statics";

import Route from "./Route";

/**
 * A public higher-order component to access the imperative API
 */
function withRouter(Component) {
  const C = props => {
    const { wrappedComponentRef, ...remainingProps } = props;

    return (
      <Route
        children={routeComponentProps => (
          <Component
            {...remainingProps}
            {...routeComponentProps}
            ref={wrappedComponentRef}
          />
        )}
      />
    );
  };

  C.displayName = `withRouter(${Component.displayName || Component.name})`;
  C.WrappedComponent = Component;

  if (__DEV__) {
    C.propTypes = {
      wrappedComponentRef: PropTypes.func
    };
  }

  return hoistStatics(C, Component);
}

export default withRouter;
