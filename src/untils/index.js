const User_key='user';

//设置用户信息
export function setItem(value) {
    if(!value||typeof value==='function'){
        console.log('数据保存失败！',value);
        return;
    }
    localStorage.setItem(User_key,JSON.stringify(value));
}
//获取
export function getItem() {
    const user=localStorage.getItem(User_key);
    if (!user) return '';
    return JSON.parse(user);
}

//删除
export function removeItem() {
    localStorage.removeItem(User_key);
}