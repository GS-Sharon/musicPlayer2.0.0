// 存放公共函数库
// 格式化为可用歌词
export default {
    getGeciArr (data) {
            //1. 总数据先变数组
            var arr = data.split("\n");
            // 2.挑选歌词数据变数组
            var arr1 = [];
            for(var i=0; i<arr.length; i++) {
                //获取中括号内的内容
                var idx = arr[i].indexOf("]");
                var time = arr[i].substring(1,idx);
                var content = arr[i].substring(idx + 1);
                // 如果中括号内的是时间进程并且转换为秒数
                var reg = /\d{2}\:\d{2}\.\d{2}/g;
                if(reg.test(time)) {
                    var min = +time.substring(0,time.indexOf(":"));
                    var totalSeconds = min * 60 + parseFloat(time.substring(time.indexOf(":") + 1));
                    arr1.push({"time":totalSeconds,"content": content});
                }
            }
            return arr1;
        }
}