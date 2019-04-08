import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Select, Input} from 'antd';

const Item = Form.Item;
const Option = Select.Option;
@Form.create()
 class AddCategory extends Component {
    static propTypes={
        categories:PropTypes.array.isRequired
    };
    validator=(ruler,value,callBack)=>{
        const {categories}=this.props;
       const cateory=categories.find((item)=> item.name===value);
        if(!value){
            callBack('请输入要添加的分类名称，不能为空。')
        }else if(cateory){
            callBack('分类已存在，不能重复添加！')
        }else {
            callBack()
        }
    };

    render() {
        const {form:{getFieldDecorator},categories}=this.props;
        return <Form>
            <Item label='所属分类'>
                {
                    getFieldDecorator('parentId',
                        {
                            initialValue: '0'
                        })(<Select>
                        <Option key="0" value="0">一级分类</Option>
                        {
                            categories.map((category) => <Option key={category._id}
                                                                 value={category._id}>{category.name}</Option>)
                        }
                    </Select>)
                }
            </Item>
            <Item label='分类名称'>
                {
                    getFieldDecorator('categoryName',{
                        rules: [
                            {validator: this.validator}
                        ]
                    })( <Input placeholder='请输入分类名称'/>)
                }
            </Item>
        </Form>
    }
}
export default AddCategory