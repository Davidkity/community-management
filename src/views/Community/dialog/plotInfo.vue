<template>
    <!-- 新增弹窗  -->
    <el-dialog :title="data.dialog_name" :visible.sync="data.dialog_info_flag" @close="close" width="650px" @open="openDialog">
        <el-form :model="data.form" ref="infoForm" :rules="rules">
            <el-form-item prop="name" label="小区名：" required :label-width="data.formLabelWidth" >
                <el-input v-model="data.form.name" placeholder="必填，请输入小区名" ></el-input>
            </el-form-item>
            <el-form-item prop="code" label="小区标识：" required :label-width="data.formLabelWidth" >
                <el-input  v-model="data.form.code" placeholder="必填，请输入小区标识,最长4位"  maxlength="4"></el-input>
            </el-form-item>
            <el-form-item prop="phone" label="联系方式：" required :label-width="data.formLabelWidth" >
                <el-input  v-model="data.form.phone" placeholder="必填，请输入手机号" minlength="11" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item  label="地址：" required :label-width="data.formLabelWidth" >
                <CityPicker :cityPickerData.sync="data.cityPickerData" :cityPickerLevel="['province','city','area']"/>
            </el-form-item>
            <el-form-item prop="address" label="详细地址：" required :label-width="data.formLabelWidth" >
                <el-input v-model="data.form.address"  placeholder="必填，XX街道/XX乡/.."></el-input>
            </el-form-item>
           
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="danger" :loading="data.submitLoading" @click="submit('infoForm')">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { reactive, watch, computed } from '@vue/composition-api';
import { validateEmpty, validateFormPhone } from "@/utils/formValidate";
import { AddCommunity, GetComunityInfo, EditCommunity } from "@/api/adminApi/community";
import { cityPicker } from "@/mixins/cityPicker"
//组件
import CityPicker from "@/components/CityPicker";
export default {
    name: "plotDialog",
    components: { CityPicker },

    props: {
        plotFlag: {
            type: Boolean,
            default: false
        },
        dialogName: {
            type: String,
            default: ""
        },
        buttonType: {
            type: String,
            default: ""
        },
        id: {

            default: 0
        }
    },

    setup(props, { root, emit, refs }) {
        const userName = computed(() => root.$store.state.app.username);
        const { resetValue } = cityPicker();
        const data = reactive({
            username: userName,
            dialog_info_flag: false,
            dialog_name: "",
            buttonType: "",   
            formLabelWidth: "100px",

            communityId: 0,

            cityPickerData: {
                provinceValue: "",
                cityValue: "",
                areaValue: ""
            },

            form: {
                name: "",
                code: "",
                address: "",
                phone: ""
            }
        })


        /*******************************************************************************************
         方法
         */
        //  watch 监听父组件,父组件向子组件传值
        watch(() => {
            data.dialog_info_flag = props.plotFlag
        });


        // 打开弹窗前触发的方法
        const openDialog = () => {
            data.dialog_name = props.dialogName;
            data.buttonType = props.buttonType;
            data.communityId = props.id;
            if(data.buttonType == "editCommunity") {
                loadCommunityInfo();
            }
        }

        // 关闭弹窗前触发的方法
        const close = () => {
            data.dialog_info_flag = false;
            data.dialog_name = "";
            data.communityId = 0;
            resetForm();
            emit("update:plotFlag", false);
        }

        // 表单验证
        const validateName = (rule, value, callback) => {
            validateEmpty("小区名称", value, callback);
        };

        const validateCode = (rule, value, callback) => {
            validateEmpty("小区标识", value, callback);
        };

        const validatePhone = (rule, value, callback) => {
            validateFormPhone("手机号", value, callback);
        };
        
        const validateAddress = (rule, value, callback) => {
            validateEmpty("小区详细地址", value, callback);
        };

        // 表单验证规则
        const rules = reactive({
            name: [
            { validator: validateName, trigger: 'blur' }
            ],
            code: [
            { validator: validateCode, trigger: 'blur' }
            ],
            phone: [
            { validator: validatePhone, trigger: 'blur' }
            ],
            address: [
            { validator: validateAddress, trigger: 'blur' }
            ]
        });

        

        // 加载数据
        const loadCommunityInfo = () => {
            let requestData = {
                communityId: data.communityId,
                current: 1,
                size: 10
            }
            GetComunityInfo(requestData).then(response => {
                console.log("编辑")
                console.log(response.data.data.records)
                let responseData = response.data.data.records[0];
                data.form.name = responseData.name;
                data.form.code = responseData.code;
                data.form.address = responseData.address;
                data.form.phone = responseData.phone;
                data.cityPickerData = {
                    provinceValue: responseData.provinceCode,
                    cityValue: responseData.cityCode,
                    areaValue: responseData.countyCode,
                }
            }).catch(error => {

            })
            
        }

        // 提交
        const submit = (formName => {
            refs[formName].validate((valid) => {
                if (valid) {
                    if(data.buttonType == "addCommunity"){
                        addCommunity()
                    }
                    if(data.buttonType == "editCommunity"){
                        editCommunity()
                    }
                }
            })
        })
        //添加小区
        const addCommunity = () => {
            let resquestData = {
                name: data.form.name,
                mark: data.form.code,
                phone: data.form.phone,
                provinceCode: data.cityPickerData.provinceValue,
                cityCode: data.cityPickerData.cityValue,
                countyCode: data.cityPickerData.areaValue,
                address: data.form.address,
                username: data.username
            }
            AddCommunity(resquestData).then(response => {
                let responseData = response.data;
                root.$message({
                    message: responseData.message,
                    type: "success"
                });
                emit("refreshData");
                close();
                
            })
        }
        // 修改小区信息
        const editCommunity = () => {
            let resquestData = {
                communityId: data.communityId,
                name: data.form.name,
                mark: data.form.code,
                phone: data.form.phone,
                provinceCode: data.cityPickerData.provinceValue,
                cityCode: data.cityPickerData.cityValue,
                countyCode: data.cityPickerData.areaValue,
                address: data.form.address,
                username: data.username
            }
            EditCommunity(resquestData).then(response => {
                let responseData = response.data;
                root.$message({
                    message: responseData.message,
                    type: "success"
                });
                emit("refreshData");
                close();
            }).catch(error => {

            })
        }
        // 重置表单
        const resetForm = () => {
            refs.infoForm.resetFields();
            data.cityPickerData = {
                provinceValue: "",
                cityValue: "",
                areaValue: ""
            }
        }
        return {
            data,
            rules, validateName, validateCode, validatePhone, validateAddress,
            openDialog, close, submit, resetForm, addCommunity, editCommunity, resetValue, loadCommunityInfo
        }
    }
}
</script>
<style lang="scss" scoped>

</style>