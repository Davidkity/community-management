
<template>
    <div>
        <el-dialog :title="data.dialogName" :visible.sync="data.costItemInfoFlag"  @close="close" width="580px" @open="openDialog">
            <el-form :model="data.form" ref="addCostItemForm" status-icon :rules="rules">

                <el-form-item prop="mark" required label="所属小区：" :label-width="data.formLabelWidth">
                    <el-select v-model="data.form.mark"  placeholder="请选择" >
                        <el-option
                            v-for="item in data.communities"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="name" required label="费用项名：" :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.name" clearable placeholder="必填，请输入名称"  ></el-input>
                </el-form-item>

                <el-form-item prop="code" required label="费用项code：" :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.code" clearable placeholder="必填，请输入费用项Code"  ></el-input>
                </el-form-item>

                <el-form-item prop="computeWay" required label="计费方式："  :label-width="data.formLabelWidth">
                    <el-select v-model="data.form.computeWay" @change="computeWayChange" placeholder="请选择" >
                        <el-option
                            v-for="item in data.computeWays"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="price"  label="费用项单价：" v-if="data.priceShow"  :label-width="data.formLabelWidth">
                    <el-input  v-model.number="data.form.price" clearable  placeholder="必填，请输入费用项单价(元)"  ></el-input>
                </el-form-item>

                <el-form-item prop="unit" required label="费用单位：" v-if="data.priceShow" :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.unit" clearable placeholder="必填，请输入费用单位"  ></el-input>
                </el-form-item>

                <el-form-item prop="otherCost"  label="附加/额定费用：" :label-width="data.formLabelWidth">
                    <el-input  v-model.number="data.form.otherCost" clearable placeholder="必填，请输入附加/额定费用(元)"  ></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" >
                    <el-button  @click="close">取消</el-button>
                    <el-button type="danger" :loading="data.submitLoading" @click="submit('addCostItemForm')">确定</el-button>
                </div>
        </el-dialog>
    </div>
</template>
<script>
import { reactive, watch, onMounted, computed } from '@vue/composition-api';
import { validateEmpty, validateNumber } from "@/utils/formValidate";
import { GetComputeWay, AddCostItem, GetCostItem, EditCostItem } from "@/api/adminApi/sys";

export default {
    
    name: "costItemInfo",

    props: {
        costItemFlag: {
            type: Boolean,
            default: ""
        },
        buttonType: {
            type: String,
            default: ""
        },
        dialogName: {
            type: String,
            default: ""
        },
        uId: {
            default: ""
        },
        costItemId: {
            default: ""
        }
    },

    setup(props, { root, emit, refs }) {

        const userName = computed(() => root.$store.state.app.username);

        const data = reactive({
            username: userName,
            costItemInfoFlag: false,
            dialogName: "",

            // 费用项id
            costItemId: "",

            formLabelWidth: "140px",
            //表单
            form: {
                mark: "",
                name: "",
                code: "",
                computeWay: "",
                price: "",
                otherCost: ""
            },
            // 小区下拉框
            communities: [],
            // 费用项计费方式
            computeWays: [],
            // 单价  当选择为固定费用是，此输入框显示
            priceShow: true


        })



        /**********************************************************
        方法
         */
        
        // 监听
        watch(() => {
            data.costItemInfoFlag = props.costItemFlag
        });


        // 打开
        const openDialog = () => {
            data.buttonType = props.buttonType;
            data.dialogName = props.dialogName;
            data.costItemId = props.costItemId;
            if(data.buttonType == "editCostItem"){
                loadCostItenData();
            }
        }

        // 关闭
        const close = () => {
            data.costItemInfoFlag = false;
            data.buttonType = "";
            resetForm();
            emit("update:costItemFlag", false);
            emit("update:buttonType", "");
            emit("getChangeData")
        }

        // 提交
        const submit = (formName) => {
            if(data.form.mark == ""){
                root.$message({
                    message: "费用项所属小区不能为空！",
                    type: "error"
                })
                return false;
            }
            if(data.form.computeWay == ""){
                root.$message({
                    message: "费用项计算方式不能为空！",
                    type: "error"
                })
                return false;
            }
            
            refs[formName].validate((valid) => {
                if (valid) {
                    data.buttonType == "addCostItem" ? addCostItem() : editCostItem();
                } else {
                    root.$message({
                        message: "填写信息不正确，请重新填写",
                        type: "error"
                    });
                    return false;
                }
            })
        }
        // 添加费用项
        const addCostItem = () => {
            let requestData = {
                mark: data.form.mark,
                code: data.form.code,
                name: data.form.name,
                computeWayCode: data.form.computeWay,
                price: data.form.price,
                otherCost: data.form.otherCost,
                unit: data.form.unit,
                username: data.username
            }
            AddCostItem(requestData).then(response => {
                root.$message({
                    message: response.data.message,
                    type: "success"
                })
                emit("getChangeData");
                close();
            }).catch(error => {

            })
        }

         // 修改费用项
        const editCostItem = () => {
            let requestData = {
                costItemId: data.costItemId,
                mark: data.form.mark,
                code: data.form.code,
                name: data.form.name,
                computeWayCode: data.form.computeWay,
                price: data.form.price,
                otherCost: data.form.otherCost,
                unit: data.form.unit,
                username: data.username
            }
            EditCostItem(requestData).then(response => {
                root.$message({
                    message: response.data.message,
                    type: "success"
                })
                close();
            }).then(error => {

            })
        }
        
        // 费用项计费方式变化
        const computeWayChange = () => {
            if(data.form.computeWay == "FIX"){
                data.form.price = 0.001;
                data.priceShow = false;
            }else{
                data.form.price = "";
                data.priceShow = true;
            }
        }
        
        //加载小区
        const loadCommunity = () => {
            root.$store.dispatch("community/getCommunity",{id: props.uId}).then(response => {
                let communityData = response.data.data;
                data.communities = communityData;
            })
        }


        // 加载费用项计算方式
        const loadComputeWay = () => {
            GetComputeWay({id: -1}).then(response => {
                let responseData = response.data.data;
                data.computeWays = responseData;
            })
        }

        // 加载指定费用项信息
        const loadCostItenData = () => {
            let requestData = {
                costItemId: data.costItemId,
                current: 1,
                size: 1
            }
            GetCostItem(requestData).then(response => {
                let responseData = response.data.data.records;
                data.form = responseData[0];
                data.form.mark = responseData[0].mark;
                data.form.computeWay = responseData[0].computeWayCode;
                if(data.form.computeWayCode == "FIX"){
                    data.priceShow = false;
                }else{
                    data.priceShow = true;
                }
            }).catch(error => {

            })
        }

        // 表单验证
        const validateMark = (rule, value, callback) => {
            validateEmpty("小区", value, callback);
        };
        const validateName = (rule, value, callback) => {
            validateEmpty("费用项名", value, callback);
        };
        const validateCode = (rule, value, callback) => {
            validateEmpty("费用项Code", value, callback);
        };
        const validateComputeWay = (rule, value, callback) => {
            validateEmpty("收费方式", value, callback);
        };
        const validatePrice = (rule, value, callback) => {
            validateNumber("单价", value, callback);
        };
        const validateUnit = (rule, value, callback) => {
            validateEmpty("费用单位", value, callback);
        };
        // 表单验证规则
        const rules = reactive({
            mark: [
            { validator: validateMark, trigger: 'blur' }
            ],
            name: [
            { validator: validateName, trigger: 'blur' }
            ],
            code: [
            { validator: validateCode, trigger: 'blur' }
            ],
            computeWay: [
            { validator: validateComputeWay, trigger: 'blur' }
            ],
            price: [
            { validator: validatePrice, trigger: 'blur' }
            ],
            unit: [
            { validator: validateUnit, trigger: 'blur' }
            ]
        });

        // 重置表单
        // 重置表单
        const resetForm = () => {
            refs.addCostItemForm.resetFields();
            data.form.mark = "",
            data.form.computeWay = ""
        }

        onMounted(() => {
            loadCommunity();
            loadComputeWay();
        })
        return {
            data, rules,
            openDialog, close, submit, resetForm, loadCommunity, addCostItem, editCostItem, computeWayChange,
            loadCostItenData
        }
    }
}
</script>
<style lang="scss" scoped>

</style>