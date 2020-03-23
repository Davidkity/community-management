
<template>
    <div class="costItem">
        <!--头-->
        <div class="costItem-content-top" style="height:90px" >
            <div class="search-title">
                <div> <p class="title">费用项设置</p> </div>
                    <div>
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                            <el-breadcrumb-item>费用项设置</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
            </div>
        </div>
        <div class="costItem-content-top">
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">查询条件</el-col>
                </el-row>
            </div>
            <div class="search-content">
                <el-row :gutter="14">
                    <el-col :span="6">
                        <el-input
                            placeholder="请输入楼栋编号"
                            v-model="search_code"
                            clearable>
                        </el-input>
                    </el-col> 
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="6">
                        <el-input
                            placeholder="请输入楼栋号"
                            v-model="search_num"
                            clearable style="width: 100%;">
                        </el-input>
                    </el-col>
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="6">
                        <el-input
                            placeholder="请输入楼栋名称"
                            v-model="search_name"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" class="searchButton" @click="search" icon="el-icon-search">
                            查询
                        </el-button>
                    </el-col>
                </el-row>
            </div>
        </div>

        <!-- 表格content数据 -->
        <div class="house-content">
            <div class="house-title">
                <el-row :gutter="20">
                    <el-col :span="22">费用项信息</el-col>
                    <el-button class="moreButton" type="primary" @click="addCostItem" size="small" icon="el-icon-circle-plus-outline">添加</el-button>
                </el-row>
            </div>
            <!-- 表格数据 -->
            <TableVue ref="costItemTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
                
                <template v-slot:operation="slotData">
                    <el-button size="small"  @click="editCostItem(slotData.data)">修改</el-button>
                    <el-button size="small"  @click="delCostItem(slotData.data)">删除</el-button>
                </template>
                <template v-slot:tableFooterLeft >
                    <el-button size="small"  @click="handlerBatchDel()">批量删除</el-button>
                </template>
            </TableVue>
        </div>
    </div>
    
</template>
<script>
import { reactive } from '@vue/composition-api';

//组件
import TableVue from "@/components/Table";  
export default {
    name: "costItemSet",
    components: { TableVue },

    setup(props, { root }) {

        const data = reactive({
            


            // 表格配置
            configTable: {
                // 勾选
                selection: true,
                // 表头
                tHead: [
                    { label: "费用项编号",  field: "code", width: 200 },
                    { label: "费用项名称",  field: "name", width: 100 },
                    { label: "计费方式", field: "computeWayCode", width: 80, columnType: "slot", slotName: "sexName" },
                    { label: "计费单价", field: "price" },
                    { label: "附加、固定费用", field: "otherCost" },
                    { label: "是否启用", field: "startUse", width: 80 },
                    { label: "创建人", field: "createBy", width: 100 },
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    // url: "getUserList",
                    // data: {
                    //     mark: "MQ",
                    //     userMark: "US",
                    //     current: 1,
                    //     size: 10
                    // }
                }
            }
        })



        /*************************************************************************
            方法
         */
        /*************查询title*********************************** */
        const search = () => {

        }


        /**  content 内的操作 *************************************** */

        // 添加
        const addCostItem = () => {

        }

        // 修改
        const editCostItem = () => {

        }

        // 删除
        const delCostItem = () => {

        }

        // 批量删除
        const handlerBatchDel = () => {

        }
        return {
            data,
            search, addCostItem, editCostItem, delCostItem, handlerBatchDel
        }
    }
}
</script>
<style lang="scss" scoped>
.costItem {
    height: 100%;
}
.empty {
    color: #fff;
}
.costItem-content-top {
    // position: fixed;
    z-index: 8999;
    height: 162px;
    
    margin-bottom: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
    @include webkit(box-sizing,border-box); 
    .search-title{
        line-height: 25px;
        font-weight:600;
        color: rgb(104, 107, 109);
        padding: 12px 20px 12px 20px;
        border-bottom: 1px solid #e7eaec;
       .moreButton {
           padding: 0 12px;
           float: right;
           line-height: 25px;
       }
        
    }
    .search-content {
        padding: 30px 20px 12px 20px;
        
        .searchButton {
            float: right;
        }
    }
    
}
.search-tools {
    float: right;
}


.house-content {
    height: 100%;
    // padding: 20px 20px 0 20px;
    // padding-right: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
}
.house-title {
    line-height: 35px;
    font-weight:600;
    padding: 12px 20px 12px 20px;
    color: rgb(104, 107, 109);
    border-bottom: 1px solid #e7eaec;
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