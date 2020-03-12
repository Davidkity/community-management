import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
// 引入 element-ui 组件
import ElementUI from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";
// 引入 composition-api 接口
import VueCompositionApi from '@vue/composition-api';
import "./icons/index";   // 引入全局文件（图标）
// import "./router/limit";  //导入 路由守卫



Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueCompositionApi);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
