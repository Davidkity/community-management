
<template>
    <div>
        <el-dialog :title="data.dialogName" :visible.sync="data.userInfoFlag"  @close="close" width="580px" @open="openDialog">
            
            <el-form :model="data.form" ref="addUserForm" status-icon :rules="rules">
                <el-form-item prop="name" required label="名称：" :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.name" clearable placeholder="必填，请输入名称"  ></el-input>
                </el-form-item>
                <el-form-item prop="sex"  label="性别：" :label-width="data.formLabelWidth"
                    :rules="[
                            { required: true, message: '性别不能为空'},
                            ]"
                >
                    <SelectVue :config="data.configOption" :selectVal.sync="data.form.sex"></SelectVue>
                </el-form-item>
                <el-form-item prop="age" label="年龄：" required :label-width="data.formLabelWidth">
                    <el-input v-model.number="data.form.age" clearable placeholder="必填，请输入年龄" ></el-input>
                </el-form-item>
                <el-form-item prop="relation" label="成员关系：" :hidden="data.relationFlag"  :label-width="data.formLabelWidth">
                    <SelectVue :config="data.configOptionRelation" :selectVal.sync="data.form.relationCode"></SelectVue>
                </el-form-item>
                <el-form-item prop="idCard" label="身份证：" required :label-width="data.formLabelWidth">
                    <el-input v-model="data.form.idCard" clearable placeholder="必填，请输入身份证" minlength=15 maxlength=18 ></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="手机：" required :label-width="data.formLabelWidth">
                    <el-input v-model.number="data.form.phone" clearable placeholder="必填，请输入手机" minlength=11 maxlength=11 ></el-input>
                </el-form-item>

                <el-form-item prop="phone" label="头像：" required :label-width="data.formLabelWidth">
                    <Uploadimg :imgName.sync="data.imgName" :config="uploadImgConfig"></Uploadimg>
                </el-form-item>
                
                <el-form-item prop="content" label="备注：" :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.content" type="textarea" clearable placeholder="可填，请输入备注" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                <el-button  @click="close">取消</el-button>
                <el-button type="danger" :loading="data.submitLoading" @click="submit('addUserForm')">确定</el-button>
            </div>
            
        </el-dialog>
    </div>
</template>
<script>
import { watch, reactive, computed, onMounted } from '@vue/composition-api';
import { AddUser, UserInfo, EditUser, GetMemberList } from "@/api/adminApi/user"
import { validateEmpty, validateFormAge, validateFormPhone, validateFormIdCard } from "@/utils/formValidate"
import { setCommunity, getCommunity  } from "@/utils/app";

// 组件
import SelectVue from "@/components/Select";
import Uploadimg from "@/components/Uploadimg";

export default {
    name: "addUser",
    components: { SelectVue, Uploadimg },
    props: {
        userFlag: {
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
        userId: {

            default: 0
        },
        memberId: {

            default: 0
        },
        isOwner: {
            type: String,
            default: ""
        }

    },
    setup(props, { refs, root, emit }) {
        const userName = computed(() => root.$store.state.app.username);

        // 图片上传配置
        const uploadImgConfig = reactive({
            action: "http://localhost:8081/api/image/upload",
            show: true
        });

        const data = reactive({
            marks: getCommunity(),
            username: userName,
            imgName: "",

            userInfoFlag: false,
            buttonType: "",
            dialogName: "",
            userId: 0,
            memberId: 0,
            isOwner: "",   // 区别业主与成员的标识
            relationFlag: true,
            formLabelWidth: "110px",
            configOption: {
                clearFlag: true,
                selectValue: "",
                init: ["", "W", "M"]
            },
            configOptionRelation:{
                clearFlag: true,
                selectValue: "",
                init: ["MEMBER", "TENANT", "OTHER"]
            },
            form: {
                name: "",
                sex: "",
                age: "",
                relationCode: "",
                idCard: "",
                phone: "",
                content: ""
            }
        })


        /**
            方法
         */
        // 监听
        watch(() => {
            data.userInfoFlag = props.userFlag
            data.isOwner = props.isOwner;
        });
        // 打开
        const openDialog = () => {
            data.buttonType = props.buttonType;
            data.dialogName = props.dialogName;
            data.isOwner = props.isOwner;
            if(data.buttonType == "editUser") {
                console.log("编辑");
                data.userId = props.userId;
                loadUserInfo(data.userId);
            }  
            if(data.buttonType == "addMember"){
                data.userId = props.userId;
                data.relationFlag = false;
            }
            if(data.buttonType == "editUserMember") {
                data.userId = props.memberId;
                // data.memberId = props.memberId;
                data.relationFlag = false;
                loadUserMemberInfo(props.userId, props.memberId);
            }
        }
        // 关闭
        const close = () => {
            data.userInfoFlag = false;
            data.buttonType = "";
            data.form.sex = "";
            data.imgName = ""; 
            resetForm();
            emit("update:userFlag", false);
            emit("update:buttonType", "");
            emit("getChangeData")
        }

        // 表单验证
        const validateName = (rule, value, callback) => {
            validateEmpty("姓名", value, callback);
        };
        const validateAge = (rule, value, callback) => {
            validateFormAge(value, callback);
        };
        const validateIdCard = (rule, value, callback) => {
            validateFormIdCard("身份证", value, callback);
        }
        const validatePhone = (rule, value, callback) => {
            validateFormPhone("手机号", value, callback);
        };
        // 表单验证规则
        const rules = reactive({
            name: [
            { validator: validateName, trigger: 'blur' }
            ],
            age: [
            { validator: validateAge, trigger: 'blur' }
            ],
            idCard: [
            { validator: validateIdCard, trigger: 'blur' }
            ],
            phone: [
            { validator: validatePhone, trigger: 'blur' }
            ]
        });

        // 提交
        const submit = (formName => {
            refs[formName].validate((valid) => {
                if (valid) {
                    if(data.buttonType == "addUser" || data.buttonType == "addMember"){
                        addUser()
                    }
                    if(data.buttonType == "editUser" || data.buttonType == "editUserMember"){
                        editUser()
                    }
                } else {
                    root.$message({
                        message: "填写信息不正确，请重新填写",
                        type: "error"
                    });
                    return false;
                }
            })
        })
        // 加载业主信息
        const loadUserInfo = (id) => {
            let requestData = {
                mark: data.marks,
                userMark: "US",
                userId: id,
                current: 1,
                size: 2,
            }
            UserInfo(requestData).then(response => {
                let responseData = response.data.data;
                data.form = responseData.records[0];
                data.configOption.selectValue = responseData.records[0].sex
                data.imgName = responseData.records[0].img;
            }).catch(error => {

            })
        }
        // 加载业主成员信息
        const loadUserMemberInfo = (userId, memberId) => {
            let requestData = {
                mark: data.marks,
                userMark: "US",
                ownerId: userId,
                otherId: memberId,
                current: 1,
                size: 2
            }
            GetMemberList(requestData).then(response => {
                let responseData = response.data.data;
                data.form = responseData.records[0];
                data.configOption.selectValue = responseData.records[0].sex;
                data.configOptionRelation.selectValue = responseData.records[0].relationCode;
                data.imgName = responseData.records[0].img;
            }).catch(error => {

            })
        }
        // 重置表单
        const resetForm = () => {
            refs.addUserForm.resetFields();
        }

        // 响应数据
        const responseFun = (responseData) => {
            root.$message({
                message: responseData.message,
                type: "success"
            });
            resetForm();
            emit("getChangeData");
            data.buttonType = "";
        }
        // 添加业主
        const addUser = () => {
            let requestData = {
                mark: data.marks,
                userMark: "US",
                userId: data.userId,
                operate: data.buttonType,
                isOwner: data.isOwner,
                name: data.form.name,
                sex: data.form.sex,
                age: data.form.age,
                idCard: data.form.idCard,
                phone: data.form.phone,
                imgName: data.imgName,
                content: data.form.content,
                username: data.username,
                memberRelation: data.form.relationCode
            }
            AddUser(requestData).then(response => {
                let responseData = response.data
                //响应数据
                responseFun(responseData);
                close()
            }).catch(error => {

            })
        }

        // 修改业主基本信息
        const editUser = () => {
            console.log("修改业主基本信息");
            let requestData = {
                mark: data.marks,
                userMark: "US",
                userId: data.userId,
                ownerId: props.userId,
                name: data.form.name,
                sex: data.form.sex,
                age: data.form.age,
                relationCode: data.form.relationCode,
                idCard: data.form.idCard,
                phone: data.form.phone,
                imgName: data.imgName,
                content: data.form.content,
                username: data.username
            }
            EditUser(requestData).then(response => {
                let responseData = response.data
                //响应数据
                responseFun(responseData);
                close()
            }).catch(error => {

            })
        }

        onMounted(() => {
            console.log("imgName: " + data.mgName);
        })
        
        return {
            data, uploadImgConfig,
            openDialog, close, submit, rules, addUser, responseFun, resetForm, loadUserInfo, loadUserMemberInfo,
            editUser
            
        }
    }
}
</script>
<style lang="scss" scoped>

</style>    