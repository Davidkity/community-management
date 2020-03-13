<template>
    <div>
        <!-- 表格数据 -->
        <TableVue :config="data.configTable">
            <template v-slot:status="slotData">
                <!-- v-slot:status="slotData": status 是数据插槽中的定义的字段的值
                    slotData.data.name: 
                        slotData 是本地的 status 对应的值, 
                        data 是 TabelVue 组件中的 双向绑定的 data 的对象,
                        name 是 TabelVue 组件中的 双向绑定的 data 的对象对应的值
                -->
                <el-switch v-model="slotData.data.name" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </template>
            <!-- 插槽-方法 -->
                <template v-slot:operation="slotData">
                    <el-button size="small" type="danger" @click="operation(slotData.data)">删除</el-button>
                    <el-button size="small" type="success" @click="operation(slotData.data)">编辑</el-button>
                </template>
        </TableVue>
    </div>
</template>
<script>
import { reactive } from '@vue/composition-api';
import TableVue from "@/components/Table";  
export default {
    name: "userBind",
    components: { TableVue },
    setup(props, { root }) {

        const data = reactive({
            configTable: {
                // 多选框
                // selection: true,
                // 表头
                tHead: [
                    { label: "楼房编号",  field: "code", width: 200 },
                    { label: "编号",  field: "num", width: 200 },
                    { label: "楼房名称", field: "name" },
                    { label: "创建人", field: "createBy" },
                    { label: "禁启用状态", field: "status", columnType: "slot",  
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
        })

        /**
            方法
         */
        const operation = (params) => {
            console.log(params) 
        }
        
        return {
            data,
            operation
        }
    }
}
</script>
<style  lang="scss" scoped>

</style>