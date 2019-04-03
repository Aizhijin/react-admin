import React, {Component} from 'react';
import {Link, Route} from "react-router-dom";
import {Layout} from 'antd';

import {getItem} from '../../untils';
import save from '../../untils/start';
import LeftNav from '../../components/left-nav'

import Home from '../home';
import Category from '../category';
import Product from '../product';
import User from '../user';
import Role from '../role';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';

import './index.less'
import logo from '../../assets/img/logo.png'

const {Header, Content, Footer, Sider} = Layout;

export default class Admin extends Component {
    constructor(props) {
        super(props);

        const user = getItem();
        if (!user) {
            //跳转页面
            return this.props.history.replace('/login')
        }
        //保存到内存中
        save.user = user;
    }

    state = {
        collapsed: false,
    };

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({collapsed});
    };

    render() {
        const opacity = this.state.collapsed ? 0 : 1;
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider theme='light'
                       collapsible
                       collapsed={this.state.collapsed}
                       onCollapse={this.onCollapse}
                >
                    <LeftNav opacity={opacity}/>
                </Sider>

                <Layout>
                    <Header style={{background: '#fff', padding: 0}}/>
                    <Content style={{margin: '0 16px'}}>
                        <Route path='/home' component={Home}/>
                        <Route path='/category' component={Category}/>
                        <Route path='/product' component={Product}/>
                        <Route path='/user' component={User}/>
                        <Route path='/role' component={Role}/>
                        <Route path='/charts/pie' component={Pie}/>
                        <Route path='/charts/line' component={Line}/>
                        <Route path='/charts/bar' component={Bar}/>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        推荐使用谷歌浏览器，可以获得更佳页面操作体验
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}