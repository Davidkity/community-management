
<template>
    <div class="houseFree">
         <!--头-->
        <div class="houseFree-content-top" style="height:90px" >
            <div class="search-title">
                <div> <p class="title">房屋费用</p> </div>
                    <div>
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>费用管理</el-breadcrumb-item>
                            <el-breadcrumb-item>房屋费用</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
            </div>
        </div>
         <div class="houseFree-content-top" :style="data.unit_top_height">
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">查询条件</el-col>
                    <el-button class="moreButton" type="text" @click="changeSelect" >{{ data.moreConditionSelect }}</el-button>
                </el-row>
            </div>
            <div class="search-content">
                <el-row :gutter="14">
                    <el-col :span="5">
                        <el-select v-model="data.selectOptions.search_buildValue" clearable @change="buildChange" placeholder="请选择楼栋">
                            <el-option
                            v-for="item in data.buildOptions"
                            :key="item.buildId"
                            :label="item.name"
                            :value="item.buildId">
                            </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="2" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-select v-model="data.selectOptions.search_unitValue" clearable @change="unitChange"  placeholder="请选择单元">
                            <el-option
                            v-for="item in data.unitOptions"
                            :key="item.unitId"
                            :label="item.num" 
                            :value="item.unitId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-select v-model="data.selectOptions.search_houseValue" clearable placeholder="请选择房屋">
                            <el-option
                            v-for="item in data.houseOptions"
                            :key="item.houseId"
                            :label="item.num"
                            :value="item.houseId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <el-button type="primary" class="searchButton" @click="search" icon="el-icon-search">
                            查询
                        </el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="14" class="el_col_hidden" :hidden="data.conditionIsHidden">
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入业主名"
                            v-model="data.selectOptions.search_name"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="2" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入业主身份证"
                            v-model="data.selectOptions.search_idCard"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="2" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入联系方式"
                            v-model="data.selectOptions.search_phone"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="5" class="empty">.</el-col>
                </el-row>
            </div>
         </div>

         <!-- 表格显示数据 -->
        <div class="houseFree-content">

            <div class="houseFree-title">
                <el-row :gutter="20">
                    <el-col :span="22">房屋信息</el-col>
                    <el-button class="moreButton" type="primary"  size="small" @click="batchCreateFree" icon="el-icon-circle-plus-outline">批量创建</el-button>
                </el-row>
            </div>

            <!-- 表格数据 -->
            <TableVue ref="houseInfoTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
                <template v-slot:buildNum="slotData">
                    <label>{{ slotData.data.buildNum }} 号楼</label>
                </template>
                <template v-slot:unitNum="slotData">
                    <label>{{ slotData.data.unitNum }} 单元</label>
                </template>
                <template v-slot:num="slotData">
                    <label>{{ slotData.data.num }} 号房</label>
                </template>
                <template v-slot:operation="slotData">
                    <el-button size="small"  @click="createBill(slotData.data)">创建费用</el-button>
                    <el-button size="small"  @click="lookBill(slotData.data.houseId)">查看收费</el-button>
                </template>
                <template v-slot:tableFooterLeft >
                    <label class="empty">.</label>
                </template>
            </TableVue>
        </div>
        <!-- 新增弹窗 -->
        <BatchCreateFreeDialog :batchCreateFlag.sync="data.batchCreateDialog" :buttonType.sync="data.buttonType" :dialogName.sync="data.dialogName"  ></BatchCreateFreeDialog>
        <CreateFreeDialog :createFlag.sync="data.createDialog" :rowData.sync="data.rowData" :buttonType.sync="data.buttonType" :dialogName.sync="data.dialogName"  ></CreateFreeDialog>
    </div>
</template>
<script>
import { reactive, onMounted } from '@vue/composition-api';
import { setCommunity, getCommunity  } from "@/utils/app";
import { GetList, GetUnitList, GetHouseList } from "@/api/adminApi/home";

//组件
import TableVue from "@/components/Table";  
import BatchCreateFreeDialog from "./dialog/batchCreateFree";
import CreateFreeDialog from "./dialog/createFree";
export default {
    name: "houseFree",
    components: { TableVue, BatchCreateFreeDialog, CreateFreeDialog },

    setup(props, { root, refs }) {
        const marks = getCommunity();
        const data = reactive({
            moreConditionSelect: "更多",
            unit_top_height: "height:132px",
            conditionIsHidden: "true",

            //弹窗
            batchCreateDialog: false,
            createDialog: false,
            buttonType: "",
            dialogName: "",

            // 条件查询
            selectOptions: {
                search_name: "",
                search_idCard: "",
                search_phone: "",
                search_buildValue: "",
                search_unitValue: "",
                search_houseValue: ""
            },
            buildOptions: [],
            unitOptions: [],
            houseOptions: [],

            // 表格行记录
            rowData: {},
            //表格
            configTable: {
                loading: true,
                // 表头
                tHead: [
                    { label: "房屋编码",  field: "code", width: 200 },
                    { label: "楼栋号",  field: "buildNum", width: 100, columnType: "slot",  slotName: "buildNum"},
                    { label: "单元号", field: "unitNum", width: 100, columnType: "slot",  slotName: "unitNum"},
                    { label: "房屋号", field: "num", width: 120, columnType: "slot",  slotName: "num" },
                    { label: "业主编码",  field: "userCode", width: 200 },
                    { label: "业主名字", field: "userName", width: 100},
                    { label: "业主身份证", field: "idCard", width: 200 },
                    { label: "联系方式",  field: "phone", width: 120 },
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    url: "getCheckInHouseInfoList",
                    data: {
                        mark: marks,
                        current: 1,
                        size: 10
                    }
                }
            }
        })


        /*******************************************************************************
            方法
         */
        // 更多/隐藏
        const changeSelect = () => {
            if(data.moreConditionSelect == "更多"){
                data.conditionIsHidden = false;
                data.unit_top_height = "height: 186px";
                data.moreConditionSelect = "隐藏";
            }else{
                data.conditionIsHidden = true;
                data.unit_top_height = "height: 132px";
                data.moreConditionSelect = "更多";
            }
        }

        // 查找
        const search = () => {
            let requestData = {
                url: "getCheckInHouseInfoList",
                data: {
                    mark: marks,
                    current: 1,
                    size: 10,
                    userName: data.selectOptions.search_name,
                    idCard: data.selectOptions.search_idCard,
                    phone: data.selectOptions.search_phone,
                    buildId: data.selectOptions.search_buildValue,
                    unitId: data.selectOptions.search_unitValue,
                    houseId: data.selectOptions.search_houseValue,
                }
            }
            getList(requestData);
        }
        
        //刷新数据
        const getList = (params) => {
            refs.houseInfoTable.refreshData(params);
        }
        // 加载 楼栋，单元，房屋 数据
        const loadBuild = () => {
            let requestData = {
                mark: marks,
                current: 1,
                size: 1000000
            }
            GetList(requestData).then(response => {
                let responseData = response.data.data.data;
                data.buildOptions = responseData;
            }).catch(error => {

            })
        }
        const buildChange = () => {
            loadUnit();
            loadHouse();
        }
        const loadUnit = () => {
            let requestData = {
                mark: marks,
                unitMark: "UN",
                buildId: data.selectOptions.search_buildValue,
                current: 1,
                size: 1000000
            }
            GetUnitList(requestData).then(response => {
                let responseData = response.data.data.data;
                data.unitOptions = responseData;
            }).catch(error => {

            })
        }
        const unitChange = () => {
            loadHouse();
        }
        const loadHouse = () => {
            let requestData = {
                mark: marks,
                houseMark: "HO",
                buildId: data.selectOptions.search_buildValue,
                unitId: data.selectOptions.search_unitValue,
                current: 1,
                size: 1000000
            }
            GetHouseList(requestData).then(response => {
                let responseData = response.data.data.records;
                data.houseOptions = responseData;
            }).catch(error => {

            })
        }

        // 表格
        // 批量创建
        const batchCreateFree = () => {
            data.batchCreateDialog = true;
            data.dialogName = "批量创建费用";
            data.buttonType = "batchCreateFree";
        }
        //创建费用
        const createBill = (params) => {
            data.rowData = params;
            data.createDialog = true;
            data.dialogName = "创建费用";
            data.buttonType = "createFree";
        }

        //查看费用
        const lookBill = (houseId) => {
            // 路由跳转
            root.$router.push({
                path: `/HouseFreeInfo/${houseId}`  // es6的写法
                // params: {
                //     userId: data.userId
                // }
            });
        }

        onMounted(() => {
            loadBuild(),
            loadUnit(),
            loadHouse()
        })
        return {
            data, marks, 
            loadBuild, loadUnit, loadHouse, buildChange, unitChange,
            changeSelect, search, getList,
            batchCreateFree, createBill, lookBill
        }
    }
}
</script>
<style lang="scss" scoped>
.houseFree {
    height: 100%;
    
}
.empty {
    color: #fff;
    
}

.houseFree-content-top {
    // position: fixed;
    z-index: 8999;
    // height: 162px;
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
        padding: 18px 20px 12px 20px;
        
        .searchButton {
            float: right;
        }

        .el_col_hidden {
            padding-top: 18px;
        }
    }
    
}
.search-tools {
    float: right;
}

.houseFree-content {
    height: 100%;
    // padding: 20px 20px 0 20px;
    // padding-right: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
}
.houseFree-title {
    line-height: 35px;
    font-weight:600;
    padding: 12px 20px 12px 20px;
    color: rgb(104, 107, 109);
    border-bottom: 1px solid #e7eaec;
}
.houseFree-info {
    padding: 20px
}
.el-table .warning-row {
    background: oldlace;
}
.el-table .success-row {
    background: #f0f9eb;
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