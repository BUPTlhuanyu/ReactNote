/**
 * Created by liaohuanyu on 2019/6/14.
 */
window.globalContainer = [];
window.containerInfoStack = [];
window.fiberStackTest = []

const ThemeContext = React.createContext(0)
function testEvents(){
    class APP extends React.Component{
        state = {
            a: 1
        }
        handleClick(event) {
            event.preventDefault();
        }
        constructor(){
            super()
            this.changeVal = this.changeVal.bind(this)
        }
        changeVal(){
            this.setState({
                a:  100
            })
        }
        render(){
            return (
                <div>
                    <a
                        onClick={event => this.handleClick(event)}
                        href={'/a'}
                    >asdasdasdasd</a>
                    <div style={{width:'100px', height: '100px', backgroundColor: "red"}}
                        onClick={this.changeVal.bind(this)}
                    ></div>
                    <ThemeContext.Provider value={this.state.a}>
                        <Header f={this.state.a}/>
                    </ThemeContext.Provider>
                </div>
            )
        }
    }

    class Header extends React.Component{
        constructor(props){
            super(props)
        }

        render(){
            // const f = this.props.f
            return (
                <div>
                    <A f={this.props.f}/>
                    {/* <ThemeContext.Consumer>
                        {
                            context => {
                                // console.log('context====>',context)
                                return  <A />
                            }
                        }
                    </ThemeContext.Consumer> */}
                </div>
            )
        }
    }

    class A extends React.Component{
        state = {
            a: 1,
            value: ''
        }
        constructor(){
            super()
        }

        render(){
            console.log('A render =====>')
            return (
                <div>
                    <ThemeContext.Consumer>
                        {
                            context => {
                                // console.log('context---',context)
                                return <div>{context}</div>
                            }
                        }                        
                    </ThemeContext.Consumer>                    
                </div>
            )
        }
    }
    ReactDOM.render(
        <APP/>,
        document.getElementById('app')
    );
}
testEvents()