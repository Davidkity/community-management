
import service from "@/utils/request";

// 加载费用开始日期
export function LoadBeginTime(data){
    return service.request({
        method: "post",
        url: "/costBill/getBeginDate/",
        data: data
    })
}

// 添加非固定费用的单据
export function CreateFree(data){
    return service.request({
        method: "post",
        url: "/costBill/addCostBillHead/",
        data: data
    })
}

// 获取费用的单据信息
export function GetCostBillInfo(data){
    return service.request({
        method: "post",
        url: "/costBill/getCostBillInfo/",
        data: data
    })
}


