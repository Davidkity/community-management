import { MessageBox } from "element-ui";

import { ref } from "@vue/composition-api";

export function global(){
    const str = ref("");
    
    const confirm = (params) => {
        MessageBox.confirm(params.context, params.tip || '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: params.type || "warning",
            center: true
        }).then(() => {
            // 调用函数(方法)，函数里面有接口
            params.fn && params.fn(params.id)    //当params.fn 为true的时候，才会执行函数 params.fn() 
            // if(params.fn){
            //     params.fn();
            // }
            // root.$message({
            //     type: 'success',
            //     message: '删除成功!'
            // });
        }).catch(() => {
            root.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
    }

    return {
        str,
        confirm
    }
}