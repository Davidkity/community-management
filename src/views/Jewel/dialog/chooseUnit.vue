

<template>
    <div>
        <el-dialog title="选择单元" :visible.sync="data.dialogChooseFlag"  @close="close" @open="openDialog">
            <el-row>
                <el-col :span="14" class="empty">.</el-col>
                <el-col :span="10">
                    <el-input v-model="data.selectValue"  placeholder="请输入单元号" class="select_input">
                        <el-button slot="append" icon="el-icon-search" type="danger" @click="select">查询</el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表单数据 -->
            <el-table :data="data.gridData.item" v-loading="data.loading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
                <el-table-column property="buildId" label="楼栋ID" width="70"></el-table-column>
                <el-table-column property="unitId" label="单元ID" width="70"></el-table-column>
                <el-table-column property="code" label="单元编码" width="180"></el-table-column>
                <el-table-column property="num" label="单元号" width="70"></el-table-column>
                <el-table-column property="layer" label="层数" width="80"></el-table-column>
                <el-table-column property="elevator" label="电梯" width="80"></el-table-column>
                <el-table-column property="content" label="楼栋备注" width="100"></el-table-column>
                <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="success" 
                                @click="choose(scope.row.unitId, scope.row.code,
                                               scope.row.num, scope.row.layer, 
                                               scope.row.elevator, scope.row.content)">
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
import { GetUnitList } from "@/api/adminApi/home";
export default {
    name: "chooseUnit",
    props: {
        chooseUnitflag: {
            type: Boolean,
            default: false
        },
        buttonType: {
            type: String,
            default: ""
        },
        id: {           
            default: 0
        },
        
    },
        
    setup(props, { root, emit }) {

        const data = reactive({
            
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
            data.dialogChooseFlag = props.chooseUnitflag,
            data.button_type = props.buttonType,
            data.buildId = props.id
        });

        //打开弹窗
        const openDialog = () => {
            data.button_type = props.buttonType;
            data.buildId = props.id;

            console.log("楼栋id");
            console.log(data.buildId);
            getInfo(data.buildId,"");
            
        }

        // emit 回调父组件，子组件向父组件传值
        const close = () => {
            data.dialogChooseFlag = false;
            emit("update:chooseUnitflag", false);
        };

        // 选择楼栋
        const choose = (unitId, code, num, layer, elevator, content) => {
           
            emit("update:chooseUnitId", unitId);
            emit("update:chooseUnitCode", code);
            emit("update:chooseUnitLayer", layer);
            emit("update:chooseUnitNum", num);
            emit("update:chooseUnitElevator", elevator);
            emit("update:chooseUnitContent", content);
        
            close();
        }
        // 获取数据
        const getInfo = (buildId, num) => {
            let requestData = {
                mark:"MQ",
                unitMark: "UN",
                unitId: "",
                buildId: buildId, 
                code: "",
                num: num,
                layer: "",
                elevator: "",
                current: 1,
                size: 10000

            }
            // 加载状态
            data.loading = true;
            GetUnitList(requestData).then(response => {
                let responseData = response.data.data;
                // 更新数据
                data.gridData.item = responseData.data;
                data.loading = false;
            }).catch(error => {
                data.loading = false;
            })
        }

        //查询
        const select = () => {
            getInfo(data.buildId, data.selectValue)
        }
        // 生命周期
        onMounted(() => {
            // getInfo("");
        })
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