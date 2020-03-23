import service from "@/utils/request";

/*******************************************************
 * 
 * 添加小区
 */
export function AddCommunity(data){
    return service.request({
        method: "post",
        url: "/community/addCommunity/",
        data: data
    });
}

/*******************************************************
 * 
 * 获取小区信息
 */
export function GetComunityInfo(data){
    return service.request({
        method: "post",
        url: "/community/getCommunityList/",
        data: data
    });
}


/*******************************************************
 * 
 * 修改指定小区信息
 */
export function EditCommunity(data){
    return service.request({
        method: "post",
        url: "/community/editCommunity/",
        data: data
    });
}

