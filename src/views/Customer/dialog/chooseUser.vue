
<template>
    <div>
        <el-dialog title="小区楼栋" :visible.sync="data.dialogChooseFlag"  @close="close" @open="openDialog">
            <el-row>
                <el-col :span="14" class="empty">.</el-col>
                <el-col :span="10">
                    <el-input v-model="data.selectValue"  placeholder="请输入业主名称" class="select_input">
                        <el-button slot="append" icon="el-icon-search" type="danger" @click="select">查询</el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表单数据 -->
            <!-- 表格数据 -->
            <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow" >

                <template v-slot:sexName="slotData">
                    <el-input v-model="slotData.data.sex" v-text="slotData.data.sex == 'W' ? '女' : '男'"></el-input>
                </template>
                <template v-slot:operation="slotData">
                    <el-button size="small" type="text"  @click="choose(slotData.data)">绑定业主</el-button>
                </template>
                <template v-slot:tableFooterLeft >
                    <label class="empty">.</label>
                </template>
            </TableVue>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, ref, watch, computed } from "@vue/composition-api";
import { GetList } from "@/api/adminApi/home";
import { setCommunity, getCommunity  } from "@/utils/app";
import { AddBindUser } from "@/api/adminApi/customer";

//组件
import TableVue from "@/components/Table"; 

export default {
    name: "chooseBuild",
    components: { TableVue },
    props: {
        chooseFlag: {
            type: Boolean,
            default: false
        },
        buttonType: {
            type: String,
            default: ""
        },
        uId: {
            default: 0
        },
        
    },
        
    setup(props, { root, emit, refs }) {

        const marks = getCommunity();
        const data = reactive({
            
            
            timer: null,
            dialogChooseFlag: false,
            selectValue: "",
            button_type: "",
            buildId: "",



            uId: "",
            gridData: {
                item: [],
            },

            loading: false,

            // 表格
            configTable: {
                // 表头
                tHead: [
                     { label: "业主编号",  field: "code", width: 170 },
                    { label: "名称",  field: "name", width: 100 },
                    { label: "性别", field: "sex", width: 80, columnType: "slot", slotName: "sexName" },
                    { label: "年龄", field: "age", width: 80 },
                    { label: "联系方式", field: "phone", width: 120 },
                    { label: "创建人", field: "createBy", width: 90 },
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    url: "getUserList",
                    data: {
                        mark: marks,
                        bindFlag: "N",
                        userMark: "US",
                        current: 1,
                        size: 10
                    }
                }
            }
        });
        


        /**************************************
            方法
         */
        //  watch 监听父组件,父组件向子组件传值
        watch(() => {
            data.dialogChooseFlag = props.chooseFlag,
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
            emit("update:chooseFlag", false);
            emit("getChangeData")
        };

        // 选择楼栋
        const choose = (params) => {
            let requestData = {
                id: props.uId,
                userId: params.userId
            }
            AddBindUser(requestData).then(response => {
                let responseData = response.data;
                root.$message({
                    message: responseData.message,
                    type: success
                })
            }).catch(error => {

            })
        
            close();
        }
       
        const getInfo = (name) => {
            let requestData = {
                url: "getUserList",
                data: {
                    mark: marks,
                    bindFlag: "N",
                    userMark: "US",
                    name: name,
                    current: 1,
                    size: 10
                }
            }
            refresh(requestData)
        }
        const refresh = (params) => {
            refs.userTable.refreshData(params);
        }
        //查询
        const select = () => {
            getInfo(data.selectValue)
        }
        // 生命周期

        return {
            data, marks,
            openDialog, close, choose, getInfo, select, refresh
        }
    }
}
</script>
<style land="scss" scoped>
.empty {
    color: #fff;
}
</style>