<template>
    <div id="nav-wrap">
        <h1 class="logo"><img src="../../../assets/logo.png" alt="" ></h1>
        <el-menu default-active="1-4-1" 
        class="el-menu-vertical-demo"
          :collapse="isCollapse" 
          unique-opened=true
          background-color="transparent" 
          text-color="#fff" 
          active-text-color="#fff"
          router>
        
            <!-- 使用 template 标签来分离 v-for 、v-if，但for中的 key index 不能写入到 template 标签上-->
            <template v-for="(item,index) in routers">
                <el-submenu v-if="!item.hidden" :key="item.id" :index="index + ''">
                <!-- 一级菜单 -->
                <template slot="title">
                    <!-- <i :class="item.meta.icon"></i> -->
                    <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon"/>
                    <span slot="title">  {{ item.meta.name }}</span>
                </template>
                <!-- 子级菜单 -->
                <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.path">
                    <template>
                        <svg-icon :iconClass="subItem.meta.icon" :className="subItem.meta.icon"/>
                        <span>{{ subItem.meta.name }}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
            </template>
        </el-menu>
    </div>
</template>
<script>
import { reactive, ref, isRef, toRefs, onMounted, computed } from "@vue/composition-api";
export default {
    name: "navMenu",
    setup(props,{ root }){

        /*************************************************************************************
         *  声明数据
         */
        const isCollapse = computed(() => root.$store.state.app.isCollapse);
        // 获取所有路由
        const routers = reactive(root.$router.options.routes);
        
        console.log(routers);

        /******************************************************************************
         * 声明函数
         */


        /*******************************************************************************
         * 返回
         */
        return {
            isCollapse,
            routers
        }
    }
    
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
.logo {
    text-align: center;
    img {
        margin: 28px auto 25px;
        width: 92px;
    }

}
#nav-wrap{
    position: fixed;
    top: 0;
    left: 0;
    width: $navMenuWidth;
    height: 100vh;
    background-color: #344a5f; 
    @include webkit(transition,all .3s ease 0s);
}
//中和掉 elementUI 组件自带的问题
.el-menu {
    border-right: solid 1px #344a5f;
}


.open {
    #nav-wrap {width: $navMenuWidth;};
}
.close {
    #nav-wrap {
        width: $navMenuMinWidth;
        border-right: solid 1px #344a5f;
    }
}
</style>