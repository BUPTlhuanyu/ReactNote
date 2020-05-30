/**
 * Created by lhy on 2018/12/6.
 */
// current 与 workInProgress 的 props 的行为
// context 原理
window.globalContainer = [];
window.containerInfoStack = [];
window.fiberStackTest = []

function testCLassComponent(){
    const MyContext = React.createContext('MyContext1')
    const MyContext2 = React.createContext('MyContext2')
    class APP extends React.Component{
        refContainer = React.createRef()
        constructor(props){
            super(props)
            this.state = {
                showHeader: false
            }
        }
        clickHandler(){
            this.setState({
                showHeader: !this.state.showHeader
            })
        }

        componentDidMount(){
            console.log('componentDidMount')
            console.log(this.refContainer, this.refContainer.toString())
        }

        render(){
            return (
                <div onClick={this.clickHandler.bind(this)} ref = {this.refContainer}>                   
                    <Header a =''> 
                        <div>1</div>
                        <div>2</div>
                    </Header>
                    <Footer b =''/>
                    <Memo c = ''/>
                </div>
            )
        }
    }
    class Header extends React.Component{
        state = {a: 'MyContext1', b: 'MyContext2'}
        render(){
            return (
                <div>
                    <div onClick = {() => {this.setState({a: Math.random()})}}>对比下面的text</div>
                    this Header will be deleted
                    <input />
                    <MyContext2.Provider value = {this.state.b}>
                        <MyContext2.Consumer>
                            {
                                value => {
                                    return <div>{ value }</div>
                                }
                            }
                        </MyContext2.Consumer>
                    </MyContext2.Provider>
                    <MyContext.Provider value = {this.state.a}>
                        <ContextClass />
                        <Footer />
                        <MyContext.Consumer>
                            {
                                value => {
                                    return <div>{ value }</div>
                                }
                            }
                        </MyContext.Consumer>
                        <MyContext.Provider value = {false}>
                            <div>MyContext 1</div>
                            <div>MyContext 2</div>     
                        </MyContext.Provider>
                        <div>MyContext 1</div>
                        <div>MyContext 2</div>     
                    </MyContext.Provider>
                </div>
            )
        }
    }
    const Footer = function(){
        return <div>
                    <MyContext.Consumer>
                        {
                            value => {
                                return <div>Footer text { value }</div>
                            }
                        }
                    </MyContext.Consumer>
                </div>
    }
    class ContextClass extends React.Component{
        render(){
            return <div>ContextClass{this.contextType}</div>
        }
    }
    ContextClass.contextType = MyContext
    const Memo = React.memo(function MyComponent(props) {
        /* 使用 props 渲染 */
        return <div>memo content</div>
      });
    ReactDOM.render(
        <APP/>,
        document.getElementById('app')
    );
}
testCLassComponent()
