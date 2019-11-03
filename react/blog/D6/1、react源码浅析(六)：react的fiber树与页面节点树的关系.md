##  概述，背景  
对fiber树的构建顺序有一个大致的了解，便于分析reconciler源码的时候有一个大致清晰的思路，不至于一头雾水。

               ReactDOM.render(<APP/>,document.getElementById('app'))
上面的渲染：
首先会对参数进行处理，对于第一个参数会创建APP的fiber树，对于第二个参数获取id为app的元素。
然后执行ReactDOM.render函数，首先会对第二个参数container创建一个fiber以及对应的root作为整个fiber树的
根节点。第一个参数会作为root对于fiber的children。
最后开始调度渲染。


##  构建测试代码   
F:\web学习路线\项目\ReactNote\react\runlogic\reconciler.html


```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="react.js"></script>
    <script src="react-dom.js"></script>
    <script src="https://cdn.staticfile.org/babel-standalone/6.26.0/babel.min.js"></script>
</head>
<body>
<div id="root"></div>
<script type="text/jsx" src="reconciler.js"></script>
</body>
</html>
```



F:\web学习路线\项目\ReactNote\react\runlogic\reconciler.js


```
window.globalContainer = [];
window.containerInfoStack = [];
window.fiberStackTest = []

class ProductCategoryRow extends React.Component {
    render() {
        return (<tr><th colSpan="2">{this.props.category}</th></tr>);
    }
}

class ProductRow extends React.Component {
    render() {
        var name = this.props.product.stocked ?
            this.props.product.name :
            <span style={{color: 'red'}}>
        {this.props.product.name}
      </span>;
        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        );
    }
}

class ProductTable extends React.Component {
    render() {
        var rows = [];
        var lastCategory = null;
        console.log(this.props.inStockOnly)
        this.props.products.forEach((product) => {
            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            if (product.category !== lastCategory) {
                rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            }
            rows.push(<ProductRow product={product} key={product.name} />);
            lastCategory = product.category;
        });
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {
    ...
    render() {
        return (
            <form>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    onChange={this.handleFilterTextInputChange}
                />
                <p>
                    <input
                        type="checkbox"
                        checked={this.props.inStockOnly}
                        onChange={this.handleInStockInputChange}
                    />
                    Only show products in stock
                </p>
            </form>
        );
    }
}

class FilterableProductTable extends React.Component {
    ...
    render() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onFilterTextInput={this.handleFilterTextInput}
                    onInStockInput={this.handleInStockInput}
                />
                <ProductTable
                    products={this.props.products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                />
            </div>
        );
    }
}


var PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
    <FilterableProductTable products={PRODUCTS} />,
    document.getElementById('root')
);


console.log("globalContainer",window.globalContainer)
console.log("containerInfoStack",window.containerInfoStack)
console.log("fiberStackTest",window.fiberStackTest)
```


F:\web学习路线\项目\ReactNote\react\runlogic\react-dom.js


```
var createFiber = function (tag, pendingProps, key, mode) {
    // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
    let newFiber = new FiberNode(tag, pendingProps, key, mode);
    window.fiberStackTest.push(newFiber)
    return newFiber
};
      ...
function createContainer(containerInfo, isConcurrent, hydrate) {
    window.containerInfoStack.push(containerInfo);
    console.dir(containerInfo);
    return createFiberRoot(containerInfo, isConcurrent, hydrate);
}
```




##  页面DOM树  

![image](http://note.youdao.com/yws/res/18036/WEBRESOURCE6900be02fb4f7fe9de8e3a9fe755996e)
![image](http://note.youdao.com/yws/res/18041/WEBRESOURCE831a1e544f3f91ba2ac55d62c3ce6e9a)



##  fiber树  
每次执行到createFiber就往fiberStackTest数组中push一个fiberNode，因此fiberStackTest中就得到了按顺序生成的fiberNode。如下：
![image](https://note.youdao.com/src/WEBRESOURCEcba747f62cc6b61f10578ed48754e4b2)
![image](https://note.youdao.com/src/WEBRESOURCE2cec7161ac122d588df5fd106845b8f4)


1、对比页面DOM树可以看到，fiber的生成顺序对应的是DOM树的广度遍历，其中第一个生成的fiberNode是整个fiber树的root，首次ReactDOM.render的时候，通过createFiberRoot函数创建的，也就是最外层容器div#root生成的fiberNode，貌似createFiberRoot也只会调用一次。第2个fiberNode是div#root也就是fiber树的根节点，可以看到第三个fiberNode与最后一个fiberNode其实是指向同一个DOM也就是最后一个DOM节点（￥199.9）。
2、另外还可以看到fiberNode生成顺序是按组件来的，也就是如下图中所示，首先组件FilterableProductTable对应的fiberNode，然后就是该组件中的元素DOM节点div对应的fiberNode，然后就是该div下包裹的组件SearchBar以及组件ProductTable对应的fiberNode；接着就是分别在这两个组件中采用广度遍历算法对组件中的每个DOM元素或者组件生成对应的fiberNode。
![image](https://note.youdao.com/src/WEBRESOURCEdcae59ce192f591fcc89d094481c6903)

3、每个fiberNode的return指向的是父节点fiberNode，举例来说组件SearchBar以及组件ProductTable的return都直接包裹他们的DOM元素div，也就是组件FilterableProductTable代码中的div：

```
class FilterableProductTable extends React.Component {
    render() {
        return (
            <div>
                <SearchBar/>
                <ProductTable/>
            </div>
        );
    }
}
```


可以由如下图的比较可知：
![image](https://note.youdao.com/src/WEBRESOURCEb9272373138b3645e33371983447214b)
说明他们return属性都存储了外层div对应的fiberNode。


##  总结  
1、创建fiberNode的顺序是对每个组件广度遍历然后在组件中对每个DOM广度遍历。
![image](http://note.youdao.com/yws/res/18059/WEBRESOURCE819b886d8e8ac8e20ec6330a58d61cbb)
2、fiberNode的return指向的是父节点fiberNode

