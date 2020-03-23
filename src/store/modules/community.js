
import { GetCommunity } from "@/api/adminApi/login";

const state = {
    
}
const getters = {
   
}
const actions = {  // 可以回调处理事情 
   
    getCommunity(content, requestData) {
        return new Promise((reoslve, reject) => {
            GetCommunity(requestData).then((response) => {
                reoslve(response);
            }).catch(error => {
                reject(error);
            })
        })
    },
}


export default {
    namespaced: true,
    state,
    getters,
    actions
};