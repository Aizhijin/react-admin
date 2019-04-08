import ajax from './ajax';
import jsonp from 'jsonp';

const prefix =process.env.NODE_ENV==='development'? 'http://localhost:3000' : 'http://localhost:5000';

export const  reqLogin=(username,password)=>{
    console.log(username,password);
    return ajax(prefix+'/login',{username,password},'POST')
};

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