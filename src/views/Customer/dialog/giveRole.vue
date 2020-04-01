<template>
    <div>
        <el-dialog :title="data.dialogName" :visible.sync="data.giveRoleFlag"  @close="close" width="580px" @open="openDialog">
            
            <el-form :model="data.form" ref="editUserForm" :rules="rules" status-icon >
                <el-form-item prop="email" required label="用户账号"  :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.email" clearable placeholder="必填，请输入用户账号(邮箱)"  ></el-input>
                </el-form-item>
                <el-form-item prop="name" label="用户名称" required :label-width="data.formLabelWidth">
                    <el-input  v-model="data.form.name" clearable placeholder="必填，请输入用户账号名称"  ></el-input>
                </el-form-item>
                <el-form-item prop="roles" label="角色"  :label-width="data.formLabelWidth">
                    <el-radio-group v-model="data.form.role">
                        <el-radio v-for="item in data.roles" :key="item.roleId" :label="item.roleId">{{ item.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" >
                <el-button  @click="close">取消</el-button>
                <el-button type="danger" :loading="data.submitLoading" @click="submit()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { reactive, watch, computed, onMounted } from '@vue/composition-api';
import { setCommunity, getCommunity  } from "@/utils/app";
import { GetRoles, GetRole } from "@/api/adminApi/permission";

import { Edit } from "@/api/adminApi/login";

//验证规则
import { stripscript,validateEmail, } from '@/utils/validate';     
export default {
    name: "giveRole",

    props: {
        giveRoleFlag: {
            type: Boolean,
            default: ""
        },
        uInfo: {
            type: Object,
            default: () => {}
        }
    },

    setup(props, { root, emit }) {

        const userName = computed(() => root.$store.state.app.username);

        const data = reactive({
            marks: getCommunity(),
            username: userName,
            giveRoleFlag: false,
            buttonType: "",
            dialogName: "",
            formLabelWidth: "110px",
            //角色
            roles: {},

            form: {
                uId: "",
                name: "",
                email: "",
                role: 2,
            }
        })


        /**
        方法
         */
        // 监听
        watch(() => {
            data.giveRoleFlag = props.giveRoleFlag
        });
        // 打开
        const openDialog = () => {
            data.buttonType = props.buttonType;
            data.dialogName = props.dialogName;
            data.form = {
                uId: props.uInfo.uId,
                name: props.uInfo.name,
                email: props.uInfo.email,
                role: 0
            };
            if(data.buttonType == "changePwd"){
                data.userId = props.userId;
                data.name = props.name;
                data.hiddrenFlag = true;
            }
            loadInfo();
            loadRole();
        }
        // 关闭
        const close = () => {
            data.giveRoleFlag = false;
            emit("update:giveRoleFlag", false);
            emit("getChangeData")
            
        }

        // 提交
        const submit = () => {
            let requestData = {
                id: data.form.uId,
                name: data.form.name,
                email: data.form.email,
                role: data.form.role,
                username: data.username,
            }
            Edit(requestData).then(response => {
                root.$message({
                    message: response.data.message,
                    type: "success"
                })
                close();
            }).catch(error => {

            })

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

        //验证用户名
        let validateNameFrom = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } 
            else {
                callback();  //true
            }
        };

        // 表单验证规则
        const rules = reactive({
            email: [
            { validator: validateEmailFrom, trigger: 'blur' }
            ],
            name: [
            { validator: validateNameFrom, trigger: 'blur' }
            ],
            
        });


        // 加载信息
        const loadInfo = () => {
            
            GetRole({uId: data.form.uId}).then(response => {
                let responseData = response.data;
                data.form.role = responseData.data;
                console.log(responseData);
            }).catch(error => {

            })
        }

        // 加载信息
        const loadRole = () => {
            GetRoles().then(response => {
                let responseData =  response.data.data;
                console.log(responseData);
                data.roles = responseData;
            }).catch(error => {

            })
        }

        
        return {
            data, rules,
            openDialog, close, loadInfo, loadRole, submit
        }
    }
}
</script>
<style lang="scss" scoped>

</style>