import React ,{Component} from 'react';
import { Form, Icon, Input, Button} from 'antd';
import './index.less';
import logo from './logo.png';
const Item=Form.Item;

export default class Login extends Component{
    prohibit=(ev)=>{
        ev.preventDefault();
    };
    render(){
        return <div className='login'>
            <header className='login-header'>
                <img src={logo} alt='logo'/>
                <h2>React项目: 后台管理系统</h2>
            </header>
            <section className='login-content'>
                <h2>用户登录</h2>
                <form onSubmit={this.prohibit} className='login-form'>
                    <Item>
                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}placeholder='用户名'/>
                    </Item>
                    <Item>
                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type='password' placeholder='密码'/>
                    </Item>
                    <Item>
                        <Button type='primary' htmlType='submit' className="login-form-button">登录</Button>
                    </Item>

                </form>
            </section>
        </div>
    }
}