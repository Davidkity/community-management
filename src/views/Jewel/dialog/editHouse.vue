<template>
    <!-- 新增弹窗  -->
    <el-dialog :title="data.dialog_name" :visible.sync="data.dialog_flag" @close="close" width="580px" @open="openDialog">
        <el-form ref="editHouseInfo" label-position="left" label-width="180px" >
            <el-form-item class="formMargin" label="房屋号">
                <el-input v-model="data.form.houseNum" placeholder="必填,请填写房屋号" ></el-input>
            </el-form-item>
            <el-form-item class="formMargin" label="房屋楼层">
                <el-input v-model="data.form.houseFloor" placeholder="必填,请填写房屋楼层"></el-input>
            </el-form-item>
            <el-form-item class="formMargin" label="房屋户型-室">
                <el-select v-model="data.form.houseTypePreValue"  class="form-select"  placeholder="必填,请选择房屋户型-室">
                    <el-option
                        v-for="item in data.houseTypePre"
                        :key="item.typePreId"
                        :label="item.name"
                        :value="item.typePreCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="formMargin" label="房屋户型-厅">
                <el-select v-model="data.form.houseTypeMidValue" class="form-select"  placeholder="必填,请选择房屋户型-厅">
                    <el-option
                        v-for="item in data.houseTypeMid"
                        :key="item.typeMidId"
                        :label="item.name"
                        :value="item.typeMidCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="formMargin" label="房屋户型-卫">
                <el-select v-model="data.form.houseTypeSufValue" class="form-select"  placeholder="必填,请选择房屋户型-卫">
                    <el-option
                        v-for="item in data.houseTypeSuf"
                        :key="item.typeSufId"
                        :label="item.name"
                        :value="item.typeSufCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="formMargin" label="建筑面积(平方)">
                <el-input v-model="data.form.houseArea" placeholder="必填,请填写房屋面积(平方)"></el-input>
            </el-form-item>
            <el-form-item class="formMargin" label="房屋单价(元)">
                <el-input v-model="data.form.housePrice" placeholder="必填,请填写房屋单价(元)"></el-input>
            </el-form-item>
            <el-form-item class="formMargin" label="备注">
                <el-input v-model="data.form.houseContent" placeholder="可填填,请填写备注"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="danger" :loading="data.submitLoading" @click="submit">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { FindHouseTypePre, FindHouseTypeMid, FindHouseTypeSuf, GetHouseList, EditHouse } from "@/api/adminApi/home";
import { reactive, ref, watch, computed, onMounted } from "@vue/composition-api";
export default {
    name: "editHouse",
    props: {
        editHouseFlag: {
            type: Boolean,
            default: false
        },
        houseId: {
            default: 0
        },
        preCode: {
            type: String,
            default: ""
        },
        midCode: {
            type: String,
            default: ""
        },
        sufCode: {
            type: String,
            default: ""
        }

    },
    setup(props, { root, refs, emit }) {
        const userName = computed(() => root.$store.state.app.username);
        const data = reactive({
            username: userName,
            dialog_name: "编辑房屋信息",
            dialog_flag: false,
            buildId: "",
            unitId: "",
            form: {
                houseId: "",
                houseNum: "",
                houseFloor: "",
                houseTypePreValue: "",
                houseTypeMidValue: "",
                houseTypeSufValue: "",
                houseArea: "",
                housePrice: "",
                houseContent: ""
            },
            houseTypePre: [],
            houseTypeMid: [],
            houseTypeSuf: []
        }) 


        /**
            方法
         */
        
        //  watch 监听父组件,父组件向子组件传值
        watch(() => {
            data.dialog_flag = props.editHouseFlag;
        });
        //打开弹窗
        const openDialog = () => {
            data.form.houseId = props.houseId;
            data.form.houseTypePreValue = props.preCode;
            data.form.houseTypeMidValue = props.midCode;
            data.form.houseTypeSufValue = props.sufCode;
            getHouseInfo();
        }

        const close = () => {
             data.form.houseId = false;
             resetForm();
             emit("update:editHouseFlag", false);
        }

        // 重置表单
        const resetForm = () => {
            refs.editHouseInfo.resetFields();
        }

        const getHouseInfo = () => {
            let requestData = {
                mark: "MQ",
                houseMark: "HO",
                houseId: props.houseId,
                current: 1,
                size: 2
            };
            GetHouseList(requestData).then(response => {
                let responseData = response.data.data.records[0];
                console.log(responseData);
                data.buildId = responseData.buildId;
                data.unitId = responseData.unitId;
                data.form = {
                    houseNum: responseData.num,
                    houseFloor: responseData.floor,
                    houseTypePreValue: responseData.typePreCode,
                    houseTypeMidValue: responseData.typeMidCode,
                    houseTypeSufValue: responseData.typeSufCode,
                    houseArea: responseData.area,
                    housePrice: responseData.price,
                    houseContent: responseData.content
                }
            }).catch(error => {

            })
        }
        const submit = () => {

            let requestData = {
                mark: "MQ",
                houseMark: "HO",
                houseId: props.houseId,
                buildId: data.buildId,
                unitId: data.unitId,
                houseNum: data.form.houseNum,
                preCode: data.form.houseTypePreValue,
                midCode: data.form.houseTypeMidValue,
                sufCode: data.form.houseTypeSufValue,
                houseFloor: data.form.houseFloor,
                houseArea: data.form.houseArea,
                housePrice: data.form.housePrice,
                houseContent: data.form.houseContent,
                username: data.username
            }
            EditHouse(requestData).then(response => {
                root.$message({
                    message: response.data.message,
                    type: "success"
                })
                emit("getChangeData")
            }).then(error => {

            })
        }
        const getPreInfo = () => {
           
            FindHouseTypePre().then(response => {
                let responseData = response.data.data;
                data.houseTypePre = responseData
            }).catch(error => {
                
            })
        }
        const getMidInfo = () => {
            FindHouseTypeMid().then(response => {
                let responseData = response.data.data;
                data.houseTypeMid = responseData
            }).catch(error => {
                
            })
        }
        const getSufInfo = () => {
            FindHouseTypeSuf().then(response => {
                let responseData = response.data.data;
                data.houseTypeSuf = responseData
            }).catch(error => {
                
            })
        }

        onMounted(() => {
            getPreInfo();
            getMidInfo();
            getSufInfo();
            
        })
        return {
            data,
            getPreInfo, getMidInfo, getSufInfo, getHouseInfo, openDialog, close, submit
        }
    }
}
</script>
<style land="scss" scoped>
.formMargin {
    margin-bottom: 20px ; 
}

.form-select {
    width: 250px;
    margin-right: 100px;
}
</style>
    