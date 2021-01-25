//获取随机字符串  年月日开头
exports.getRandomString = function (){
  let date = new Date();//实例一个时间对象；
  let year = date.getFullYear()+'';//获取系统的年；
  let month = date.getMonth()+1+'';//获取系统月份，由于月份是从0开始计算，所以要加1
  let day = date.getDate()+'';
  let temparr = ['a','b','c','d','e','f','m','h','i','k','w'];
  let str = '';
  for(let i = 0;i<=10;i++){
    let randomNumber = Math.floor(Math.random() * 10) + 1;
    let randStr = '';
    if(i%2 === 0){
        randStr = temparr[randomNumber]
    }else{
        randStr = randomNumber;
    }
    str += randStr;
  }
  return year+month+day+str;
}
