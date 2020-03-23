
<template>
    <div>
        <!-- 流程状态 -->
        <div class="add-content-top">
            <div class="search-title">
                <el-row :gutter="20">
                    <el-col :span="6">添加房屋流程状态</el-col>
                </el-row>
            </div>
            <div class="search-content">
                <el-steps :active="data.active" align-center >
                    <el-step title="选择楼栋"></el-step>
                    <el-step title="选择单元"></el-step>
                    <el-step title="添加房屋"></el-step>
                </el-steps>
            </div>
        </div>

        <!-- 显示 -->
        <div class="build-center">
            <!--楼栋-->
            <div v-if="data.active == 1">
                <div class="center-title">
                <el-row :gutter="20">
                    <el-col :span="19">楼栋信息</el-col>
                    <el-button class="moreButton" type="primary" @click="chooseBuild" size="small" icon="el-icon-search">选择楼栋</el-button>
                    <el-button class="moreButton" type="primary" @click="addBuild" size="small" icon="el-icon-circle-plus-outline">添加楼栋</el-button>
                </el-row>
                </div>
                <div class="house-info">
                    <el-row class="build-el-row" :gutter="14">
                        <el-col :span="7">
                            <label>楼栋编码: </label>
                            <label>{{ data.buildCode }}</label>
                        </el-col>
                        <el-col :span="7">
                            <label>楼栋号: </label>
                            <label>{{ data.buildNum }}</label>
                        </el-col>
                        <el-col :span="7">
                            <label>楼栋名称: </label>
                            <label>{{ data.buildName }}</label>
                        </el-col>
                    </el-row>
                    <el-row :gutter="14">
                        <el-col :span="7">
                            <label>备注: </label>
                            <label>{{ data.buildContent }}</label>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <!--单元-->
            <div v-if="data.active == 2">
                <div class="center-title">
                <el-row :gutter="20">
                    <el-col :span="19">单元信息</el-col>
                    <el-button class="moreButton" type="primary" @click="chooseUnit" size="small" icon="el-icon-search">选择单元</el-button>
                    <el-button class="moreButton" type="primary" @click="addUnit" size="small" icon="el-icon-circle-plus-outline">添加单元</el-button>
                </el-row>
                </div>
                <div class="house-info">
                    <el-row class="build-el-row" :gutter="14">
                        <el-col :span="7">
                            <label>单元编码: </label>
                            <label>{{ data.unit.code }}</label>
                        </el-col>
                        <el-col :span="7">
                            <label>单元号: </label>
                            <label>{{ data.unit.num }}单元</label>
                        </el-col>
                        <el-col :span="7">
                            <label>总层数: </label>
                            <label>{{data.unit.layer}}层</label>
                        </el-col>
                    </el-row>
                    <el-row :gutter="14">
                        <el-col :span="7">
                            <label>电梯: </label>
                            <label v-text="data.unit.elevator == 'Y' ? '有': '无'"> </label>
                        </el-col>
                        <el-col :span="7">
                            <label>备注: </label>
                            <label>{{ data.unit.content }}</label>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <!--房屋-->
            <div v-if="data.active == 3">
                <div class="center-title">
                <el-row :gutter="20">
                    <el-col :span="19">添加楼房</el-col>
                </el-row>
                </div>
                <div class="house-info">
                    <el-form ref="houseForm" label-position="left" label-width="180px">
                        <el-form-item class="formMargin" label="房屋号">
                            <el-input v-model="data.houseForm.houseNum" placeholder="必填,请填写房屋号" ></el-input>
                        </el-form-item>
                        <el-form-item class="formMargin" label="房屋楼层">
                            <el-input v-model="data.houseForm.houseFloor" placeholder="必填,请填写房屋楼层"></el-input>
                        </el-form-item>
                        <el-form-item class="formMargin" label="房屋户型">
                            <el-select v-model="data.houseForm.houseTypePreValue" class="form-select" clearable placeholder="必填,请选择房屋户型-室">
                                <el-option
                                    v-for="item in data.houseTypePre"
                                    :key="item.typePreId"
                                    :label="item.name"
                                    :value="item.typePreCode">
                                </el-option>
                            </el-select>
                            <el-select v-model="data.houseForm.houseTypeMidValue" class="form-select" clearable placeholder="必填,请选择房屋户型-厅">
                                <el-option
                                    v-for="item in data.houseTypeMid"
                                    :key="item.typeMidId"
                                    :label="item.name"
                                    :value="item.typeMidCode">
                                </el-option>
                            </el-select>
                            <el-select v-model="data.houseForm.houseTypeSufValue" class="form-select" clearable placeholder="必填,请选择房屋户型-卫">
                                <el-option
                                    v-for="item in data.houseTypeSuf"
                                    :key="item.typeSufId"
                                    :label="item.name"
                                    :value="item.typeSufCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="formMargin" label="建筑面积(平方)">
                            <el-input v-model="data.houseForm.houseArea" placeholder="必填,请填写房屋面积(平方)"></el-input>
                        </el-form-item>
                        <el-form-item class="formMargin" label="房屋单价(元)">
                            <el-input v-model="data.houseForm.housePrice" placeholder="必填,请填写房屋单价(元)"></el-input>
                        </el-form-item>
                        <el-form-item class="formMargin" label="备注">
                            <el-input v-model="data.houseForm.houseContent" placeholder="可填填,请填写备注"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        
        <!-- 按钮 -->
        <div class="ln_button">
                <el-button style="margin-top: 12px;" type="info" size="small" :disabled="data.active == 1" @click="last">上一步</el-button>
                <el-button style="margin-top: 12px;" :loading="data.submitLoading" :type="data.nextBtnType" size="small" @click="next">{{data.nextText}}</el-button>
                <el-button style="margin-top: 12px;" v-if="data.active == 3" type="primary" plain  size="small" @click="close">取消</el-button>
        </div>

        <!-- 楼栋 -->
        <DialogChooseBuild  :chooseBuildflag.sync="data.build_info" 
                            :buttonType.sync="data.buttonType" 
                            :chooseBuildId.sync="data.buildId"
                            :chooseBuildCode.sync="data.buildCode" 
                            :chooseBuildName.sync="data.buildName"
                            :chooseBuildNum.sync="data.buildNum" 
                            :chooseBuildContent.sync="data.buildContent" />
        <DialogAddBuild :flag.sync="data.addBuild"
                        :buttonType.sync="data.buttonType"
                        :addBuildId.sync="data.buildId"
                        :addBuildCode.sync="data.buildCode" 
                        :addBuildName.sync="data.buildName"
                        :addBuildNum.sync="data.buildNum" 
                        :addBuildContent.sync="data.buildContent" />

        <!-- 单元 -->
        <DialogChooseUnit :chooseUnitflag.sync="data.unit_info" :id.sync="data.buildId" :buttonType="data.buttonType"
                          :chooseUnitId.sync="data.unit.id" :chooseUnitElevator.sync="data.unit.elevator" 
                          :chooseUnitCode.sync="data.unit.code" :chooseUnitLayer.sync="data.unit.layer" 
                          :chooseUnitNum.sync="data.unit.num" :chooseUnitContent.sync="data.unit.content" />

        <DialogUnitInfo :unitFlag.sync="data.unit_flag" :id="data.buildId" :buttonType.sync="data.buttonType" :dialogName.sync="data.dialog_name"
                          :unitIdFormAddHouse.sync="data.unit.id" :unitElevatorFormAddHouse.sync="data.unit.elevator"
                          :unitCodeFormAddHouse.sync="data.unit.code" :unitLayerFormAddHouse.sync="data.unit.layer"
                          :unitNumFormAddHouse.sync="data.unit.num" :unitContentFormAddHouse.sync="data.unit.content"/>        
                                 
    </div>
</template>
<script>
import { FindHouseTypePre, FindHouseTypeMid, FindHouseTypeSuf, AddHouse} from "@/api/adminApi/home";
import { reactive, onMounted, computed } from '@vue/composition-api';
import { setCommunity, getCommunity  } from "@/utils/app";
import DialogChooseBuild from "../dialog/chooseBuild";
import DialogAddBuild from "../dialog/addBuild";
import DialogChooseUnit from "../dialog/chooseUnit";
import DialogUnitInfo from "../dialog/unitOperate";
export default {
    name:"addhouse",
    components: {
        DialogChooseBuild,
        DialogAddBuild,
        DialogChooseUnit,
        DialogUnitInfo
    },
    
    setup(props, { root, refs }) {
        const userName = computed(() => root.$store.state.app.username);
        const data = reactive({
            marks: getCommunity(),
            username: userName,
            active: 1,
            nextText: "下一步",
            nextBtnType: "primary",
            lastDisabled: false,
            buttonType: "",
            dialog_name: "",
            // 房屋
            build_info: false,
            buildId: "",
            buildCode: "",
            buildName: "",
            buildNum: "",
            buildContent: "",

            submitLoading: false,

            // 添加楼栋
            addBuild: false,

            //单元
            unit_info: false,
            unit_flag: false,
            unit: {
                id: "",
                code: "",
                num: "",
                elevator: "",
                layer: "",
                content: ""
            },

            //房屋
            houseTypePre: [],
            houseTypeMid: [],
            houseTypeSuf: [],
            
            houseForm: {
                // buildId: data.buildId,
                // unitId: data.unitId,
                houseNum: "",
                houseFloor: "",
                houseTypePreValue: "",
                houseTypeMidValue: "",
                houseTypeSufValue: "",
                hosueArea: "",
                housePrice: "",
                houseContent: ""
            }

        })


        /*****************************************************************
            方法
         */
        const last = () => {
            data.active--;
            data.nextText = "下一步";
            data.nextBtnType = "primary";
        }
        const next = () => {
            if(data.active == 1){
                if(checkBuildInfo() == -1){
                    data.active = 1;
                    return false;
                }
            }
            if(data.active == 2){
                if(checkUnitInfo() == -1){
                    data.active = 2;
                    return false;
                };
            }
            if (data.active++ == 2){
                data.nextText = "完成";
                data.nextBtnType = "success";
                // 查出房屋类型
                findAllHouseTypePre();
                findAllHouseTypeMid();
                findAllHouseTypeSuf();
                // data.active = 2;
            }else if(data.active > 3){
                submit();
                data.active = 3;
            }else{
                data.nextText = "下一步";
            }
        }
        // 选择楼栋
        const chooseBuild = () => {
            data.build_info = true;
            data.buttonType = "房屋中选择楼栋";
        }
        const addBuild = () => {
            data.addBuild = true;
            data.buttonType = "房屋中添加楼栋";
        }
        // 楼房数据格式化
        // 选择单元
        const chooseUnit = () => {
            data.unit_info = true;
            data.buttonType = "房屋中选择单元";
            console.log("房屋中选择单元");
            console.log(data.buildId);
        }
        //添加单元
        const addUnit = () => {
            data.unit_flag = true;
            data.buttonType = "房屋中选择单元";
            data.dialog_name = "新增单元"
        }

        // 查询所有 的室信息
        const findAllHouseTypePre = () => {
            FindHouseTypePre().then(response => {
                let responseData = response.data.data;
                data.houseTypePre = responseData
            }).catch(error => {
                
            })
        }

        // 查询所有 的厅信息
        const findAllHouseTypeMid = () => {
            FindHouseTypeMid().then(response => {
                let responseData = response.data.data;
                data.houseTypeMid = responseData
            }).catch(error => {
                
            })
        }

        // 查询所有 的卫信息
        const findAllHouseTypeSuf = () => {
            FindHouseTypeSuf().then(response => {
                let responseData = response.data.data;
                data.houseTypeSuf = responseData
            }).catch(error => {
                
            })
        }

        
        // 提交房屋
        const submit = () => {
            // 检查信息
            console.log("检查信息")
            if(checkHouseInfo() == -1) return false;
            let requestData = {
                mark: data.marks,
                houseMark: "HO",
                buildId: data.buildId,
                unitId: data.unit.id,
                houseNum: data.houseForm.houseNum,
                houseFloor: data.houseForm.houseFloor,
                houseTypePreValue: data.houseForm.houseTypePreValue,
                houseTypeMidValue: data.houseForm.houseTypeMidValue,
                houseTypeSufValue: data.houseForm.houseTypeSufValue,
                houseArea: data.houseForm.houseArea,
                housePrice: data.houseForm.housePrice,
                houseContent: data.houseForm.houseContent,
                username: data.username
            }
            data.submitLoading = true;
            AddHouse(requestData).then(response => {
                let responseData = response.data;
                root.$message({
                    message: responseData.message,
                    type: 'success'
                });
                //重置表单
                resetForm();
                data.submitLoading = false;
            }).catch(error => {
                data.submitLoading = false;
            })
        }

        // 检查信息的正确性
        const checkBuildInfo = () => {
            if(data.buildCode == "" || data.buildName == "" || data.buildNum == ""){
                root.$message({
                    message: "楼栋信息不能为空！！",
                    type: "error"
                });
                return -1;
            }   
        }
        const checkUnitInfo = () => {
            if(data.unit.code == "" || data.unit.num == "" || data.unit.elevator == "" || data.unit.layer == ""){
                root.$message({
                    message: "单元号不能为空！！",
                    type: "error"
                });
                return -1;
            }   
        }
        const checkHouseInfo = () => {
            if(data.houseForm.houseNum == ""){
                root.$message({
                    message: "房屋号不能为空！！",
                    type: "error"
                });
                return -1;
            }      
            if(data.houseForm.houseFloor == ""){
                root.$message({
                    message: "房屋楼层不能为空！！",
                    type: "error"
                });
                return -1;
            } 
            if(data.houseForm.houseTypeSufValue == "" || data.houseForm.houseTypeMidValue == "" || data.houseForm.houseTypePreValue == "" ){
                root.$message({
                    message: "房屋户型不能为空！！",
                    type: "error"
                });
                return -1;
            }
            if(data.houseForm.houseArea == ""){
                root.$message({
                    message: "房屋面积不能为空！！",
                    type: "error"
                });
                return -1;
            }
        }
        // 重置表单
        const resetForm = () => {
            data.houseForm.houseNum = "";
            data.houseForm.houseFloor = "";
            data.houseForm.houseTypePreValue = "";
            data.houseForm.houseTypeMidValue = "";
            data.houseForm.houseTypeSufValue = "";
            data.houseForm.houseArea = "";
            data.houseForm.housePrice = "";
            data.houseForm.houseContent = "";
            // refs.houseForm.resetFields();
        }
        //跳转路由到房屋首页
        const close = () => {
            // 路由跳转
            root.$router.push({
                name: "House",   
            });
        }


        //生命周期
        onMounted(() => {
            
            console.log(data.active);
            
        })

        return {
            data, 
            // 方法
            last, next, chooseBuild, addBuild, chooseUnit, addUnit, findAllHouseTypePre, findAllHouseTypeMid, findAllHouseTypeSuf,
            submit, close, checkBuildInfo, checkUnitInfo, checkHouseInfo, resetForm
        }
    }
}
</script>
<style lang="scss" scoped>
.add {
    height: 100%;
}

.ln_button {
    margin-top: 20px;
    float: right;
}

.add-content-top {
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
/******************************************************************************************
    选择房屋
 */
.build-center {
    height: 100%;
    // padding: 20px 20px 0 20px;
    // padding-right: 30px;
    border-top: 2px solid #e7eaec;
    background-color: #fff;
}
.center-title {
    line-height: 35px;
    font-weight:600;
    padding: 12px 20px 12px 20px;
    color: rgb(104, 107, 109);
    border-bottom: 1px solid #e7eaec;
}
.house-info {
    padding: 20px;
    .build-el-row {
        margin-bottom: 30px;
    }
}



/******************************************************************************************
    选择单元
 */




/******************************************************************************************
    添加房屋
 */
.formMargin {
    margin-bottom: 20px ; 
}

.form-select {
    width: 250px;
    margin-right: 100px;
}

</style>