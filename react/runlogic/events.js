/**
 * Created by liaohuanyu on 2019/6/14.
 */
window.globalContainer = [];
window.containerInfoStack = [];
window.fiberStackTest = []

function testEvents(){
    class APP extends React.Component{
        state = {
            a: 1
        }
        constructor(){
            super()
            this.changeVal = this.changeVal.bind(this)
        }
        changeVal(value){
            this.setState({
                a:  value
            })
        }
        render(){
            return (
                <div>
                    <Header a={this.state.a} change = {this.changeVal}/>
                </div>
            )
        }
    }

    class Header extends React.Component{
        state = {
            a: 1
        }
        constructor(){
            super()
            this.mouseOver = this.mouseOver.bind(this)
            this.onChange = this.onChange.bind(this)
        }
        mouseOver(e){
            e.stopPropagation()
            e.preventDefault()
            this.setState({
                a : this.state.a + 10000
            })
        }
        clickHandler(){
            function makeError () {
                var name = "geoff"
                var msg = "Hi, " + name
                console.log(msg)
            }

            makeError()
            // alert("click")
            this.setState({
                a:  100
            })
        }
        onChange(e){
            this.props.change(e.target.value)
        }
        render(){
            return (
                <div>
                    {/* <div onClick={this.clickHandler.bind(this)} >
                        <div onClick={this.clickHandler.bind(this)}>
                            <div onClick={this.clickHandler.bind(this)}>
                                this is Header {this.state.a}
                            </div>
                        </div>
                    </div>
                    <p onClick={this.clickHandler.bind(this)} >
                        this is Header
                    </p> */}
                    <div onClick={this.clickHandler.bind(this)} >
                        <div onClick={this.clickHandler.bind(this)}>
                            <div onClick={this.clickHandler.bind(this)}>
                                this is Header {this.state.a}
                            </div>
                        </div>
                    </div>
                    <p>
                        this is Header
                    </p>
                    <input onInput={this.onChange} value={this.props.a}></input>
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