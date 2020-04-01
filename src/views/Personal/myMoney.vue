<template>
    <div class="main">
         <!--头-->
        <div class="content-top" style="height:90px" >
            <div class="search-title">
                <div> <p class="title">我的信息</p> </div>
                    <div>
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>个人管理</el-breadcrumb-item>
                            <el-breadcrumb-item>我的信息</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
            </div>
        </div>

        <div class="content-top" :style="data.unit_top_height">
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">我的信息</el-col>
                </el-row>
            </div>
            <div class="search-content">
                <el-row :gutter="14" style="margin-bottom: 30px;">
                    <el-col :span="8"> <label>费用编号：</label> <label></label></el-col> 
                    <el-col :span="8">
                        <label>费用类型：</label> 
                        <label ></label>
                    </el-col> 
                    <el-col :span="8"> <label>费用项名：</label> <label></label></el-col> 
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive } from '@vue/composition-api'
export default {
    name: "myMoney",

    setup(props, { root }) {

        const data = reactive({

        })

        return {
            data
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