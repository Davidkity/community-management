<template>
    <div class="unit">
         <!--头-->
        <div class="unit-content-top" style="height:90px" >
            <div class="search-title">
                <div> <p class="title">房屋信息</p> </div>
                    <div>
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>资产管理</el-breadcrumb-item>
                            <el-breadcrumb-item>房屋信息</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
            </div>
        </div>
        <div class="unit-content-top" :style="data.unit_top_height">
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">查询条件</el-col>
                    <el-button class="moreButton" type="text" @click="changeSelect" >{{ data.moreConditionSelect }}</el-button>
                </el-row>
            </div>
            <div class="search-content">
                <el-row >
                    <el-col :span="5">
                        <el-input
                            placeholder="请选择楼栋"
                            v-model="data.selectOptions.search_buildName"
                            @input="cleanBuildId"
                            clearable>
                        </el-input>
                       
                    </el-col> 
                    <el-col :span="2" >
                        <el-button type="primary"  @click="chooseBuild" icon="el-icon-search">选择</el-button>
                    </el-col>
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-input
                            placeholder="请选择单元"
                            v-model="data.selectOptions.search_unitNum"
                            clearable style="width: 100%;">
                        </el-input>
                    </el-col>
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入房屋号"
                            v-model="data.selectOptions.search_houseNum"
                            clearable>
                        </el-input>
                    </el-col>

                    <el-col :span="5">
                        <el-button type="primary" class="searchButton" @click="search" icon="el-icon-search">
                            查询
                        </el-button>
                    </el-col>
                </el-row>

                <el-row  class="el_col_hidden" :hidden="data.conditionIsHidden">
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入房屋编码"
                            v-model="data.selectOptions.search_houseCode"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="3" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-select v-model="data.selectOptions.search_houseStatus" clearable placeholder="请选择房屋状态">
                        <el-option
                        v-for="item in data.houseStatus_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 表格显示数据 -->
      <div class="unit-content">

            <div class="unit-title">
                <el-row :gutter="20">
                    <el-col :span="22">房屋信息</el-col>
                    <el-button class="moreButton" type="primary" @click="addHouse" size="small" icon="el-icon-circle-plus-outline">添加房屋</el-button>
                </el-row>
            </div>
            <div class="unit-info">
                <el-table :data="data.tableData.item" border @selection-change="handleSelectionChange" style="width: 100%"
                v-loading="data.loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="code" label="房屋编码" width="200"></el-table-column>
                    <el-table-column prop="buildNum" label="楼栋号" :formatter="formatNum" width="100" ></el-table-column>
                    <el-table-column prop="unitNum" label="单元号" :formatter="formatNum" width="100" ></el-table-column>
                    <el-table-column prop="num" label="房屋号" :formatter="formatHouseNum" width="100" ></el-table-column>
                    <el-table-column prop="floor" label="楼层" :formatter="formatLayer" width="80"></el-table-column>
                    <el-table-column prop="typeName" label="房屋户型"  width="180"></el-table-column>
                    <el-table-column prop="area" label="建筑面积" :formatter="formatArea" width="110"></el-table-column>
                    <el-table-column prop="price" label="单价" width="100" :formatter="formatPrice"></el-table-column>
                    <el-table-column prop="houseStatus" label="房屋状态" width="100"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="deleteItem(scope.row.houseId)">删除</el-button>
                            <el-button size="mini" type="text" @click="dialogEdit(scope.row.houseId, 
                                                                                     scope.row.preCode,
                                                                                     scope.row.midCode,
                                                                                     scope.row.sufCode)">编辑</el-button>
                            <el-button size="mini" type="text" v-if="scope.row.statusCode != 'FREE'" @click="costItemSet(scope.row.houseId)">费用项</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="black-space-30"></div>
                <!-- 底部分页 -->
                <el-row>
                    <el-col :span="12">
                        <el-button size="medium" type="danger" @click="deleteAll">批量删除</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-pagination 
                            class="pull-right"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            background 
                            :page-sizes="[10, 20, 30, 40]"
                            layout="total, sizes, prev, pager, next, jumper" 
                            :total="data.totals">
                        </el-pagination>
                    </el-col>
                </el-row>
                <!-- 新增弹窗 -->
                <DialogEditHouse :editHouseFlag.sync="data.dialog_info" :houseId.sync="data.infoId"  @getChangeData="getList" /> 
                <DialogChooseBuild :chooseBuildflag.sync="data.dialog_choose_Build" :buttonType.sync="data.buttonType" :chooseBuildId.sync="data.selectOptions.search_buildId" :chooseBuildName.sync="data.selectOptions.search_buildName" />
               <!-- <DialogInfo :flag.sync="dialog_info" :category="options.category" /> -->
            </div>
        </div>
   </div>
    
</template>

<script>
import { GetHouseList, GetBuildList, DeleteHouse } from "@/api/adminApi/home";
import DialogEditHouse from "./dialog/editHouse";
import DialogChooseBuild from "./dialog/chooseBuild";
import { global } from "@/utils/global_V3.0.js";
import { ref, reactive, onMounted } from '@vue/composition-api';
import { setCommunity, getCommunity  } from "@/utils/app";
export default {
    components: {
        DialogEditHouse,
        DialogChooseBuild
    },
    setup(props, { root }) {
        // console.log(root.$route.params.buildId);
        
        const data = reactive({
            marks: getCommunity(),
            unit_top_height: "height:132px",
            moreConditionSelect: "更多",
            conditionIsHidden: "true",
            dialogEditHouse: false,
            dialog_choose_Build: false,
            selectOptions: {
                search_buildId: "",
                search_buildName: "",
                search_unitNum: "",
                search_houseNum: "",
                search_houseCode: "",
                search_houseStatus: ""
            },
            houseStatus_options: [
                { value: 'FREE', label: '空闲' },
                { value: 'RENT', label: '已租' },
                { value: 'SOLD', label: '已卖' }
            ],
            elevator_value: "",
            totals: 0,
            dialog_info: false,

            deleteInfoId: "",
            infoId: "",
            buttonType: "",
            dialog_name: "添加楼栋",
            tableData: {
                item: []
            },
            page: {
                pageNumber: 1,
                pageSize: 10
            }
        });
        // 相当于给方法换了一个名称
        const { confirm } = global()

        /***************************************************************************************
            方法
         */

        const formatNum = (row, column) => {
            return row[column.property] + "单元";
        }
        const formatHouseNum = (row, column) => {
            return row[column.property] + "房号";
        }
        
        const formatLayer = (row, column) => {
            return row[column.property] + "层";
        }

        const formatArea = (row, column) => {
            return row[column.property] + "平方米";
        }

        const formatPrice = (row, column) => {
            return row[column.property] + "元";
        }
        
        
        //查询条件
        const chooseBuild = () => {
            data.dialog_choose_Build = true;
            data.buttonType = "单元中选择楼栋";
        }

        

        // 添加房屋
        const addHouse = () => {
            // 路由跳转
            root.$router.push({
                name: "AddHouse",
            });
        }

        // 修改
        const dialogEdit = (houseId, preCode, midCode, sufCode) =>{
            data.infoId = houseId;
            data.dialog_info = true;
        }
        // 详情
        const dialogInfo = (id) => {
            data.infoId = id;
            data.buttonType = "infoButton";
            data.dialog_name = "单元详情";
            data.dialog_info = true;
        }
        /*******************************************************************
            方法
         */
        /**
            选择楼栋
         */
       
        
        //是否隐藏更多查询条件
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
        //根据情况清空查询条件里面的 buildId
        const cleanBuildId = () => {
            if(data.selectOptions.search_buildName == ""){
                data.selectOptions.search_buildId = "";
            }
        }
        // 查询
        const search = () => {
            // return false;
            let requestData = {
                mark: data.marks,
                houseMark: "HO",
                buildId: data.selectOptions.search_buildId,
                unitNum: data.selectOptions.search_unitNum,
                houseNum: data.selectOptions.search_houseNum,
                houseCode: data.selectOptions.search_houseCode,
                statusCode: data.selectOptions.search_houseStatus,
                current: data.page.pageNumber,
                size: data.page.pageSize
            }
             // 加载状态
            data.loading = true;
            GetHouseList(requestData).then(response => {
                let responseData = response.data;
                // 更新数据
                data.tableData.item = responseData.data.records;
                // 更新页码总数
                data.totals = responseData.data.total;
                data.loading = false;
                
            }).catch(error => {
                data.loading = false;
            })
        }
        /**
            表格数据颜色的变化
         */
        const tableRowClassName = (row, rowIndex) => {
            return rowIndex === 1 ? 'warning-row' : 'success-row';
        }
        // 表格
        const handleSelectionChange = (val) =>{
            
            // 映射出数据（筛选出id）
            let unitId = val.map(item => item.unitId)
            data.deleteInfoId = unitId;
            console.log("unitId: " + unitId);
        }
        //每页的条数
        const handleSizeChange = (val) =>{
            data.page.pageSize = val;
            getList();
        }
        //当前是第几页
        const handleCurrentChange = (val) =>{
            data.page.pageNumber = val;
            getList();
        }
        
        /**
            显示所有数据
         */
        const getList = (() => {
            let requestData = {
                mark: data.marks,
                houseMark: "HO",
                current: data.page.pageNumber,
                size: data.page.pageSize
            }
            // 加载状态
            data.loading = true;
            GetHouseList(requestData).then(response => {
                
                let responseData = response.data;
                // 更新数据
                data.tableData.item = responseData.data.records;
                // 更新页码总数
                data.totals = responseData.data.total;
                data.loading = false;
            }).catch(error => {
                data.loading = false;
            })
           
        });
        
        /** 
            删除全部
         */
        const deleteAll = () => {

            if(!data.deleteInfoId || data.deleteInfoId.length == 0){
                root.$message({
                    message: "请选择要删除的数据！！",
                    type: "warning"
                })
            }
            confirm({
                context: "确认删除当前所选全部信息，确认后将无法恢复！！",
                type: "warning",
                fn: confirmDelete
            })
        }
        // 删除
        const deleteItem = (id) => {
            data.deleteInfoId = [id];
            confirm({
                context: "确认删除当前信息，确认后将无法恢复！！",
                tip: "警告",
                type: "warning",
                fn: confirmDelete
            });
        }
        // 确认删除
        const confirmDelete = (value) => {
            console.log("确认： " + data.deleteInfoId);
            let requestData = JSON.stringify(data.deleteInfoId)
            DeleteHouse(requestData).then(response => {
                data.deleteInfoId = "";
                getList();
            }).catch(error => {

            });
        }
        
        const costItemSet = (houseId) => {
            // 路由跳转
            root.$router.push({
                path: `/HouseCostItem/${houseId}`  // es6的写法
                // params: {
                //     userId: data.userId
                // }
            });
        }
        /**
            生命周期
         */
        onMounted(() => {
            //获取列表
            getList();
        })
        return {
            data,
            // ref
            // search_unitNum, search_code, search_name, dialog_info, totals, loading, infoId, buttonType, dialog_name,
            // //reactive
            // tableData,
            // 方法、函数
            changeSelect, cleanBuildId, search, tableRowClassName,handleSizeChange,handleCurrentChange, handleSelectionChange, 
            deleteAll, deleteItem, confirmDelete, getList, dialogEdit, dialogInfo, 
            formatNum, formatLayer, formatArea, formatPrice, formatHouseNum, addHouse, chooseBuild, costItemSet

        }
    }
}
</script>

<style lang="scss" scoped>

.unit {
    height: 100%;
    
}
.empty {
    color: #fff;
    
}

.unit-content-top {
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

.unit-content {
    height: 100%;
    // padding: 20px 20px 0 20px;
    // padding-right: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
}
.unit-title {
    line-height: 35px;
    font-weight:600;
    padding: 12px 20px 12px 20px;
    color: rgb(104, 107, 109);
    border-bottom: 1px solid #e7eaec;
}
.unit-info {
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