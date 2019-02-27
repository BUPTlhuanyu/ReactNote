/**
 * Created by lhy on 2018/12/6.
 */

class Header extends React.Component{
    render(){
        return (
            <div>
                this is header
            </div>
        )
    }
}
class Content extends React.Component{
    render(){
        return (
            <div>
                this is Content
            </div>
        )
    }
}
class Footer extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div>
                this is Footer {this.props.children}
            </div>
        )
    }
}

const child1 = React.createElement('li', null, 'First Text Content');
const child2 = React.createElement('li', null, 'Second Text Content');
const child3 = React.createElement('li', null, 'Third Text Content');
const FooterEnhance = React.createElement(Footer, {key:1,ref:null,a:100,children:"第二个参数children"} ,"0000000");
console.log("FooterEnhance",FooterEnhance.props.key)

class App extends React.Component{
    render(){
        return (
            <div>
                <Header/>
                <Content/>
                <Footer>aaaaa</Footer>
                {FooterEnhance}
            </div>
        )
    }
}

console.log(React)

console.log("Footer",Object.keys(Footer))

// console.log(React.Component.prototype.isMounted(Header))

// React.forwardRef((props)=><div>a</div>)

// React.forwardRef(Footer)

// createFactory
console.log(React.createFactory('div')())
console.log(React.createFactory(Footer)())

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);