
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
                    <el-step title="选择房屋"></el-step>
                </el-steps>
            </div>
        </div>

        <!-- 显示 -->
        <div class="build-center">
            <!--楼栋-->
            <div v-if="data.active == 1">
                <div class="center-title">
                <el-row :gutter="20">
                    <el-col :span="22">楼栋信息</el-col>
                    <el-button class="moreButton" type="primary" @click="chooseBuild" size="small" icon="el-icon-search">选择楼栋</el-button>
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
                    <el-col :span="22">单元信息</el-col>
                    <el-button class="moreButton" type="primary" @click="chooseUnit" size="small" icon="el-icon-search">选择单元</el-button>
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
                    <el-col :span="22">房屋信息</el-col>
                    <el-button class="moreButton" type="primary" @click="chooseHouse" size="small" icon="el-icon-search">选择房屋</el-button>
                </el-row>
                </div>
                <div class="house-info">
                    <el-row class="build-el-row" :gutter="14">
                        <el-col :span="7">
                            <label>房屋编码: </label>
                            <label>{{ data.house.code }}</label>
                        </el-col>
                        <el-col :span="7">
                            <label>房屋号: </label>
                            <label>{{ data.house.num }}</label>
                        </el-col>
                        <el-col :span="7">
                            <label>房屋状态: </label>
                            <label>{{ data.house.houseStatus }}</label>
                        </el-col>
                    </el-row>
                    <el-row :gutter="14">
                        <el-col :span="7">
                            <label>房屋户型: </label>
                            <label v-text="data.house.typeName"> </label>
                        </el-col>
                        <el-col :span="7">
                            <label>面积: </label>
                            <label>{{ data.house.area }}</label>
                        </el-col>
                        <el-col :span="7">
                            <label>单价: </label>
                            <label>{{ data.house.price }}</label>
                        </el-col>
                    </el-row>
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

        <!-- 单元 -->
        <DialogChooseUnit :chooseUnitflag.sync="data.unit_info" :id.sync="data.buildId" :buttonType="data.buttonType"
                          :chooseUnitId.sync="data.unit.id" :chooseUnitElevator.sync="data.unit.elevator" 
                          :chooseUnitCode.sync="data.unit.code" :chooseUnitLayer.sync="data.unit.layer" 
                          :chooseUnitNum.sync="data.unit.num" :chooseUnitContent.sync="data.unit.content" />
      
        <!-- 房屋 -->  
        <DialogChooseHouse :chooseHouseflag.sync="data.house_info" :buildId.sync="data.buildId" 
                           :unitId.sync="data.unit.id" :userId.sync="data.userId"
                            :buttonType="data.buttonType"
                          :chooseHouseId.sync="data.house.id" :chooseHouseStatus.sync="data.house.houseStatus" 
                          :chooseHouseCode.sync="data.house.code" :chooseHouseTypeName.sync="data.house.typeName" 
                          :chooseHouseNum.sync="data.house.num" :chooseHouseArea.sync="data.house.area" 
                          :chooseHousePrice.sync="data.house.price"/>                    
    </div>
    
</template>
<script>

import { FindHouseTypePre, FindHouseTypeMid, FindHouseTypeSuf, AddHouse, EditHouse} from "@/api/adminApi/home";
import { UserCheckIn } from "@/api/adminApi/user";
import { getCommunity  } from "@/utils/app";

import { reactive, onMounted, computed } from '@vue/composition-api';
//组件
import DialogChooseBuild from "@/views/Jewel/dialog/chooseBuild";
import DialogChooseUnit from "@/views/Jewel/dialog/chooseUnit";
import DialogChooseHouse from "@/views/Jewel/dialog/chooseHouse";
export default {
    name:"addhouse",
    components: {
        DialogChooseBuild,
        DialogChooseUnit,
        DialogChooseHouse
    },
    
    setup(props, { root, refs }) {
        // console.log("id:" + root.$route.params.userId);
        const marks = getCommunity();
        const user_id = root.$route.params.userId;
        const userName = computed(() => root.$store.state.app.username);
        const data = reactive({
            userId: user_id,
            username: userName,
            active: 1,
            nextText: "下一步",
            nextBtnType: "primary",
            lastDisabled: false,
            buttonType: "",
            dialog_name: "",
            // 楼栋
            build_info: false,
            buildId: "",
            buildCode: "",
            buildName: "",
            buildNum: "",
            buildContent: "",

            submitLoading: false,

            

            //单元
            unit_info: false,
            unit: {
                id: "",
                code: "",
                num: "",
                elevator: "",
                layer: "",
                content: ""
            },

            //房屋
            house_info: false,
            house: {
               id: "",   
               code: "",  
               houseStatus: "",  
               num: "",  
               typeName: "",  
               area: "",  
               price: "",  
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
               
                // data.active = 2;
            }else if(data.active > 3){
                if(checkHouseInfo() == -1){
                    data.active = 3;
                }
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
        
        // 楼房数据格式化
        // 选择单元
        // 选择单元
        const chooseUnit = () => {
            data.unit_info = true;
            data.buttonType = "房屋中选择单元";
        }

        const chooseHouse = () => {
            data.house_info = true;
        }
        

        
        
        // 提交房屋
        const submit = () => {
            console.log("data.house.id: " + data.house.id);
            
            let requestData = {
                mark: marks,
                checkInMark: "CI",
                houseId: data.house.id,
                userId: data.userId,
                username: data.username
            }
            
            UserCheckIn(requestData).then(response => {
                  
                let changeHouseStatusData = {
                    mark: marks,
                    houseMark: "HO",
                    houseId: data.house.id,
                    houseStatusCode: "SOLD",
                    username: data.username
                }
                EditHouse(changeHouseStatusData).then(response => {
                    root.$message({
                        message: "入住房屋成功",
                        type: "success"
                    }) 
                    close();
                }).catch(error => {

                })
            }).catch(error => {

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
            if(data.house.id == ""){
                root.$message({
                    message: "房屋信息不能为空！！",
                    type: "error"
                });
                return -1;
            }   
        }
        
        //跳转路由到房屋首页
        const close = () => {
            // 路由跳转
            root.$router.push({
                name: "UserInfo",   
            });
        }


        //生命周期
        onMounted(() => {
            
            
        })

        return {
            data, marks, 
            // 方法
            last, next, chooseBuild, chooseUnit, chooseHouse, 
            submit, close, checkBuildInfo, checkUnitInfo, checkHouseInfo
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