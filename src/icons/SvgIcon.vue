<template>
    <!-- <div>{{ plusOne }}</div> -->
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>
<script>
import { reactive, ref, computed,onMounted } from '@vue/composition-api';
export default {
    name: "svgIcon",
    // 父组件向子组件传值，子组件用属性接受
  //  props:["iconClass","className"],
    props: {
        // 分页
        iconClass: {
            type: String,    //定义接受的值的类型
            default: ""
            // required: true,   // 为true的时候，必须传值，不然报错
            // validator: (value) => {
            //     return value >= 0
            // }
        },
        className: {
            type: String,    //定义接受的值的类型
            default: ""
        }
    },
    setup(props){
        const msg = ref("Vue前端代码撸起来");
        const count = ref(10);
        /**
         * computed: 监听属性变化，并计算属性
         */
        // const plusOne = computed(() => {
        //     return count.value + 1;
        // })
        // const plusOne = computed({
        //     get: () => count.value + 1,
        //     set: val => { count.value = val -1 } 
        // });
        const iconName = computed(() => `#icon-${props.iconClass}`);
        const svgClass = computed(() => {
            if(props.className){
                return `svg-icon ${props.className}`;
            }else{
                return `svg-icon`;
            }
        });
        return {
            msg,
            iconName,
            svgClass
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../styles/config.scss";
.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor; // 设置此属性，才能改 svg 图标的颜色
    color: #cccccc;
    padding: 0 10px 2px 10px;
    font-size: 20px;  
}
// 菜单栏被选中时高亮
li.el-submenu {
    &.is-active.is-opened .el-submenu__title .svg-icon {
        fill: currentColor; 
        color: $iconColor ;
    }
}
</style>