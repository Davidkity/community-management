
<template>
    <div>
        <el-dialog :title="data.dialogName" :visible.sync="data.userInfoFlag"  @close="close" width="580px" @open="openDialog">
            
            <el-form :model="data.form" ref="addUserForm" status-icon :rules="rules">
                <el-form-item prop="email" required label="用户账号" v-if="!data.hiddrenFlag" :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.email" clearable placeholder="必填，请输入用户账号(邮箱)"  ></el-input>
                </el-form-item>
                <el-form-item prop="name" label="用户名称" v-if="!data.hiddrenFlag" :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.username" clearable placeholder="必填，请输入用户账号名称"  ></el-input>
                </el-form-item>
                <el-form-item prop="password" required label="用户密码" :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.password" clearable placeholder="必填，请输入用户密码"  ></el-input>
                </el-form-item>
                <el-form-item prop="passwords" required label="确认密码" :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.passwords" clearable placeholder="必填，请再次输入用户密码"  ></el-input>
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
import { setCommunity, getCommunity  } from "@/utils/app";
//验证规则
import { stripscript,validateEmail,validatePass,validateCodeValue } from '@/utils/validate';           
// JS实现的base64加密、md5加密及sha1加密
import sha1 from "js-sha1";
import { Register, Edit } from "@/api/adminApi/login";

// 组件
import SelectVue from "@/components/Select";
import Uploadimg from "@/components/Uploadimg";

export default {
    name: "add",
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
        name: {
            type: String,
            default: ""
        }
    },
    setup(props, { refs, root, emit }) {
        const userName = computed(() => root.$store.state.app.username);

        const marks = getCommunity();

        const data = reactive({
            marks: getCommunity(),
            username: userName,

            hiddrenFlag: false,

            userInfoFlag: false,
            buttonType: "",
            dialogName: "",
            userId: 0,
            name: "",
            memberId: 0,
            isOwner: "",   // 区别业主与成员的标识
            relationFlag: true,
            formLabelWidth: "110px",
            form: {
                email: "",
                username: "",
                password: "",
                passwords: ""
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
            
            if(data.buttonType == "changePwd"){
                data.userId = props.userId;
                data.name = props.name;
                data.hiddrenFlag = true;
            }
            
        }
        // 关闭
        const close = () => {
            data.userInfoFlag = false;
            data.buttonType = "";
            resetForm();
            emit("update:userFlag", false);
            emit("update:buttonType", "");
            emit("getChangeData")
        }

        // 表单验证
       //验证邮箱
        let validateEmailFrom = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱'));
            } else if(!validateEmail(value)){     //邮箱验证，正则表达式
                callback(new Error('用户名格式有误'));  
            }
            else {
                callback();  //true
            }
        };
        //验证密码
        let validatePassword = (rule, value, callback) => {

            data.form.password = stripscript(value);
            value = data.form.password;
            
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (!validatePass(value)) {
                callback(new Error('密码为6至20为的数组+字母'));
            } else {
                callback();
            }
        };
        //验证重复密码
        let validatePasswords = (rule, value, callback) => {

            data.form.passwords = stripscript(value);
            value = data.form.passwords;
            
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value != data.form.password) {
                callback(new Error('两次密码不匹配，请重新输入'));
            } else {
                callback();
            }
        };
        // 表单验证规则
        const rules = reactive({
            email: [
            { validator: validateEmailFrom, trigger: 'blur' }
            ],
            password: [
            { validator: validatePassword, trigger: 'blur' }
            ],
            passwords: [
            { validator: validatePasswords, trigger: 'blur' }
            ]
        });

        // 提交
        const submit = (formName => {
            refs[formName].validate((valid) => {
                if (valid) {
                    if(data.buttonType == "addUser"){
                        addUser()
                    }
                    if(data.buttonType == "changePwd"){
                        changePwd()
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
                mark: marks,
                email: data.form.email,
                username: data.form.username,
                password: sha1(data.form.password)
            }
            Register(requestData).then(resopnse => {
                let resopnseData = resopnse.data;
                root.$message({
                    message: resopnseData,
                    type: "success"
                })
                close();
            }).catch(error => {

            })
        }

        // 修改业主基本信息
        const changePwd = () => {
           let requestData = {
                id: data.userId,
                pwd: sha1(data.form.password)
            }
            Edit(requestData).then(resopnse => {
                resopnseData = resopnse.data;
                root.$message({
                    message: resopnseData.message,
                    type: "success"
                })
            }).catch(error => {

            })
            
        }

        onMounted(() => {

        })
        
        return {
            data, marks,
            openDialog, close, submit, rules, addUser, responseFun, resetForm,
            changePwd
            
        }
    }
}
</script>
<style lang="scss" scoped>

</style>    