
<template>
    <div>
        <el-dialog title="选择要解绑的房屋" :visible.sync="data.checkOutFlag"  @close="close" @opened="openDialog">
            <el-row>
                <el-col :span="14" class="empty">.</el-col>
                <el-col :span="10">
                    <el-input v-model="data.selectValue"  placeholder="请输入房屋号" class="select_input">
                        <el-button slot="append" icon="el-icon-search" type="danger" @click="select">查询</el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表单数据 -->
            <TableVue ref="checkTable" :config="data.configTable" :tableRow.sync="data.tableRow" >
                <template v-slot:buildNum="slotData">
                     <el-input v-text="slotData.data.buildNum != '' ? slotData.data.buildNum + '楼栋': ''"></el-input>
                </template>
                <template v-slot:unitNum="slotData">
                     <el-input v-text="slotData.data.unitNum != '' ? slotData.data.unitNum + '单元': ''"></el-input>
                </template>
                <template v-slot:houseNum="slotData">
                     <el-input v-text="slotData.data.houseNum != '' ? slotData.data.houseNum + '房号': ''"></el-input>
                </template>
                <template v-slot:area="slotData">
                     <el-input v-text="slotData.data.area != '' ? slotData.data.area + '平方米': ''"></el-input>
                </template>
                <template v-slot:price="slotData">
                     <el-input v-text="slotData.data.price != '' ? slotData.data.price + '元': ''"></el-input>
                </template>
                <template v-slot:operation="slotData">
                     <el-button size="small" type="success"  @click="checkOut(slotData.data)">解绑</el-button>
                </template>
            </TableVue>
        </el-dialog>
    </div>
</template>
<script>
import { reactive, watch, onMounted, onBeforeMount, computed } from '@vue/composition-api';
import { DelCheckIn } from "@/api/adminApi/user";
import { EditHouse } from "@/api/adminApi/home";
import { setCommunity, getCommunity  } from "@/utils/app";
// 组件
import TableVue from "@/components/Table";  
export default {
    name: "CheckOut",
    components: { TableVue },
    props: {
        checkOutFlag: {
            type: Boolean,
            default: ""
        },
        userId: {
            default: 0
        }
    },
    setup(props, { root, emit, refs }) {
        const userName = computed(() => root.$store.state.app.username);
        const marks = getCommunity();
        const data = reactive({
            username: userName,
            checkOutFlag: false,
            userId: "",
            // 查询条件
            selectValue: "",
            //表格数据
            configTable: {
                paginationShow: false,
                // 表头
                tHead: [
                    { label: "业主名称",  field: "userName", width: 100 },
                    { label: "楼栋号", field: "buildNum", columnType: "slot", slotName: "buildNum", width: 80,  },
                    { label: "单元号", field: "unitNum", columnType: "slot", slotName: "unitNum", width: 80,  },
                    { label: "房屋号", field: "houseNum", columnType: "slot", slotName: "houseNum", width: 80,  },
                    { label: "房屋户型", field: "typeName", width: 120,  },
                    { label: "房屋面积", field: "area", columnType: "slot", slotName: "area", width: 100,  },
                    { label: "房屋单价", field: "price", columnType: "slot", slotName: "price", width: 80,  },
                    { label: "操作", columnType: "slot",  slotName: "operation" }
                ],
                requestData: {
                    url: "getCheckInList",
                    data: {
                        mark: marks,
                        checkInMark: "CI",
                        userId: props.userId,
                        current: 1,
                        size: 10
                    }
                }
                
            }
        })





        /*******************************************************************
            方法
         */
        
        //监听
        watch(() => {
            data.checkOutFlag = props.checkOutFlag;
            data.userId = props.userId;
        })
        //打开弹窗
        const openDialog = () => {
            data.userId = props.userId;
            getList();
        }
        //关闭弹窗
        const close = () => {
            data.checkOutFlag = false;
            emit("update:checkOutFlag", false);
        }
        // 查询
        const select = () => {
            let requestData = {
                url: "getCheckInList",
                data: {
                    mark: marks,
                    checkInMark: "CI",
                    userId: data.userId,
                    houseNum: data.selectValue,
                    current: 1,
                    size: 10
                }
            }
            refs.checkTable.refreshData(requestData);
        }

        //解绑
        const checkOut = (params) => {
            console.log(params);
            let requestData = {
                mark: marks,
                checkInMark: "CI",
                checkInId: params.checkInId
            }
            DelCheckIn(requestData).then(response => {
                let changeHouseStatusData = {
                    mark: marks,
                    houseMark: "HO",
                    houseId: params.houseId,
                    houseStatusCode: "FREE",
                    username: data.username
                }
                EditHouse(changeHouseStatusData).then(response => {
                    refs.checkTable.refreshData();
                    root.$message({
                        message: "解绑房屋成功",
                        type: "success"
                    }) 
                    // close();
                }).catch(error => {

                })
            }).catch(error => {

            })
        }
        const getList = () => {
            let requestData = {
                url: "getCheckInList",
                data: {
                    mark: marks,
                    checkInMark: "CI",
                    userId: data.userId,
                    current: 1,
                    size: 10
                }
            }
            refs.checkTable.refreshData(requestData);
        }

        
        return {
            data, marks,
            openDialog, close, select, getList, checkOut

        }
    }
}
</script>
<style lang="scss" scoped>
.empty {
    color: #fff;
}
</style>