
import { AddBuild } from "@/api/adminApi/home"
import { GetBuildList } from "../../api/adminApi/home"


const state = {

}

const getters = {

}

const mutations = {

}

const actions = {

    addBuild(content, requestData){
        return new Promise((reoslve, reject) => {
            console.log("到达 addBuild 方法");
            // AddBuild(requestData).then(response  => {
            //     console.log("到达 addBuild 方法");
            //     console.log(response);
            //     reoslve(response);
            // }).catch(error => {
            //     reject(error);
            // })
        })
    },

    getBuildInfo(content, requestData){
        console.log("到达 getBuildInfo 方法")
        return new Promise((reoslve, reject) => {
            GetBuildList(requestData).then(response => {
                reoslve(response);
            }).catch(error => {
                reject(error);
            })
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