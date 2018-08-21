/**
 * 时间戳转时间
 */
export function chabgeTime(timestamp) {
  console.log(timestamp)
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  Y = date.getFullYear() + '-';
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  D = date.getDate()<10 ? '0'+date.getDate()+ ' ' : date.getDate()+ ' ';
  h = date.getHours() + ':';
  m = date.getMinutes() + ':';
  s = date.getSeconds();
  return Y+M+D;
}

/**
 * 计算角度
 */
export function getAngle(px,py,mx,my){//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
  var x = Math.abs(px-mx);
  var y = Math.abs(py-my);
  var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
  var cos = y/z;
  var radina = Math.acos(cos);//用反三角函数求弧度
  var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度

  if(mx>px&&my>py){//鼠标在第四象限
      angle = 180 - angle;
  }

  if(mx==px&&my>py){//鼠标在y轴负方向上
      angle = 180;
  }

  if(mx>px&&my==py){//鼠标在x轴正方向上
      angle = 90;
  }

  if(mx<px&&my>py){//鼠标在第三象限
      angle = 180+angle;
  }

  if(mx<px&&my==py){//鼠标在x轴负方向
      angle = 270;
  }

  if(mx<px&&my<py){//鼠标在第二象限
      angle = 360 - angle;
  }

  return angle;
}

/**
 * 生成可用数组
 */
export function numToArr(num,type) {
  
  var arr = [0,1,2,3,4,5,6,7,8,9];
  if (!type) {
    if (num==10) {
      return arr;
    } else {
      return [0]
    }
   
  }
  if (num == "0") {
    return [0];
  } else if (num == "1") {
    arr.splice(1+1);
    return arr;
  } else if (num == "2") {
    arr.splice(2+1);
    return arr;
  } else if (num == "3") {
    arr.splice(3+1);
    return arr;
  } else if (num == "4") {
    arr.splice(4+1);
    return arr;
  } else if (num == "5") {
    arr.splice(5+1);
    return arr;
  } else if (num == "6") {
    arr.splice(6+1);
    return arr;
  } else if (num == "7") {
    arr.splice(7+1);
    return arr;
  } else if (num == "8") {
    arr.splice(8+1);
    return arr;
  } else if (num == "9") {
    arr.splice(9+1);
    return arr;
  } else{
    return arr;
  }
}


/**
 * 生成可用数组
 */
export function numToArrTwo(num) {
  // console.log(num);
  var arr= [];
  num.map((item,index)=>{
    if (typeof (item*1) === 'number' && item%1 === 0) {
      if (item<10) {
        arr.push(item);
      }
     
    }
  });
  // console.log(arr)
  return arr;
}


/**
 * 获取个位值数组
 */
export function getOneArr(arr) {   //获取个位值数组
  var oneArr = [];
  if (arr.length != 0) {
    arr.map((item)=>{
      oneArr.push(item.substr(0,1))
    })
  }
  return Array.from(new Set(oneArr));
}

/**
 * 获取个位值数组
 */
export function getTwoArr(arr) {   //获取个位值数组
  var twoArr = [];
  if (arr.length != 0) {
    arr.map((item)=>{
      console.log(parseInt(item))
      twoArr.push(parseInt(item).substr(1,2))
    })
  }
  console.log(Array.from(new Set(twoArr)))
  return Array.from(new Set(twoArr));
}

/**
 * 根据十位显示值
 */
export function getTypeNum(arr,num) {   //根据十位显示值
  var oneArr = [];
  if (arr.length != 0) {
    arr.map((item)=>{
      if (item.substr(0,1) == num) {
        console.log(parseInt(item))
        oneArr.push(parseInt(item).toString().substr(1,2))
      }
    })
  }
  console.log(Array.from(new Set(oneArr)))
  return Array.from(new Set(oneArr));
}
/**
 * 生成可用数组
 */
export function isInArray(val,arr) {
  for(var i=0;i<arr.length;i++){
		if(arr[i]==val){
			return true;
    }
  }
  return false;
}
