import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select} from 'antd';
const Item = Form.Item;
const Option = Select.Option;

@Form.create()
class AddUserForm extends Component {
    static propTypes={
        roles:PropTypes.array.isRequired
    };
    validator = (ruler, value, callBack) => {
        const length = value && value.length;
        const reg = /^[a-zA-Z0-9]+$/;
         if (length < 4) {
            callBack('密码必须大于4位')
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
    const { form:{getFieldDecorator} ,roles} = this.props;

    return (
      <Form>
        <Item label='用户名' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'username',{
              rules: [
          {required: true, message: '必须输入用户名!'},
          {whitespace: true, message: '不能有空格!'},
          {min: 4, message: '必须大于4位!'},
          {max: 12, message: '不能超过12位!'},
          {pattern: /^[a-zA-Z0-9_]+$/, message: '必须为数字、字母、下划线'},
              ]
          }
            )(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>
        <Item label='密码' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'password',{
                    rules: [
                        {validator: this.validator},
                        {whitespace: true, message: '不能有空格!'},
                        {required: true, message: '必须输入密码!'},

                    ]
                }
            )(
              <Input placeholder='请输入密码' type='password'/>
            )
          }
        </Item>
        <Item label='手机号' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'phone',{
                    rules:[
                        {pattern:/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,message:'手机号为1开头的11位数字'},
                        {whitespace:true,message:'不能有空格'},
                        {required:true,message:'必须输入电话号码'},
                        ]}
            )(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'email',{
                    rules:[
                        {whitespace:true,message:'不能有空格'},
                        {required:true,message:'必须输入邮箱'},
                    ]}

            )(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='角色' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'role_id',{
                    rules:[
                        {required:true,message:'必须选择分类'},
                    ]}
            )(
              <Select placeholder='请选择分类' key={-1}>
                  {
                      roles.map((item)=>{
                          return  <Option key={item._id}>{item.name}</Option>
                      })
                  }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default AddUserForm;