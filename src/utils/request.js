import axios from 'axios';
import { Message } from 'element-ui';

// 创建 axios ，赋给变量 service
// 根据环境，来声明一个变量并赋值
const BASEURL = process.env.NODE_ENV === "production" ? "" : "/api";
const service = axios.create({
    
    baseURL: BASEURL,  // http://192.168.0.104:8080/api == http://www.web-jshtml.cn/productapi
    timeout: 10000,     //延时时间设置，超过就不会去请求
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
});
//获取当前的环境   
console.log(process.env.NODE_ENV);

console.log(process.env.VUE_APP_ABC);

// 添加请求拦截器
// 请求之前所做的事情
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 后台需要前端这边传相关的参数（在请求头添加）
    // Tokey
    // userId
    // suid
    config.headers["Tokey"] = "111111";
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let data = response.data;
    if(data.resCode !== 200){
        Message.error(data.message);
        return Promise.reject(data);    //跑的是对应的 .vue 文件方法中的 catch 部分
    }else{
        return response;
        //  return Promise.resolve(data); //跑的是对应的 .vue 文件方法中的 then 部分
    }
  }, function (error) {
    // 对响应错误做点什么
    Message.error(data.message);
    return Promise.reject(error);
  });

  export default service;