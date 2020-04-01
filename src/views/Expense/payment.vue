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

         <!-- 表格显示数据 -->
        <div class="mid-content">
            <div class="mid-title">
                <el-row :gutter="20">
                    <el-col :span="22" >
                        <label>单据费用</label>
                    </el-col>
                </el-row>
            </div>
           
            <el-form :model="data.form" ref="paymentForm" status-icon :rules="rules">
                <el-row :gutter="20">
                    <el-col :span="14" style="border-right: 1px solid rgb(244, 244, 244);" >
                        <el-form-item  prop="costBillCode" class="rlabel" label="单据编码：" :label-width="data.formLabelWidth">
                            <label >{{ data.form.code }} </label>
                        </el-form-item>
                        <el-form-item prop="itemCode" class="rlabel"  label="费用项目：" :label-width="data.formLabelWidth">
                            <el-col :span="18" v-model="data.form.itemCode" >{{data.form.costItemName}}</el-col>
                        </el-form-item>
                        <el-form-item prop="endTime" class="rlabel"  label="到期时间：" :label-width="data.formLabelWidth">
                            <el-col :span="18" v-model="data.form.endTime" >{{data.form.costEndTime}}</el-col>
                        </el-form-item>
                        <el-form-item prop="paymentCycleCode" class="rlabel" v-if="data.billWay == 'FIX'"  label="缴费周期：" :label-width="data.formLabelWidth">
                            <el-select v-model="data.form.paymentCycleCode" required  @change="paymentCycleCodeChange" placeholder="请选择">
                                <el-option
                                    v-for="item in data.paymentCycle"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                                   >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="shouldPay" class="rlabel"  label="应付款" :label-width="data.formLabelWidth">
                            <el-col :span="18" style="color:red; font-size:32px">
                                <el-col :span="2" >￥</el-col>
                                <el-col :span="2" v-model="data.form.shouldPay">{{ data.form.shouldPay }}</el-col>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="discount" class="rlabel" v-if="data.billWay == 'FIX'"  label="打折率" :label-width="data.formLabelWidth">
                            <el-col :span="2" v-model="data.form.discount" v-text="data.form.discount == 100 ? '' : data.form.discount " > </el-col>
                            <label v-text="data.form.discount == '' ? '' : (data.form.discount == null ? '' : (data.form.discount == 100 ? '' : '折'))"></label>
                        </el-form-item>
                        <el-form-item prop="wayCode" class="rlabel" required label="支付方式" :label-width="data.formLabelWidth">
                            <SelectVue :config="data.configOptionWay" :selectVal.sync="data.form.wayCode"></SelectVue>
                        </el-form-item>
                        <el-form-item prop="money" class="rlabel"  label="实付款" :label-width="data.formLabelWidth">
                            <el-col :span="18" style="color:red; font-size:28px">
                                <el-col :span="2" >￥</el-col>
                                <el-col :span="2" v-model="data.form.money">{{data.form.money}}</el-col>
                            </el-col>
                        </el-form-item>
                        
                        <el-row class="rlabel">
                            <el-button type="success" style="width:200px" @click="submit('paymentForm')">提交费用</el-button>
                        </el-row>
                    </el-col>
                </el-row>
            </el-form>
            
        </div>
    </div>
</template>
<script>

import { reactive, onMounted, computed } from '@vue/composition-api';
import { GetCostBillInfo } from "@/api/adminApi/costBill";
import { setCommunity, getCommunity  } from "@/utils/app";
import { GetPaymentCycle } from "@/api/adminApi/sys";
import { AddReceipt } from "@/api/adminApi/receiptBill"
import { validateEmpty } from "@/utils/formValidate";

// 组件
import SelectVue from "@/components/Select";

export default {
    name:"payment",
    components: { SelectVue },
    setup(props, { root, refs }) {
        const userName = computed(() => root.$store.state.app.username);
        const costBillId = root.$route.params.costBillId;
        const data = reactive({
            marks: getCommunity(),
            username: userName,
            formLabelWidth: "110px",
            configOptionTime:{
                clearFlag: true,
                selectValue: "",
                init: ["ONEMONTH", "TWOMONTH", "THREEMONTH", "FOURMONTH", "FIVEMONTH", "SIXMONTH", "ONEYEAR"]
            },
            configOptionWay:{
                clearFlag: true,
                selectValue: "",
                init: ["CASH", "WECHAT", "ALIPAY", "E_BANK" ]
            },
            form: {
                code: "",
                costItemId: "",
                costItemName: "",
                costEndTime: "",
                shouldPay: "",
                money: "",
                paymentCycleCode: "",
                discount: "",
                wayCode: ""
            },
            billWay: "",
            tempMoney: "",
            paymentCycle: [],
            rowPaymentCycle: {}
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
                data.form = {
                    code: responseData.records[0].code,
                    costItemId: responseData.records[0].costItemId,
                    costItemName: responseData.records[0].costItemName,
                    costEndTime: responseData.records[0].costEndTime,
                    shouldPay: responseData.records[0].shouldPay,
                    money: responseData.records[0].shouldPay,
                    paymentCycleCode: "",
                    discount: "",
                    wayCode: ""
                }
                data.tempMoney = responseData.records[0].shouldPay;
               
                data.billWay =  responseData.records[0].billWay;
            }).catch(error => {

            })
        } 
        // 加载支付周期
        const loadPaymentCycle = () => {
            GetPaymentCycle().then(response => {
                let responseData = response.data.data;
                data.paymentCycle = responseData;
            })
        }
        // 表单验证
        const validateTimeCode = (rule, value, callback) => {
            validateEmpty("周期", value, callback);
        };
        const validateWayCode = (rule, value, callback) => {
            validateEmpty("缴费方式", value, callback);
        };
        // 表单验证规则
        const rules = reactive({
            paymentCycleCode: [
            { validator: validateTimeCode, trigger: 'blur' }
            ],
            wayCode: [
            { validator: validateWayCode, trigger: 'blur' }
            ],
        });
        
        // 缴费周期改变，变化打折率
        const paymentCycleCodeChange = (val) => {
            data.rowPaymentCycle = data.paymentCycle.find(item => item.code == val)
            data.form.discount = data.rowPaymentCycle.discount;
            data.form.shouldPay = data.tempMoney * data.rowPaymentCycle.val;
            data.form.money = data.form.shouldPay * data.form.discount / 100;
        }

        // 提交
        const submit = (formName => {
            refs[formName].validate((valid) => {
                if (valid) {
                    let requestData = {
                        mark: data.marks,
                        receiptMark: "RE",
                        costBillId: costBillId,
                        shouldPay: data.form.shouldPay,
                        paymentCycleCode: data.form.paymentCycleCode,
                        discount: data.form.discount,
                        amount: data.form.money,
                        paymentWay: data.form.wayCode,
                        username: data.username
                    }
                    AddReceipt(requestData).then(response => {
                        root.$message({
                            message: response.data.message,
                            type: "success"
                        })
                        loadInfo();
                    })
                } else {
                    root.$message({
                        message: "填写信息不正确，请重新填写",
                        type: "error"
                    });
                    return false;
                }
            })
        })

        onMounted(() => {
            loadInfo();
            loadPaymentCycle();
        })
        return {
            data, rules, costBillId,
            submit, validateTimeCode, validateWayCode, loadInfo, loadPaymentCycle, paymentCycleCodeChange
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
.rlabel {
    padding: 10px 10px 30px 10px;
}
</style>