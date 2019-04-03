//引入包
import React, {Component} from 'react';
import {Col, Layout, Row, Modal, message} from "antd";
import {withRouter} from "react-router-dom";//装饰器
import dayjs from 'dayjs';//获取标准格式时间方法

//自定义方法、模块
import {removeItem} from '../../untils';//获取、移除用户数据方法
import start from '../../untils/start';//引入内存用户数据
import {getWeather} from '../../api' //提取获取天气函数
import MyButton from '../my-button';//引入自定义按钮
import menuList from '../../config/menu-config'//引入菜单栏配置

//样式、图片
import './index.less'

const {Header} = Layout;

@withRouter
class HeaderMain extends Component {
    state = {
        NowTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        weatherImg: 'http://api.map.baidu.com/images/weather/day/qing.png',
        weather: '晴'
    };
    logout = () => {
        Modal.confirm({
            title: '你确认要退出吗？',
            onOk: () => {
                //退出清空用户数据
                removeItem();
                //清空内存
                start.user = {};
                //跳转登录页面
                this.props.history.replace('/login');
            },
            okText: '确认',
            cancelText: '取消'
        })
    };
    getTitle = () => {
        //获取地址栏path
        const {pathname} = this.props.location;
        //对比菜单返回对应的title
        for (let i = 0; i < menuList.length; i++) {
            const children = menuList[i].children;
            if (children) {
                for (let j = 0; j < children.length; j++) {
                    if (children[j].key === pathname) {
                        return children[j].title;
                    }
                }
            } else {
                if (pathname === menuList[i].key) {
                    return menuList[i].title;
                }
            }
        }
    };

    componentDidMount() {
        this.IntervalId = setInterval(() => {
            this.setState({
                NowTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
            })
        }, 1000);
        //请求天气数据
        getWeather('深圳')
            .then((res) => {
                this.setState({
                    weatherImg: res.weatherImg,
                    weather: res.weather
                })
            })
            .catch((err) => {
                message.error(err, 2);
            })
    };
    componentWillUnmount() {
        clearInterval(this.IntervalId);
    }
    render() {
        const {NowTime,weatherImg,weather}=this.state;
        const title = this.getTitle();
        return <Header className='header-main'>
            <Row className='header_top'>
                <span>欢迎 {start.user.username} </span>
                <MyButton onClick={this.logout}>退出</MyButton>
            </Row>
            <Row className='header_bottom'>
                <Col className='header_bottom_left' span={6}><span>{title}</span></Col>
                <Col className='header_bottom_right' span={18}>
                    <span>{NowTime}</span>
                    <img src={weatherImg} alt='天气'/>
                    <span>{weather}</span>
                </Col>
            </Row>
        </Header>
    }
}

export default HeaderMain