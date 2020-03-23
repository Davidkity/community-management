<template>
    <div id="header-warp">
        <div class="pull-left header-icon" @click="navMenuState">
            <svg-icon iconClass="menu" className="menu"></svg-icon>
        </div>
        
        <div class="pull-right ">
            <div class="pull-left">
                
                <el-select v-model="data.communityCode"  @change="communityChange" placeholder="请选择小区" style="width:100px">
                    <el-option
                    v-for="item in data.communityOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                    </el-option>
                </el-select>
                <label style="width:100px; margin: 0 7px"> 小区 &nbsp;&nbsp;</label>
            </div>
            <div class="user-info pull-left">
                <el-avatar> {{ username }} </el-avatar>
                <!--
                <img src="../../../assets/images/face.jpg" alt="">
                {{ username}}
                -->
            </div>
            <div class="header-icon pull-left" @click="exit">
                <svg-icon iconClass="exit" className="exit" />
            </div>
        </div>
    </div>
</template>
<script>
import { computed, reactive, onMounted } from "@vue/composition-api";
import { setCommunity, getCommunity  } from "@/utils/app";
// 中央事件
import EventBus from "@/utils/bus"
//组件

export default {
    name: "layoutHeader",

    setup(props, { root }){

        const navMenuState = () =>{
            root.$store.commit('app/SET_COLLAPSE');
            // root.$store.dispatch("setMenuStatus");
        };

        const username = computed(() => root.$store.state.app.username);
        // const userId = computed(() => root.$store.state.app.id);
        const userId = root.$store.getters['app/id'];

        const community = getCommunity();
        // const community = computed(() => root.$store.state.app.community);
        
        const data = reactive({
            communityCode: community,
            communityOptions: []
        })


        const communityChange = () => {
            // console.log("data.communityCode: " + data.communityCode);
            root.$store.commit("app/SET_COMMUNITY", data.communityCode);
            setCommunity(data.communityCode);
            // console.log(getCommunity());
            // console.log(root.$store.getters['app/community'])

        }

        //加载小区
        const loadCommunity = () => {
            root.$store.dispatch("community/getCommunity",{id: userId}).then(response => {
                let communityData = response.data.data;
                data.communityOptions = communityData;
            })
        }

        // 退出
        const exit = () => {
            console.log("退出。。。");
            root.$store.dispatch("app/exit").then(() => {
                console.log("路由跳转前");
                root.$router.push({
                    name: "Login"
                });
                console.log("路由跳转后");
            })
        }

        onMounted(() => {
            loadCommunity();
        })

        return {
            data,
            navMenuState,
            username,
            exit, communityChange, loadCommunity
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-warp {
    position: fixed;
    z-index: 888;
    top: 0;
    right: 0;
    left: $navMenuWidth;
    height: 75px;
    background-color: #fff;
    line-height: 75px;
    // -webkit-box-shadow: 0 3px 16px 0 rgba(0, 0, 0, .1);
    @include webkit(box-shadow,0 3px 16px 0 rgba(0, 0, 0, .1));
    @include webkit(transition,all .3s ease 0s);
}
.open {
    #header-warp { left: $navMenuWidth; }
}
.close {
    #header-warp { left: $navMenuMinWidth; }
}
.header-icon {
    padding: 0 14px;
    svg {
        margin-bottom: -16px;
        font-size: 45px;
        cursor: pointer;
    }
}
.user-info {
    height: 100%;
    padding: 0 32px;
    
}
.el-avatar {
    margin-top: 10px;
    width: 50px;
    height: 50px;
    font-size: 30px;
    line-height: 50px;
}
</style>