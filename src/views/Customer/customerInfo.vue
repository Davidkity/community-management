<template>
    <div class="main">
         <!--头-->
        <div class="content-top" style="height:90px" >
            <div class="search-title">
                <div> <p class="title">用户信息</p> </div>
                    <div>
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                            <el-breadcrumb-item>用户信息</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
            </div>
        </div>

        <div class="content-top" :style="data.unit_top_height">
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">用户信息</el-col>
                    <el-button class="moreButton" type="text" @click="changeSelect" >{{ data.moreConditionSelect }}</el-button>
                </el-row>
            </div>
            <div class="search-content">
                <el-row :gutter="14" >
                    <el-col :span="7">
                        <el-input
                            placeholder="请输入业主名"
                            v-model="data.selectOptions.search_name"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入业主身份证"
                            v-model="data.selectOptions.search_idCard"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入联系方式"
                            v-model="data.selectOptions.search_phone"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="5"  >
                        <el-button type="primary" class="searchButton" @click="search" icon="el-icon-search">
                            查询
                        </el-button>
                    </el-col>
                </el-row>
                

                <el-row :gutter="14" class="el_col_hidden" :hidden="data.conditionIsHidden">
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入用户账号"
                            v-model="data.selectOptions.search_email"
                            clearable>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
        
        </div>

        <!-- 表格显示数据 -->
        <div class="mid-content">

            <div class="mid-title">
                <el-row :gutter="20">
                    <el-col :span="22">业主信息</el-col>
                    <el-button class="moreButton" type="primary" @click="addUser" size="small" icon="el-icon-circle-plus-outline">添加用户</el-button>
                </el-row>
            </div>

            <!-- 表格数据 -->
            <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
                <template v-slot:sexName="slotData">
                    <el-input v-model="slotData.data.sex" v-text="slotData.data.sex == 'W' ? '女' : (slotData.data.sex == 'M' ? '男' : '')"></el-input>
                </template>

                <template v-slot:age="slotData">
                    <el-input v-model="slotData.data.sex" v-text="slotData.data.age != '' ? slotData.data.age : ''"></el-input>
                </template>

                <template v-slot:operation="slotData">
                    <el-button size="small" type="text"  @click="bindUser(slotData.data)">绑定业主</el-button>
                    <el-button size="small" type="text"  @click="changePwd(slotData.data)">修改密码</el-button>
                    <el-button size="small" type="text"  @click="giveRole(slotData.data)">编辑用户</el-button>
                </template>
                <template v-slot:tableFooterLeft >
                    <label class="empty">.</label>
                </template>
            </TableVue>
        
        </div>
        <!-- 新增弹窗 -->
        <AddDialog :userFlag.sync="data.userInfoDialog" :buttonType.sync="data.buttonType" :dialogName.sync="data.dialogName" :userId.sync="data.uId" :name.sync="data.name"  @getChangeData="getData"></AddDialog>

        <ChooseUserDialog :chooseFlag.sync="data.chooseUserDialog" :buttonType.sync="data.buttonType" :dialogName.sync="data.dialogName" :uId.sync="data.uId"  @getChangeData="getData"></ChooseUserDialog>

        <GiveRoleDialog :giveRoleFlag.sync="data.giveRoleDialog" :buttonType.sync="data.buttonType" :dialogName.sync="data.dialogName" :uInfo.sync="data.uInfo"  @getChangeData="getData"></GiveRoleDialog>
    </div>
</template>
<script>
import { reactive } from '@vue/composition-api';
import { setCommunity, getCommunity  } from "@/utils/app";

//组件
import TableVue from "@/components/Table"; 
import AddDialog from "./dialog/add";
import ChooseUserDialog from "./dialog/chooseUser";
import GiveRoleDialog from "./dialog/giveRole";
export default {
    name: "myMoney",
    components: { TableVue, AddDialog, ChooseUserDialog, GiveRoleDialog },
    setup(props, { root, refs }) {

        const marks = getCommunity();
        const data = reactive({
            
            // 查询条件中的
            house_top_height: "height:132px",
            moreConditionSelect: "更多",
            conditionIsHidden: "true",

            selectOptions:{
                search_name: "",
                search_idCard: "",
                search_phone: "",
                search_email: "",
            },
            uId: "",
            name: "",
            uInfo: {},
            giveRoleDialog: false,
            chooseUserDialog: false,
            userInfoDialog: false,
            buttonType: "",
            dialogName: "",
            // 表格
            configTable: {
                
                // 表头
                tHead: [
                    { label: "账号",  field: "email", width: 220 },
                    { label: "账号名",  field: "name", width: 120 },
                    { label: "业主名", field: "uname", width: 120, },
                    { label: "身份证", field: "idCard", width: 180, },
                    { label: "性别", field: "sex", width: 80, columnType: "slot", slotName: "sexName" },
                    { label: "年龄", field: "age", columnType: "slot", slotName: "age"},
                    { label: "联系方式", field: "phone" },
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    url: "getUInfo",
                    data: {
                        mark: marks,
                        current: 1,
                        size: 10
                    }
                }
            }
        })




        /******************************************************
            方法 
         */

        //是否隐藏更多查询条件
        const changeSelect = () => {
            if(data.moreConditionSelect == "更多"){
                data.conditionIsHidden = false;
                data.house_top_height = "height: 256px";
                data.moreConditionSelect = "隐藏";
            }else{
                data.conditionIsHidden = true;
                data.house_top_height = "height: 132px";
                data.moreConditionSelect = "更多";
            }
        }

        const search = () => {
            let requestData = {
                url: "getUInfo",
                data: {
                    mark: marks,
                    current: 1,
                    size: 10,
                    uname: data.selectOptions.search_name,
                    idCard: data.selectOptions.search_idCard,
                    phone: data.selectOptions.search_phone,
                    email: data.selectOptions.search_email,
                }
            };
            getList(requestData)
        }


        /**********************************表格************************************************************** */
        // 添加业主
        const addUser = () =>{
            data.userInfoDialog = true;
            data.dialogName = "添加用户";
            data.buttonType = "addUser";
        }

        // 绑定业主
        const bindUser = (params) => {
            data.uId = params.id;
            data.chooseUserDialog = true;
            data.dialogName = "选择业主";
            data.buttonType = "chooseUser";
        }
        
        // 赋予角色
        const giveRole = (params) => {
            data.uInfo = {
                uId:  params.id,
                name: params.name,
                email: params.email
            }
            data.giveRoleDialog = true;
            data.dialogName = "编辑用户";
            data.buttonType = "giveRole";
        }

        // 改密码
        const changePwd = (params) => {
            data.userInfoDialog = true;
            data.uId = params.id;
            data.name = params.name;
            data.dialogName = "修改密码";
            data.buttonType = "changePwd";
        }

        const getData = () => {
            let requestData = {
                url: "getUInfo",
                data: {
                    mark: marks,
                    current: 1,
                    size: 10
                }
            }
            getList(requestData)
        }
        //刷新数据
        const getList = (params) => {
            refs.userTable.refreshData(params);
        }
        return {
            data, marks,
            search, changeSelect, addUser, getList, getData, bindUser, changePwd, giveRole
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