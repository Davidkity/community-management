

    
<template>
    <div class="main">
         <!--头-->
        <div class="content-top" style="height:90px" >
            <div class="search-title">
                <div> <p class="title">缴费清单</p> </div>
                    <div>
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>费用管理</el-breadcrumb-item>
                            <el-breadcrumb-item>缴费清单</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
            </div>
        </div>

         <div class="content-top" :style="data.unit_top_height">
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">查询条件</el-col>
                    <el-button class="moreButton" type="text" @click="changeSelect" >{{ data.moreConditionSelect }}</el-button>
                </el-row>
            </div>
            <div class="search-content">
                <el-row :gutter="14">
                    <el-col :span="5">
                        <el-input placeholder="请输入缴费编号" v-model="data.selectOptions.search_code" clearable></el-input>
                    </el-col>
                    <el-col :span="2" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-select v-model="data.selectOptions.costItemId" clearable placeholder="请选择费用项" >
                            <el-option
                                v-for="item in data.costItem"
                                :key="item.costItemId"
                                :label="item.name"
                                :value="item.costItemId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-select v-model="data.selectOptions.paymentCycleCode" required clearable placeholder="请选择缴费周期">
                            <el-option
                                v-for="item in data.paymentCycle"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                                >
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
                        <SelectVue :config="data.configOption" :selectVal.sync="data.selectOptions.type"  ref="selectValue"></SelectVue>
                    </el-col>
                    <el-col :span="2" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-date-picker
                            v-model="data.selectOptions.beginTime"
                            type="date"
                            placeholder="日期从"
                            value-format="yyyy-MM-dd"
                            clearable>
                        </el-date-picker>
                    </el-col>
                    <el-col :span="2" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-date-picker
                            v-model="data.selectOptions.endTime"
                            type="date"
                            placeholder="日期到"
                            value-format="yyyy-MM-dd"
                            clearable>
                        </el-date-picker>
                    </el-col>
                </el-row>
            </div>
         </div>

         <!-- 表格显示数据 -->
        <div class="mid-content">

            <div class="mid-title">
                <label>缴费清单 </label>
            </div>
            <!-- 表格数据 -->
            <TableVue ref="receiptInfoTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
                <template v-slot:billWay="slotData">
                    <label v-text="slotData.data.billWay == 'FIX' ? '固定费用' : '非固定费用'"></label>
                </template>
                <template v-slot:shouldAmount="slotData">
                    <label v-text="slotData.data.shouldAmount == 0 ? '-' : slotData.data.shouldAmount + ' 元'"></label>
                </template>
                <template v-slot:amount="slotData">
                    <label v-text="slotData.data.amount == 0 ? '-' : slotData.data.amount + ' 元'"></label>
                </template>
                <template v-slot:tableFooterLeft >
                    <label class="empty">.</label>
                </template>
            </TableVue>
        </div>
    </div>   
</template>




<script>
import { setCommunity, getCommunity  } from "@/utils/app";
import { reactive, onMounted, computed } from '@vue/composition-api';
import { GetCostBillInfo } from "@/api/adminApi/costBill";
import { GetCostItem, GetPaymentCycle } from "@/api/adminApi/sys";

//组件
import TableVue from "@/components/Table";  
import SelectVue from "@/components/Select";

export default {
    name:"paymentHistory",
    components: { TableVue, SelectVue },

    setup(props, { root, refs }) {

        const marks = getCommunity();

        const data = reactive({
            
            // 查询
            moreConditionSelect: "更多",
            unit_top_height: "height:132px",
            conditionIsHidden: "true",

            selectOptions: {
                search_code: "",
                costItemId: "",
                paymentCycleCode: "",
                type: "",
                beginTime: "",
                endTime: ""
            },
            paymentCycle: [],
            // 费用项
            costItem: [],

            configOption: {
                clearFlag: true,
                selectValue: "",
                init: ["FIX", "UNFIX"]
            },




            // 费用单信息
            costBillInfo: {},

            //表格
            configTable: {
                loading: true,
                // 表头
                tHead: [
                    { label: "缴费编码",  field: "code", width: 180 },
                    { label: "费用项目",  field: "costItemName", width: 150, },
                    { label: "费用类型",  field: "billWay", width: 120,  columnType: "slot",  slotName: "billWay"},
                    { label: "缴费周期",  field: "cycleName", width: 120, },
                    { label: "应缴金额", field: "shouldAmount", width: 140, columnType: "slot",  slotName: "shouldAmount"},
                    { label: "实缴金额", field: "amount", width: 140, columnType: "slot",  slotName: "amount" },
                    { label: "打折率",  field: "discounts", width: 100 },
                    { label: "支付方式",  field: "payWayName", width: 100 },
                    { label: "缴费时间",  field: "createTime", width: 200, },
                    { label: "缴费人",  field: "createBy", width: 120, }
                ],
                requestData: {
                    url: "getReceiptBillInfo",
                    data: {
                        mark: marks,
                        receiptMark: "RE",
                        current: 1,
                        size: 10,
                        
                    }
                   
                }
            }
        })
       

        /**
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

        // 加载支付周期
        const loadPaymentCycle = () => {
            GetPaymentCycle().then(response => {
                let responseData = response.data.data;
                data.paymentCycle = responseData;
            })
        }

        const search = () => {
            let requestData = {
                url: "getReceiptBillInfo",
                data: {
                    mark: marks,
                    receiptMark: "RE",
                    current: 1,
                    size: 10,
                    code: data.selectOptions.search_code,
                    costItemId: data.selectOptions.costItemId,
                    paymentCycleCode: data.selectOptions.paymentCycleCode,
                    type: data.selectOptions.type,
                    beginTime: data.selectOptions.beginTime,
                    endTime: data.selectOptions.endTime,
                }
            }
            getList(requestData);
        }

        //刷新数据
        const getList = (params) => {
            refs.receiptInfoTable.refreshData(params);
        }
        onMounted(() => {
            loadCostItem();
            loadPaymentCycle();
        })

        return {
            data, marks,
            changeSelect, loadCostItem, loadPaymentCycle, search, getList
        }
    }
}

</script>
<style lang="scss" scoped>
.content {
    height: 100%;
    
}
.empty {
    color: #fff;
    
}

.content-top {
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

.mid-content {
    height: 100%;
    // padding: 20px 20px 0 20px;
    // padding-right: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
}
.mid-title {
    line-height: 35px;
    font-weight:600;
    padding: 12px 20px 12px 20px;
    color: rgb(104, 107, 109);
    border-bottom: 1px solid #e7eaec;
}
.mid-info {
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