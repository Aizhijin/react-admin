import ajax from './ajax';
import jsonp from 'jsonp';

const prefix =process.env.NODE_ENV==='development'? 'http://localhost:3000' : 'http://localhost:5000';
//登录请求
export const  reqLogin=(username,password)=>{
    return ajax(prefix+'/login',{username,password},'POST')
};
//获取天气
export const getWeather=function(city) {
    return new Promise((resolve,reject)=>{
        jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
            (err,data)=>{
                if (!err) {
                    const { dayPictureUrl, weather } = data.results[0].weather_data[0];
                    resolve({weather, weatherImg: dayPictureUrl});
                } else {
                    // 提示错误
                    reject('请求失败，网络不稳定~');
                }
            }
        )
    })

};
//获取所有品类
export const reqGetCategorys = (parentId ) =>{
    return ajax(prefix+'/manage/category/list', {parentId});

};
//添加分类
export const reqAddCategorys = (parentId ,categoryName) =>{
    return ajax(prefix+'/manage/category/add', {parentId,categoryName},'POST');
};
//修改分类
export const reqUpdateCategorys = (categoryId ,categoryName) =>{
    return ajax(prefix+'/manage/category/update', {categoryId,categoryName},'POST');
};
//获取产品列表
export const reqGetProduct = (pageNum ,pageSize) =>{
    return ajax(prefix+'/manage/product/list', {pageNum,pageSize});
};
//添加产品
export const reqAddProduct = (obj) =>{
    return ajax(prefix+'/manage/product/add',obj,'POST');
};
//更新产品
export const reqUpdateProduct = (obj) =>{
    return ajax(prefix+'/manage/product/update',obj,'POST');
};
//删除图片
export const reqDelImage = (name,id) =>{
    return ajax(prefix+'/manage/img/delete',{name,id},'POST');
};
//搜索产品
export const reqSearchProduct = (data) =>{
    return ajax(prefix+'/manage/product/search',data);
};
//获取分类名
export const reqGetCateoryName = (categoryId) =>{
    return ajax(prefix+'/manage/category/info',{categoryId});
};
//更新商品状态
export const reqUpdateStatus = ( obj) =>{
    return ajax(prefix+'/manage/product/updateStatus',obj,'POST');
};
//添加用户
export const reqAddUser = ( obj) =>{
    return ajax(prefix+'/manage/user/add',obj,'POST');
};
//添加角色
export const reqAddRole = ( obj) =>{
    return ajax(prefix+'/manage/role/add',obj,'POST');
};
//获取所有角色
export const reqGetRoles = () =>{
    return ajax(prefix+'/manage/role/list');
};
//更新角色
export const reqUpdateRoles = (obj) =>{
    return ajax(prefix+'/manage/role/update',obj,'POST');
};
//获取所有用户
export const reqGetUsers = (obj) =>{
    return ajax(prefix+'/manage/user/list');
};
//更新用户
export const reqUpdateUser = (user) =>{
    return ajax(prefix+'/manage/user/update',user,'POST');
};
//删除用户
export const reqDeleteUser = (userId) =>{
    return ajax(prefix+'/manage/user/delete',{userId},'POST');
};
