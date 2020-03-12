<template>
    <div class="build">
        <div class="build-content-top">
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">查询条件</el-col>
                    <el-col :span="6" hidden="true">查询条件</el-col> <!-- 隐藏 -->
                    <el-button class="moreButton" type="text" hidden="true">更多</el-button>
                </el-row>
            </div>
            <div class="search-content">
                <el-row :gutter="14">
                    
                    <el-col :span="7">
                        <el-input
                            placeholder="请输入楼栋编号"
                            v-model="search_code"
                            clearable>
                        </el-input>
                    </el-col> 
                    <el-col :span="6">
                        <el-input
                            placeholder="请输入楼栋号"
                            v-model="search_num"
                            clearable style="width: 100%;">
                        </el-input>
                    </el-col>
                    <el-col :span="7">
                        <el-input
                            placeholder="请输入楼栋名称"
                            v-model="search_name"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" class="searchButton" @click="search" icon="el-icon-search">
                            查询
                        </el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 表格显示数据 -->
        <div class="build-content">

            <div class="build-title">
                <el-row :gutter="20">
                    <el-col :span="22">楼栋信息</el-col>
                    <el-button class="moreButton" type="primary" @click="dialog_info = true" size="small" icon="el-icon-circle-plus-outline">添加楼栋</el-button>
                </el-row>
            </div>
            <div class="build-info">
                <el-table :data="tableData.item" border @selection-change="handleSelectionChange" style="width: 100%"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="code" label="楼房编码" width="300"></el-table-column>
                    <el-table-column prop="num" label="编号" width="250"></el-table-column>
                    <el-table-column prop="name" label="楼房名称" width="200"></el-table-column>
                    <el-table-column prop="createBy" label="创建人员" width="270"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="deleteItem(scope.row.buildId)">删除</el-button>
                            <el-button size="mini" type="success" @click="dialogInfo(scope.row.buildId)">编辑</el-button>
                            <el-button size="mini" type="success" @click="unitInfo(scope.row.buildId)" >添加单元</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="black-space-30"></div>
                <!-- 底部分页 -->
                <el-row>
                    <el-col :span="12">
                        <el-button size="medium" type="danger" @click="deleteAll">批量删除</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-pagination 
                            class="pull-right"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            background 
                            :page-sizes="[10, 20, 30, 40]"
                            layout="total, sizes, prev, pager, next, jumper" 
                            :total="totals">
                        </el-pagination>
                    </el-col>
                </el-row>
                <!-- 新增弹窗 -->
                <DialogInfo :flag.sync="dialog_info" :id.sync="infoId" :buttonType.sync="buttonType" :dialogName.sync="dialog_name" @getChangeData="getList" />
               <!-- <DialogInfo :flag.sync="dialog_info" :category="options.category" /> -->
            </div>
        </div>
    </div>
    
</template>

<script>
import { GetList, Delete } from "@/api/adminApi/home";
import DialogInfo from "./dialog/addBuild";
import { global } from "@/utils/global_V3.0.js";
import { ref, reactive, onMounted } from '@vue/composition-api'
export default {
    components: {
        DialogInfo
    },
    setup(props, {root}) {

        // const data = reactive({
        //     search_id: "",
        //     search_code: "",
        //     search_name: "",
        //     totals: 0,
        //     dialog_info: false,
        //     tableData: {
        //         item: []
        //     },
        //     page: {
        //         pageNumber: 1,
        //         pageSize: 10
        //     }
        // });
        // 相当于给方法换了一个名称
        const { confirm } = global()
        /**
            声明变量
         */

        const search_num = ref("");
        const search_code = ref("");
        const search_name = ref("");
        const totals = ref(0);
        const loading = ref(false);
        const deleteInfoId = ref("");
        const infoId = ref("");
        const buttonType = ref("");
        //  弹窗
        const dialog_info = ref(false);
        const dialog_name = ref("添加楼栋");


        const tableData = reactive({
            item: []
        });
        //页码
        const page = reactive({
            pageNumber: 1,
            pageSize: 10
        })


        /** 
            声明方法
         */

        const dialogInfo = (id) =>{
            infoId.value = id;
            buttonType.value = "editButton";
            dialog_name.value = "修改楼栋";
            dialog_info.value = true;
        }
        const search = () => {
            let requestData = {
                mark:"MQ",
                code: search_code.value,
                name: search_name.value,
                num: search_num.value,
                current: page.pageNumber,
                size: page.pageSize
            }
             // 加载状态
            loading.value = true;
            GetList(requestData).then(response => {
                let data = response.data.data;
                // 更新数据
                tableData.item = data.data;
                // 更新页码总数
                
                totals.value = data.total;
                loading.value = false;
            }).catch(error => {
                loading.value = false;
            })
        }
        /**
            表格数据颜色的变化
         */
        const tableRowClassName = (row, rowIndex) => {
            return rowIndex === 1 ? 'warning-row' : 'success-row';
        }
        // 表格
        const handleSelectionChange = (val) =>{
            
            // 映射出数据（筛选出id）
            let buildId = val.map(item => item.buildId)
            deleteInfoId.value = buildId;
            console.log("buildId: " + buildId);
        }
        //每页的条数
        const handleSizeChange = (val) =>{
            page.pageSize = val;
            getList();
        }
        //当前是第几页
        const handleCurrentChange = (val) =>{
            page.pageNumber = val;
            getList();
        }
        
        /**
            查询数据
         */
        const getList = (() => {
            let requestData = {
                mark:"MQ",
                buildId: "",
                code: "",
                name: "",
                num: "",
                current: page.pageNumber,
                size: page.pageSize
            }
            // 加载状态
            loading.value = true;
            GetList(requestData).then(response => {
                let data = response.data.data;
                // 更新数据
                tableData.item = data.data;
                // 更新页码总数
                
                totals.value = data.total;
                loading.value = false;
            }).catch(error => {
                loading.value = false;
            })
        });
        
        /** 
            删除全部
         */
        const deleteAll = () => {

            if(!deleteInfoId.value || deleteInfoId.value.length == 0){
                root.$message({
                    message: "请选择要删除的数据！！",
                    type: "warning"
                })
            }
            confirm({
                context: "确认删除当前所选全部信息，确认后将无法恢复！！",
                type: "warning",
                fn: confirmDelete
            })
        }
        // 删除
        const deleteItem = (id) => {
            deleteInfoId.value = [id];
            confirm({
                context: "确认删除当前信息，确认后将无法恢复！！",
                tip: "警告",
                type: "warning",
                fn: confirmDelete
            });
        }
        // 确认删除
        const confirmDelete = (value) => {
            console.log("确认： " + deleteInfoId.value);
            let requestData = JSON.stringify(deleteInfoId.value)
            Delete(requestData).then(response => {
                deleteInfoId.value = "";
                getList();
            }).catch(error => {

            });
            console.log(value)
        }
        //跳转到单元信息页面
        const unitInfo = (id) => {
            // 路由跳转
            root.$router.push({
                name: "Unit",
                params: {
                    buildId: id
                }
                
            });
        }
        /**
            生命周期
         */
        onMounted(() => {
            //获取列表
            getList();
        })
        return {
            
            // ref
            search_num, search_code, search_name, dialog_info, totals, loading, infoId, buttonType, dialog_name,
            //reactive
            tableData,
            // 方法、函数
            search, tableRowClassName,handleSizeChange,handleCurrentChange, handleSelectionChange, 
            deleteAll, deleteItem, confirmDelete, getList, dialogInfo, unitInfo

        }
    }
}
</script>

<style lang="scss" scoped>

.build {
    height: 100%;
    
}

.build-content-top {
    // position: fixed;
    z-index: 8999;
    height: 162px;
    
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
        padding: 30px 20px 12px 20px;
        
        .searchButton {
            float: right;
        }
    }
    
}
.search-tools {
    float: right;
}

.build-content {
    height: 100%;
    // padding: 20px 20px 0 20px;
    // padding-right: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
}
.build-title {
    line-height: 35px;
    font-weight:600;
    padding: 12px 20px 12px 20px;
    color: rgb(104, 107, 109);
    border-bottom: 1px solid #e7eaec;
}
.build-info {
    padding: 20px
}
.el-table .warning-row {
    background: oldlace;
}
.el-table .success-row {
    background: #f0f9eb;
 }
</style>