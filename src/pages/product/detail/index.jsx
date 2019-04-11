import React, {Component} from 'react';
import {Card, Icon, List} from 'antd';

import {reqGetCateoryName} from '../../../api'
import './index.less'

const Item = List.Item;
export default class Detail extends Component {
    state = {
        category: '商品分类',
    };
    goBack = () => {
        this.props.history.goBack();
    };
    componentDidMount() {
        const {categoryId, pCategoryId} = this.props.location.state;
        this.getCateoryName(categoryId, pCategoryId)
    }
    getCateoryName = async (categoryId, pCategoryId) => {
        let category = '';
        if (pCategoryId === '0') {
            const result = await reqGetCateoryName(categoryId);
            category = result.data.name;
        } else {
            const result1 = await reqGetCateoryName(pCategoryId);
            const result2 = await reqGetCateoryName(categoryId);
            category = result1.data.name + '/' + result2.data.name;
        }
        this.setState({
            category
        })
    };
    createItem = (item, index) => {
        let headTxt;
        switch (index) {
            case 0:
                headTxt = '名称';
                break;
            case 1:
                headTxt = '描述';
                break;
            case 2:
                headTxt = '分类';
                break;
            case 3:
                headTxt = '价格';
                item=item+'￥';
                break;
            case 4:
                headTxt = '图片';
                item = item.length ? item.map((img, index) => {
                    return <img key={index} src={`/upload/` + img} alt='444'/>
                }) : <span>无</span>;
                break;
            case 5:
                headTxt = '详情';
                item = <div dangerouslySetInnerHTML={{__html: item}}/>;
                break;
            default:
                headTxt = '';
        }
        return <Item><span className='head'>[商品{headTxt}]：</span>{item}</Item>
    };

    render() {
        const {price, detail, desc, name, imgs,} = this.props.location.state;
        const {category} = this.state;
        const data = [name, desc, category, price, imgs, detail];
        return <Card className='main'
                     title={
                         <div className='top'>
                             <Icon className='arrow' onClick={this.goBack}
                                   type='arrow-left'/><span>商品详情</span>
                         </div>
                     } >
            <List
                size="large"
                bordered
                dataSource={data}
                renderItem={this.createItem}
            />
        </Card>
    }
}