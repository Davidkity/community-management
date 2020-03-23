<template>
    <div class="house">
        <!--头-->
        <div class="house-content-top" :style="data.house_top_height">
            <div class="house-title">
                <div> <p class="title">查询条件</p> </div>
                <div>
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
        </div>
        
        <div>
            <SelectVue :config="data.configOption" :selectVal.sync="data.selectVal1"></SelectVue>
            <!-- 表格数据 -->
            <TableVue :config="data.configTable" >
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
    </div>
    
</template>
<script>
import { reactive } from '@vue/composition-api';
import TableVue from "@/components/Table";  
import SelectVue from "@/components/Select"; 
import { setCommunity, getCommunity  } from "@/utils/app";
export default {
    name: "userBind",
    components: { TableVue, SelectVue },
    setup(props, { root }) {

        const marks = getCommunity();

        const data = reactive({
           
            selectVal1: "",
            configOption: {
                clearFlag: true,
                init: ["name", "phone"]
            },

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
                        mark: marks,
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
            console.log(params) ;
            console.log(data.selectVal1);
        }
        
        return {
            data, marks,
            operation
        }
    }
}
</script>
<style  lang="scss" scoped>

.house {
    height: 100%;
    
}
.empty {
    color: #fff;
    
}
.house-content-top {
    // position: fixed;
    z-index: 8999;
    // height: 162px;
    margin-bottom: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
    @include webkit(box-sizing,border-box); 
    .house-title{
        line-height: 25px;
        font-weight:600;
        color: rgb(104, 107, 109);
        padding: 12px 20px 12px 20px;
        border-bottom: 1px solid #e7eaec;     
    } 
}
.title {
    font-size: 24px;
    font-weight: 10px;
    
}
.el-breadcrumb__item {
    font-size: 14px;
    margin-top: 15px;
}
</style>