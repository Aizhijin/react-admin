import React, {Component, Fragment} from 'react';
import {Table, Input, Card, Select, Button, Icon, message} from 'antd';
import {Link} from 'react-router-dom'
import MyButton from '../../../components/my-button/index'
import {reqGetProduct, reqSearchProduct,reqUpdateStatus} from '../../../api/index'

const Option = Select.Option;
export default class Commodity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            total: 0,
            /* isLoading: true,*/
            searchType: 'productName',
        };
        this.searchInput = React.createRef();
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
            title: '价格(￥)',
            dataIndex: 'price',
            key: 'price',
        }, {
            title: '状态',
            /*dataIndex: 'age',*/
            key: 'status',
            render: (e) => {
                return <Fragment>
                    <Button type='primary' onClick={this.changeStatus(e)}>{e.status===1? '下架':'在售'}</Button>
                    &nbsp;&nbsp;{e.status===1? '在售':'下架'}
                </Fragment>
            }
        }, {
            title: '操作',
            /* dataIndex: 'age',*/
            key: 'operator',
            render: (product) => {
                return <Fragment>
                    <MyButton onClick={this.particulars(product)}>详情</MyButton>
                    <MyButton onClick={this.updateProduct(product)}>修改</MyButton>
                </Fragment>
            }
        }
    ];
    changeStatus=(e)=>{
        return async ()=>{
            const status= e.status===1? 2:1;
            const id=e._id;
            const result=await reqUpdateStatus({productId:id,status});
            if (result.status===0){
                message.success('状态更新成功~~');
                this.setState({
                    products:this.state.products.map((item)=>{
                        if (item._id===id){
                            item.status=status;
                        }
                        return item
                    })
                })
            } else {
                message.error('状态更新失！')
            }
        }
    };
    particulars=(product)=>{
        return () => {
            this.props.history.push('/product/detail', product)
        }
    };
    updateProduct = (product) => {
        return () => {
            this.props.history.push('/product/saveupdate', product)
        }
    };

    //获取后台分页后的数据
    getProducts = async (pageNum, pageSize = 3) => {
        const {searchType} = this.state;
        let result = null;
        this.setState({isLoading: true});
        console.log(this.searchContent);
        if (this.searchContent) {
            result = await reqSearchProduct({
                [searchType]: this.searchContent,
                pageNum,
                pageSize
            });
            console.log(result)
        } else {
            result = await reqGetProduct(pageNum, pageSize);
        }
         this.setState({isLoading: false});
        if (result.status === 0) {
            this.setState({
                products: result.data.list,
                total: result.data.total
            })
        } else {
            message.error(result.msg)
        }
    };
    searchContent = '';
    handleSelect = (value) => {
        this.setState({searchType: value})
    };
    search = () => {
        this.searchContent = this.searchInput.current.state.value;
        this.getProducts(1);
    };

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const {products, total, isLoading} = this.state;

        return <Card
            title={
                <Fragment>
                    <Select defaultValue='productName' onChange={this.handleSelect}>
                        <Option key={0} value='productName'>根据商品名称</Option>
                        <Option key={1} value='productDesc'>根据商品描述</Option>
                    </Select>
                    <Input placeholder="关键字" style={{width: 300, margin: '0 10px'}} ref={this.searchInput}/>
                    <Button type='primary' onClick={this.search}>搜索</Button>
                </Fragment>
            }
            extra={<Link to='/product/saveupdate'><Button type='primary'><Icon type='plus'></Icon>添加产品</Button></Link>}
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
                    onChange: this.getProducts,
                    onShowSizeChange: this.getProducts
                }}
                rowKey="_id"
                loading={isLoading}
            />
        </Card>
    }
}