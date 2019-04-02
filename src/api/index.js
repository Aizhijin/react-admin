import ajax from './ajax';

const prefix =process.env.NODE_ENV==='development'? 'http://localhost:3000' : 'http://localhost:5000';

export const  reqLogin=(username,password)=>{
    console.log(username,password);
    return ajax(prefix+'/login',{username,password},'POST')
};