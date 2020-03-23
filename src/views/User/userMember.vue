<template>
    <div class="userMember">
        <!--头-->
        <div class="user-content-top" style="height:90px" >
            <div class="content-title" style="line-height: 25px;">
                <div> <p class="title">业主成员</p> </div>
                    <div>
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>业主管理</el-breadcrumb-item>
                            <el-breadcrumb-item>业主成员</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
            </div>
        </div>
        <div class="user-content-top" :style="data.house_top_height">
            <div class="content-title">
                <el-row :gutter="20">
                    <el-col :span="6">业主信息</el-col>
                    <el-button class="moreButton" type="primary"  @click="selectUser" >选择业主</el-button>
                    <el-button class="moreButton" type="primary"  :hidden="data.hiddenAddMember" @click="addMember" >添加成员</el-button>
                </el-row>
            </div>
            <div class="content-body">
                <el-row v-model="data.ownerInfo" type="flex" class="row-bg">
                    <el-col :span="4">
                    <!--
                        <div class="demo-image__placeholder">
                            <div class="block">
                                <el-image class="img" :src="data.imgSrc"  fit="fill">
                                <div slot="placeholder" class="image-slot">
                                    加载中<span class="dot">...</span>
                                </div>
                                </el-image>
                                
                            </div>
                        </div>
                    -->
                        <Uploadimg :imgName.sync="data.ownerInfo.img" :config="uploadImgConfig"></Uploadimg>
                    </el-col>
                    
                    <el-col :span="20">
                        <div class="inner_row_div">
                            <el-row :span="20" class="inner_row_style">
                                <el-col :span="7">
                                    <label>业主编码：</label> 
                                    <label>{{data.ownerInfo.code}}</label>
                                </el-col>
                                <el-col :span="1" class="empty">.</el-col>
                                <el-col :span="7">
                                    <label>名称：</label> 
                                    <label>{{data.ownerInfo.name}}</label>
                                </el-col>
                                <el-col :span="1" class="empty">.</el-col>
                                <el-col :span="7">
                                    <label>性别：</label> 
                                    <label v-text="data.ownerInfo.sex == 'W' ? '女' : data.ownerInfo.sex == 'M' ? '男' : ''"></label>
                                </el-col>
                                <el-col :span="1" class="empty">.</el-col>
                            </el-row>
                            
                            <el-row :span="20" class="inner_row_style">
                                <el-col :span="7">
                                    <label>年龄：</label> 
                                    <label>{{data.ownerInfo.age}}</label>
                                </el-col>
                                <el-col :span="1" class="empty">.</el-col>
                                <el-col :span="7">
                                    <label>身份证号：</label> 
                                    <label>{{data.ownerInfo.idCard}}</label>
                                </el-col>
                                <el-col :span="1" class="empty">.</el-col>
                                <el-col :span="7">
                                    <label>联系方式：</label> 
                                    <label>{{data.ownerInfo.phone}}</label>
                                </el-col>
                                <el-col :span="1" class="empty">.</el-col>
                            </el-row>

                            <el-row :span="20" >
                                <el-col :span="7">
                                    <label>创建员工：</label> 
                                    <label>{{data.ownerInfo.createBy}}</label> 
                                </el-col>
                                <el-col :span="1" class="empty">.</el-col>
                                <el-col :span="7">
                                    <label>备注：</label> 
                                    <label>{{data.ownerInfo.content}}</label> 
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    
                    
                        
                </el-row>
                
                
            </div>
        </div>
        <div class="user-content">
            <div class="user-title"></div>
            <!-- 表格数据 -->
            <TableVue ref="userMemberTable" :config="data.configTable" :tableRow.sync="data.tableRow">
                <template v-slot:sexName="slotData">
                    <el-input v-model="slotData.data.sex" v-text="slotData.data.sex == 'W' ? '女' : '男'"></el-input>
                </template>
                <template v-slot:operation="slotData">
                    <el-button size="small"  @click="editUserMember(slotData.data)">修改</el-button>
                    <el-button size="small"  @click="delUserMember(slotData.data)">删除</el-button>
                </template>
            </TableVue>
        </div>
        <AddUserDialog :userFlag.sync="data.userInfoDialog" :buttonType.sync="data.buttonType" :isOwner.sync="data.isOwner" :dialogName.sync="data.dialogName"
                     :userId.sync="data.ownerInfo.userId" :memberId.sync="data.memberId" 
                     @getChangeData="getMembers"></AddUserDialog>
        <ChooseUser :chooseUserFlag.sync="data.chooseFlag"  @getChangeData="getMembers" 
                    :userId.sync = "data.ownerInfo.userId"     :code.sync = "data.ownerInfo.code"
                    :name.sync = "data.ownerInfo.name"         :sex.sync = "data.ownerInfo.sex"
                    :age.sync = "data.ownerInfo.age"           :idCard.sync = "data.ownerInfo.idCard"
                    :phone.sync = "data.ownerInfo.phone"       :img.sync = "data.ownerInfo.img"
                    :createBy.sync = "data.ownerInfo.createBy" :content.sync = "data.ownerInfo.content"></ChooseUser>
    </div>
</template>

<script>
import { global } from "@/utils/global_V3.0.js";
import { reactive, onMounted } from '@vue/composition-api';
import { GetMemberList, DelMember } from "@/api/adminApi/user";
import { setCommunity, getCommunity  } from "@/utils/app";

//组件
import TableVue from "@/components/Table"; 
import AddUserDialog from "./dialog/addUser";
import ChooseUser from "./dialog/chooseUser";
import Uploadimg from "@/components/Uploadimg";


export default {
    name: "UserMember",
    components: { TableVue, AddUserDialog, ChooseUser, Uploadimg },

    setup(props, {  root, refs }) {
        const { confirm } = global();

        // 图片上传配置
        const uploadImgConfig = reactive({
            action: "http://localhost:8081/api/image/upload",
        });
        const marks = getCommunity();
        const data = reactive({
            
            hiddenAddMember: true,
            imgSrc: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            
            imgName: "",

            chooseFlag: false,

            userInfoDialog: false,
            buttonType: "",
            dialogName: "",
            // 成员id
            memberId: "",
            isOwner: "",
            ownerInfo: {
                userId: "",
                code: "",
                name: "",
                sex: "",
                age: "",
                idCard: "",
                phone: "",
                img: "",
                createBy: "",
                content: ""
            },
            //表格数据
            tableRow: {},
            configTable: {
                paginationShow: false,
                // 表头
                tHead: [
                    { label: "成员编号",  field: "code", width: 200 },
                    { label: "名称",  field: "name", width: 100 },
                    { label: "性别", field: "sex", width: 80, columnType: "slot", slotName: "sexName" },
                    { label: "年龄", field: "age", width: 80 },
                    { label: "关系", field: "relationName", width: 80,},
                    { label: "身份证", field: "idCard" },
                    { label: "联系方式", field: "phone" },
                    { label: "创建人", field: "createBy", width: 100 },
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    url: "getUserMemberList",
                    data: {
                        mark: marks,
                        ownerId: 0,
                        current: 1,
                        size: 1000
                    }
                }
            }

            

        })


        /*************************************************
            方法
         */
        // 选择业主
        const selectUser = () => {
            data.hiddenAddMember = false;
            data.chooseFlag = true;
        }
        // 添加成员
        const addMember = () => {
            data.userInfoDialog = true;
            data.isOwner = "N";
            data.dialogName = "添加成员";
            data.buttonType = "addMember";

        }
        // 查找出成员信息
        const getMembers = () => {
            console.log("获取信息")
            let requestData = {
                url: "getUserMemberList",
                data: {
                    mark: marks,
                    ownerId: data.ownerInfo.userId,
                    current: 1,
                    size: 1000
                }
            }
            refs.userMemberTable.refreshData(requestData);
        }
        
        // 修改成员信息
        const editUserMember = (params) => {
            console.log(params);
            data.memberId = params.userId;
            data.userInfoDialog = true;
            data.dialogName = "修改成员信息";
            data.buttonType = "editUserMember";
        }

        // 删除成员信息
        const delUserMember = (params) => {
            console.log("ownerId: " + data.ownerInfo.userId)
            console.log(params);
            data.memberId = params.userId;
            confirm({
                context: "确认删除当前所选信息，确认后将无法恢复！！",
                type: "warning",
                fn: memberDelete
            })
        }
        const memberDelete = () => {
            console.log("data.memberId: " + data.memberId);
            let requestData = {
                mark: marks,
                ownerId: data.ownerInfo.userId,
                memberId: data.memberId
            }
            DelMember(requestData).then(response => {
                let responseDate = response.data;
                console.log(responseDate);
                root.$message({
                    message: responseDate.message,
                    type: "success"
                })
                getMembers();
            }).catch(error => {

            })
        }

        onMounted(() => {

        })
        return {
            data, marks, uploadImgConfig,
            selectUser, addMember, getMembers, editUserMember, delUserMember, memberDelete
        }
    }
}
</script>

<style lang="scss" scoped>

.userMember {
    height: 100%;
    
}
.empty {
    color: #fff;
    
}
.user-content-top {
    // position: fixed;
    z-index: 8999;
    // height: 162px;
    margin-bottom: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
    @include webkit(box-sizing,border-box); 
    
    .content-title{
        line-height: 35px;
        font-weight:600;
        color: rgb(104, 107, 109);
        padding: 12px 20px 12px 20px;
        border-bottom: 1px solid #e7eaec;
       .moreButton {
           padding: 0 12px;
           margin-left: 10px;
           float: right;
           line-height: 35px;
       }
        
    }
    .content-body {
        padding: 18px 20px 12px 20px;
        
        .contentButton {
            float: right;
        }

        .el_col_hidden {
            padding-top: 18px;
        } 
        .inner_row_div {
            // margin: 10px 10px;
            padding: 10px 10px;
            .inner_row_style {
                height: 75px;
            }
        }
    }
    
}
.demo-image__placeholder {
    height: 200px;
    width: 200px;

    .img {
        height: 180px;
        width: 170px;
    }
}

// 表格头部
.user-content {
    height: 100%;
    // padding: 20px 20px 0 20px;
    // padding-right: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
}
.user-title {
    line-height: 35px;
    font-weight:600;
    padding: 12px 20px 12px 20px;
    color: rgb(104, 107, 109);
}

.title {
    font-size: 24px;
    font-weight: 10px;
    
}
.el-breadcrumb__item {
    font-size: 14px;
    margin-top: 15px;
}
</style>