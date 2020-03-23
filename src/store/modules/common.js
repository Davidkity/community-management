

const state = {
    uploadUrl: "http://localhost:8080/upload-images/"
}
const getters = {
    uploadUrl: state => state.uploadUrl
}
const actions = {  // 可以回调处理事情 
   
}


export default {
    namespaced: true,
    state,
    getters,
    actions
};