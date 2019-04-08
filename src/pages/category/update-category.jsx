import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Input} from 'antd';
const Item=Form.Item;
@Form.create()
class UpdateCategory extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired
    };

    validator = (ruler, value, callBack) => {
        const {categoryName}=this.props;
        if (!value) {
            callBack('不能为空，请输入分类名称')
        }
        else if (value===categoryName) {
            callBack('名称不能一样')
        }
        else {
            callBack();
        }
    };

    render() {
        const {form: {getFieldDecorator}, categoryName} = this.props;
        return <Form style={{height:80}}>
            <Item>
                {
                    getFieldDecorator('categoryName', {
                        initialValue: categoryName,
                        rules: [
                            {validator: this.validator}
                        ]
                    })(<Input placeholder="请输入要修改的分类名称~"/>)
                }
            </Item>
        </Form>
    }
}

export default UpdateCategory