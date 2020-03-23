

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

export function formatDate(fmt, date){
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      var dateTime = new Date(date);
       var data = new Date(date);
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),                //秒   
        "q+": Math.floor((dateTime.getMonth() + 3) / 3), //季度   
        "S": dateTime.getMilliseconds()
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
      }
      return fmt;
    

}