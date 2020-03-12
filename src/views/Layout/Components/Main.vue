<template>
    <div id="main-wrap">
        <!-- router-view 加载当前路由下的第一个子路由 -->
        <div class="main-content">
            
            <div class="content"><router-view /></div>
        </div> 
    </div>
</template>
<script>
export default {
    name: "Main",

    setup(props,{ root }){
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#main-wrap {
    height: 100vh;
    // position: fixed;
    // left: $navMenuWidth;
    // top: 75px;
    // right: 0;
    // bottom: 0;
    // border: 30px solid #f7f7f7;
    // border-bottom: none;
    // background-color: #fff;
    // -webkit-box-sizing: border;
}
.main-content {
    
    width: 100%;
    height: 100%;
    padding-top: $layoutHeader + 30px;
    padding-left: $navMenuWidth + 30px;
    padding-right: 30px;
    @include webkit(box-sizing,border-box);
    @include webkit(transition, all .3s ease 0s);
}
.open {
   .main-content { padding-left: $navMenuWidth + 30px;} 
}
.close {
   .main-content { padding-left: $navMenuMinWidth + 30px;} 
}

.content {
    width: 100%;
    height: 100%;
    // border-top: 2px solid #e7eaec;
    // padding: 30px 30px 0 30px;
    // background-color: #fff;
    @include webkit(box-sizing,border-box);
}
</style>