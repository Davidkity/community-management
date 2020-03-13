
<template>
    <div class="red">
        
        <el-table 
            
            :data="data.tableData" 
            style="width: 100%" 
            :row-class-name="tableRowClassName"
        >
            <!-- 多选框 -->
            <el-table-column v-if="data.tableConfig.selection" type="selection" width="55"></el-table-column>

            <template v-for="item in data.tableConfig.tHead">
                <!--v-slot-->
                <el-table-column
                :key="item.field"
                :prop="item.field"
                :label="item.label"
                :width="item.width"
                v-if="item.columnType === 'slot'"
                >
                <template slot-scope="scope">
                    <slot :name="item.slotName" :data="scope.row"></slot>
                </template>
                </el-table-column>

                <!--文本数据渲染-->
                <el-table-column
                :key="item.field"
                :prop="item.field"
                :label="item.label"
                :width="item.width"
                v-else
                >
                </el-table-column>
            </template>
        </el-table>
        <!-- 页码 -->
        <el-pagination class="pagination"
            v-if="data.tableConfig.paginationShow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.currentPage"
            :page-sizes="pageData.pageSizes"
            :page-size="pageData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.total"
            background
        ></el-pagination>
    </div>
</template>
<script>
import { reactive, onBeforeMount, watch } from '@vue/composition-api';
import { loadData } from "./tableLoadData";
import { paginationHook } from "./paginationHook"
export default {

    name:"Table",
    props: {
        config: {
            type: Object,
            default: () => {}
        }
    },

    setup(props, { root }) {

        // 加载数据
        const { tableData, tableLoadData } = loadData({ root });
        // 页码
        const { pageData, handleSizeChange, handleCurrentChange, totalCount } = paginationHook();

        const data = reactive({
            // 加载效果
            loading: false,
            // 配置表单的属性
            tableConfig: {
                selection: false,
                recordCheckbox: false,
                requestData: {},  
                tHead: [],
                paginationLayout: "total, sizes, prev, pager, next, jumper",
                paginationShow: true
            },
            // 表单数据
            tableData: [],
        }) 

        // watch 数据监听
        // 数据渲染
        watch([
            () => tableData.item,
            () => tableData.total
        ], ([tableData, total]) => {
            data.tableData = tableData;
            totalCount(total);
        });
        // 页码监听
        watch([
            () => pageData.currentPage,
            () => pageData.pageSize
        ], ([currentPage, pageSize]) => {
            let requestData = data.tableConfig.requestData;
            if(requestData.data) {
                requestData.data.current = currentPage;
                requestData.data.size = pageSize;
                data.loading = true;
                tableLoadData(data.tableConfig.requestData);
                data.loading = false;
            }
        })

        // 初始化表格
        const initTableConfig = () => {
            // 获取外部传来的 config 数据
            let configData = props.config;
            // 把本地定义的 tableConfig 转化为 json(Map) 格式
            let keys = Object.keys(data.tableConfig);
            // 循环外部的的 configData
            for(let key in configData) {
                // 当内部的 config 的 key 与外部的 key 相匹配, 就把外部对应 key 的值赋值给内部
                if(keys.includes(key)) {
                    data.tableConfig[key] = configData[key];
                }
            }
        }

        // 表格的颜色样式
        const tableRowClassName = ({row, rowIndex}) => {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        }

        onBeforeMount(() => {
            initTableConfig();
            tableLoadData(data.tableConfig.requestData);
        })

        return {
            data, pageData,
            tableRowClassName, handleSizeChange, handleCurrentChange
        }
    }

    
}
</script>
<style lang="scss" scoped>
.pagination {
    margin: 20px, 20px, 20px 0;
    padding: 20px;
    float: right;
}
</style>

<!--
封装组件说明文档：
组件所在位置： src > components > Table > index.vue;
组件引用方式：import TableVue form "@/components/Table";
template: <TableVue :config="data.configTable" />;

参数配置：在 data 里面配置
configTable: {
    // 多选框
    selection: false,     // 多选款是否开启
    // 表头
    tHead: [
        { label: "楼房编号",  field: "code", width: 200 },
        { label: "编号",  field: "num", width: 200 },
        { label: "楼房名称", field: "name" },
        { label: "创建人", field: "createBy" },
        { label: "禁启用状态", field: "status", columnType: "slot",   // columnType 是插槽是否开启的标志( slot )
            // slotName: "status" 
        },
        { label: "操作", columnType: "slot",  slotName: "operation" }
    ],
    // 请求接口URL
    requestData: {
        url: "getBuildList",
        data: {
            mark: "MQ", 
            current: 1,
            size: 10
        }
    }
}
-->