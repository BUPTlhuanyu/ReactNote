/**
 * Created by liaohuanyu on 2019/6/14.
 */
window.globalContainer = [];
window.containerInfoStack = [];
window.fiberStackTest = []

function testEvents(){
    class APP extends React.Component{
        render(){
            return (
                <div>
                    <Header/>
                </div>
            )
        }
    }

    class Header extends React.Component{
        clickHandler(){
            console.log("click")
        }
        render(){
            return (
                <div>
                    <div onClick={this.clickHandler.bind(this)}>
                        this is Header
                    </div>
                    <p onClick={this.clickHandler.bind(this)}>
                        this is Header
                    </p>
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