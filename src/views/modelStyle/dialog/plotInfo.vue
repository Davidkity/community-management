<template>
    <!-- 新增弹窗  -->
    <el-dialog :title="data.dialog_name" :visible.sync="data.dialog_info_flag" @close="close" width="580px" @open="openDialog">
        <el-form :model="data.form" ref="infoForm">
            
            <el-form-item label="楼栋名称：" :label-width="data.formLabelWidth" prop="build_name">
                <CityPicker></CityPicker>
            </el-form-item>
           
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="danger" :loading="data.submitLoading" @click="submit">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { reactive, watch } from '@vue/composition-api';

//组件
import CityPicker from "@/components/CityPicker";
export default {
    name: "plotDialog",
    components: { CityPicker },

    props: {
        plotFlag: {
            type: Boolean,
            default: false
        },
        dialogName: {
            type: String,
            default: ""
        }
    },

    setup(props, { root, emit }) {

        const data = reactive({
            dialog_info_flag: false,
            dialog_name: "",

            form: {

            }
        })


        /*******************************************************************************************
         方法
         */
        //  watch 监听父组件,父组件向子组件传值
        watch(() => {
            data.dialog_info_flag = props.plotFlag
        });


        // 打开弹窗前触发的方法
        const openDialog = () => {
            data.dialog_name = props.dialogName;
        }

        // 关闭弹窗前触发的方法
        const close = () => {
            data.dialog_info_flag = false;
            data.dialog_name = "";
            emit("update:plotFlag", false);
        }

        // 提交
        const submit = () => {

        }

        return {
            data,
            openDialog, close, submit
        }

    }
    
}
</script>
<style lang="scss" scoped>

</style>