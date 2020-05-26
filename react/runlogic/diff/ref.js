/**
 * Created by lhy on 2018/12/6.
 */

window.globalContainer = [];
window.containerInfoStack = [];
window.fiberStackTest = []

function testCLassComponent(){
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
                    <Header/>
                </div>
            )
        }
    }
    class Header extends React.Component{
        render(){
            return (
                <div>
                    this Header will be deleted
                </div>
            )
        }
    }
    ReactDOM.render(
        <APP/>,
        document.getElementById('app')
    );
}
testCLassComponent()
