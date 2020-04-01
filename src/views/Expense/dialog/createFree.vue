
<template>
    <div>
        <el-dialog :title="data.dialogName" :visible.sync="data.createFlag"  @close="close" width="580px" @open="openDialog">
            <el-form :model="data.form" ref="createFreeForm" status-icon >

                <el-form-item prop="type"  label="费用类型：" :label-width="data.formLabelWidth">
                    <el-select v-model="data.form.costItemId" clearable  required @change="costItemIdChange" placeholder="请选择" >
                        <el-option
                            v-for="item in data.costItem"
                            :key="item.costItemId"
                            :label="item.name"
                            :value="item.costItemId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="useAmount"  label="使用量：" :label-width="data.formLabelWidth">
                    <el-input  placeholder="请输入使用量" v-model="data.form.useAmount" clearable> </el-input>
                </el-form-item>

                <el-form-item prop="date"  label="选择时间：" :label-width="data.formLabelWidth">
                    <el-date-picker
                        v-model="data.form.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        unlink-panels
                        >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                <el-button  @click="close">取消</el-button>
                <el-button type="danger" :loading="data.submitLoading" @click="submit('createFreeForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { watch, reactive, computed, onMounted } from '@vue/composition-api';
import { validateEmpty, validateFormAge, validateFormPhone, validateFormIdCard } from "@/utils/formValidate";
import { setCommunity, getCommunity  } from "@/utils/app";
import { GetCostItem } from "@/api/adminApi/sys";
import { GetList, GetUnitList } from "@/api/adminApi/home";
import { LoadBeginTime, CreateFree } from "@/api/adminApi/costBill";

// 组件
import SelectVue from "@/components/Select";

export default {
    name: "beachCreateFree",
    components: { SelectVue },

    props: {
        createFlag: {
            type: Boolean,
            default: ""
        },
        rowData: {
            type: Object,
            default: () => {}
        },
        buttonType: {
            type: String,
            default: ""
        },
        dialogName: {
            type: String,
            default: ""
        },
    },

    setup(props, { root, emit, refs }) {
        const userName = computed(() => root.$store.state.app.username);
        //小区标识
        const marks = getCommunity();

        const data = reactive({
            
            username: userName,

            createFlag: false,
            dialogName: "",
            buttonType: "",
            formLabelWidth: "110px",

            //表单数据
            form: {
                date: ["",""],
                costItemId: "",
                useAmount: ""
            },
            costItem: [],
            // beginDate: new Date('2022-10-19')

            // 行数据
            rowData: {},

            beginDate: ""
            
        })



        /***************************************************************
        方法
         */

        // 监听
        watch(() => {
            data.createFlag = props.createFlag
        });
        

        // 打开弹窗
        const openDialog = () => {
            data.buttonType = props.buttonType;
            data.dialogName = props.dialogName;
            data.rowData = props.rowData;
        }

        //关闭弹窗
        const close = () => {
             data.createFlag = false;
             resetForm();
             emit("update:createFlag", false);
        }

        // 重置表单
        const resetForm = () => {
            data.form.costItemId = "";
            data.form.useAmount = "";
            data.form.date = ["",""];
        }
        
       
        
        // 表单数据验证
        const validateForm = (params) => {
            if(params.useAmount == ""){
                root.$message({
                    message: "使用量不能为空",
                    type: "error"
                })
                return false;
            }
            if(params.costItemId == ""){
                root.$message({
                    message: "费用类型不能为空",
                    type: "error"
                })
                return false;
            }
            if(params.date[0] == "" || params.date[1] == ""){
                root.$message({
                    message: "费用日期不能为空",
                    type: "error"
                })
                return false;
            }
            
            return true;

        }
         // 提交
        const submit = (formName => {
            if(!validateForm(data.form)){
                return false;
            };
            var now = new Date(data.form.date[0]);

            var old = new Date(data.beginDate);

            if(now.getTime() < old.getTime()){
                root.$message({
                    message: "费用开始日期不能低于上一次的费用结束日期",
                    type: "error"
                })
                return false;
            }
            
            let requestData = {
                mark: marks,
                frMark: "FR",
                houseId: data.rowData.houseId,
                costBeginTime: data.form.date[0],
                costEndTime: data.form.date[1],
                costItemId: data.form.costItemId,
                useAmount: data.form.useAmount,
                username: data.username,
                billWay: "UNFIX"
            }
            CreateFree(requestData).then(response => {
                let responseData = response.data
                root.$message({
                    message: responseData.message,
                    type: "success"
                })
            }).catch(error => {

            })


           
        })

        // 费用项id变化时
        const costItemIdChange = () => {
            loadBeginTime()
        }

        // 加载费用项
        const loadCostItem = () => {
            let requestData = {
                mark: marks,
                startUse: "Y",
                computeWayCode: "UNIT_PRICE",
                current: 1,
                size: 100
            }
            GetCostItem(requestData).then(response => {
                let responseData = response.data.data.records;
                data.costItem = responseData;
            })
        }
        // 加载 费用开始日期
        const loadBeginTime = () => {
        //     String mark = condition.get("mark");
        // String frMark = condition.get("frMark");
        // String houseId = condition.get("houseId");
        // String costItemId = condition.get("costItemId");
            let requestData = {
                mark: marks,
                houseId: data.rowData.houseId,
                costItemId: data.form.costItemId
            }
            LoadBeginTime(requestData).then(response => {
                let responseData = response.data.data;
                root.$set(data.form.date, "0", responseData)
                data.beginDate = data.form.date[0];
            }).catch(error => {

            })
        }

        onMounted(() => {
            loadCostItem();
        })
        return {
            data,  marks,
            validateForm,
            openDialog, close, loadCostItem, costItemIdChange, submit, 
        }
    }
}
</script>
<style lang="scss" scoped>

</style>