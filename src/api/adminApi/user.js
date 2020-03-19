import service from "@/utils/request";

/*******************************************************
 * 
 * 业主
 */
// 添加业主
export function AddUser(data){
    return service.request({
        method: "post",
        url: "/user/addUser/",
        data: data
    });
}
// 查询业主信息
export function UserInfo(data){
    return service.request({
        method: "post",
        url: "/user/getUserList/",
        data: data
    });
}
// 删除业主
export function UserDelete(data){
    return service.request({
        method: "post",
        url: "/user/delUser/",
        data: data
    });
}
// 修改业主
export function EditUser(data){
    return service.request({
        method: "post",
        url: "/user/editUser/",
        data: data
    });
}

// 业主入住房屋
export function UserCheckIn(data){
    return service.request({
        method: "post",
        url: "/checkIn/addCheckIn/",
        data: data
    });
}

// 业主入住房屋
export function DelCheckIn(data){
    return service.request({
        method: "post",
        url: "/checkIn/delete/",
        data: data
    });
}

//获取业主成员信息
export function GetMemberList(data){
    return service.request({
        method: "post",
        url: "/userMember/getList/",
        data: data
    });
}

// 删除业主关系
export function DelMember(data){
    return service.request({
        method: "post",
        url: "/userMember/delete/",
        data: data
    });
}




// 分页条件查询业主信息
// export function getUserInfo(data){
//     return service.request({
//         method: "post",
//         url: "/user/getUserInfo/",
//         data: data
//     });
// }