import axios from 'axios';
import {message} from  'antd';

export default function  ajax(url,data,method='GET') {
    method=method.toUpperCase();
    let promise=null;
    if(method==='GET'){
        promise=axios.get(url,{
            params:data
        });
    } else {
        console.log(data);
        promise =axios.post(url,data)
    }
    return promise
        .then((res)=>{
            return res.data;
        })
        .catch((err)=>{
            console.log('请求失败了！');
            message.error('网络异常，请稍后重试~~',2)
        })
}