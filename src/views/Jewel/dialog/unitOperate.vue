<template>
    <!-- 新增弹窗  -->
    <el-dialog :title="data.dialog_name" :visible.sync="data.dialog_info_flag" @close="close" width="580px" @open="openDialog">
        <el-form :model="data.form" ref="addInfoForm">
            <el-form-item label="楼栋名称：" :label-width="data.formLabelWidth" prop="buildId" >
                <el-select v-model="data.form.buildId" clearable filterable :disabled="data.disabledBuildFlag"  placeholder="请选择楼栋">
                    <el-option
                    v-for="item in data.build_options.build"
                    :key="item.buildId"
                    :label="item.name"
                    :value="item.buildId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单元编码：" :label-width="data.formLabelWidth" v-if="data.hiddenFlag" prop="unitCode">
                <el-input v-model.number="data.form.unitCode" :disabled="data.disabledFlag"  maxlength="2" ></el-input>
            </el-form-item>
            <el-form-item label="单元编号：" :label-width="data.formLabelWidth"  prop="unit_num">
                <el-input v-model.number="data.form.unit_num" :disabled="data.disabledFlag" maxlength="2" placeholder="必填，请输入单元编号"></el-input>
            </el-form-item>
            <el-form-item label="总层数：" :label-width="data.formLabelWidth" prop="layer">
                <el-select v-model="data.form.layer" clearable :disabled="data.disabledFlag"  placeholder="必填，请选择层数">
                    <el-option
                    v-for="item in data.layer_options"
                    :key="item.value"
                    :label="item.label" 
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否有电梯：" :label-width="data.formLabelWidth" prop="elevator">
                <el-select v-model="data.form.elevator" clearable :disabled="data.disabledFlag"  placeholder="必填，请选择是否有电梯">
                    <el-option
                    v-for="item in data.elevator_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" :label-width="data.formLabelWidth"  prop="build_content">
                <el-input type="textarea" v-model="data.form.build_content" :disabled="data.disabledFlag" placeholder="可填，请填写备注"></el-input>
            </el-form-item>
            <el-form-item label="创建人：" :label-width="data.formLabelWidth" v-if="data.hiddenFlag" prop="createBy">
                <el-input v-model.number="data.form.createBy" :disabled="data.disabledFlag"  maxlength="2" ></el-input>
            </el-form-item>
            <el-form-item label="创建日期：" :label-width="data.formLabelWidth" :formatter="formatCreateTime" v-if="data.hiddenFlag" prop="createTime">
                <el-input v-model.number="data.form.createTime"  :disabled="data.disabledFlag"  maxlength="2" ></el-input>
            </el-form-item>
            <el-form-item label="修改人：" :label-width="data.formLabelWidth" v-if="data.hiddenFlag" prop="updateBy">
                <el-input v-model.number="data.form.updateBy" :disabled="data.disabledFlag"  maxlength="2" ></el-input>
            </el-form-item>
            <el-form-item label="修改日期：" :label-width="data.formLabelWidth" v-if="data.hiddenFlag" prop="updateTime">
                <el-input v-model.number="data.form.updateTime" :formatter="formatUpdateTime" :disabled="data.disabledFlag"  maxlength="2" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" v-if="!data.hiddenFlag" class="dialog-footer">
            <el-button  @click="close">取消</el-button>
            <el-button type="danger" :loading="data.submitLoading" @click="submit">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { GetUnitList, EditUnit, GetBuildList, AddUnit } from "@/api/adminApi/home";
import { reactive, ref, watch, computed } from "@vue/composition-api";
import { dateFormat } from "../../../utils/common";
//验证规则
import { validateMath } from '@/utils/validate';
export default {
    name: "unitOperate",
    props: {
        unitFlag: {
            type: Boolean,
            default: false
        },
        dialogName: {
            type: String,
            default: "添加楼栋"
        },
        id: {           
            default: 0
        },
        buttonType: {
            type: String,
            default: ""
        }
    },
    setup(props ,{ emit, root, refs}) {

        const userName = computed(() => root.$store.state.app.username);
        /**
         数据
         */
         const data = reactive({
            disabledFlag: false,
            disabledBuildFlag: false,
            hiddenFlag: false,
            dialog_name: "添加单元",
            dialog_info_flag: false,
            formLabelWidth: "110px",
            username: userName,
            build_id: "",
            button_type: "",
            form: {
                buildId: "",
                unitCode: "",
                unit_num: "",
                layer: "",
                elevator: "",
                build_content: "",
                createBy: "",
                createTime: "",
                updateBy: "",
                updateTime: ""
            },
            // 分类下拉
            categoryOption: [],
            // 按钮加载
            submitLoading: false,
            // 选择楼栋
            build_options: {
                build: []
            },
            //总层数
            layer_options: [
                { value: 1, label: "1层"}, { value: 2, label: "2层" }, { value: 3, label: "3层" }, { value: 4, label: "4层" },
                { value: 5, label: "5层" }, { value: 6, label: "6层" }, { value: 7, label: "7层" }, { value: 8, label: "8层" }, 
                { value: 9, label: "9层" }, { value: 10, label: "10层" }, { value: 11, label: "11层" }, { value: 12, label: "12层" },                
            ],
            // 是否有电梯
            elevator_options: [
                {
                    value: 'N',
                    label: '无'
                },
                {
                    value: 'Y',
                    label: '有'
                }
            ],
         });

        // 格式
        const formatCreateTime  = (row, column) => {
            // let data =  row[column.property] ;
            // return timestampToTime(date);
            return "12121212";
        }

        const formatUpdateTime  = (row, column) => {
            let data =  row[column.property] ;
            return timestampToTime(date);
        }

        //  watch 监听父组件,父组件向子组件传值
        watch(() => {
            data.dialog_info_flag = props.unitFlag,
            data.button_type = props.buttonType
        });
        // emit 回调父组件，子组件向父组件传值
        const close = () => {
            data.dialog_info_flag = false;
            data.button_type = "";
            data.dialog_name = "添加单元";
            resetForm();
            data.disabledFlag = false;
            data.hiddenFlag = false;
            emit("update:unitFlag", false);
            emit("update:dialogName", data.dialog_name)
            emit("update:buttonType", "");
            emit("update:id", "");
            
        };
        //打开弹窗
        const openDialog = () => {
            data.categoryOption = props.category;
            data.button_type = props.buttonType;
            // data.build_id = buildId;
            if(data.button_type == "editButton"){
                data.dialog_name = "修改单元";
                getInfo();
            }else if(data.button_type == "infoButton"){
                data.dialog_name = "单元详情";
                getInfo();
                data.disabledBuildFlag = true;
                data.disabledFlag = true;
                data.hiddenFlag = true;
            }else if(data.button_type == "房屋中选择单元"){
                console.log("房屋中选择单元");
                console.log(props.id);
                data.form.buildId = props.id;
                data.disabledBuildFlag = true;
            }
            getBuildInfo();
        }
        //获取楼栋信息
        const getBuildInfo = () => {
            let requestData = {
                mark:"MQ",
                buildId: ""
            }
            GetBuildList(requestData).then(response => {
                let responseData = response.data.data;
                data.build_options.build = responseData;
            }).catch(error => {

            })
        }
        //根据id 获取数据
        const getInfo = () => {
            console.log(props.id);
            let requestData = {
                mark:"MQ",
                unitMark: "UN",
                current: 1,
                size: 2,
                unitId: props.id,
                buildId: "",
                code: "",
                num: "",
                layer: "",
                elevator: "",
            }
            GetUnitList(requestData).then(response => {
                let responseData = response.data.data.data[0];
                data.form = {
                    // build_num: responseData.num,
                    // build_name: responseData.name,

                    buildId: responseData.buildId,
                    unitCode: responseData.code,
                    unit_num: responseData.num,
                    layer: responseData.layer,
                    elevator: responseData.elevator,
                    build_content: responseData.content,
                    createBy: responseData.createBy,
                    createTime: responseData.createTime,
                    updateBy: responseData.updateBy,
                    updateTime: responseData.updateTime
                }
               
            }).catch(error => {

            })
        }
        // 重置表单
        const resetForm = () => {
            refs.addInfoForm.resetFields();
        }
        // 提交
        const submit = (() => {
           
            if(data.form.buildId == ""){
                root.$message({
                    message: '请选择楼栋！！',
                    type: "error"
                })
                return false;
            }
            if(data.unit_num == ""){
                root.$message({
                    message: '请填写单元编号！！',
                    type: "error"
                })
                return false;
            }
            // 不知为什么无用
            // if(!validateMath(data.unit_num)){
            //     root.$message({
            //         message: '单元编号只能为纯数字！！',
            //         type: "warning"
            //     })
            //     return false;
            // }
            if(data.layer == ""){
                root.$message({
                    message: '请选择楼层数！！',
                    type: "error"
                })
                return false;
            }
            if(data.elevator == ""){
                root.$message({
                    message: '请选择有无电梯！！',
                    type: "error"
                })
                return false;
            }
            data.submitLoading = true;
            // 判断是走添加还是修改路线
            data.button_type == "editButton" ? editInfo() : addInfo();          
        })
        const addInfo = () =>{
            let requestData = {
                mark:"MQ",
                unitMark: "UN",
                buildId: data.form.buildId,
                num: data.form.unit_num,
                layer: data.form.layer,
                elevator: data.form.elevator,
                content: data.form.build_content,
                createBy: data.username
            }
            // 调用添加数据的接口
            AddUnit(requestData).then(response => {
                let responseData = response.data
                root.$message({
                    message: responseData.message,
                    type: 'success'
                })
                data.submitLoading = false
                // 重置表单
                resetForm();
                // root.$refs['addInfoForm'].resetFields();
                // 刷新数据
                emit("getChangeData");
                if(data.button_type == "房屋中选择单元"){
                    emit("update:unitIdFormAddHouse", responseData.data.unitId);
                    emit("update:unitCodeFormAddHouse", responseData.data.code);
                    emit("update:unitNumFormAddHouse", responseData.data.num);
                    emit("update:unitLayerFormAddHouse", responseData.data.layer);
                    emit("update:unitElevatorFormAddHouse", responseData.data.elevator);
                    emit("update:unitContentFormAddHouse", responseData.data.content);
                    close();
                }
            }).catch(error => {
                data.submitLoading = false
            })
        }

        const editInfo = () =>{
            let requestData = {
                mark:"MQ",
                unitMark: "UN",
                unitId: props.id,
                buildId: data.form.buildId,
                num: data.form.unit_num,
                layer: data.form.layer,
                elevator: data.form.elevator,
                content: data.form.build_content,
                updateBy: data.username
            }
            // 调用修改接口
            EditUnit(requestData).then(response => {
                let responseData = response.data
                root.$message({
                    message: responseData.message,
                    type: 'success'
                })
                data.submitLoading = false
                // 刷新数据
                emit("getChangeData")
                
            }).catch(error => {
                data.submitLoading = false
            })
        }
        return {
            data,
            // methods
            close, openDialog, getInfo, submit, addInfo, editInfo, getBuildInfo, formatCreateTime, formatUpdateTime
        }
    }
}
</script>
<style scoped>

</style>