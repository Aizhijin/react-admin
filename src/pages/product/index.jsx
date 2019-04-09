import React, {Component, Fragment} from 'react';
import {Table, Input, Card, Select, Button, Icon,message} from 'antd';
import {Link} from 'react-router-dom'
import MyButton from '../../components/my-button'
import {reqGetProduct} from '../../api'

const Option = Select.Option;
export default class Commodity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products:[],
            total:0,
            isLoading:true
        }
    }
    columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '商品描述',
            dataIndex: 'desc',
            key: 'desc',
        }, {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
        }, {
            title: '状态',
            /*dataIndex: 'age',*/
            key: 'status',
            render: () => {
                return <Fragment>
                    <Button type='primary'>下架</Button>
                    &nbsp;&nbsp;在售
                </Fragment>
            }
        }, {
            title: '操作',
            /* dataIndex: 'age',*/
            key: 'operator',
            render: () => {
                return <Fragment>
                    <MyButton>详情</MyButton>
                    <MyButton>修改</MyButton>
                </Fragment>
            }
        }
    ];

    //获取后台分页后的数据
    getProducts=async (pageNum,pageSize=3)=>{
        this.setState({isLoading:true});
        const resualt=await reqGetProduct(pageNum,pageSize);
        this.setState({isLoading:false});
        if (resualt.status===0){
            this.setState({
                products:resualt.data.list,
                total:resualt.data.total
            })
        } else {
            message.error(resualt.msg)
        }
    };

    componentDidMount(){
        this.getProducts(1)
    }
    render() {
        const {products,total,isLoading}=this.state;

        return <Card
            title={
                <Fragment>
                    <Select value={0}>
                        <Option key={0} value={0}>根据商品名称</Option>
                        <Option key={1} value={1}>根据商品描述</Option>
                    </Select>
                    <Input placeholder="关键字" style={{width: 300, margin: '0 10px'}}/>
                    <Button type='primary'>搜索</Button>
                </Fragment>
            }
            extra={<Link  to='/product/saveupdate'><Button type='primary'><Icon type='plus'></Icon>添加产品</Button></Link>}
            style={{width: '100%'}}
        >
            <Table
                dataSource={products}
                columns={this.columns}
                bordered
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ['3', '6', '9', '12'],
                    defaultPageSize: 3,
                    showQuickJumper: true,
                    total,
                    onChange:this.getProducts,
                    onShowSizeChange:this.getProducts
                }}
                rowKey="_id"
                loading={isLoading}
            />
        </Card>
    }
}