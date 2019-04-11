import React, {Component} from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import {Layout} from 'antd';
import HeaderMain from '../../components/header-main'

import {getItem} from '../../untils';
import save from '../../untils/start';
import LeftNav from '../../components/left-nav'

import Home from '../home';
import Category from '../category';
import Product from '../product';
import User from '../user';
import Role from '../role';
import Charts from '../charts';
import './index.less'
const {Content, Footer, Sider} = Layout;
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

                <Layout className='main-content'>
                    <HeaderMain/>
                    <Content style={{margin: '0 16px'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/charts' component={Charts}/>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        推荐使用谷歌浏览器，可以获得更佳页面操作体验
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}