import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

// 引入布局组件
import Layout from "@/views/Layout/index.vue";

const routes = [
  /**
   * app的主界面
   */
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  /**
   * 登录
   */
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import("../views/Login/index.vue")
  },
  /**
   * 主控制台
   */
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      name: "小区管理",
      icon: "plot"
    },
    component: Layout,
    children:[
      // 主控制台首页
      {
        path: "/index",
        name: "Index",
        meta: {
          name: "我的小区",
          icon: "my-plot"
        },
        component: () => import("../views/Console/index.vue")
      }
    ]
  },
  /**
   * 资产管理台
   */
  {
    path: "/jewel",
    name: "Jewel",
    meta: {
      name: "资产管理",
      icon: "jewel"
    },
    component: Layout,
    children:[
      // 楼栋管理页面
      {
        path: "/build",
        name: "Build",
        meta: {
          name: "楼栋信息",
          icon: "build"
        },
        component: () => import("../views/Jewel/build.vue")
      },
      // 楼栋管理页面
      {
        path: "/unit",
        name: "Unit",
        meta: {
          name: "单元信息",
          icon: "unit"
        },
        component: () => import("../views/Jewel/unit.vue")
      },
      // 楼栋管理页面
      {
        path: "/house",
        name: "House",
        meta: {
          name: "房屋信息",
          icon: "house"
        },
        component: () => import("../views/Jewel/house.vue")
      }
    ]
  },
  
  /**
   * 业主管理
   */
  {
    path: "/user",
    name: "User",
    meta: {
      name: "业主管理",
      icon: "user"
    },
    component: Layout,
    children:[
      // 业主信息管理页面
      {
        path: "/userInfo",
        name: "UserInfo",
        meta: {
          name: "业主信息",
          icon: "user-info"
        },
        component: () => import("../views/User/userInfo.vue")
      },
      // 业主成员管理页面
      {
        path: "/userMember",
        name: "UserMember",
        meta: {
          name: "业主成员",
          icon: "user-member"
        },
        component: () => import("../views/User/userMember.vue")
      },
      // 绑定业主管理页面
      {
        path: "/userBind",
        name: "UserBind",
        meta: {
          name: "业主绑定",
          icon: "bind"
        },
        component: () => import("../views/User/userBind.vue")
      }
    ]
  },














 
];

const router = new VueRouter({
  routes
});

export default router;
