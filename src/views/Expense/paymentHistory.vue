

    
<template>
    <div class="main">
         <!--头-->
        <div class="content-top" style="height:90px" >
            <div class="search-title">
                <div> <p class="title">缴费历史</p> </div>
                    <div>
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>费用管理</el-breadcrumb-item>
                            <el-breadcrumb-item>缴费历史</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
            </div>
        </div>

        <div class="content-top" :style="data.unit_top_height">
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">费用信息</el-col>
                </el-row>
            </div>
            <div class="search-content">
                <el-row :gutter="14" style="margin-bottom: 30px;">
                    <el-col :span="8"> <label>费用编号：</label> <label>{{ data.costBillInfo.code }}</label></el-col> 
                    <el-col :span="8">
                        <label>费用类型：</label> 
                        <label v-text="data.costBillInfo.billWay == 'FIX' ? '固定费用' : '非固定费用'"></label>
                    </el-col> 
                    <el-col :span="8"> <label>费用项名：</label> <label>{{ data.costBillInfo.costItemName }}</label></el-col> 
                </el-row>
                <el-row :gutter="14">
                    <el-col :span="8"> 
                        <label>费用状态：</label> 
                        <label v-text="data.costBillInfo.costStatusCode == 'PAY' ? '已付款' : '未付款'"></label>
                    </el-col> 
                    <el-col :span="8"> <label>费用开始日期：</label> <label>{{ data.costBillInfo.costBeginTime }}</label></el-col> 
                    <el-col :span="8"> <label>费用到期日期：</label> <label>{{ data.costBillInfo.costEndTime }}</label></el-col> 
                </el-row>
            </div>
        </div>

         <!-- 表格显示数据 -->
        <div class="mid-content">

            <div class="mid-title">
                <label>缴费历史 </label>
            </div>
            <!-- 表格数据 -->
            <TableVue ref="houseInfoTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
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

//组件
import TableVue from "@/components/Table";  
export default {
    name:"paymentHistory",
    components: { TableVue },

    setup(props, { root }) {

        const costBillId = root.$route.params.costBillId;
        const marks = getCommunity();

        const data = reactive({
            

            // 费用单信息
            costBillInfo: {},

            //表格
            configTable: {
                loading: true,
                // 表头
                tHead: [
                    { label: "缴费编码",  field: "code", width: 200 },
                    { label: "缴费周期",  field: "cycleName", width: 150, },
                    { label: "应缴金额", field: "shouldAmount", width: 150, columnType: "slot",  slotName: "shouldAmount"},
                    { label: "实缴金额", field: "amount", width: 150, columnType: "slot",  slotName: "amount" },
                    { label: "打折率",  field: "discounts", width: 150 },
                    { label: "缴费时间",  field: "createTime", width: 250, },
                    { label: "缴费人",  field: "createBy", width: 250, }
                ],
                requestData: {
                    url: "getReceiptBillInfo",
                    data: {
                        mark: marks,
                        receiptMark: "RE",
                        costBillId: costBillId,
                        current: 1,
                        size: 10
                    }
                }
            }
        })
       




        /**
            方法
         */

          // 加载数据
        const loadInfo = () => {
            let requestData = {
                mark: data.marks,
                costBillId: costBillId,
                current: 1,
                size: 11
            }
            GetCostBillInfo(requestData).then(response => {
                let responseData = response.data.data;
                data.costBillInfo = responseData.records[0];
            }).catch(error => {

            })
        } 

        onMounted(() => {
            loadInfo()
        })

        return {
            data, costBillId, marks,
            loadInfo
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