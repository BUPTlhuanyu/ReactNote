/**
 * Created by lhy on 2018/12/6.
 */
window.globalContainer = [];
window.containerInfoStack = [];
window.fiberStackTest = []
function formatMoney(str) {
    str = str + ''
    if (/[^0-9.]/.test(str)){
        return "0.00"
    }
     // 找到小数点的下标
     let pointIdx = str.indexOf('.')
     // 如果没有小数点
     if (pointIdx < 0) {
         // 将数值进行千位符转换
       str = str.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
     } else { // 如果有小数点
         // 取整数部分, 也可以用 parseInt
       let int = str.substr(0, pointIdx)
       // 整数部分进行千位符转换
       str = int.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + str.substr(pointIdx)
     }
    return str 
}

function testInputComponent(){
    class APP extends React.Component{
        static getDerivedStateFromProps(){
            console.log('APP getDerivedStateFromProps');
            return {}
        }
        constructor(props){
            super(props)
            this.state = {
                a: 2
            }
        }
        componentDidMount(){
            console.log('APP componentDidMount');
        }
        render(){
            console.log("APP render")
            return (
                <div onClick={() => {this.setState({a: 898})}}>
                    点击一下
                    <Footer test ={this.state.a}/>
                </div>
            )
        }
    }

    class Footer extends React.Component{
        static getDerivedStateFromProps(){
            console.log('Footer getDerivedStateFromProps');
            return {}
        }
        constructor(props){
            super(props)
            this.changeValue = this.changeValue.bind(this)
            this.state = {
                amount: ''
            }
        }
        changeValue(e){
            let that = this
            let pos = e.target.value.length
            let amount = e.target.value
                .replace(/^0/, '') // 第一个不能为 0
                .replace(/[^\d\.]/g, '') //如果输入非数字，则替换为''
                .replace(/^\./g,'') //必须保证第一个为数字而不是 .  
                .replace('.','$##$').replace(/\./g,'').replace('$##$','.') //保证.只出现一次，而不能出现两次以上 
                .replace(/^(\d+)\.(\d\d).*$/,'$1.$2') // 最多两位小数
            amount = formatMoney(amount)
            // const callBack = function(){
            //     e.target.selectionStart = pos
            //     e.target.selectionEnd = pos
            // }
            // setTimeout(callBack)
            that.setState({
                amount: amount
            })
        }
        componentDidMount(){
            console.log('Footer componentDidMount');
        }
        render(){
            console.log("Footer render")
            return (
                <div>
                    <input 
                        style = {{width: '600px', height: '100px',fontSize: '50px', padding: '20px'}}
                        type = "text"
                        // onInput={(e) => {
                        //     this.changeValue(e)
                        // }}
                        onBlur = {()=>{console.log('blur==============>');}}
                        onInput = {this.changeValue}
                        value = {this.state.amount}
                    ></input>
                    <div
                        style = {{width: '100px', height: '100px', fontSize: '50px'}} 
                        onTouchStart = {() => {this.setState({
                            amount: ''
                        })}}
                    >点击</div>
                </div>
            )
        }
    }
    ReactDOM.render(
        <APP/>,
        document.getElementById('app')
    );
}
testInputComponent()

