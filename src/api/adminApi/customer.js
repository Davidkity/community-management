

import service from "@/utils/request";
/**
 * 用户绑定业主
 */
export function AddBindUser(data){
    return service.request({
        method: "post",
        url: "/bindUser/addBindUser/",
        data: data
    })
}
