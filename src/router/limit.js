
import router from "./index"
import store from "../store/index"

import { getToKen, removeToKen, removeUsername, getUserId, removeUserId, setCommunity, getCommunity, removeCommunity } from "@/utils/app";

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
            removeUserId();
            removeCommunity()
            store.commit("app/SET_TOKEN", "");
            store.commit("app/SET_USERNAME", "");
            store.commit("app/SET_USERID", "");
            store.commit("app/SET_COMMUNITY", "");
            next();
        }else{
            // 本地用户id为空，则去 cookie 中拿取 id
            if(store.getters['app/id'] == ""){
                let id = getUserId()
                let communityCookie = getCommunity();
                console.log("communityCookie: " + store.getters['app/community'])
                store.commit("app/SET_USERID", id);
                if(store.getters['app/community'] === ""){
                    store.dispatch("community/getCommunity",{id: id}).then(response => {
                        console.log("jinlia")
                        let communityData = response.data.data;
                        // 把 小区 code 过滤出来
                        let community = communityData.map(item => item.code);
                        store.commit("app/SET_COMMUNITY", community[0]);
                        setCommunity(community[0]);
                    })
                }
            }
            
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
