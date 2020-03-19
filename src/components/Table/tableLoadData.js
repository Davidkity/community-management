import { reactive } from '@vue/composition-api';
import { requestUrl } from "@/api/adminApi/requestUrl";
import { loadTableData } from "@/api/adminApi/common";

export function loadData(){
    const tableData = reactive({
        item: [],
        total: 0
    });

    const tableLoadData = (params) => {
        let requestJson = params
        let requestData = {
            url: requestUrl[requestJson.url],
            method: requestJson.method,
            data: requestJson.data
        }
        loadTableData(requestData).then(response => {
            let responseData = response.data.data;   //注意返回的数据的层数
            // 后台没有数据的时候就返回一个空的数组出来，不管怎样都是返回一个数组出来
            tableData.item = responseData.records;
            tableData.total = responseData.records.length === 0 ? 0 : response.data.data.total
            // 返回的数据存在
            // if(responseData && responseData.records.length > 0) {
            //     console.log("赋值")
            //     tableData.item = responseData.records;
            //     tableData.total = response.data.data.total
            // }
        }).catch(error => {})
    }

    return {
        tableData, tableLoadData
    }
}

/**
 * 多选框的加载数据
 * const tableData = reactive({
        item: [],   // 数据存放位置
        total: 0    // 数据总条数
    });
    tableLoadData ：请求接口的方法
    loadTableData： 请求接口  默认请求方式为  post
 */