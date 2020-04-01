
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

        <div class="houseFree-content-top" style="height:90px" >
            <div class="search-title">
                <div> <p class="title">房屋业主简单信息</p> </div>
                <div class="search-content">
                    <el-row :gutter="20">
                        <el-col :span="8" >
                           <label>姓名： {{ data.userInfo.userName }} </label>
                        </el-col>
                        <el-col :span="8" >
                           <label>身份证： {{ data.userInfo.idCard }} </label>
                        </el-col>
                        <el-col :span="8" >
                           <label>联系方式：{{ data.userInfo.phone }} </label>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        

         <!-- 表格显示数据 -->
        <div class="houseFree-content">

            <div class="houseFree-title">
                <el-row :gutter="20">
                    <el-col :span="22" >
                        <label>{{ data.houseInfo.buildNum }} 号楼 </label>
                        <label>{{ data.houseInfo.unitNum }} 单元 </label>
                        <label>{{ data.houseInfo.num }} 号房 </label>
                    </el-col>
                </el-row>
            </div>

            <!-- 表格数据 -->
            <TableVue ref="houseInfoTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
                <template v-slot:billWay="slotData">
                    <label v-text="slotData.data.billWay == 'FIX' ? '固定费用' : '非固定费用'"></label>
                </template>
                <template v-slot:price="slotData">
                    <label v-text="slotData.data.price == 0 ? '-' : slotData.data.price + ' 元'"></label>
                </template>
                <template v-slot:useAmount="slotData">
                    <label v-text="slotData.data.useAmount == null ? '-' : slotData.data.useAmount + ' ' + slotData.data.unit"></label>
                </template>
                <template v-slot:shouldPay="slotData">
                    <label v-text="slotData.data.shouldPay == 0 ? '-' : slotData.data.shouldPay + ' 元'"></label>
                </template>
                <template v-slot:costStatusCode="slotData">
                    <label v-text="slotData.data.costStatusCode == 'PAY' ? '已缴费' : (slotData.data.costStatusCode == 'UNPAY' ? '未缴费' : '部分缴费')"></label>
                </template>
                
                <template v-slot:operation="slotData">
                    <el-button size="small" type="text"  @click="payFree(slotData.data.costBillId)">缴费</el-button>
                    <el-button size="small" type="text"  @click="payFreeHistory(slotData.data.costBillId)">缴费历史</el-button>
                    <el-button size="small" type="text"  @click="cancelFree(slotData.data)">取消费用</el-button>
                </template>
                <template v-slot:tableFooterLeft >
                    <label class="empty">.</label>
                </template>
            </TableVue>
        </div>
        
        
    </div>
</template>
<script>
import { reactive, onMounted, computed } from '@vue/composition-api';
import { setCommunity, getCommunity  } from "@/utils/app";
import { GetList, GetUnitList, GetHouseList } from "@/api/adminApi/home";

import { GetUserCheckInInfo } from "@/api/adminApi/user";

import { GetCostBillInfo } from "@/api/adminApi/costBill";

//组件
import TableVue from "@/components/Table";  


export default {
    name: "houseFree",
    components: { TableVue },

    
    setup(props, { root, refs }) {
        //小区标识
        
        const marks = getCommunity();
        const house_id = root.$route.params.houseId;
        const userName = computed(() => root.$store.state.app.username);

        const data = reactive({

            form: {
               costBillCode: ""
            },

            username: userName,
            houseId: house_id,
           
            // 房屋信息
            houseInfo: [],
            userInfo: [],

            // 表格行记录
            rowData: {},
            //表格
            configTable: {
                loading: true,
                // 表头
                tHead: [
                    { label: "费用编码",  field: "code", width: 200 },
                    { label: "费用类型",  field: "billWay", width: 100, columnType: "slot",  slotName: "billWay"},
                    { label: "费用名", field: "costItemName", width: 120},
                    { label: "开始时间", field: "costBeginTime", width: 120 },
                    { label: "到期时间",  field: "costEndTime", width: 120 },
                    { label: "单价",  field: "price", width: 120, columnType: "slot",  slotName: "price" },
                    { label: "使用量",  field: "useAmount", width: 120, columnType: "slot",  slotName: "useAmount" },
                    { label: "应交费用",  field: "shouldPay", width: 120, columnType: "slot",  slotName: "shouldPay" },
                    { label: "状态",  field: "costStatusCode", width: 100, columnType: "slot",  slotName: "costStatusCode" },
                    
                    
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    url: "getCostBillInfo",
                    data: {
                        mark: marks,
                        houseId: house_id,
                        current: 1,
                        size: 10
                    }
                }
            }
        })


        /*******************************************************************************
            方法
         */
        

        
        
        //刷新数据
        const getList = (params) => {
            refs.houseInfoTable.refreshData(params);
        }
        // 加载房屋信息
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

        // 加载业主信息
        const loadUserInfo = () => {
            let requestData = {
                mark: marks,
                checkInMark: "CI",
                houseId: data.houseId,
                current: 1,
                size: 2
            }
            GetUserCheckInInfo(requestData).then(response => {
                let responseData = response.data.data;
                data.userInfo = responseData.records[0];
                
                // loadHouseCostItem();
            }).then(error => {

            })
        }
        // 表格
        //缴费
        const payFree = (costBillId) => {
             // 路由跳转
            root.$router.push({
                path: `/Payment/${costBillId}`  // es6的写法
            });
        }
        //缴费历史
        const payFreeHistory = (costBillId) => {
             // 路由跳转
            root.$router.push({
                path: `/PaymentHistory/${costBillId}`  // es6的写法
            });
        }
        // 取消费用（只在还未缴费的前提下才能取消）
        const cancelFree = () => {

        }

        // 加载数据
        const loadInfo = () => {
            let requestData = {
                mark: data.marks,
                costBillId: 13,
                current: 1,
                size: 11
            }
            GetCostBillInfo(requestData).then(response => {
                let responseData = response.data.data;
                data.form.costBillCode = responseData.records[0].code;
                data.code = responseData.records[0].code;
            }).catch(error => {

            })
        } 

        onMounted(() => {
            loadHouseInfo();
            loadUserInfo();

            // loadInfo();
        })
        return {
            data, marks, 
            getList, loadHouseInfo,
            payFree, payFreeHistory, cancelFree, loadInfo

            
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