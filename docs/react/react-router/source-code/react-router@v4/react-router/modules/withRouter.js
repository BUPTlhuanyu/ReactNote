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
  //C为由高阶组件withRouter产生的包裹组件，该包裹组件C为纯函数
  const C = props => {
    //remainingProps为除wrappedComponentRef之外的props数据
    const { wrappedComponentRef, ...remainingProps } = props;

    return (
      <Route
          //routeComponentProps:Route组件上props = { ...context, location, match }
        children={routeComponentProps => (
          <Component
            {...remainingProps}
            {...routeComponentProps}
            //利用回调ref将被包裹组件wrappedComponent的ref引用提供给其他组件使用。
              // React 将在组件挂载时将 DOM 元素传入ref 回调函数并调用，当卸载时传入 null 并调用它。
              // 在componentDidMout 和 componentDidUpdate 触发之前，Refs 保证是最新的。
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
