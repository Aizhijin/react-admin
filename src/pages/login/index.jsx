import React, {Component} from 'react';
import {Form, Icon, Input, Button, message} from 'antd';
import {reqLogin} from '../../api';
import './index.less';
import logo from '../../assets/img/logo.png';

import {setItem} from '../../untils/index'

const Item = Form.Item;

@Form.create()
class Login extends Component {

    //登录验证
    prohibit = (ev) => {
        ev.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                //校验成功
                const {username, password} = values;
                const result = await reqLogin(username, password);
                if (result.status === 0) {
                    setItem(result.data);
                    message.success('登录成功!');
                    this.props.history.replace('/');
                } else {
                    message.error(result.msg, 2)
                }
            } else {
                console.log('校验失败！');
                console.log(err);
            }
        })
    };

    //密码验证
    validator = (ruler, value, callBack) => {
        const length = value && value.length;
        const reg = /^[a-zA-Z0-9]+$/;
        if (!value) {
            callBack('必须输入密码')
        }
        else if (length < 4) {
            callBack('密码必须小于4位')
        }
        else if (length > 12) {
            callBack('密码不能大于12位')
        }
        else if (!reg.test(value)) {
            callBack('密码必须为数字、字母')
        } else {
            callBack();
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return <div className='login'>
            <header className='login-header'>
                <img src={logo} alt='logo'/>
                <h2>React项目: 后台管理系统</h2>
            </header>
            <section className='login-content'>
                <h2>用户登录</h2>
                <form onSubmit={this.prohibit} className='login-form'>
                    <Item>
                        {
                            getFieldDecorator('username',
                                {
                                    rules: [
                                        {required: true, message: '必须输入用户名!'},
                                        {whitespace: true, message: '不能有空格!'},
                                        {min: 4, message: '必须大于4位!'},
                                        {max: 12, message: '不能超过12位!'},
                                        {pattern: /^[a-zA-Z0-9_]+$/, message: '必须为数字、字母、下划线'},
                                    ]
                                }
                            )(<Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                     placeholder='用户名'/>)
                        }
                    </Item>
                    <Item>
                        {
                            getFieldDecorator('password', {
                                rules: [
                                    {validator: this.validator}
                                ]
                            })(<Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type='password'
                                      placeholder='密码'/>)
                        }
                    </Item>
                    <Item>
                        <Button type='primary' htmlType='submit' className="login-form-button">登录</Button>
                    </Item>

                </form>
            </section>
        </div>
    }
}

export default Login
