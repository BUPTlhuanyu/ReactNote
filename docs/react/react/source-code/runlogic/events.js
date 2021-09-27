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
            a: 1,
            value: ''
        }
        constructor(){
            super()
            this.mouseOver = this.mouseOver.bind(this)
            this.onChange = this.onChange.bind(this)
            this.repaint = this.repaint.bind(this)
        }

        componentDidMount(){
            // this.setState({
            //     btWidth: '500px'
            // })
            // let dom  =  document.getElementById('bt')
            // console.log('componentDidMount Header', dom.style.width)
            // dom.style.width = '50px'
        }

        componentWillReceiveProps(nextProps){
            let value = nextProps.a + ':'
            this.setState({
                value
            })
        }
        mouseOver(e){
            e.stopPropagation()
            e.preventDefault()
            this.setState({
                a : this.state.a + 10000
            })
        }
        repaint(e){
            
            let dom  =  document.getElementById('bt')
            console.log('e', dom.style.width)
            dom.style.width = '200px'
        }
        clickHandler(){
            function makeError () {
                var name = "geoff"
                var msg = "Hi, " + name
                console.log(msg)
            }

            makeError()
            // alert("click")
            setTimeout(() => {
                let dom  =  document.getElementById('bt')
                console.log('componentDidMount Header', dom.style.width)
                dom.style.width = '10px'
                this.setState({
                    btWidth: '800px'
                })

            }, 3000)

        }
        onChange(e){
            // let val = e.target.value + ','
            // this.setState({
            //     value: val
            // })
            // this.props.change(val)
            let val = e.target.value + ''
            val = val + ','
            this.setState({
                value:  val
            })
            setTimeout(() => {
                this.setState({
                    value: val + ';'
                })
            })
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
                    {/* <div onClick={this.clickHandler.bind(this)} >
                        <div onClick={this.clickHandler.bind(this)}>
                            <div onClick={this.clickHandler.bind(this)}>
                                this is Header {this.state.a}
                            </div>
                        </div>
                    </div>
                    <button id="bt" onClick={this.repaint} style={{width:this.state.btWidth}}>
                        this is Header
<<<<<<< HEAD
                    </button> */}
                    {/* <input onChange={this.onChange} value={this.props.a}></input>
                    <input onChange={this.onChange}  type="checkbox"></input> */}
                    <input onChange={this.onChange} value={this.state.value}></input>
=======
                    </p>
                    <input type='text' onChange={this.onChange} value={this.state.value}></input>
>>>>>>> 95ac73b20e4b4230ee1ac6571d850419c5223292
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