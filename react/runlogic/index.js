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
    constructor(props,ref){
        super(props)
    }
    render(){
        return (
            <div>
                this is Footer
            </div>
        )
    }
}

class App extends React.Component{
    render(){
        return (
            <div>
                <Header/>
                <Content/>
                <Footer/>
            </div>
        )
    }
}

console.log(React)

console.log("Footer",Object.keys(Footer))

// console.log(React.Component.prototype.isMounted(Header))

// React.forwardRef((props)=><div>a</div>)

React.forwardRef(Footer)

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);