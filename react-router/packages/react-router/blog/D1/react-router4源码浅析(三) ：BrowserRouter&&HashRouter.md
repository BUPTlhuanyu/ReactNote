## BrowserRouter ##

react-router-dom中的BrowserRouter关键代码:

	import { Router } from "react-router";
	import { createBrowserHistory as createHistory } from "history";
	
	class BrowserRouter extends React.Component {
	  history = createHistory(this.props);
	
	  render() {
	    return <Router history={this.history} children={this.props.children} />;
	  }
	}

对Router进行的封装，将createHistory(this.props)以及BrowserRouter组件包裹的Children作为Router组件props中的history以及children。

## HashRouter ##

react-router-dom中的HashRouter关键代码:

	import { Router } from "react-router";
	import { createHashHistory as createHistory } from "history";
	
	class HashRouter extends React.Component {
	  history = createHistory(this.props);
	
	  render() {
	    return <Router history={this.history} children={this.props.children} />;
	  }
	}

对Router进行的封装，将createHistory(this.props)以及HashRouter组件包裹的Children作为Router组件props中的history以及children。

***下面代码中的history会被忽略***：

	<BrowserRouter history = {history} /> 
	<HashRouter history = {history} /> 





