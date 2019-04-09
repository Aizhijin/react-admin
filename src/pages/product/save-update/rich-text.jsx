import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
import PropTypes from 'prop-types'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

export default class EditorDemo extends React.Component {
    static propTypes={
        Txtcontent:PropTypes.string.isRequired
    };
    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null)
    };
    componentDidMount () {
        const htmlContent = this.props.Txtcontent;
        // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
       if (htmlContent){
           this.setState({
               editorState: BraftEditor.createEditorState(htmlContent)
           })
       }
    }
    // 一旦内容发生变化，触发的回调
    handleEditorChange = (editorState) => {
        this.setState({editorState})
    };

    render() {

        const {editorState} = this.state;
        return (
            <div style={{border: '1px solid #d9d9d9', borderRadius: 4, width: 850}}>
                <BraftEditor
                    value={editorState}
                    onChange={this.handleEditorChange}
                    contentStyle={{height: 250}}
                />
            </div>
        )
    }
}