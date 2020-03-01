<template>
    <div id="login" :style="backgroundDiv">
        <div class="login-wrap">
            <ul class="menu-tab">
            <li :class="{'current': item.current}" v-for="item in menuTab" :key="item.id" @click="toggleMenu(item)" >{{ item.txt }}</li>
            </ul>
          <!-- 表单开始 -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm"  class="login-form" size="medium">
                <el-form-item  prop="email" class="item-form">
                    <!-- for 是用来绑定input框的，达到点击label，input框也能获取到焦点 -->
                    <label for="email">邮箱</label>  
                    <el-input id="email" type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item  prop="username" class="item-form" v-if="loginButton.model === 'register'"> 
                    <!-- for 是用来绑定input框的，达到点击label，input框也能获取到焦点 -->
                    <label for="username">用户名</label>  
                    <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item  prop="password" class="item-form">
                    <label for="password">密码</label>
                    <el-input id="password"  v-model="ruleForm.password" autocomplete="off" minlength=6 maxlength=20></el-input>
                </el-form-item>
                <el-form-item  prop="passwords" class="item-form" v-if="loginButton.model === 'register'">
                    <label for="passwords">重复密码</label>
                    <el-input id="passwords"  v-model="ruleForm.passwords" autocomplete="off" minlength=6 maxlength=20></el-input>
                </el-form-item>
                <el-form-item  prop="code" class="item-form">
                    <label for="code">验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="15">
                            <el-input id="code" v-model="ruleForm.code" autocomplete="off" minlength=6 maxlength=6></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block" :disabled="codeButton.status" @click="getSms()">{{ codeButton.text }}</el-button>
                        </el-col>
                    </el-row>
                    
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block" :disabled="loginButton.status">{{ loginButton.model === "login" ? "登录" : "注册" }}</el-button>
                </el-form-item>
            </el-form> 
      </div>
    </div>
</template>

<script>
// JS实现的base64加密、md5加密及sha1加密
import sha1 from "js-sha1";
import {GetSms,Register,Login} from "@/api/adminApi/login";
//运用到什么接口，就导入什么接口
import { reactive, ref, isRef, toRefs, onMounted, computed } from "@vue/composition-api";
//验证规则
import { stripscript,validateEmail,validatePass,validateCodeValue } from '@/utils/validate';

export default {
    name: "login",

    setup(props, context){

        /*********************************************************************************************************
        * 方法
        */
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
        //验证邮箱
        let validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } 
            else {
                callback();  //true
            }
        };
        //验证密码
        let validatePassword = (rule, value, callback) => {

            ruleForm.password = stripscript(value);
            value = ruleForm.password;
            
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

            ruleForm.passwords = stripscript(value);
            value = ruleForm.passwords;
            
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value != ruleForm.password) {
                callback(new Error('两次密码不匹配，请重新输入'));
            } else {
                callback();
            }
        };
        //验证验证码
        let validateCode = (rule, value, callback) => {
            ruleForm.code = stripscript(value);
            value = ruleForm.code;
            
            if (value === '') {
                return callback(new Error('请输入验证码'));
            } else if(!validateCodeValue(value)){
                return callback(new Error('验证码格式有误'));
            } else {
                callback();
            }
        }

        /*************************************************************************************************
            数据
         */

        //倒计时
        const timer = ref(null);

        // 背景图片
        const backgroundDiv = reactive({
            backgroundImage : 'url(' + require('../../assets/bg2.jpg') + ')',
            backgroundRepeat : 'no-repeat',
            backgroundSize : '100% 100%'
        })

        const menuTab = reactive([
            { txt: "登录", current: true, type: 'login' },
            { txt: "注册", current: false, type: 'register' }
        ]);
        //登录按钮
        const loginButton = reactive({
            // 登录按钮的状态（是否禁用）
            status: true,
            model: "login"
        });
        // 表单绑定数据
        const ruleForm = reactive( {
            username: '',
            email: '',
            password: '',
            passwords: '',
            code: ''
        });
        //验证码按钮
        const codeButton = reactive({
            status: false,
            text: "获取验证码"
        });
        // 表单验证规则
        const rules = reactive({
            email: [
            { validator: validateEmailFrom, trigger: 'blur' }
            ],
            username: [
            { validator: validateUsername, trigger: 'blur' }
            ],
            password: [
            { validator: validatePassword, trigger: 'blur' }
            ],
            passwords: [
            { validator: validatePasswords, trigger: 'blur' }
            ],
            code: [
            { validator: validateCode, trigger: 'blur' }
            ]
        });
        /*******************************************************************************************************
        * 声明函数
        */
        const toggleMenu = (data => {
            menuTab.forEach(element => {
                element.current = false;
            });
            data.current = true;
            //修改模块值
            loginButton.model = data.type;
            resetFormDate();
            //重置验证码按钮文本内容
            codeButton.text = "获取验证码";
            //重置登录(注册)按钮为默认不可点的状态
            clearCountDown();
        });
        /**
        * 重置表单数据
        */
        const resetFormDate = (() => {
            //重置表单数据
            context.refs.loginForm.resetFields();
        });
        /**
        * 验证码按钮状态修改
        */
        const updateCodeButtonStatus = ((params) =>{
            codeButton.status = params.status;
            codeButton.text = params.text;
        });
        /**
        * 登录、注册按钮可选状态的修改
        */
        const updateLoginButtonStatus = ((params) => {
            loginButton.status = params.status;
        });
        /**
        * 获取验证码
        */
        const getSms = (() => {
            console.log("进入 getSms 方法");
            //进行提示
            // if(ruleForm.username == ''){
            //     context.root.$message.error('用户名不能为空！！');
            //     return false;
            // }  
            //前端验证邮箱格式
            if(!validateEmail(ruleForm.email)){
                context.root.$message.error('邮箱的格式不正确，请重新输入！！');
                return false;
            }
            //请求验证码的接口
            let data = {
                email: ruleForm.email,
                module: loginButton.model
            // module: loginButton.model
            };
            //修改验证码按钮的状态
            updateCodeButtonStatus({
                status: true,
                text: "发送中"
            });
            //模拟延时请求 3秒
            setTimeout(() => {
                console.log(data.email);
                console.log(data.module);
                GetSms(data).then(response => {
                    let data = response.data;
                    console.log(data);
                    context.root.$message({
                        message: data.message,
                        type: "success"
                    });
                    //启用登录或注册按钮
                    updateLoginButtonStatus({
                        status: false
                    });
                    //调定时器，倒计时
                    countDown(5);
                }).catch(error => {
                    updateCodeButtonStatus({
                        status: false,
                        text: "获取验证码"
                    })
                    console.log(error);
                });
            }, 3000);
            
        })
        /**
        * 提交表单
        */
        const submitForm = (loginForm => {
            context.refs[loginForm].validate((valid) => {
                if (valid) {
                    loginButton.model === "login" ? login() : register();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        });
        /**
        * 登录
        */
        const login = (() => {
            let requestData = {
                email: ruleForm.email,
                username: ruleForm.username,
                password: sha1(ruleForm.password),
                code: ruleForm.code
            };
            context.root.$store.dispatch("app/login",requestData).then(response => {
                // Login(requestData).then(response =>{
                //     console.log(response);
                    clearCountDown();

                    // 路由跳转
                    context.root.$router.push({
                        name: "Console"
                    });
                }).catch(error => {

                });
            });
        
        /**
        * 注册
        */
        const register = (() => {
            let requestData = {
                email: ruleForm.email,
                username: ruleForm.username,
                password: sha1(ruleForm.password),
                code: ruleForm.code,
                module: loginButton.model
            }
            Register(requestData).then(response => {
                let data = response.data;
                context.root.$message({
                    message: data.message,
                    type: "success"
                })
                // 注册成功
                toggleMenu(menuTab[0]);
                clearCountDown();
            }).catch(error =>{
                // 失败时执行的代码
            });
        });
        /**
        * 倒计时
        */
        const countDown = ((number) => {
            // setTimeout 倒计时，只执行一次
            // 判断定时器是否存在，存在则清除
            if(timer.value){
                clearInterval(timer.value);
            }
            let time = number;
            //setInterval 倒计时，可不断的执行，需要条件才会停止
            timer.value = setInterval(() => {
                time--;
                if(time === 0){
                    clearInterval(timer.value);
                    updateCodeButtonStatus({
                        status: false,
                        text: "再次获取"
                    });
                }else{
                    codeButton.text = `倒计时${time}秒`;
                }
            }, 1000);
        });
        /**
        * 清除倒计时
        */
        const clearCountDown = (() =>{
            // 还原验证码按钮默认状态
            updateCodeButtonStatus({
                status: false,
                text: "获取验证码"
            });
            // 登录、注册按钮不可选
            updateLoginButtonStatus({
                status: true
            });
            // 清除倒计时计时器
            clearInterval(timer.value);
        });
        
        /**
        * 生命周期
        */
        //挂载完成后
        onMounted(() => {
            
        }) 


        return {
            // ref
            timer, 
            //reactive
            backgroundDiv, menuTab, loginButton, ruleForm, codeButton, rules, 
            // 函数
            toggleMenu, submitForm, getSms
        }
    }
}
</script>
<style lang="scss" scoped>
    #login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
    width: 330px;
    margin: auto;
}
.menu-tab {
    text-align: center;
    li {
        display: inline-block;
        width: 88px;
        line-height: 36px;
        font-size: 14px;
        color: #fff;
        border-radius: 2px;
        margin-bottom: -8px;
        cursor: pointer
    }
    .current {
        background-color: rgba(0,0,0,.1);
    }
}
.login-form {
    margin-top: 29px;
    label {
        display: block;
        text-align: left;
        margin-bottom: -8px;
        margin-top: 12px;
        font-size: 14px;
        color: #fff
    }
    .item-form { margin-bottom: 13xp; }
    .block {
        display: block;
        width: 100%;
    }
    .login-btn {margin-top: 19px; }
}
</style>