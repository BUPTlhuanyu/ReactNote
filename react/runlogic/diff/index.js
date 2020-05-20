/**
 * Created by lhy on 2018/12/6.
 */

window.globalContainer = [];
window.containerInfoStack = [];
window.fiberStackTest = []

function testCLassComponent(){
    class APP extends React.Component{
        constructor(props){
            super(props)
            this.state = {

            }
        }
        render(){
            return (
                <div>
                    <div>item 1</div>
                    <div>item 2</div>
                    <Header/>
                    <Footer/>
                </div>
            )
        }
    }

    class Footer extends React.Component{
        constructor(props){
            super(props)
            this.state = {

            }
        }
        render(){
            console.log("Footer render")
            return (
                <div id="footer">
                    this is Footer
                </div>
            )
        }
    }
    class Header extends React.Component{
        static getDerivedStateFromProps(){
            console.log('Header getDerivedStateFromProps');
            return {}
        }
        constructor(props){
            super(props)
            this.state = {
                a : 1
            }
        }
        render(){
            console.log(this.state.a)
            console.log("Header render")
            return (
                <div onClick={this.clickHandler.bind(this)}>
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
