
<template>
    <div>
        <el-dialog title="选择要解绑的房屋" :visible.sync="data.chooseUserFlag"  @close="close" @opened="openDialog">
            <el-row>
                <el-col :span="14" class="empty">.</el-col>
                <el-col :span="10">
                    <el-input v-model="data.selectValue"  placeholder="请输入业主名" class="select_input">
                        <el-button slot="append" icon="el-icon-search" type="danger" @click="select">查询</el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表单数据 -->
            <TableVue ref="checkTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
                
                <template v-slot:sexName="slotData">
                     <el-input v-text="slotData.data.sex == 'W' ? '女' : '男'"></el-input>
                </template>
                <template v-slot:operation="slotData">
                     <el-button size="small" type="success"  @click="choose(slotData.data)">选择</el-button>
                </template>
            </TableVue>
        </el-dialog>
    </div>
</template>
<script>
import { reactive, watch, onMounted, onBeforeMount, computed } from '@vue/composition-api';
import { DelCheckIn } from "@/api/adminApi/user";
import { EditHouse } from "@/api/adminApi/home";
// 组件
import TableVue from "@/components/Table";  
export default {
    name: "CheckOut",
    components: { TableVue },
    props: {
        chooseUserFlag: {
            type: Boolean,
            default: ""
        },
        userId: {
            default: 0
        }
    },
    setup(props, { root, emit, refs }) {
        const userName = computed(() => root.$store.state.app.username);
        const data = reactive({
            username: userName,
            chooseUserFlag: false,
            userId: "",
            // 查询条件
            selectValue: "",
            //表格数据
            configTable: {
                paginationShow: false,
                // 表头
                tHead: [
                    { label: "业主编号",  field: "code", width: 180 },
                    { label: "名称",  field: "name", width: 80 },
                    { label: "性别", field: "sex", width: 60, columnType: "slot", slotName: "sexName" },
                    { label: "年龄", field: "age", width: 80 },
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
                        size: 10000
                    }
                }
                
            }
        })





        /*******************************************************************
            方法
         */
        
        //监听
        watch(() => {
            data.chooseUserFlag = props.chooseUserFlag;
            data.userId = props.userId;
        })
        //打开弹窗
        const openDialog = () => {

        }
        //关闭弹窗
        const close = () => {
            data.chooseUserFlag = false;
            emit("update:chooseUserFlag", false);
            emit("getChangeData");
        }
        // 查询
        const select = () => {
            let requestData = {
                url: "getUserList",
                data:{
                    mark: "MQ",
                    userMark: "US",
                    current: 1,
                    size: 10,
                    name: data.selectValue
                }
            }
            refs.checkTable.refreshData(requestData);
        }

        //解绑
        const choose = (params) => {
            console.log(params);
            emit("update:userId", params.userId);
            emit("update:code", params.code);
            emit("update:name", params.name);
            emit("update:sex", params.sex);
            emit("update:age", params.age);
            emit("update:idCard", params.idCard);
            emit("update:phone", params.phone);
            emit("update:img", params.img);
            emit("update:createBy", params.createBy);
            emit("update:content", params.content);
            
            close();
        }
       

        
        return {
            data, 
            openDialog, close, select, choose

        }
    }
}
</script>
<style lang="scss" scoped>
.empty {
    color: #fff;
}
</style>