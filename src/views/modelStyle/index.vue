
<template>
    <div class="plot">
        <div class="plot-content-top">
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
                            clearable>
                        </el-input>
                    </el-col> 
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="6">
                        <el-input
                            placeholder="请输入楼栋号"
                            clearable style="width: 100%;">
                        </el-input>
                    </el-col>
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="6">
                        <el-input
                            placeholder="请输入楼栋名称"
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
                    <el-col :span="22">小区信息</el-col>
                    <el-button class="moreButton" type="primary" @click="addPlot" size="small" icon="el-icon-circle-plus-outline">添加</el-button>
                </el-row>
            </div>
            <!-- 表格数据 -->
            <TableVue ref="plotTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
                
                <template v-slot:operation="slotData">
                    <el-button size="small"  @click="editPlot(slotData.data)">修改</el-button>
                    <el-button size="small"  @click="delPlot(slotData.data)">删除</el-button>
                </template>
                <template v-slot:tableFooterLeft >
                    <el-button size="small"  @click="handlerBatchDel()">批量删除</el-button>
                </template>
            </TableVue>
        </div>

         <!-- 新增弹窗 -->
        <DialogInfo :plotFlag.sync="data.dialog_info" :dialogName.sync="data.dialog_name" /> 
    </div>
    
</template>
<script>
import { reactive } from '@vue/composition-api';

//组件
import TableVue from "@/components/Table"; 
import DialogInfo from "./dialog/plotInfo"; 
export default {
    name: "plotSet",
    components: { TableVue, DialogInfo },

    setup(props, { root }) {

        const data = reactive({
            
            //弹窗开启的标志。默认关闭
            dialog_info: false,
            dialog_name: "",


            // 表格配置
            configTable: {
                // 勾选
                selection: true,
                // 表头
                tHead: [
                    { label: "业主编号",  field: "code", width: 200 },
                    { label: "名称",  field: "name", width: 100 },
                    { label: "性别", field: "sex", width: 80, columnType: "slot", slotName: "sexName" },
                    { label: "年龄", field: "age", width: 80 },
                    { label: "身份证", field: "idCard" },
                    { label: "联系方式", field: "phone" },
                    { label: "创建人", field: "createBy", width: 100 },
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    url: "getUserList",
                    data: {
                        mark: "MQ",
                        userMark: "US",
                        current: 1,
                        size: 10
                    }
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
        const addPlot = () => {
            console.log("添加");
            data.dialog_info = true;
            data.dialog_name = "添加小区";

        }

        // 修改
        const editPlot = () => {

        }

        // 删除
        const delPlot = () => {

        }

        // 批量删除
        const handlerBatchDel = () => {

        }
        return {
            data,
            search, addPlot, editPlot, delPlot, handlerBatchDel
        }
    }
}
</script>
<style lang="scss" scoped>
.plot {
    height: 100%;
}
.empty {
    color: #fff;
}
.plot-content-top {
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
</style>