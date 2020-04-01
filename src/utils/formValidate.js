
import { vaildatePhone, vaildateIdCard } from "./validate";
// 验证是否为空
export function validateEmpty(fieldName, value, callback){
    if (value === "") {
        return callback(new Error(fieldName + '不能为空'));
    }else{
        return callback();
    } 
    
}

// 验证手机号
export function validateFormPhone(fieldName, value, callback){
    
    if (value === "") {
        return callback(new Error(fieldName + '不能为空'));
    }else if(!vaildatePhone(value)){
        return callback(new Error('手机号格式不对'));
    }else{
        return callback();
    }
    
    
}
// 验证身份证
export function validateFormIdCard(fieldName, value, callback){
    if (value === "") {
        return callback(new Error(fieldName + '不能为空'));
    }else if(!vaildateIdCard(value)){
        return callback(new Error('身份证格式不对'));
    }else{
        return callback();
    }
    
    
}
// 验证年龄
export function validateFormAge(value, callback){
    if (!value) {
        return callback(new Error('年龄不能为空'));
    }
    setTimeout(() => {
        if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
    } else {
        if (value < 18) {
            callback(new Error('必须年满18岁'));
        } else if(value > 110) {
            callback(new Error('年龄不能大于110'));
        }else{
            callback();
        }
    }
    }, 10);
}

// 验证整数数字
export function validateNumber(fieldName, value, callback){
    if (!value) {
        return callback(new Error(fieldName + '不能为空'));
    }
    if (value == 0){
        return callback(new Error(fieldName + '不能为零'));
    }
    setTimeout(() => {
        if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
        }else{
            callback();
        }
    }, 10);
}