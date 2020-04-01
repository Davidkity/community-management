
<template>
    <div>
        <el-dialog :title="data.dialogName" :visible.sync="data.batchCreateFlag"  @close="close" width="580px" @open="openDialog">
            <el-form :model="data.form" ref="createFreeForm" status-icon >
                <el-form-item prop="range" label="收费范围：" :label-width="data.formLabelWidth">
                    <SelectVue :config="data.configOption" :selectVal.sync="data.form.range"  ref="selectValue"></SelectVue>
                </el-form-item>

                <el-form-item prop="builId" label="选择楼栋：" :hidden="data.hiddenBuild" :label-width="data.formLabelWidth">
                    <el-select v-model="data.form.buildId" clearable @change="buildChange" placeholder="请选择楼栋">
                        <el-option
                        v-for="item in data.buildOptions"
                        :key="item.buildId"
                        :label="item.name"
                        :value="item.buildId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="builId" label="选择单元：" :hidden="data.hiddenUnit"  :label-width="data.formLabelWidth">
                    <el-select v-model="data.form.unitId" clearable  placeholder="请选择单元">
                        <el-option
                        v-for="item in data.unitOptions"
                        :key="item.unitId"
                        :label="item.num" 
                        :value="item.unitId">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item prop="type"  label="费用类型：" :label-width="data.formLabelWidth">
                    <el-select v-model="data.form.costItemId" required  placeholder="请选择" >
                        <el-option
                            v-for="item in data.costItem"
                            :key="item.costItemId"
                            :label="item.name"
                            :value="item.costItemId">
                        </el-option>
                    </el-select>
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
import { BatchCreateFree } from "@/api/adminApi/home";

// 组件
import SelectVue from "@/components/Select";

export default {
    name: "beachCreateFree",
    components: { SelectVue },

    props: {
        batchCreateFlag: {
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
    },

    setup(props, { root, emit, refs }) {
        const userName = computed(() => root.$store.state.app.username);
        //小区标识
        const marks = getCommunity();

        const data = reactive({
            
            username: userName,

            batchCreateFlag: false,
            dialogName: "",
            buttonType: "",
            formLabelWidth: "110px",

            hiddenBuild: true,
            hiddenUnit: true,
            buildOptions: [],
            unitOptions: [],
            //表单数据
            form: {
                range: "",
                buildId: "",
                unitId: "",
                date: "",
                costItemId: ""
            },
            costItem: [],
            // 收费范围
            configOption: {
                clearFlag: true,
                selectValue: "",
                init: ["", "community", "build", "unit"]
            },
        })



        /***************************************************************
        方法
         */

        // 监听
        watch(() => {
            data.batchCreateFlag = props.batchCreateFlag
        });
        watch(() => data.form.range, (range) => {
            if(range == "community"){
                data.hiddenBuild = true;
                data.hiddenUnit = true;
            }
            if(range == "build"){
                data.hiddenBuild = false;
                data.hiddenUnit = true;
            }
            if(range == "unit"){
                data.hiddenBuild = false;
                data.hiddenUnit = false;
            }
        })

        // 打开弹窗
        const openDialog = () => {
            data.buttonType = props.buttonType;
            data.dialogName = props.dialogName;
        }

        //关闭弹窗
        const close = () => {
             data.batchCreateFlag = false;
             resetForm();
             emit("update:batchCreateFlag", false);
        }

        // 重置表单
        const resetForm = () => {
            data.form.range = "";
            data.form.buildId = "";
            data.form.unitId = "";
            data.form.costItemId = "";
            data.form.date = ["",""];
            refs.selectValue.resetData();
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
        // 加载单元信息
        const loadUnit = () => {
            let requestData = {
                mark: marks,
                unitMark: "UN",
                buildId: data.form.buildId,
                current: 1,
                size: 1000000
            }
            GetUnitList(requestData).then(response => {
                let responseData = response.data.data.data;
                data.unitOptions = responseData;
            }).catch(error => {

            })
        }
        // 楼栋下拉框变化
        const buildChange = () => {
            loadUnit();
        }
        
        // 表单数据验证
        const validateForm = (range, costItemId) => {
            if(range == ""){
                root.$message({
                    message: "收费范围不能为空",
                    type: "error"
                })
                return false;
            }
            if((range == "build" || range == "unit" ) && data.form.buildId == ""){
                root.$message({
                    message: "还未选择楼栋",
                    type: "error"
                })
                return false;
            }
            if(range == "unit" && data.form.unitId == ""){
                root.$message({
                    message: "还未选择单元",
                    type: "error"
                })
                return false;
            }
            if(costItemId == ""){
                root.$message({
                    message: "费用类型不能为空",
                    type: "error"
                })
                return false;
            }
            return true;

        }
         // 提交
        const submit = (formName => {
            if(!validateForm(data.form.range, data.form.costItemId)){
                return false;
            };
            
            let requestData = {
                mark: marks,
                frMark: "FR",
                range: data.form.range,
                buildId: data.form.buildId,
                unitId: data.form.unitId,
                beginTime: data.form.date[0],
                endTime: data.form.date[1],
                costItemId: data.form.costItemId,
                username: data.username,
                billWay: "FIX"
            }
            BatchCreateFree(requestData).then(response => {
                let responseData = response.data
                root.$message({
                    message: responseData.message,
                    type: "success"
                })
            }).catch(error => {

            })


            // refs[formName].validate((valid) => {
            //     if (valid) {
            //         if(data.buttonType == "addUser" || data.buttonType == "addMember"){
            //             addUser()
            //         }
            //         if(data.buttonType == "editUser" || data.buttonType == "editUserMember"){
            //             editUser()
            //         }
            //     } else {
            //         root.$message({
            //             message: "填写信息不正确，请重新填写",
            //             type: "error"
            //         });
            //         return false;
            //     }
            // })
        })
        // 加载费用项
        const loadCostItem = () => {
            let requestData = {
                mark: marks,
                startUse: "Y",
                computeWayCode: "FIX",
                current: 1,
                size: 100
            }
            GetCostItem(requestData).then(response => {
                let responseData = response.data.data.records;
                data.costItem = responseData;
            })
        }

        onMounted(() => {
            loadCostItem();
            loadBuild();

        })
        return {
            data,  marks,
            validateForm,
            openDialog, close, loadCostItem, loadBuild, loadUnit, submit, buildChange
        }
    }
}
</script>
<style lang="scss" scoped>

</style>