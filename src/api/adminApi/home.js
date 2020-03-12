
import service from "@/utils/request";

/*******************************************************
 * 
 * 楼栋
 */
export function AddBuild(data){
    return service.request({
        method: "post",
        url: "/build/addBuild/",
        data: data
    });
}

export function EditBuild(data){
    return service.request({
        method: "post",
        url: "/build/editBuild/",
        data: data
    });
}

export function GetList(data){
    return service.request({
        method: "post",
        url: "/build/getList/",
        data: data
    })
}

export function GetBuildList(data){
    return service.request({
        method: "post",
        url: "/build/getBuildList/",
        data: data
    })
}

export function Delete(data){
    return service.request({
        method: "post",
        url: "/build/delete/",
        data: data
    })
}

/************************************************************
 *  单元
 */
export function AddUnit(data){
    return service.request({
        method: "post",
        url: "/unit/addUnit/",
        data: data
    })
}

export function EditUnit(data){
    return service.request({
        method: "post",
        url: "/unit/editUnit/",
        data: data
    })
}

export function GetUnitList(data){
    return service.request({
        method: "post",
        url: "/unit/getList/",
        data: data
    })
}

export function DeleteUnit(data){
    return service.request({
        method: "post",
        url: "/unit/delete/",
        data: data
    })
}

/**********************************************************
 * 房屋
 * 
 */
// 室信息
export function FindHouseTypePre(data){
    return service.request({
        method: "get",
        url: "/typePre/getAll/",
        data: data
    })
}

// 厅信息
export function FindHouseTypeMid(data){
    return service.request({
        method: "get",
        url: "/typeMid/getAll/",
        data: data
    })
}

// 卫信息
export function FindHouseTypeSuf(data){
    return service.request({
        method: "get",
        url: "/typeSuf/getAll/",
        data: data
    })
}

// 添加房屋
export function AddHouse(data){
    return service.request({
        method: "post",
        url: "/house/addHouse/",
        data: data
    })
}

//获取房屋信息
export function GetHouseList(data){
    return service.request({
        method: "post",
        url: "/house/getAll/",
        data: data
    })
}

//修改房屋信息
export function EditHouse(data){
    return service.request({
        method: "post",
        url: "/house/editHouse/",
        data: data
    })
}

//删除房屋
export function DeleteHouse(data){
    return service.request({
        method: "post",
        url: "/house/deleteHouse/",
        data: data
    })
}

