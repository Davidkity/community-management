<template>
    <el-select v-model="data.selectValue" placeholder="请选择" :clearable="data.clearableFlag"  @change="select">
        <el-option v-for="item in data.initOption" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
</template>
<script>
import { reactive, onMounted, watch } from '@vue/composition-api';
export default {
    name: "",
    props: {
        config: {
            type: Object,
            default: () => {}
        }
    },
    setup(props, { root, emit }){
        const data = reactive({
            selectValue: "",
            clearableFlag: false,
            initOption: [],
            option: [
                { value: "", label: "请选择" },
                { value: "name", label: "姓名" },
                { value: "phone", label: "手机号" },
                { value: "email", label: "邮箱" },
                { value: "id", label: "ID" },
                { value: "title", label: "标题" },
                { value: "W", label: "女" },
                { value: "M", label: "男" },
                { value: "MEMBER", label: "家庭成员" },
                { value: "TENANT", label: "租客" },
                { value: "Y", label: "开启" },
                { value: "N", label: "关闭" },
                { value: "community", label: "小区" },
                { value: "build", label: "楼栋" },
                { value: "unit", label: "单元" },
                { value: "CASH", label: "现金" },
                { value: "WECHAT", label: "微信" },
                { value: "ALIPAY", label: "支付宝" },
                { value: "E_BANK", label: "网银" },
                { value: "FIX", label: "固定费用" },
                { value: "UNFIX", label: "非固定费用" },
                { value: "OTHER", label: "其他" }

            ]
        });


        watch(() => props.config.selectValue, (selectValue)  => {
            data.selectValue = props.config.selectValue;
        }); 



        /**
         * 初始化下拉选择
         */
        const initOption = () => {
            let initData = props.config.init;
            // 是否可清除的标记
            data.clearableFlag = props.config.clearFlag
            let optionArr = [];
            // 数据检验
            if(initData.length === 0) {
                root.$message({
                    message: "config的参数是空的，无法显示下拉菜单；",
                    type: "error"
                })
                console.log("config的参数是空的，无法显示下拉菜单；");
                return false;
            }
            initData.forEach(item => {
                let arr = data.option.filter(elem => elem.value == item); // filter匹配成功后是一个数组，需要取下标第一个
                if(arr.length > 0) {
                    optionArr.push(arr[0]);
                }
            })
            // 数据检验
            if(optionArr.length === 0) {
                root.$message({
                    message: "匹配的数据为空！；",
                    type: "error"
                })
                console.log("匹配的数据为空！");
                return false;
            }
            // 初始化赋值
            data.initOption = optionArr;
            
            // 初始化搜索类型
            // data.selectValue = optionArr[0].value;
        }

        const select = () => {
            emit("update:selectVal", data.selectValue)
        }

        // 重置数据
        const resetData = () => {
            data.selectValue = ""
        }
        /**
         * 组件挂载完成时
         */
        onMounted(() => {
            initOption()
        })
        
        return {
            data,
            select, initOption, resetData
        }
    }
}
</script>
<style scoped>
</style>
<!--
组件目录位置：sre > components > Select > index.vue;
组件引用方式：import SelectVue from "@c/Select";
template：<SelectVue :config="data.configOption" />
参数配置：
configOption: {
    clearFlag    // 是否可清除的标志，可配置，默认为 false
    init: ["name", "phone"]
}
configOption: {
    init: []
    aa: ""
}
init：
    数据类型: Array; 
    可配置的数据："name", "phone", "email", "id", "title"
aa：
    数据类型：String
    可配置的数据：任意字符串

selectVal:  外部用于接收选中的值  默认为  ""
-->