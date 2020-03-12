

/**
 * 格式化日期
 */
export function timestampToTime(timestamp) {
    console.log("日期格式化");
    let now = new Date(timestamp*1000);
    let year = now.getFullYear();    
    let month = now.getMonth()+1;    
    let date = now.getDate();    
    let hour = now.getHours();    
    let minute = now.getMinutes();    
    let second = now.getSeconds();    
    return year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;
}