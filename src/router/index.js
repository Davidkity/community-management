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
    path: "/community",
    name: "Community",
    redirect: "index",
    meta: {
      name: "小区管理",
      icon: "plot"
    },
    component: Layout,
    children:[
      // 我的小区
      {
        path: "/index",
        name: "Index",
        meta: {
          name: "我的小区",
          icon: "my-plot"
        },
        component: () => import("../views/Community/myPlot.vue")
      },
      // 小区管理
      {
        path: "/plotManage",
        name: "PlotManage",
        meta: {
          name: "小区管理",
          icon: "my-plot"
        },
        component: () => import("../views/Community/plotManage.vue")
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
      // 单元管理页面
      {
        path: "/unit",
        name: "Unit",
        meta: {
          name: "单元信息",
          icon: "unit"
        },
        component: () => import("../views/Jewel/unit.vue")
      },
      // 房屋管理页面
      {
        path: "/house",
        name: "House",
        meta: {
          name: "房屋信息",
          icon: "house"
        },
        component: () => import("../views/Jewel/house.vue")
      },
      /**
       * 添加房屋 AddHouse
       */
      {
        path: "/addHouse",
        name: "AddHouse",
        hidden: true,
        meta: {
          name: "添加房屋",
          icon: "house"
        },
        component: () => import("../views/Jewel/components/addHouse.vue")
      },
      /**
       * 房屋费用项 AddHouse
       */
      {
        path: "/houseCostItem/:houseId",
        name: "HouseCostItem",
        hidden: true,
        meta: {
          name: "房屋费用项",
          icon: "house"
        },
        component: () => import("../views/Jewel/houseCostItem.vue")
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
      },
      // 业主入住房屋管理页面
      {
        path: "/userCheckIn/:userId",
        name: "UserCheckIn",
        hidden: true,
        meta: {
          name: "业主入住房屋",
          icon: "bind"
        },
        component: () => import("../views/User/components/checkInHouse.vue")
      }
    ]
  },

  /**
   * 业主管理
   */
  {
    path: "/expense",
    name: "Expense",
    meta: {
      name: "费用管理",
      icon: "user"
    },
    component: Layout,
    children:[
      // 业主信息管理页面
      {
        path: "/expenseSet",
        name: "ExpenseSet",
        meta: {
          name: "费用设置",
          icon: "user-info"
        },
        component: () => import("../views/Expense/expenseSet.vue")
      },
    ]
  },



 /**
   * 系统管理
   */
  {
    path: "/sysSet",
    name: "SysSet",
    meta: {
      name: "系统管理",
      icon: "user"
    },
    component: Layout,
    children:[
      // 费用项设置
      {
        path: "/costItemSet",
        name: "CostItemSet",
        meta: {
          name: "费用项设置",
          icon: "user-info"
        },
        component: () => import("../views/SysSet/costItemSet.vue")
      },
    ]
  }

  













 
];

const router = new VueRouter({
  routes
});

export default router;
