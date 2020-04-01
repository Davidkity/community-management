import service from "@/utils/request";

// 添加收款单
export function AddReceipt(data){
    return service.request({
        method: "post",
        url: "/receipt/addReceipt/",
        data: data
    })
}
