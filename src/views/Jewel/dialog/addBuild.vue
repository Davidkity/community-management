<template>
    <!-- 新增弹窗  -->
    <el-dialog :title="data.dialog_name" :visible.sync="data.dialog_info_flag" @close="close" width="580px" @open="openDialog">
        <el-form :model="data.form" ref="addInfoForm">
            <el-form-item label="楼栋编号：" :label-width="data.formLabelWidth" prop="build_num">
                <el-input v-model="data.form.build_num" @input="formatName" placeholder="必填，请输入编号" ></el-input>
            </el-form-item>
            <el-form-item label="楼栋名称：" :label-width="data.formLabelWidth" prop="build_name">
                <el-input v-model="data.form.build_name" :disabled="true"  placeholder="必填，请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="备注：" :label-width="data.formLabelWidth" prop="build_content">
                <el-input type="textarea" v-model="data.form.build_content" placeholder="可填，请填写备注"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="danger" :loading="data.submitLoading" @click="submit">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { AddBuild, GetList, EditBuild } from "@/api/adminApi/home";
import { reactive, ref, watch, computed } from "@vue/composition-api";
export default {
    name: "addBuild",
    props: {
        flag: {
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
            dialog_name: "添加楼栋",
            dialog_info_flag: false,
            formLabelWidth: "100px",
            username: userName,
            build_id: "",
            build_code: "",
            button_type: "",
            form: {
                build_num: "",
                build_name: "",
                build_content: ""
            },
            // 分类下拉
            categoryOption: [],
            // 按钮加载
            submitLoading: false
         });

        // 格式化数据
        const formatName = () =>{
            if(data.form.build_num != ""){
                data.form.build_name = data.form.build_num + "号楼";
            }else{
                data.form.build_name = "";
            }
        }
        //  watch 监听父组件,父组件向子组件传值
        watch(() => {
            data.dialog_info_flag = props.flag,
            data.button_type = props.buttonType
        });
        // emit 回调父组件，子组件向父组件传值
        const close = () => {
            data.dialog_info_flag = false;
            data.button_type = "";
            data.dialog_name = "添加楼栋";
            resetForm();
            emit("update:flag", false);
            emit("update:dialogName", data.dialog_name)
            emit("update:buttonType", "");
            emit("update:id", "");
        };
        //打开弹窗
        const openDialog = () => {
            data.categoryOption = props.category;
            data.button_type = props.buttonType;
            if(data.button_type == "editButton"){
                data.dialog_name = "修改楼栋";
                getInfo();
            }
        }
        //根据id 获取数据
        const getInfo = () => {
            let requestData = {
                mark:"MQ",
                current: 1,
                size: 2,
                buildId: props.id,
                code: "",
                name: "",
                num: ""
            }
            GetList(requestData).then(response => {
                let responseData = response.data.data.data[0];
                data.form = {
                    build_num: responseData.num,
                    build_name: responseData.name,
                    build_content: responseData.content
                }
               
            }).catch(error => {

            })
        }
        //返回数据到页面中
        const returnDataToPage = () => {
            emit("update:addBuildId", data.build_id)
            emit("update:addBuildCode", data.build_code);
            emit("update:addBuildNum", data.form.build_num);
            emit("update:addBuildName", data.form.build_name);
            emit("update:addBuildContent", data.form.build_content);
        }

        // 重置表单
        const resetForm = () => {
            refs.addInfoForm.resetFields();
        }
        // 提交
        const submit = (() => {
            
            if(!data.form.build_num) {
                root.$message({
                    message: '楼房编号不能为空！！',
                    type: 'error'
                })
                return false;
            }
            if(!data.form.build_name) {
                root.$message({
                    message: '楼房名称不能为空！！',
                    type: 'error'
                })
                return false;
            }
            data.submitLoading = true;
            // 判断是走添加还是修改路线
            data.button_type == "editButton" ? editInfo() : addInfo();
            // root.$store.dispatch("home/addBuild",requestData).then(response => {
                
            //     console("111: " + response.data);
            //     let data = response.data
            //     root.$message({
            //         message: data.message,
            //         type: 'success'
            //     })
            //     resetForm();
            //     data.submitLoading = false;
            //     console.log("调用成功");
            //     console.log(response);
            // }).catch(error => {
            //     data.submitLoading = false;
            //     console.log(error);
            // })

            
        })
        const addInfo = () =>{
            let requestData = {
                mark:"MQ",
                createdBy: data.username,
                num: data.form.build_num,
                name: data.form.build_name,
                content: data.form.build_content,
            }
            //调用添加数据的接口
            AddBuild(requestData).then(response => {
                let responseData = response.data
                console.log("数据");
                console.log(responseData);
                root.$message({
                    message: responseData.message,
                    type: 'success'
                })
                data.build_code = responseData.data.code;
                data.build_id = responseData.data.buildId;
                data.submitLoading = false
                // 返回数据到房屋添加楼栋页面
                if(data.button_type == "房屋中添加楼栋"){
                    returnDataToPage();
                    close();
                }
                // 重置表单
                resetForm();
                // root.$refs['addInfoForm'].resetFields();

                // 刷新数据
                emit("getChangeData");
            }).catch(error => {
                data.submitLoading = false
            })
        }

        const editInfo = () =>{
            let requestData = {
                mark:"MQ",
                updateBy: data.username,
                buildId: props.id,
                num: data.form.build_num,
                name: data.form.build_name,
                content: data.form.build_content,
            }
            // 调用修改接口
            EditBuild(requestData).then(response => {
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
            formatName, close, openDialog, getInfo, submit, addInfo, editInfo, returnDataToPage
        }
    }
}
</script>
<style scoped>

</style>