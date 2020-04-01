import service from "@/utils/request";

/*******************************************************
 * 
 * 获取费用项计算方式
 */
export function GetComputeWay(data = {}){
    return service.request({
        method: "post",
        url: "/computeWay/getComputeWay/",
        data: data
    });
}



/*******************************************************
 * 
 * 添加费用项
 */
export function AddCostItem(data){
    return service.request({
        method: "post",
        url: "/costItem/addCostItem/",
        data: data
    });
}


/*******************************************************
 * 
 * 获取费用项
 */
export function GetCostItem(data = {}){
    return service.request({
        method: "post",
        url: "/costItem/getCostItem/",
        data: data
    });
}

/*******************************************************
 * 
 * 修改费用项
 */
export function EditCostItem(data){
    return service.request({
        method: "post",
        url: "/costItem/editCostItem/",
        data: data
    });
}

/*******************************************************
 * 
 * 删除费用项
 */
export function CostItemDel(data){
    return service.request({
        method: "post",
        url: "/costItem/delCostItem/",
        data: data
    });
}

/*******************************************************
 * 
 * 获取全部的支付周期
 */
export function GetPaymentCycle(data){
    return service.request({
        method: "get",
        url: "/paymentCycle/getPaymentCycle/",
        data: data
    });
}


