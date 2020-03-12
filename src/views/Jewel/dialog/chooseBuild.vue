
<template>
    <div>
        <el-dialog title="小区楼栋" :visible.sync="data.dialogChooseFlag"  @close="close" @open="openDialog">
            <el-row>
                <el-col :span="14" class="empty">.</el-col>
                <el-col :span="10">
                    <el-input v-model="data.selectValue"  placeholder="请输入楼栋编号" class="select_input">
                        <el-button slot="append" icon="el-icon-search" type="danger" @click="select">查询</el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表单数据 -->
            <el-table :data="data.gridData.item" v-loading="data.loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
                <el-table-column property="code" label="楼栋编码" width="160"></el-table-column>
                <el-table-column property="name" label="楼栋名称" width="100"></el-table-column>
                <el-table-column property="num" label="楼栋编号" width="100"></el-table-column>
                <el-table-column property="content" label="楼栋备注" width="100"></el-table-column>
                <el-table-column property="createBy" label="创建人" width="100"></el-table-column>
                <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="success" 
                                @click="choose(scope.row.name, scope.row.code, scope.row.num, scope.row.content)">
                                选择
                            </el-button>
                        </template>
                </el-table-column>
            </el-table>          
        </el-dialog>
    </div>
</template>

<script>
import { reactive, ref, watch, computed } from "@vue/composition-api";
import { GetList } from "@/api/adminApi/home";
export default {
    name: "chooseBuild",
    props: {
        chooseBuildflag: {
            type: Boolean,
            default: false
        },
        buttonType: {
            type: String,
            default: ""
        }
        
    },
        
    setup(props, { root, emit }) {

        const data = reactive({
            timer: null,
            dialogChooseFlag: false,
            selectValue: "",
            button_type: "",
            buildId: "",

            gridData: {
                item: [],
            },
           
            loading: false
        });
        


        /**************************************
            方法
         */
        //  watch 监听父组件,父组件向子组件传值
        watch(() => {
            data.dialogChooseFlag = props.chooseBuildflag,
            data.button_type = props.buttonType
        });

        //打开弹窗
        const openDialog = () => {
            data.buildId = props.buildId;
            data.button_type = props.buttonType;
            getInfo("");
        }

        // emit 回调父组件，子组件向父组件传值
        const close = () => {
            data.dialogChooseFlag = false;
            emit("update:chooseBuildflag", false);
        };

        // 选择楼栋
        const choose = (name, code, num, content) => {
            getInfo(num);
            emit("update:chooseBuildName", name);
            emit("update:chooseBuildCode", code);
            emit("update:chooseBuildNum", num);
            emit("update:chooseBuildContent", content);
        
            close();
        }
        // 获取数据
        const getInfo = (buildNum) => {
            let requestData = {
                mark:"MQ",
                buildId: "",
                code: "",
                name: "",
                num: buildNum,
                current: 1,
                size: 10000
            }
            // 加载状态
            data.loading = true;
            GetList(requestData).then(response => {
                let responseData = response.data.data;
                // 更新数据
                data.gridData.item = responseData.data;
                if(buildNum != ""){
                    emit("update:chooseBuildId", responseData.data[0].buildId);
                }
                data.loading = false;
            }).catch(error => {
                data.loading = false;
            })
        }

        //查询
        const select = () => {
            getInfo(data.selectValue)
        }
        // 生命周期

        return {
            data, openDialog, close, choose, getInfo, select
        }
    }
}
</script>
<style land="scss" scoped>
.empty {
    color: #fff;
}
</style>