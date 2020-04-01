
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
                            placeholder="请输入费用项名称"
                            v-model="data.selectOption.search_name"
                            clearable>
                        </el-input>
                    </el-col> 
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="6">
                        <el-select v-model="data.selectOption.search_computeWay" clearable placeholder="请选择计费方式" >
                            <el-option
                                v-for="item in data.computeWays"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                        
                    </el-col>
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="6">
                        <SelectVue :config="data.configOption" :selectVal.sync="data.selectOption.search_startUse"></SelectVue>
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
                
                <template v-slot:use="slotData">
                    <el-switch style="width:100px"
                        v-model="slotData.data.startUse" 
                        active-color="#13ce66" 
                        inactive-color="#ff4949"
                        active-value="Y"
                        inactive-value="N"
                        @change="useChange(slotData.data)"
                        ></el-switch>
                </template>

                <template v-slot:operation="slotData">
                    <el-button size="small"  @click="editCostItem(slotData.data.costItemId)">修改</el-button>
                    <el-button size="small"  @click="delCostItem(slotData.data.costItemId)">删除</el-button>
                </template>
                <template v-slot:tableFooterLeft >
                    <el-button size="small"  @click="handlerBatchDel()">批量删除</el-button>
                </template>
            </TableVue>
        </div>

        <!-- 新增弹窗 -->
        <CostItemDialog :costItemFlag.sync="data.costItemDialog" :uId.sync="data.uId" :costItemId.sync="data.costItemId" :buttonType.sync="data.buttonType" :dialogName.sync="data.dialogName"   @getChangeData="getList"></CostItemDialog>
    </div>
    
</template>
<script>
import { global } from "@/utils/global_V3.0.js";
import { reactive, onMounted, computed } from '@vue/composition-api';
import { EditCostItem, CostItemDel, GetComputeWay } from "@/api/adminApi/sys";
import { getCommunity  } from "@/utils/app";
//组件
import TableVue from "@/components/Table";  
import SelectVue from "@/components/Select";
import CostItemDialog from "./dialog/costItemInfo";
export default {
    name: "costItemSet",
    components: { TableVue, SelectVue, CostItemDialog },

    setup(props, { root, refs }) {
        const { confirm } = global();
        const marks = getCommunity();
        const userName = computed(() => root.$store.state.app.username);
        const data = reactive({
            username: userName,
            temmpMark: "",      //用于修改弹窗中显示的小区
            // 用户id
            uId: root.$store.getters['app/id'],
            // 费用项id
            costItemId: "",
            // 费用项计费方式
            computeWays: [],
            // 选择条件
            selectOption: {
                search_name: "",
                search_computeWay: "",
                search_startUse: ""
            },

            configOption: {
                clearFlag: true,
                selectValue: "",
                init: ["Y", "N"]
            },
            costItemDialog: false,
            buttonType: "",
            dialogName: "",

            // 表格配置
            configTable: {
                // 勾选
                selection: true,
                // 表头
                tHead: [
                    { label: "费用项编号",  field: "code", width: 200 },
                    { label: "费用项名称",  field: "name", width: 180 },
                    { label: "计费方式", field: "computeWayName", width: 180,  },
                    { label: "计费单价", field: "price" },
                    { label: "附加/固定费用", field: "otherCost" },
                    { label: "是否启用", field: "startUse", width: 80, columnType: "slot",  slotName: "use" },
                    { label: "创建人", field: "createBy", width: 100 },
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    url: "getCostItemList",
                    data: {
                        mark: marks,
                        current: 1,
                        size: 10
                    }
                }
            },

            // 表格数据
            tableRow: {},

            costItemIds: []
        })



        /*************************************************************************
            方法
         */
        /*************查询title*********************************** */
        const search = () => {
            let requestData = {
                url: "getCostItemList",
                data: {
                    mark: marks,
                    name: data.selectOption.search_name,
                    computeWayCode: data.selectOption.search_computeWay,
                    startUse: data.selectOption.search_startUse,
                    current: 1,
                    size: 10
                }
            }
            getList(requestData)
        }


        /**  content 内的操作 *************************************** */

        
        //刷新数据、显示数据
        const getList = (params) => {
            refs.costItemTable.refreshData(params);
        }
        
        // 加载费用项计算方式
        const loadComputeWay = () => {
            GetComputeWay({id: -1}).then(response => {
                let responseData = response.data.data;
                data.computeWays = responseData;
            })
        }

        // 添加
        const addCostItem = () => {
            data.costItemDialog = true;
            data.dialogName = "添加费用项";
            data.buttonType = "addCostItem";
        }

        // 修改
        const editCostItem = (id) => {
            data.costItemDialog = true;
            data.dialogName = "修改费用项";
            data.buttonType = "editCostItem";
            data.costItemId = id;
            data.temmpMark = marks;
        }

        // 删除
        const delCostItem = (id) => {
            data.costItemIds = [id];
            confirm({
                context: "确认删除当前所选信息，确认后将无法恢复！！",
                type: "warning",
                fn: costItemDelete
            })
        }

        // 批量删除
        const handlerBatchDel = () => {
            if(!data.tableRow.idItem || data.tableRow.idItem == 0){
                root.$message({
                    message: "请选择需要删除的用户",
                    type: "error"
                })
                return false;
            }
            data.costItemIds = data.tableRow.idItem.map(item => item.costItemId);
            confirm({
                context: "确认删除当前所选全部信息，确认后将无法恢复！！",
                type: "warning",
                fn: costItemDelete
            })
        }
        
        // 删除
        const costItemDelete = () => {
            let requestData = JSON.stringify(data.costItemIds);
            CostItemDel(requestData).then(response => {
                let responseData = response.data;
                refs.costItemTable.refreshData();
                root.$message({
                    message:  responseData.message,
                    type: "success"  
                })
            }).catch(error => {

            })
        }
        // 启动/关闭变化
        const useChange = (params) => {
            if(params.startUse == "Y"){
                if(params.price == 0 && params.otherCost == 0){
                    root.$message({
                        message: "不能开启此费用项，此费用项的单价和附加/固定费用都为空",
                        type: "error"
                    })
                    let requestData = {
                        url: "getCostItemList",
                        data:{
                            mark: marks,
                            current: 1,
                            size: 10,
                        }
                    }
                    getList(requestData);
                    return false;
                }else{
                    let requestData = {
                        costItemId: params.costItemId,
                        username: data.username,
                        startUse: "Y"
                    }
                    EditCostItem(requestData).then(response => {
                        root.$message({
                            message: response.data.message,
                            type: "success"
                        })
                    }).then(error => {

                    })
                }
            }else{
                let requestData = {
                    costItemId: params.costItemId,
                    username: data.username,
                    startUse: "N"
                }
                EditCostItem(requestData).then(response => {
                    root.$message({
                        message: response.data.message,
                        type: "success"
                    })
                }).then(error => {

                })
            }
        } 

        onMounted(() => {
            // getList();
            loadComputeWay()
        })
        return {
            data, marks,
            search, addCostItem, editCostItem, delCostItem, handlerBatchDel, getList, useChange,
            loadComputeWay

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