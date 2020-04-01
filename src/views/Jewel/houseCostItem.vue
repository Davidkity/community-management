
<template>
    <div class="houstCostItem">
        <!--头-->
        <div class="houstCostItem-content-top" style="height:90px" >
            <div class="search-title">
                <div> <p class="title">房屋费用项信息</p> </div>
                    <div>
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>资产管理</el-breadcrumb-item>
                            <el-breadcrumb-item>房屋费用项信息</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
            </div>
        </div>

        <div class="houstCostItem-content-top" >
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">选择费用项</el-col>
                </el-row>
            </div>
            <div class="search-content">
                <el-row >
                    <el-col :span="5">
                        <el-select v-model="data.costItemId"  placeholder="请选择" >
                            <el-option
                                v-for="item in data.costItem"
                                :key="item.costItemId"
                                :label="item.name"
                                :value="item.costItemId">
                            </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="2">
                        <el-button type="primary" class="searchButton" @click="addHouseCostItem" >
                            添加
                        </el-button>
                    </el-col>
                </el-row>
            </div>
        </div>

        
        <!-- 显示 -->
        <div class="build-center">
            <div class="center-title">
                <el-row :gutter="20">
                    <el-col :span="19">房屋费用项信息</el-col>
                </el-row>
                </div>
                <div class="house-info">
                    <el-row class="build-el-row" :gutter="14">
                        
                        <el-col :span="8">
                            <label>楼栋号: </label>
                            <label> {{ data.houseInfo.buildNum }} </label>
                            <label> 号楼</label>
                        </el-col>
                        <el-col :span="8">
                            <label>单元号: </label>
                            <label> {{ data.houseInfo.unitNum }} 单元</label>
                        </el-col>
                        <el-col :span="8">
                            <label>房屋号: </label>
                            <label>{{ data.houseInfo.num }} 号</label>
                        </el-col>
                    </el-row>
                    <br>
                    <hr>
                </div>
                <div style="width: 900px">
                    <!-- 表格数据 -->
                    <TableVue ref="houseCostItemTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
                        <!-- 插槽-方法 -->
                        <template v-slot:operation="slotData">
                            <el-button size="small"  @click="handlerDel(slotData.data)">删除</el-button>
                        </template>
                    </TableVue>
                </div>
                 
        </div>
        
    </div>
    
</template>
<script>
import { global } from "@/utils/global_V3.0.js";
import { reactive, onMounted, computed } from '@vue/composition-api';
import { setCommunity, getCommunity  } from "@/utils/app";

import { GetCostItem } from "@/api/adminApi/sys";
import { GetHouseList, AddHouseCostItem, GetHouseCostItem, DeleteHouseCostItem } from "@/api/adminApi/home";

//组件
import TableVue from "@/components/Table";  

export default {
    name: "costItemSet",
    components: { TableVue },
    setup(props, { root, refs }) {
        const { confirm } = global();
        //小区标识
        const marks = getCommunity();
        const house_id = root.$route.params.houseId;
        const userName = computed(() => root.$store.state.app.username);
        const data = reactive({
            username: userName,
            houseId: house_id,

            // 费用项
            costItem: [],
            // 费用项id
            costItemId: "",

            houstCostItemId: "",

            // 房屋信息
            houseInfo: [],

            configTable: {
                paginationShow: false,
                // 表头
                tHead: [
                    { label: "费用名",  field: "costItemName", width: 200 },
                    { label: "费用计算方式",  field: "computeName", width: 200 },
                    { label: "单价(元)", field: "price", width: 100,  },
                    { label: "固定/额外费用(元)", field: "otherCost", width: 180 },
                    { label: "创建人", field: "createBy", width: 100 },
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    url: "getHouseCostItemList",
                    data: {
                        mark: marks,
                        houseId: house_id,
                        current: 1,
                        size: 100
                    }
                }
            }

            
        })



        /*************************************************************
        方法
         */
        
        // 添加房屋费用项
        const addHouseCostItem = () => {
            let requestData = {
                mark: marks,
                houseId: data.houseId,
                costItemId: data.costItemId,
                username: data.username
            }
            AddHouseCostItem(requestData).then(response => {
                let responseData = response.data;
                root.$message({
                    message: responseData.message,
                    type:"success"
                })
                loadHouseCostItem()
            }).then(error => {

            })
            
        }

        // 加载费用项
        const loadCostItem = () => {
            let requestData = {
                mark: marks,
                startUse: "Y",
                current: 1,
                size: 100
            }
            GetCostItem(requestData).then(response => {
                let responseData = response.data.data.records;
                data.costItem = responseData;
            })
        }
        //加载房屋费用信息
        const loadHouseInfo = () => {
            let requestData = {
                mark: marks,
                houseMark: "HO",
                houseId: data.houseId,
                current: 1,
                size: 10
            }
            GetHouseList(requestData).then(response => {
                let responseData = response.data.data;
                data.houseInfo = responseData.records[0];
                // loadHouseCostItem();
            }).then(error => {

            })
        }
        //加载 房屋费用项信息
        const loadHouseCostItem = () => {
           let requestData = {
                url: "getHouseCostItemList",
                data: {
                    mark: marks,
                    houseId: data.houseId,
                    current: 1,
                    size: 100
                }
            }
            getList(requestData);
        }
        
        //刷新数据
        const getList = (params) => {
            refs.houseCostItemTable.refreshData(params);
        }

        // 删除房屋费用
        const handlerDel = (params) => {
           data.houstCostItemId = [params.houseCostItemId];
            confirm({
                context: "确认删除当前所选信息，确认后将无法恢复！！",
                type: "warning",
                fn: del
            })
        }

        const del = () => {
            let requestData = JSON.stringify(data.houstCostItemId);
            DeleteHouseCostItem(requestData).then(response => {
                let responseData = response.data;
                getList();
                root.$message({
                    message: responseData.message,
                    type: "success"  
                })
            }).catch(error => {

            })
        }

        onMounted(() => {
            loadCostItem();
            loadHouseInfo()
        })
        return {
            data, marks,
            loadCostItem, loadHouseInfo, loadHouseCostItem, addHouseCostItem, handlerDel, del
        }
    }
}
</script>
<style lang="scss" scoped>

.houstCostItem {
    height: 100%;
    
}
.empty {
    color: #fff;
    
}
.houstCostItem-content-top {
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



// 下部的显示
.build-center {
    border-top: 2px solid #e7eaec;
    background-color: #fff;
}
.center-title {
    line-height: 35px;
    font-weight:600;
    padding: 12px 20px 12px 20px;
    color: rgb(104, 107, 109);
    border-bottom: 1px solid #e7eaec;
}
.house-info {
    padding: 20px;
    .build-el-row {
        margin-bottom: 30px;
    }
}





.houstCostItem-content {
    height: 100%;
    // padding: 20px 20px 0 20px;
    // padding-right: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
}
.houstCostItem-title {
    line-height: 35px;
    font-weight:600;
    padding: 12px 20px 12px 20px;
    color: rgb(104, 107, 109);
    border-bottom: 1px solid #e7eaec;
}
.houstCostItem-info {
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