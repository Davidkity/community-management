/**
 * 过滤特殊字符
 */
export function stripscript(str){
    var rs = "";
    for (var i = 0; i < str.length; i++){
        rs = rs + str.substr(i,1).replace(/[`～*~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={ }|《》？：“”【】、；‘’，。、]/g,'');
    }
    return rs;
}

/**
 * 验证邮箱
 */
export function validateEmail(value){
    let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if(!reg.test(value)){
        return false;
    }else{
        return true;
    }
}

/**
 * 验证密码 6-20为的字母 + 数字
 */
export function validatePass(value){
    let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    if(!reg.test(value)){
        return false;
    }else{
        return true;
    }
}



/**
 * 验证验证码 6为的字母 或 数字
 */
export function validateCodeValue(value){
    // let reg = /^[a-zA-Z0-9]{6}$/;
    let reg = /^([a-zA-Z]|[0-9]){6}$/;
    return reg.test(value) ? true : false;
}



