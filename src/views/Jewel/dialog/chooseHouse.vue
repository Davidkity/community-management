

<template>
    <div>
        <el-dialog title="选择房屋" :visible.sync="data.dialogChooseFlag"  @close="close" @open="openDialog">
            <el-row>
                <el-col :span="14" class="empty">.</el-col>
                <el-col :span="10">
                    <el-input v-model="data.selectValue"  placeholder="请输入房屋号" class="select_input">
                        <el-button slot="append" icon="el-icon-search" type="danger" @click="select">查询</el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表单数据 -->
            <el-table :data="data.gridData.item" v-loading="data.loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
                <el-table-column prop="code" label="房屋编码" width="180"></el-table-column>
                <el-table-column prop="buildNum" label="楼栋号" :formatter="formatBuildNum" width="100" ></el-table-column>
                <el-table-column prop="unitNum" label="单元号" :formatter="formatNum" width="100" ></el-table-column>
                <el-table-column prop="num" label="房屋号" :formatter="formatHouseNum" width="100" ></el-table-column>
                <el-table-column prop="floor" label="楼层" :formatter="formatLayer" width="80"></el-table-column>
                <el-table-column prop="typeName" label="房屋户型"  width="120"></el-table-column>
                <el-table-column prop="area" label="建筑面积" :formatter="formatArea" width="110"></el-table-column>
                <el-table-column prop="price" label="单价" width="100" :formatter="formatPrice"></el-table-column>
                <el-table-column prop="houseStatus" label="房屋状态" width="100"></el-table-column>
                <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="success" 
                                @click="choose(scope.row.houseId, scope.row.code,
                                               scope.row.num, scope.row.houseStatus, 
                                               scope.row.typeName, scope.row.area,
                                               scope.row.price)">
                                选择
                            </el-button>
                        </template>
                </el-table-column>
            </el-table>          
        </el-dialog>
    </div>
</template>

<script>
import { reactive, ref, watch, computed, onMounted } from "@vue/composition-api";
import { GetHouseList } from "@/api/adminApi/home";
export default {
    name: "chooseUnit",
    props: {
        chooseHouseflag: {
            type: Boolean,
            default: false
        },
        buttonType: {
            type: String,
            default: ""
        },
        userId: {
            default: 0
        },
        buildId: {           
            default: 0
        },
        unitId: {           
            default: 0
        },
        
    },
        
    setup(props, { root, emit }) {

        const data = reactive({
            
            dialogChooseFlag: false,
            selectValue: "",
            button_type: "",
            userId: "",
            buildId: "",
            unitId: "",
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
            data.dialogChooseFlag = props.chooseHouseflag,
            data.button_type = props.buttonType,
            data.userId = props.userId
            data.buildId = props.buildId,
            data.unitId = props.unitId
        });

        //打开弹窗
        const openDialog = () => {
            console.log("状态" + data.dialogChooseFlag);
            data.button_type = props.buttonType;
            data.userId = props.userId;
            data.buildId = props.buildId;
            data.unitId = props.unitId;

            console.log("id");
            console.log(data.buildId);
            console.log(data.unitId);
            console.log(data.userId);
            getInfo(data.buildId, data.unitId, "");
            
        }

        // emit 回调父组件，子组件向父组件传值
        const close = () => {
            data.dialogChooseFlag = false;
            emit("update:chooseHouseflag", false);
        };

        //格式化数据
        
        const formatBuildNum = (row, column) => {
            return row[column.property] + "号楼";
        }
        const formatNum = (row, column) => {
            return row[column.property] + "单元";
        }
        const formatHouseNum = (row, column) => {
            return row[column.property] + "房号";
        }
        
        const formatLayer = (row, column) => {
            return row[column.property] + "层";
        }

        const formatArea = (row, column) => {
            return row[column.property] + "平方米";
        }

        const formatPrice = (row, column) => {
            return row[column.property] + "元";
        }

        // 选择楼栋
       
        const choose = (houseId, code, num, houseStatus, typeName, area, price) => {
           
            emit("update:chooseHouseId", houseId);
            emit("update:chooseHouseCode", code);
            emit("update:chooseHouseStatus", houseStatus);
            emit("update:chooseHouseNum", num);
            emit("update:chooseHouseTypeName", typeName);
            emit("update:chooseHouseArea", area);
            emit("update:chooseHousePrice", price);
        
            close();
        }
        // 获取数据
        const getInfo = (buildId, unitId, houseNum) => {
            let requestData = {
                mark:"MQ",
                houseMark: "HO",
                // userId: data.userId,
                buildId: buildId, 
                unitId: unitId,
                houseNum: houseNum,
                statusCode: "FREE",
                current: 1,
                size: 10000

            }
            // 加载状态
            data.loading = true;
            GetHouseList(requestData).then(response => {
                let responseData = response.data.data;
                // 更新数据
                data.gridData.item = responseData.records;
                data.loading = false;
            }).catch(error => {
                data.loading = false;
            })
        }

        //查询
        const select = () => {
            getInfo(data.buildId, data.unitId, data.selectValue)
        }
        // 生命周期
        onMounted(() => {
            // getInfo("");
        })
        return {
            data, 
            openDialog, close, choose, getInfo, select,
            formatBuildNum, formatNum, formatHouseNum, formatLayer, formatArea, formatPrice
        }
    }
}
</script>
<style land="scss" scoped>
.empty {
    color: #fff;
}
</style>