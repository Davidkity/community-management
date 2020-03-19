<template>
    <div class="house">
        <!--条件查询-->
        <div class="house-content-top" :style="data.house_top_height">
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">查询条件</el-col>
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
                <el-row  :gutter="14" class="el_col_hidden" :hidden="data.conditionIsHidden">
                    <el-col :span="7">
                        <el-select v-model="data.selectOptions.search_buildValue" clearable @change="buildChange" placeholder="请选择楼栋">
                            <el-option
                            v-for="item in data.buildOptions"
                            :key="item.buildId"
                            :label="item.name"
                            :value="item.buildId">
                            </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-select v-model="data.selectOptions.search_unitValue" clearable @change="unitChange"  placeholder="请选择单元">
                            <el-option
                            v-for="item in data.unitOptions"
                            :key="item.unitId"
                            :label="item.num" 
                            :value="item.unitId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="1" class="empty">.</el-col>
                    <el-col :span="5">
                        <el-select v-model="data.selectOptions.search_houseValue" clearable placeholder="请选择房屋">
                            <el-option
                            v-for="item in data.houseOptions"
                            :key="item.houseId"
                            :label="item.num"
                            :value="item.houseId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5" class="empty">.</el-col>
                    
                </el-row>

                <el-row :gutter="14" class="el_col_hidden" :hidden="data.conditionIsHidden">
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入业主编号"
                            v-model="data.selectOptions.search_code"
                            clearable>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 表格显示数据 -->
        <div class="house-content">

            <div class="house-title">
                <el-row :gutter="20">
                    <el-col :span="22">业主信息</el-col>
                    <el-button class="moreButton" type="primary" @click="addUser" size="small" icon="el-icon-circle-plus-outline">添加业主</el-button>
                </el-row>
            </div>

            <!-- 表格数据 -->
            <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
                <template v-slot:sexName="slotData">
                    <!-- v-slot:status="slotData": status 是数据插槽中的定义的字段的值
                        slotData.data.name: 
                            slotData 是本地的 status 对应的值, 
                            data 是 TabelVue 组件中的 双向绑定的 data 的对象,
                            name 是 TabelVue 组件中的 双向绑定的 data 的对象对应的值
                    -->
                    
                    <el-input v-model="slotData.data.sex" v-text="slotData.data.sex == 'W' ? '女' : '男'"></el-input>
                    
                </template>
                <!-- 插槽-方法 -->
                <template v-slot:operation="slotData">
                    <el-button size="mini" plain>
                        <el-dropdown @command="handleCommand" >
                            <span class="el-dropdown-link">
                                变更<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" >
                                <el-dropdown-item v-for="item in data.dropDown" :key="item.id" :command="beforeHandleCommand(slotData.data,item.code)"  v-text="item.value"></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-button>
                    <el-button size="small"  @click="editUser(slotData.data)">详情</el-button>
                </template>
                <template v-slot:tableFooterLeft >
                    <el-button size="small"  @click="handlerBatchDel()">批量删除</el-button>
                </template>
            </TableVue>
            <!-- 新增弹窗 -->
            <AddUserDialog :userFlag.sync="data.userInfoDialog" :buttonType.sync="data.buttonType" :dialogName.sync="data.dialogName" :userId.sync="data.userId" :isOwner.sync="data.isOwner" @getChangeData="getList"></AddUserDialog>
            <!-- 房屋解绑弹窗 -->
            <CheckOutDialog :checkOutFlag.sync="data.checkOutFlag" :userId.sync="data.userId"></CheckOutDialog>
        </div>

    </div>

    
</template>

<script>

import { global } from "@/utils/global_V3.0.js";
import { ref, reactive, onMounted } from '@vue/composition-api';
import { UserDelete } from "@/api/adminApi/user";
import { GetList, GetUnitList, GetHouseList } from "@/api/adminApi/home";

//组件
import TableVue from "@/components/Table";  
import AddUserDialog from "./dialog/addUser";
import CheckOutDialog from "./dialog/checkOut";

export default {
    name: "userInfo",
    components: { TableVue, AddUserDialog, CheckOutDialog },

    setup(props, { root, refs }) {

        const { confirm } = global();

        const data = reactive({
            //业主的标识
            isOwner: "",

            // 查询条件中的
            house_top_height: "height:132px",
            moreConditionSelect: "更多",
            conditionIsHidden: "true",
            selectOptions: {
                search_name: "",
                search_idCard: "",
                search_phone: "",
                search_code: "",
                search_buildValue: "",
                search_unitValue: "",
                search_houseValue: ""
            },
            buildOptions: [],
            unitOptions: [],
            houseOptions: [],

            // 表格
            userInfoDialog: false,
            buttonType: "",
            dialogName: "",
            userId: 0,

            //房屋解绑
            checkOutFlag: false,

            dropDown: [
                {id: 1, code:"update", value: "修改业主"},
                {id: 2, code:"delete", value: "删除业主"},
                {id: 3, code:"checkIn", value: "入住房屋"},
                {id: 4, code:"unbind", value: "房屋解绑"},
                {id: 5, code:"propertyFee", value: "物业费用"},
            ],


            tableRow: {},

            configTable: {
                // 勾选
                selection: true,
                // 表头
                tHead: [
                    { label: "业主编号",  field: "code", width: 200 },
                    { label: "名称",  field: "name", width: 100 },
                    { label: "性别", field: "sex", width: 80, columnType: "slot", slotName: "sexName" },
                    { label: "年龄", field: "age", width: 80 },
                    { label: "身份证", field: "idCard" },
                    { label: "联系方式", field: "phone" },
                    { label: "创建人", field: "createBy", width: 100 },
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    url: "getUserList",
                    data: {
                        mark: "MQ",
                        userMark: "US",
                        current: 1,
                        size: 10
                    }
                }
            }
        })

        /*****************************************************************************
            方法
         */
        

        /************************************查询条件*********************************************************** */
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
        /**
            选择楼栋
         */
        
        
        //根据情况清空查询条件里面的 buildId
        const cleanBuildId = () => {
            if(data.selectOptions.search_buildName == ""){
                data.selectOptions.search_buildId = "";
            }
        }

        




        // 查询
        // search_name: "",
        //         search_idCard: "",
        //         search_phone: "",
        //         search_idCard: "",
        //         search_buildValue: "",
        //         search_unitValue: "",
        //         search_houseValue: ""
        const search = () => {
            let requestData = {
                url: "getUserList",
                data:{
                    mark: "MQ",
                    userMark: "US",
                    current: 1,
                    size: 10,
                    name: data.selectOptions.search_name,
                    idCard: data.selectOptions.search_idCard,
                    code: data.selectOptions.search_code,
                    phone: data.selectOptions.search_phone,
                    buildId: data.selectOptions.search_buildValue,
                    unitId: data.selectOptions.search_unitValue,
                    houseId: data.selectOptions.search_houseValue
                }
                
            }
            getList(requestData);
            console.log("楼栋id: " + data.selectOptions.search_buildValue)
        }
        /**********************************表格************************************************************** */
        // 添加业主
        const addUser = () =>{
            data.userInfoDialog = true;
            data.isOwner = "Y";
            data.dialogName = "添加业主";
            data.buttonType = "addUser";
        }

        //编辑业主
        const editUser = (row) => {
            data.userId = row.userId;
            data.userInfoDialog = true;
            data.dialogName = "编辑业主";
            data.buttonType = "eidtUser";
        }

        //入住房屋
        const checkIn = (row) => {
            data.userId = row.userId;
            // 路由跳转
            console.log("data.userId: " + data.userId)
            root.$router.push({
                path: `/UserCheckIn/${data.userId}`  // es6的写法
                // params: {
                //     userId: data.userId
                // }
            });
        }

        // 房屋解绑
        const checkOut = (row) => {
            data.userId = row.userId;
            data.checkOutFlag = true;
            console.log(data.userId);
            console.log(data.checkOutFlag);
        }

        //下拉框点击事件
        const handleCommand = (command) => {
            switch (command.command) {
                case "update":
                    console.log("修改")
                    editUser(command.row);
                　　break;
                case "delete":
                    handlerDel(command.row);
                　　break;
                case "checkIn":
                    console.log("入住")
                    checkIn(command.row);
                    break;
                case "unbind":
                    console.log("解绑")
                    checkOut(command.row);
                    break;
                case "propertyFee":
                    console.log("费用")
                    break;
            }
        }
        const beforeHandleCommand = (row,command) => {
            return {
                'row': row,
                'command': command
            }
        }
        
        //刷新数据
        const getList = (params) => {
            refs.userTable.refreshData(params);
        }
        // 批量删除
        const handlerBatchDel = () => {
            let id = data.tableRow.idItem;
            if(!id || id.length == 0){
                root.$message({
                    message: "请选择需要删除的用户",
                    type: "error"
                })
                return false;
            }
            confirm({
                context: "确认删除当前所选全部信息，确认后将无法恢复！！",
                type: "warning",
                fn: userDelete
            })
        }
        // 单个删除
        const handlerDel = (params) => {
            data.tableRow.idItem = [params.userId];
            confirm({
                context: "确认删除当前所选信息，确认后将无法恢复！！",
                type: "warning",
                fn: userDelete
            })
        }
        // 删除数据
        const userDelete= () => {
            let requestData = JSON.stringify(data.tableRow.idItem);
            UserDelete(requestData).then(response => {
                let responseData = response.data;
                refs.userTable.refreshData();
                root.$message({
                    message:  responseData.message,
                    type: "success"  
                })
            }).catch(error => {

            })

        }

        

        // 加载 楼栋，单元，房屋 数据
        const loadBuild = () => {
            let requestData = {
                mark: "MQ",
                current: 1,
                size: 1000000
            }
            GetList(requestData).then(response => {
                let responseData = response.data.data.data;
                data.buildOptions = responseData;
            }).catch(error => {

            })
        }

        const buildChange = () => {
            loadUnit();
            loadHouse();
        }
        const loadUnit = () => {
            let requestData = {
                mark: "MQ",
                unitMark: "UN",
                buildId: data.selectOptions.search_buildValue,
                current: 1,
                size: 1000000
            }
            GetUnitList(requestData).then(response => {
                let responseData = response.data.data.data;
                data.unitOptions = responseData;
            }).catch(error => {

            })
        }
        const unitChange = () => {
            loadHouse();
        }
        const loadHouse = () => {
            let requestData = {
                mark: "MQ",
                houseMark: "HO",
                buildId: data.selectOptions.search_buildValue,
                unitId: data.selectOptions.search_unitValue,
                current: 1,
                size: 1000000
            }
            GetHouseList(requestData).then(response => {
                let responseData = response.data.data.records;
                data.houseOptions = responseData;
            }).catch(error => {

            })
        }
        onMounted(() => {
            loadBuild(),
            loadUnit(),
            loadHouse()
        })
        return {
            data,
            // 查询条件
            changeSelect, search, cleanBuildId, loadBuild, buildChange, loadUnit, unitChange, loadHouse,
            // 表格
            addUser, getList, handlerBatchDel, handlerDel, editUser, checkIn, handleCommand, beforeHandleCommand,
            checkOut
        }
    }
}
</script>

<style lang="scss" scoped>


.house {
    height: 100%;
    
}
.empty {
    color: #fff;
    
}

.house-content-top {
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

.house-content {
    height: 100%;
    // padding: 20px 20px 0 20px;
    // padding-right: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
}
.house-title {
    line-height: 35px;
    font-weight:600;
    padding: 12px 20px 12px 20px;
    color: rgb(104, 107, 109);
    border-bottom: 1px solid #e7eaec;
}
.house-info {
    padding: 20px
}
.el-table .warning-row {
    background: oldlace;
}
.el-table .success-row {
    background: #f0f9eb;
 }

</style>