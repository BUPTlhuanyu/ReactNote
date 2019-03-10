/**
 * Created by lhy on 2018/12/6.
 */

// function testFragment(){
//     let ReactFragment1 = React.cloneElement(<React.Fragment children={["child","child","child"]}/>,{xxx:"这会被添加到React.Fragment的props上"})
//     console.log("ReactFragment1",ReactFragment1)
//     console.log("ReactFragment1",React.Fragment)
//
//     ReactDOM.render(
//         <React.Fragment children={["child","child","child"]}/>,
//         document.getElementById('app')
//     );
//
//     console.log("ReactFragment",<React.Fragment xxx="不允许的"/>)
// }
//
// function testSomething(){
//     class Header extends React.Component{
//         render(){
//             return (
//                 <div>
//                     this is header
//                 </div>
//             )
//         }
//     }
//     class Content extends React.Component{
//         render(){
//             console.log("Content props",this.props)
//             return (
//                 <div>
//                     this is Content
//                 </div>
//             )
//         }
//     }
//     class Footer extends React.Component{
//         constructor(props){
//             super(props)
//         }
//         render(){
//             return (
//                 <div>
//                     this is Footer {this.props.children}
//                 </div>
//             )
//         }
//     }
//
//
//
//     const child1 = React.createElement('li', null, 'First Text Content');
//     const child2 = React.createElement('li', null, 'Second Text Content');
//     const child3 = React.createElement('li', null, 'Third Text Content');
//     const FooterEnhance = React.createElement(Footer, {key:1,ref:null,a:100,children:"第二个参数children"} ,"0000000");
//     console.log("FooterEnhance",FooterEnhance.props.key)
//
//     class App extends React.Component{
//         render(){
//             let reactChildLike = {$$typeof:Symbol.for('react.element')}
//             let func = function (child) {
//                 console.log(this)
//                 this.a=1000;
//                 return child
//             }
//             let contextTest = {a:1}
//             console.log("React.Children.map test",React.Children.map(reactChildLike,func,contextTest))
//             console.log("contextTest.a",contextTest.a)
//             console.log(React.Children.count(this.props.children))
//             console.log(this.props.children)
//             console.log(React.Children.map([reactChildLike,[reactChildLike,this.props.children]],(children)=>[children,children,children]))
//             return (
//                 <div>
//                     {FooterEnhance}
//                 </div>
//             )
//         }
//     }
//
//     console.log(React)
//
//     console.log("Footer",Object.keys(Footer))
//
//     console.log("App", <App/>)
//
// // console.log(React.Component.prototype.isMounted(Header))
//
// // React.forwardRef((props)=><div>a</div>)
//
// // React.forwardRef(Footer)
//
// // createFactory
//     console.log(React.createFactory('div')())
//     console.log(React.createFactory(Footer)())
//
//
//     console.log("debug from here")
//
//
//     ReactDOM.render(
//         <App>
//             {/*测试*/}
//             <Header/>
//             <Content key="1" ref={{}}/>
//             string 1
//             <React.Fragment key111="Fragment 只能有key和children作为其属性"
//                             children111="Fragment 只能有key和children作为其属性"
//                             ref={{"some":"Fragment 也不能使用ref获取引用"}}
//                             key="允许的"
//                             children="允许的,貌似没什么用，根本用不了，真实的children就是React.Fragment包裹的内容"
//             >
//                 Some text.
//                 <h2>A heading</h2>
//             </React.Fragment>
//             <Footer>覆盖</Footer>
//             string 2
//         </App>,
//         document.getElementById('app')
//     );
// }
//
// function testMemo(){
//     const MyComponent = React.memo(function MyComponent(props) {
//         return (
//             <div>
//                 this is memo
//             </div>
//         )
//     });
//     console.log("<MyComponent />",<MyComponent />)
//     console.log("MyComponent",MyComponent)
//     ReactDOM.render(
//         <MyComponent />,
//         document.getElementById('app')
//     );
// }
// // testMemo()
// console.log("ReactFragment1",<React.Fragment/>)

// function testPortal(){
//     const app = document.getElementById('app');
//     const Portal = ReactDOM.createPortal(<div onClick={() => {console.log("click")}}>"portal"</div>, app);
//     console.log("Portal",Portal)
//     ReactDOM.render(
//         Portal,
//         document.getElementById('app')
//     );
// }
// testPortal()

function testLazyComponent(){
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
            console.log("Content props",this.props)
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
    ReactDOM.render(
        <div>
            <Content>
             <Header>
                 <Footer/>
             </Header>
            </Content>
        </div>,
        document.getElementById('app')
    );
}

testLazyComponent()
