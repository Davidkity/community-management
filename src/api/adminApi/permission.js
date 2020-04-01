
import service from "@/utils/request";
/**
 * 获取角色
 */
export function GetRoles(){
    return service.request({
        method: "get",
        url: "/role/getRoles/",
    })
}

/**
 * 获取角色id
 */
export function GetRole(data){
    return service.request({
        method: "post",
        url: "/uRole/getURole/",
        data: data
    })
}

