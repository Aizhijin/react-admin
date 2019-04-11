import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Icon, Menu} from "antd";
import menulist from '../../config/menu-config'
import User from '../../untils/start';
import logo from "../../assets/img/logo.png";

const {Item, SubMenu} = Menu;

@withRouter
class LeftNav extends Component {
    static propTypes = {
        opacity: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        const openKey = [];
        this.menu = this.createMenu(menulist, openKey);
        this.state = {
            openKey
        };
    }

     /*createMenu(menulist, openKey) {
         const {pathname} = this.props.location;
         return menulist.map((item) => {
             const son = item.children;
             if (son) {
                 return <SubMenu
                     key={item.key}
                     title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                     {
                         son.map((singel) => {
                             if (pathname.startsWith(singel.key) || singel.key.startsWith(pathname)) {
                                 //设置打开状态
                                 //openKey跟state的引用一样，修改可以导致state里的state修改
                                 openKey.push(item.key)
                             }
                             return this.createItem(singel)
                         })} </SubMenu>
             } else {
                 return this.createItem(item)
             }
         })
     }*/

    handleOpenChange = (openKey) => {
        this.setState({openKey})
    };

    handelClick = () => {
        this.setState({
            openKey: []
        })
    };
    createItem = (item) => {
        return <Item key={item.key}>
            <Link to={item.key}>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
            </Link>
        </Item>
    };

    createMenu(menulist, openKey) {

        const {pathname} = this.props.location;
        //获取权限列表
        const menus = User.user.role.menus;
        return menulist.reduce((prev, curr, index) => {
            if (curr.children) {//有子项
                //创建子项列表
                const arr = curr.children.reduce((prevSon, currSon) => {
                    if (menus.find(son => currSon.key === son)) {
                        //判断是否需要打开二级菜单
                        if (pathname.startsWith(currSon.key) || currSon.key.startsWith(pathname)) openKey.push(curr.key);
                        return [...prevSon, this.createItem(currSon)];
                    } else return prevSon
                }, []);
                //检测是否有子项权限
                if (arr.length) {
                    return [...prev, <SubMenu
                        key={curr.key}
                        title={<span><Icon type={curr.icon}/><span>{curr.title}</span></span>}>
                        {arr}
                    </SubMenu>]
                } else return prev
            } else { //无子项
                if (menus.find(row => curr.key === row)) {
                    return [...prev, this.createItem(curr)];
                } else return prev //没找到也需要返回 否则下次累加没有值
            }
        }, []);
    };

    render() {
        let {location: {pathname}, opacity} = this.props;
        if (pathname.startsWith('/product')) pathname = '/product';
        return (
            <Fragment>
                <Link to='/home'>
                    <div className="logo" onClick={this.handelClick}>
                        <img src={logo} alt='logo'/>
                        <h2 style={{opacity}}>硅谷后台</h2>
                    </div>
                </Link>
                <Menu theme="light" selectedKeys={[pathname]} openKeys={this.state.openKey}
                      onOpenChange={this.handleOpenChange}
                      mode="inline"> {this.menu}</Menu>
            </Fragment>
        )
    }
}

export default LeftNav