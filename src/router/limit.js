
import router from "./index"
import store from "../store/index"

import { getToKen, removeToKen, removeUsername } from "@/utils/app";

const whiteRouter = ["/login"];  //IndexOf 方法，判断数组中是否存在指定的某个对象,若不存在，则返回 -1

/**
 * 路由守卫
 * to: 下一个页面，要进入的页面
 * from： 上一个页面，离开之前的页面
 */
router.beforeEach((to, from, next) => {
    
    if(getToKen()){
        console.log("存在");
        if(to.path === "/login"){
            removeToKen();
            removeUsername();
            store.commit("app/SET_TOKEN", "");
            store.commit("app/SET_USERNAME", "");
            next();
        }else{
            next();
        }
        
    }else {
        console.log("不存在");
        if(whiteRouter.indexOf(to.path) !== -1) {  //存在
            next();
        }else {
            next("/login");
        }
    }
})
