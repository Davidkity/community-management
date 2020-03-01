<template>
    <div id="header-warp">
        <div class="pull-left header-icon" @click="navMenuState">
            <svg-icon iconClass="menu" className="menu"></svg-icon>
        </div>
        <div class="pull-right ">
            <div class="user-info pull-left">
                <img src="../../../assets/images/face.jpg" alt="">
                {{ username}}
            </div>
            <div class="header-icon pull-left" @click="exit">
                <svg-icon iconClass="exit" className="exit" />
            </div>
        </div>
    </div>
</template>
<script>
import { computed } from "@vue/composition-api";
export default {
    name: "layoutHeader",

    setup(props, { root }){

        const navMenuState = () =>{
            root.$store.commit('app/SET_COLLAPSE');
            // root.$store.dispatch("setMenuStatus");
        };

        const username = computed(() => root.$store.state.app.username);

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

        return {
            navMenuState,
            username,
            exit
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-warp {
    position: fixed;
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
    border-right: 1px solid #ededed;
    + .header-icon {
        padding: 0 28px;
    };
    img {
        display: inline-block;
        margin-bottom: -14px;
        margin-right: 18px;
        border-radius: 50px;    
    }
}
</style>