
import { Login } from "@/api/adminApi/login";
import { setToKen, removeToKen, setUserName, getUsername, removeUsername } from "@/utils/app";

const state =  {
    // html5 本地存储
    isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
    // cookie 存储数据
    // isCollapse: JSON.parse(Cookie.get("isCollapse")) || false,
    // count
    toKen: "",
    username: getUsername() || ""
}

const getters = {// 相当于computed
    // count: state => state.count + 10
    // username: state.username
    

}

const mutations = {// 同步函数 使用  root.$store.commit("SET_COUNT",100) 调用
    SET_COLLAPSE(state){ 
        state.isCollapse = !state.isCollapse;
        // html5本地存储
        sessionStorage.setItem("isCollapse",JSON.stringify(state.isCollapse));
        //cookie存储
        // Cookie.set("isCollapse",JSON.stringify(state.isCollapse));
    },
    SET_TOKEN(state, value){
        state.toKen = value;
    },
    SET_USERNAME(state, value){
        state.username = value;
    },

    

}

const actions = {
    setMenuStatus(content, data){
        content.commit("SET_COLLAPSE");
    },
    login(content, requestData) {
        return new Promise((reoslve, reject) => {
            Login(requestData).then((response) => {
                let data = response.data.data;
                content.commit("SET_TOKEN",data.token);
                content.commit("SET_USERNAME",data.username);
                setToKen(data.token);
                setUserName(data.username);
                reoslve(response);
            }).catch(error => {
                reject(error);
            })
        })
    },
    exit({ commit }){
        return new Promise((reoslve, reject) => {
            removeToKen();
            removeUsername();
            commit("SET_TOKEN","");
            commit("SET_USERNAME","");
            reoslve();
        })
        
    }
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}