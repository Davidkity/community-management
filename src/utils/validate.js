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

/**
 * 纯数字验证
 */
export function validateMath(value){
    let reg = /[1-9]\d*/;
    return reg.test(value) ? true : false;
}

/**
 * 验证手机号
 */
export function vaildatePhone(value){
    let reg = /^1[3456789]\d{9}$/;
    return reg.test(value) ? true : false
     
}

/**
 * 验证身份证
 */
export function vaildateIdCard(value){
    let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
    return reg.test(value) ? true : false
     
}


