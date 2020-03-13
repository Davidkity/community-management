import { reactive } from '@vue/composition-api';
export function paginationHook(){
    const pageData = reactive({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 50, 100]
    });
    // 统计数据总和
    const totalCount = (val) => pageData.total = val;
    const handleSizeChange = (val) => pageData.pageSize = val
    const handleCurrentChange = (val) => pageData.currentPage = val
    return {
        pageData, 
        handleSizeChange, 
        handleCurrentChange,
        totalCount
    }
}

/**
 * 表单的分页
 * 
 */