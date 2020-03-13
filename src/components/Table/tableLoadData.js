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
            let responseData = response.data.data.data;
            // 返回的数据存在
            if(responseData && responseData.length > 0) {
                tableData.item = responseData;
                tableData.total = response.data.data.total
            }
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