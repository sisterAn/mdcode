/**
 * 生成基础axios对象，并对请求和响应做处理
 * 前后端约定接口返回解构规范
 * {
 *    code: 0,
 *    content:{},
 *    message:""
 * }
 */
import axios from 'axios'

// 创建一个独立的axios实例
const instance = axios.create({ 
    // 设置baseUr地址,如果通过proxy跨域可直接填写base地址
    baseURL: '/api',
    // 定义统一的请求头部
    headers: {
        'content-type': 'application/json',
    },
    // 配置请求超时时间
    timeout: 10000, 
    // 如果用的JSONP，可以配置此参数带上cookie凭证，如果是代理和CORS不用设置
    withCredentials: true
});
// 请求拦截
instance.interceptors.request.use(config => {
    // 自定义header，可添加项目token
    config.headers.token = 'token';
    return config;
});
// 返回拦截
instance.interceptors.response.use((response)=>{
    // 获取接口返回结果
    const res = response.data;
    // code为0，直接把结果返回回去，这样前端代码就不用在获取一次data.
    if(res.code === 0){
        return res;
    } else{
        // 错误显示可在service中控制，因为某些场景我们不想要展示错误
        console.error(res.message);
        return res;
    }
},()=>{
    console.log('网络请求异常，请稍后重试!');
});


function request(url, params, method){
    return new Promise((resolve,reject)=>{
        instance({
            url,
            method,
            data: JSON.stringify(params)
        }).then((res)=>{
            console.log('------------res: ')
            console.log(res)
            // 此处作用很大，可以扩展很多功能。
            // 比如对接多个后台，数据结构不一致，可做接口适配器
            // 也可对返回日期/金额/数字等统一做集中处理
            if(res.code === 0){
                resolve(res.content);
            }else{
                reject(res);
            }
        }).catch((error)=>{
            console.log(error.message)
        })
    })
}
// 封装GET请求
function get(url,params){
    return request(url,params,'get')
}
// 封装POST请求
function post(url,params){
    return request(url,params,'post')
}
export default {
    get,post
}