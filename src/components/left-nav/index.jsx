import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Icon, Menu} from "antd";
import menulist from '../../config/menu-config'

const {Item, SubMenu} = Menu;

@withRouter
class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.menu = this.createMenu(menulist);
    }

    createItem(item) {
        return <Item key={item.key}>
            <Link to={item.key}>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
            </Link>
        </Item>
    }

    createMenu(menulist) {
        return menulist.map((item) => {
            const son = item.children;
            if (son) {
                return <SubMenu
                    key={item.key}
                    title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                    {son.map((singel) => {
                        return this.createItem(singel)
                    })} </SubMenu>
            } else {
                return this.createItem(item)
            }
        })
    }

    render() {
        const {pathname} = this.props.location;
        return (
            <Menu theme="light" defaultSelectedKeys={[pathname]} mode="inline"> {this.menu}</Menu>
        )
    }
}

export default LeftNav