import service from "@/utils/request";
/**
 * 获取验证码
 */
export function GetSms(data){
    return service.request({
        method: "post",
        url: "/email/getCheckCode/",
        data: data
    })
}

 /**
  * 获取用户角色
  */


  /**
   * 获取用户的所关联的小区
   * @param {*} data 
   */
export function GetCommunity(data = {}){
    return service.request({
        method: "post",
        url: "/uCommunity/getCommunityName/",
        data: data
    })
}

  /**
   * 登录
   */
export function Login(data){
    return service.request({
        method: "post",
        url: "/admin/login/",
        data: data
    })
}
   /**
    * 注册
    */
   export function Register(data){
       return service.request({
           method: "post",
           url: "/admin/register/",
           data: data
       })
   }