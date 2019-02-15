### Redirect原理 ###
组件中核心函数为上节介绍的generatePath以及history库的createLocation函数，该函数的作用是根据pathname生成一个location对象，结合Redirect源码给出props中to为不同类型时的例子：

#### to为字符串 ####
参看[项目](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/src/app/App.tsx)中的一个例子：

          <Switch>
              {/*配置默认路由*/}
              <Route
                  exact
                  path="/"
                  render={() => <Redirect to="/recommend" />}
              />
              <Route path="/recommend" component={Recommend}/>
              <Route path="/rank" component={Rank}/>
              <Route path="/search" component={Search}/>
              <Route path="/singer" component={Singer}/>
          </Switch>

此例中computedMatch为null，当to为字符串的时候，并且push不存在，因此执行history.replace替换location，源码中对应的location产生代码为：

	const location = createLocation(to)
结果为

	{
	        hash: "",
	        pathname: "/recommend",
	        search: "",
	        state: undefined
	}

#### to为对象 ####

		let to={
		    pathname: "/login",
		    search: "?utm=your+face",
		    state: { "a":1}
		}
		const location = createLocation(to)
		
返回结果为：

		{
		    hash:""
		    pathname:"/login"
		    search:"?utm=your+face"
		    state:{
		        a:1
		    }
		}




### 源码 ###

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