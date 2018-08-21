<!-- 阅卷页面 -->
<template>
  <div style="height:100%;background:#f0f2f5;">
    <div class="header">
      <img class="back-img" @click="back" src="../assets/images/return.png" alt="">
      <span class="paper-type">正常卷</span>
      <div class="line"></div>
      <span class="paper-num">阅卷量：{{totleNum}}</span>
      <div class="line"></div>
      <!-- <img class="edit-img"  src="../assets/images/read_paper/edit-active.png" alt=""> -->
      <img class="edit-img" :src="editImg" @click="editClick"  alt="">
      <img class="count-img" @click="showCount" src="../assets/images/read_paper/count.png" alt="">
      <span class="back-comment" @click="showBack">回评</span>
    </div>
    <div id="toolDom" class="option-btn" style="position:absolute; left:4%">
      <div v-show="editStatus" v-for="(item,index) in optionClass" :key="index" @click="optionClick(index)" v-bind:class="item" >
      </div>
      <div v-show="editStatus" v-drag class="tool"></div>
    </div>
    <div v-show="!noAnswer" class="answer-wrapper">
      <img v-bind:src="amswerImg"  class="anwer-img" alt="">
      <div v-for="(item,index) in answerOption" :class="item.type" v-text="item.value" :style="{top:item.top,left:item.left,width:item.width,transform: 'rotate('+(item.rotate)+'deg)'}"></div>
      <!-- <div class="text" style="left:20%;top:30%;">发生范德萨分</div> -->
      <div v-dragTwo class="input-wrapper" v-show="showText">
        <div class="circle"></div>
        <textarea @blur="textArea" id="areaText" v-model="textareaValue" rows="1" ></textarea>
        <div class="circle"></div>
      </div>
    </div>
    <div v-show="noAnswer" class="no-answer">
        <img src="../assets/images/read_paper/no_answer.png" alt="">
        <div>已无更多任务......</div>
    </div>
    <div class="footer">
      <div class="calc-wrapper">
        <div class="left left-container" id="scrollDiv" >
          <div class="left-con"  @click="chooseItem(index)" v-for="(item,index) in answerArr">
            <span :class="{active:item.active}">{{item.text}}</span> <span class="input" v-text="item.value"></span>
             <!-- <input type="text" v-model="item.value"  disabled> -->
          </div>
           <!-- <div class="left-con">
            <span >2</span><input type="text" disabled>
          </div>
           <div class="left-con">
            <span>3</span><input type="text" disabled>
          </div>
          <div class="left-con">
            <span>4</span><input type="text" disabled>
          </div> -->
          <!-- <div class="left-con">
            <span>5</span><input type="text">
          </div>
          <div class="left-con">
            <span>6</span><input type="text">
          </div> -->
        </div>
        <div class="right">
          <!-- <div class="right-con" >
            <span v-for="(item,index) in calcBtn.first" @click="calcScore(item)" :class="{active:item.active}">{{item.value}}</span>
          </div> -->
          <div class="right-con" >
             <!-- <p v-for="(val, key, index) in calcBtnTwo">{{val}}</p> -->
            <span v-for="(val, key, index) in calcBtnTwo"  v-if="key<6&&key!=0" @click="!val.disable &&calcScore(val)" :class="{active:val.active,disabled:val.disable}">{{val.value}}</span>
          </div>
          <div class="right-con" style="padding-top:2px;">
            <span v-for="(val, key, index) in calcBtnTwo"  v-if="key>5" @click="!val.disable &&calcScore(val)" :class="{active:val.active,disabled:val.disable}">{{val.value}}</span>
            <span v-for="(val, key, index) in calcBtnTwo"  v-if="key==0" @click="!val.disable &&calcScore(val)" :class="{active:val.active,disabled:val.disable}">{{val.value}}</span>
            <!-- <span v-for="(item,index) in calcBtn.second" @click="!item.disable && calcScore(item)" :class="{active:item.active,disabled:item.disable}">{{item.value}}</span> -->
            <!-- <span class="active">6</span><span>7</span><span>8</span><span  class="disabled">9</span><span class="disabled">0</span> -->
          </div>
          <!-- <div class="right-con" style="padding-top:2px;">
            <span class="danger">异常</span><span class="danger">零分</span><span class="danger">满分</span><span  class="primary">+0.5</span><span class="primary">提交</span>
          </div> -->
          <div class="right-con" style="padding-top:2px;">
            <span @click="jumpNext(1)"  class="danger flex-1">异常</span>
            <span @click="jumpNext(2)" class="danger flex-1">零分</span>
            <span @click="jumpNext(3)" class="danger flex-1">满分</span>
            <span @click="jumpNext(4)" v-show="showHalf" class="primary flex-1">+0.5</span>
            <span @click="jumpNext(5)" v-show="showHalf" class="primary flex-1">提交</span>
            <span @click="jumpNext(5)" v-show="!showHalf"   class="primary flex-2">提交</span>
          </div>
        </div>
      </div>
    </div>
    <back-comment  :show-back="showStatus" @onchange="changeBack"></back-comment>
    <favorite-list :path="favPoth" :paper="paperId"  :show-fav="showFav" @onchange="changeFav"></favorite-list>
    <my-count :other-name="otherName" :to-show="isShow" @onchange="changeStatus"></my-count>
    <alert-tem :is-show="alertShow" :alert-text="alertText" @onchange="change"></alert-tem>
  </div>
</template>

<script>
import {getAngle,numToArr,isInArray,numToArrTwo} from '../assets/js/util.js'
import { GetPersonInfoInDB,GetItemInfo,GetUnMarkBuffer,submitSmart } from "../api/api.js"
import AlloyFinger from 'alloyfinger'
import Transform from 'css3transform'


import myCount from './myCount';
import backComment from './backComment';
import favoriteList from './favoriteList';
import alert from './alert/alert';

export default {
  data () {
    return {
      alertText:'',
      alertShow:false,
      totleNum:'', //阅卷量
      showImg:[],  //显示图片
      whichImg:0,  //当前第几张图片
      showHalf:false, //是否显示加0.5
      noAnswer:false,  //是否显示没有题目
      favPoth:'',  //收藏需要的path
      paperId:'',   //收藏的paperid
      isShow:false,
      showStatus:false,
      showFav:false,
      showText:false,
      textareaValue:'',
      isScroll:true,
      id:'',
      editStatus:false,
      editImg : require('../assets/images/read_paper/edit.png'),
      index:0,  //第几个输入框
      answerOption:[],
      saveOption:[], //撤回 前进保存
      // {
      //   type:"right",
      //   top:"10px",
      //   left:"12px"
      // },{
      //   type:"error",
      //   top:"80px",
      //   left:"92px"
      // },{
      //   type:"right",
      //   top:"60px",
      //   left:"62px"
      // },{
      //   type:"right",
      //   top:"90px",
      //   left:"62px"
      // },{
      //   type:"line",
      //   top:"190px",
      //   left:"162px",
      //   width:"200px",
      //   rotate:"10"
      // }
       calcBtnTwo:{
        "1":{
          value:1,
          active:false,
          disable:false
        },
        "2":{
          value:2,
          active:false,
          disable:false
        },
        "3":{
          value:3,
          active:false,
          disable:false
        },
        "4":{
          value:4,
          active:false,
          disable:false
        },
        "5":{
          value:5,
          active:false,
          disable:false
        },
        "6":{
          value:6,
          active:false,
          disable:false
        },
        "7":{
          value:7,
          active:false,
          disable:false
        },
        "8":{
          value:8,
          active:false,
          disable:false
        },
        "9":{
          value:9,
          active:false,
          disable:true
        },
        "0":{
          value:0,
          active:false,
          disable:true
        }
      },
      calcBtn:{
        first:[{
          value:1,
          active:false,
          disable:true
        },{
          value:2,
          active:false,
          disable:true
        },{
          value:3,
          active:false,
          disable:true
        },{
          value:4,
          active:false,
          disable:true
        },{
          value:5,
          active:false,
          disable:true
        }],
        second:[{
          value:6,
          active:false,
          disable:false
        },{
          value:7,
          active:false,
          disable:false
        },{
          value:8,
          active:false,
          disable:false
        },{
          value:9,
          active:false,
          disable:true
        },{
          value:0,
          active:false,
          disable:true
        }],
        third:[{
          value:'异常',
          active:true,
          disable:false
        },{
          value:'零分',
          active:true,
          disable:false
        },{
          value:'满分',
          active:true,
          disable:false
        },{
          value:'提交',
          active:true,
          disable:false
        }]
      },
      answerArr:[],
      // answerArr:[{
      //   text:'1',
      //   value:'',
      //   active:true,
      //   length:'2',
      //   max:'12'
      // },{
      //   text:'2',
      //   value:'',
      //   active:false,
      //   length:'1',
      //   max:'5'
      // },{
      //   text:'3',
      //   value:'',
      //   active:false,
      //   length:'2',
      //   max:'32'
      // },{
      //   text:'4',
      //   value:'',
      //   active:false,
      //   length:'1',
      //   max:'9'
      // }],
      optionClass:[{
        'active':true,
        'move-img':true
      },{
        'active':false,
        'yes-img':true
      },{
        'active':false,
        'close-img':true
      },{
        'active':false,
        'line-img':true
      },{
        'active':false,
        'text-img':true
      },{
        'active':false,
        'fav-img':true
      },{
        'active':false,
        'back-img':true
      },{
        'active':false,
        'restart-img':true
      }],
      af:'', //
      amswerImg:"",
      optionType:'',
      disableArr:[], //需要隐藏的按钮index,
      finalAnswerArr:{
        // examid:"EXAM115",
        // subjectid:33,
        // userid:1658,
        // taskid:9129,
        // vtime:600,
        // itemid:1,
        // score:4,
        // subscore:"2,2",
        // memo:"",
        // ann:"",
        // chkcode:593018
      },
      downLoadTime:'',
      otherName:""
    };
  },
  mounted() {
      // this.$nextTick(function(){
        
      // })
      //   document.getElementById("areaText").focus();
      // })
      var _this = this;
      var oMove = document.getElementsByClassName("answer-wrapper")[0];
      var poxXStart,poxYStart,poxXend,poxYend,linePosition={};
      oMove.addEventListener('touchstart', function(ev) {
        ev.preventDefault();
        var posX= ev.changedTouches[0].clientX;
        var posY= ev.changedTouches[0].clientY;
        poxXStart = ev.changedTouches[0].clientX;
        poxYStart = ev.changedTouches[0].clientY;
        console.log(posY);
        console.log(document.getElementsByClassName("anwer-img")[0].offsetTop)
        console.log(document.getElementsByClassName("anwer-img")[0].offsetTop*1+document.getElementsByClassName("anwer-img")[0].offsetHeight*1)
        if (posY>=document.getElementsByClassName("anwer-img")[0].offsetTop-70&&posY<=document.getElementsByClassName("anwer-img")[0].offsetTop*1+document.getElementsByClassName("anwer-img")[0].offsetHeight*1-80) {
          linePosition ={
            top:posY-oMove.offsetTop,
            left:posX
          }
          console.log(_this.optionType)
          if (_this.optionType&&_this.optionType!=="line"&&_this.optionType!=="text") {
            _this.answerOption.push({
              type:_this.optionType,
              top:posY-oMove.offsetTop-15+'px',
              left:posX-10+'px'
            })
          }
        }
        function drowLine(ev) {
          poxXend= ev.changedTouches[0].clientX>oMove.offsetWidth?oMove.offsetWidth:ev.changedTouches[0].clientX;  //限制画线区域X
          poxYend= ev.changedTouches[0].clientY>395?395:ev.changedTouches[0].clientY<140?140:ev.changedTouches[0].clientY;  //限制划线区域Y
          var sqrtValue = Math.pow((poxXend-poxXStart),2)+Math.pow((poxYend-poxYStart),2)
          var lineWidth = Math.floor(Math.sqrt(sqrtValue));
          console.log(lineWidth)
          var angle = getAngle(poxXStart,poxYStart,poxXend,poxYend)-90;  //旋转角度
          console.log(angle)
          if (lineWidth>10) {
            _this.answerOption.push({
              type:"line",
              top:linePosition.top+'px',
              left:linePosition.left+'px',
              width:lineWidth+'px',
              rotate:angle
            })
          }
          
          
          oMove.removeEventListener('touchend',drowLine,false);  //删除事件
        }
        if (_this.optionType == 'line') {
          oMove.addEventListener('touchend',drowLine,false);
        }
      })
      document.getElementById('scrollDiv').addEventListener('scroll', function(event) {
        event.preventDefault();
      });
      this.AlloyFinger(); //图片绑定移动缩放事件
  },
  components:{
    myCount:myCount,
    backComment:backComment,
    favoriteList:favoriteList,
    alertTem:alert
  },
  directives: {
    drag: {
      // 指令的定义
      inserted: function (el) {
          var oDiv= document.getElementById("toolDom");
          var oMove = document.getElementsByClassName("tool")[0];
          var clientWidth = document.documentElement.clientWidth;
          oMove.addEventListener('touchstart', function(ev) {
            ev.preventDefault();
            // console.log(ev)
            var touch = event.targetTouches[0]
            var disX=touch.clientX-oDiv.offsetLeft;
            var disY=touch.clientY-oDiv.offsetTop;
            // console.log(touch.clientX)
            oMove.addEventListener('touchmove', function(event) {
              event.preventDefault();
              // console.log(document.documentElement.clientWidth)
              console.log(oDiv.offsetTop)
              // console.log(oDiv.offsetLeft)
              var touch = event.targetTouches[0];
              var l=touch.clientX-disX;
              var t=touch.clientY-disY;
              oDiv.style.left=l+'px';
              oDiv.style.top=t+'px';
            }.bind(this),false);
            oMove.addEventListener('touchend', function(event) {
                // console.log(event)
                if (oDiv.offsetLeft<0 || oDiv.offsetWidth+oDiv.offsetLeft>clientWidth) {
                  var l='4%';
                };
                if (oDiv.offsetTop<60 || oDiv.offsetTop>400) {
                    oDiv.style.top= '50px';
                };
                // console.log(disX)
                oDiv.style.left=l;
            }.bind(this),false);
         },false);
      }
    },
    dragTwo: {   //输入框
      // 指令的定义
      inserted: function (el) {
          var oDiv = document.getElementsByClassName("answer-wrapper")[0];
          var oMove = document.getElementsByClassName("input-wrapper")[0];
          var clientWidth = document.documentElement.clientWidth;
          oMove.addEventListener('touchstart', function(ev) {
              console.log(ev)
            ev.preventDefault();
             var touch = event.targetTouches[0];
            var areaLeft = touch.clientX-oMove.offsetLeft;
            oMove.addEventListener('touchmove', function(event) {
              event.preventDefault();
              var touch = event.targetTouches[0];
              var t=touch.clientY-oDiv.offsetTop;
              oMove.style.left=touch.clientX-areaLeft+'px';
              console.log(touch.clientY,oDiv.offsetTop)
              oMove.style.top=t+'px';
              if (touch.clientY<150) {
                  console.log("+++++")
                  oMove.style.top='90px';
              } else if (touch.clientY>360) {
                  oMove.style.top='305px';
              };
              console.log(oMove.offsetWidth+oMove.offsetLeft>clientWidth)
              if (oMove.offsetLeft<0) {
                oMove.style.left='0px';
              } else if( oMove.offsetWidth+oMove.offsetLeft>clientWidth){
                oMove.style.left=clientWidth-oMove.offsetWidth+'px';
              }
            }.bind(this),false);
            oMove.addEventListener('touchend', function(event) {
              // if (oDiv.offsetLeft<0 || oDiv.offsetWidth+oDiv.offsetLeft>clientWidth) {
              //     var l='4%';
              //   };
                
                // console.log(disX)
                // oDiv.style.left=l;
              console.log(document.getElementById("areaText"))
                document.getElementById("areaText").focus();
            }.bind(this),false);
         },false);
      }
    }
  },
  methods: {
    change() {
      this.alertShow = !this.alertShow;
      this.$router.push({
        path: '/login'
        // path: '/blocklist'
      })
    },
    chooseItem(index){   //单个选择
      this.isScroll =false;
      this.answerArr.map((item,index)=>{
        item.active = false;
      });
      this.answerArr[index].active = true;
      this.answerArr[index].value = '';
      this.index =index;
      this.disableArr = this.disableBtn();//点击对应得item

    },
    textArea(){
      var oMove = document.getElementsByClassName("input-wrapper")[0];
      this.answerOption.push({
        type:'text',
        top:oMove.offsetTop+'px',
        left:oMove.offsetLeft+'px',
        value:this.textareaValue
      });
      this.showText =false;
      this.textareaValue = '';
    },
    AlloyFinger(){
      var _this = this;
      let swordEle = document.getElementsByClassName('answer-wrapper')[0];
      console.log(swordEle)
      let bwidth, bheight, swidth, sheight;
      // bwidth = swordEle.offsetWidth;
      // bheight = swordEle.offsetHeight;
      Transform(swordEle);
      var initScale = 1;
      this.af = new AlloyFinger(swordEle, {
        touchStart: function (evt) {
          // console.log(evt)
        },
        touchMove: function (evt) {
          swordEle.style.translateX += evt.deltaX;
          swordEle.style.translateY += evt.deltaY;
          evt.preventDefault();
        },
        touchEnd: function () {
          console.log('end')
          console.log(swordEle.style.transform)
        },
        touchCancel: function () {
          console.log('cancel')
        },
        multipointStart: function () {
          initScale = swordEle.scaleX;
        },
        multipointEnd: function () {
        },
        tap: function () {
        },
        doubleTap: function () {
        },
        longTap: function () {
        },
        singleTap: function () {
        },
        rotate: function (evt) {
          // swordEle.rotateZ += evt.angle;
        },
        pinch: function (evt) {
          alert(swordEle.scaleX)
          alert(initScale * evt.scale)
          swordEle.scaleX = swordEle.scaleY = initScale * evt.scale;
        },
        pressMove: function (evt) {
          let widthDiff = bwidth - swidth;
          let heightDiff = 100;
          console.log('diff' + evt.deltaX)
          console.log('translateX:' + swordEle.translateX  + '  ' + swordEle.translateY )
          if (((evt.deltaX>0)&&(swordEle.translateX >=0))||((evt.deltaY>0)&&(swordEle.translateY >= heightDiff))||((swordEle.translateX<0)&&((evt.deltaX<0)))||((swordEle.translateY<0)&&((evt.deltaY<0)))) {
           
            // var divWidth = document.getElementsByClassName("answer-wrapper")[0].offsetWidth;
            // if(swordEle.translateX<Math.floor(divWidth/2)*-1) {
            //   swordEle.translateX = Math.floor(divWidth/2)*-1;
            // } else if (swordEle.translateX>Math.floor(divWidth/2)) {
            //   swordEle.translateX = Math.floor(divWidth/2);
            // } else {
              swordEle.translateX += evt.deltaX;
            // }
          } else {
            swordEle.translateX += evt.deltaX;
            swordEle.translateY += evt.deltaY;
          }

          // console.log('pressmve:' + swordEle.translateX)
          // console.log('pressmve:' + swordEle.translateY)
        },
        swipe: function (evt) {
         console.log("swipe" + evt.direction);
        }
      });
    },
    calcScore(item) {  
      this.isScroll =true;  //是否自动滚动   
      console.log(this.index)
      var optArr =  this.calcBtnTwo;
      for(var key in optArr){  
         console.log(optArr[key])  
         optArr[key].active = false;
      }   
      item.active = true;
      // console.log(item);
      //给左侧输入框赋值
      this.inputAnswer(item.value);
    },
    inputAnswer(val,type=""){
      if(type==1) { //零分
        this.answerArr[this.index].value = 0
      } else if(type==2) { //满分
        this.answerArr[this.index].value = this.answerArr[this.index].max;
      } else if(type==3) {  //加0.5
        this.answerArr[this.index].value = this.answerArr[this.index].value*1+0.5*1;
      } else {
         this.answerArr[this.index].value += val;
      }
      // console.log(this.index)
     
      this.disableArr = this.disableBtn();
      
      // this.changeInput();
    },
    showBack() {
      this.showStatus =true;
    },
    changeFav() { //回评
      this.showFav =!this.showFav;
    },
    changeBack(){
      this.showStatus =!this.showStatus;
    },
    changeStatus(val) {
      this.isShow =!this.isShow;
    },
    showCount() {
      console.log(this.isShow)
      this.isShow =true;
    },
    editClick() {
      // if (this.af) {
      //   this.af = this.af.destroy();
      // } else {
      //   this.AlloyFinger();
      // }
      
      this.editStatus =!this.editStatus;
      if (this.editStatus) {
        this.editImg = require('../assets/images/read_paper/edit-active.png')
      } else {
        this.editImg = require('../assets/images/read_paper/edit.png')
      }
     
    },
    optionClick(index){
      if (this.af) {
        this.af = this.af.destroy();
        document.getElementsByClassName('answer-wrapper')[0].style.transform ="perspective(500px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
      }
      console.log(this.disableBtn)
      console.log(index === 1);
      if (index !== 4 ) {
        this.showText=false;
      }
      if (index === 0 ) {  //移动
        this.optionType = "";
        this.AlloyFinger();
      } else if (index === 1 ){  //打勾
        this.optionType = "right";
      } else if (index === 2 ){ //打叉
        this.optionType = "error";
      } else if (index === 3 ){ //划线
        this.optionType = "line";
      } else if (index === 4 ){  //输入文字
        this.showText=true;
        this.optionType = "text";
      } else if (index === 5 ){  //收藏
        this.showFav =!this.showFav;
      } else if (index === 6 ){  //撤回
        if (this.answerOption.length!==0) {
          this.saveOption.push(this.answerOption.pop());
        }
      } else if (index === 7 ){  //前进
        if (this.saveOption.length!==0) {
          this.answerOption.push(this.saveOption.pop());
        }
      }
     
      this.optionClass.map((item,index)=>{
        item.active = false;
      });
      this.optionClass[index].active = true;
      if (index === 6 || index === 7){
        setTimeout(()=>{
           this.optionClass[index].active = false;
        },200);
      }
    },
    changeInput(){   //左侧输入框变化
     
    },
    toScroll(){
      var totalHeight = (document.getElementsByClassName('left-con')[0].offsetHeight+5)*this.answerArr.length
      var eachHeight = document.getElementsByClassName('left-con')[0].offsetHeight;
      var conHeight = document.getElementsByClassName('left-container')[0].clientHeight;
      var scrollHeight = document.getElementsByClassName('left-container')[0].scrollTop+5;
      if (totalHeight> conHeight+scrollHeight){
        scrollHeight+=eachHeight;
        document.getElementsByClassName('left-container')[0].scrollTop = scrollHeight;
      }
    },
    back(){
      this.$router.go(-1)
    },
    addActive(){
      this.answerArr.map((item,index)=>{
        item.active = false;
      });
      this.answerArr[this.index].active = true;
    },
    autoScroll(){
      var arr = this.answerArr;
      for (var i=this.index+1;i<arr.length;i++ ) {
        console.log(arr[i])
        if(arr[i].value.length==2 || arr[i].value>arr[i].max.slice(0,1)|| arr[i].value.length==arr[i].max.length){
          this.index+=1;
          this.addActive();
        }
      }
    },
    jumpNext(type){
      if(type==1) { //异常
        // this.inputAnswer(item.value);
      } else if(type==2){  //零分
        this.inputAnswer(0,1);
      } else if(type==3){  //满分
        this.inputAnswer(this.answerArr[this.index].max,2);
      } else if(type==4){ //加0.5
        this.inputAnswer(0.5,3);
      } else if(type==5){

      }
      
      // this.nextAnswer();
    },
    changeAnswer(){  //已无任务
      this.noAnswer =true;
      this.answerArr.map(function(item,index){
          item.active=false;
          item.value='';
      });
      for(var key in this.calcBtnTwo){  
      //  console.log(key);
        this.calcBtnTwo[key].disable = true;
      } 
    },
    nextAnswer(){
      // return new Promise(resolve=>{
        // if (this.id<this.showImg.length-1) {
        // this.$router.push({
        //   path: `/readPaper/${(this.id*1+1)}`,
        // });
        // this.submitToSmart()
       
          // console.log(res)
          this.index = 0;
          this.submitToSmart().then((res)=>{

           
            
            console.log(this.showImg)
            console.log(this.whichImg)

            this.answerOption=[];
            this.saveOption=[];
            this.whichImg+=1;
            if (this.whichImg>this.showImg.length-1) {
              this.changeAnswer();
              return;
            }
            this.amswerImg = this.showImg[this.whichImg].Path1;
            this.favPoth = this.showImg[this.whichImg].Path1;
            this.paperId = this.showImg[this.whichImg].Paperid;

            //切换工具条选中
            this.optionClass.map((item,index)=>{
              item.active = false;
            });
            this.optionType = '';
            this.optionClass[0].active=true;
            // this.AlloyFinger(); //图片绑定移动缩放事件

            this.answerArr.map(function(item,index){
                if (index==0) {
                  item.active=true;
                } else {
                  item.active=false;
                }
                item.value='';
            });
           
            this.disableArr = this.disableBtn();
          });
        
              
      // } else {
      //   this.$router.push({
      //     path: `/readPaper/${0}`,
      //   });
      // }
      // })
     
    },
    disableBtn(type){
      var arr = this.answerArr;
      
      //计算index
      console.log(arr[this.index].value.toString()==="0")
     console.log(arr[this.index].value)
      //添加背景颜色
      console.log(this.showHalf,arr[this.index].value.length==arr[this.index].max.length)
      if(arr[this.index].value.toString()==="0"||!this.showHalf&&arr[this.index].value && arr[this.index].value>arr[this.index].max|| !this.showHalf&&arr[this.index].value>arr[this.index].max.slice(0,1)||!this.showHalf&&arr[this.index].value.length==arr[this.index].max.length||arr[this.index].value>=arr[this.index].max) {
        this.index+=1;
        for(var key in this.calcBtnTwo){  
        //  console.log(key);
          this.calcBtnTwo[key].active = false;
        } 
        this.autoScroll(); 
        console.log(this.index,this.answerArr.length)
        if (this.index==this.answerArr.length) {
          // var totle=0;
          // console.log(this.index,this.answerArr.length,'+++++++++++')
          // this.answerArr.map(function(item,index){
          //   console.log(item.value)
          //   totle+=item.value*1;
          // });
            this.nextAnswer();
            return numToArrTwo(arr[this.index].allowValue);
          // alert('总分'+totle)
        }
      } else if (arr[this.index].value.toString().indexOf(".")!==-1||arr[this.index].value.length==arr[this.index].max.length&&this.showHalf ) {
        // alert()
          return [];
      }
      this.addActive();
      if(arr[this.index].value) {
          if(arr[this.index].max.length==2||arr[this.index].value>=arr[this.index].max.slice(0,1)) {
            return numToArr(arr[this.index].max.slice(1),true);
          } else if(this.showHalf){
            return []
          } else {
            return numToArr(10,true)
          }
      } else {
        arr[this.index].allowValue.map((item,index)=>{
          // console.log(item)
          if(item == 0.5) {
            this.showHalf =true;
          }
        });
        if (arr[this.index].max>=9) {
          return numToArr(10,false)
        }else {
          return numToArrTwo(arr[this.index].allowValue)
        }
      }
      // console.log(this.answerArr)
      // for(var i=0,len=this.answerArr.length;i<len;i++){
      //   var ele = this.answerArr[i];
      //   if(!ele.value) {
      //     // console.log(ele.max)
      //     if(ele.max.length==2) {
      //       return numToArr(10)
      //     } else {
      //       return numToArr(ele.max)
      //     }
      //   } else {
      //     // console.log(ele.value)
      //     if (ele.value.length<2 &&ele.max.length>1 ) {
      //       if (ele.value>ele.max.slice(0,1)) {
      //         // console.log("-----------------------------")
      //           if(this.answerArr[i+1].max.length==2) {
      //             return numToArr(10)
      //           } else {
      //             return numToArr(this.answerArr[i+1].max)
      //           }
      //       } else{
      //         // console.log("this")
      //         return numToArr(ele.max.slice(1))
      //       }
      //     }
      //   }
      // };
    },
    getImgList(){
      // {examid:"EXAM115",subjectid:"33",userid:"32860B1228CDAF94",itemid:"1",tasktype:"N",iFetchRoleid:0,iProblem:0,isFirst:1,checkcode:"107805"}
      var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      var param = {
        examid:sessObj.examid,
        subjectid:sessObj.subjectid,
        userid:sessObj.userid,
        itemid:sessObj.itemid,
        tasktype:"N",
        iFetchRoleid:0,
        iProblem:0,
        isFirst:0,
        checkcode:sessObj.chkcode
      };
      GetUnMarkBuffer(param).then((res)=>{
        if(res.d.length == 0){
          this.changeAnswer();
          return;
        }
        this.showImg = res.d;
        console.log(this.showImg)
        this.amswerImg = this.showImg[this.whichImg].Path1;
        this.favPoth = this.showImg[this.whichImg].Path1;
        this.paperId = this.showImg[this.whichImg].Paperid;
        
        this.downLoadTime = new Date();
      })
    },
    getItemInfo(){
      // {examid:"EXAM115",subjectid:"33",itemid:"1"}
      var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      var param = {
        examid:sessObj.examid,
        subjectid:sessObj.subjectid,
        itemid:sessObj.itemid
      }
      GetItemInfo(param).then((res)=>{
        console.log(res)
        this.otherName=res.d[0][0];
        console.log(this.otherName)
        res.d.map((item,index)=>{
          console.log(item == 0.5);
          this.answerArr.push({
            text:item[1],
            value:'',
            active:true,
            length:item[item.length-1].length,
            allowValue:item.slice(2),
            max:item[item.length-1]
          });
          console.log(this.answerArr);
          this.disableArr = this.disableBtn();
        });
        // 0"22"  1"22_1"  2"0"  3"2"
      //   answerArr:[{
      //   text:'1',
      //   value:'',
      //   active:true,
      //   length:'2',
      //   max:'12'
      // },
      })
    },
    getPersonInfo(){
      // {examid:"EXAM115",subjectid:"33",userid:"1658",itemid:"1"}
      var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      console.log(sessObj);
      var param = {
        examid:sessObj.examid,
        subjectid:sessObj.subjectid,
        itemid:sessObj.itemid,
        userid:sessObj.u
      };
      console.log(param);
      GetPersonInfoInDB(param).then((res)=>{
        console.log(res.d.split("@"))
        this.totleNum = res.d.split("@")[1]+' / '+ res.d.split("@")[4]
      })
    },
    optionCon(){
      console.log(this.answerOption);
      var con='';
      // right$x$y$	
      this.answerOption.map((item,index)=>{
        if(item.type == "line") {
          con+=item.type+'$'+parseInt(item.left)+'$'+(parseInt(item.top)-80)+'$'+parseInt(item.width)+ "\t";
        } else {
          con+=item.type+'$'+parseInt(item.left)+'$'+(parseInt(item.top)-80)+'$'+ "\t";
        }
        
      });
      return con;
    },
    submitToSmart(){
      // {examid:"EXAM115",subjectid:33,userid:1658,taskid:9132,
      // vtime:9,
      // itemid:1,
      // score:0,
      // subscore:"0,0",
      // memo:"",ann:"right$50$3$	right$94$2$",chkcode:593018}
      //  var timeUsed = Math.floor((new Date() - DownLoadTime) / 1000);
      return new Promise((resolve)=>{
        var timeUsed = Math.floor((new Date() - this.downLoadTime) / 1000);
        if (timeUsed >= 600) {
            timeUsed = 600;
        } else if (timeUsed < 0) { //防止用户修改本地计算机时间
            timeUsed = 40;
        };
        var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
        console.log(sessObj);
        var subscore = [];
        var score = 0;
        this.answerArr.map((item,index)=>{
          subscore.push(item.value);
          score += item.value*1;
        });
        console.log(this.showImg[this.whichImg])
        var param = {
          examid:sessObj.examid,
          subjectid:sessObj.subjectid,
          itemid:sessObj.itemid,
          userid:sessObj.u,
          vtime:timeUsed,
          taskid:this.showImg[this.whichImg].Taskid,
          subscore:subscore.join(","),
          memo:"",
          score:score, //总分
          chkcode:sessObj.chkcode,
          ann:this.optionCon() //收集操作划线信息
        };
        // var parms = "{examid:\"" + param.examid + "\",subjectid:" + param.subjectid + ",userid:" + sessObj.u +
        //                    ",taskid:" + this.showImg[this.whichImg].Taskid + ",vtime:" + timeUsed + ",itemid:" + sessObj.itemid
        //                    + ",score:" + score + ",subscore:\"" + subscore.join(",")
        //             + "\",memo:\"" + '' + "\",ann:\"" + this.optionCon() + "\",chkcode:" + sessObj.chkcode + "}";
        submitSmart(param).then((res)=>{
          if (res.d == 0) {
                this.alertText = "提交过程发生错误,来自:func_submit";
                this.alertShow = true;
                // alert("提交过程发生错误,来自:func_submit");
                return;
            }
            if (res.d == -1) {
                this.alertText = "账号被别人占用,请重新登录并设置密码，或联系管理员";
                this.alertShow = true;
                // alert("账号被别人占用,请重新登录并设置密码，或联系管理员");
                return;
            }
            if (res.d == -2) {
                this.alertText = "评卷人离开太久，为安全起见，系统要求您重新登录";
                this.alertShow = true;
                // alert("评卷人离开太久，为安全起见，系统要求您重新登录");
                return;
            }
            if (res.d == 2) {
                // if ($("#stage").val() != "正评") {
                //     alert("请注意：系统从此开始进入正评阶段！");
                // }
            }
            resolve(res);
        })
      })
     
    }
  },
  created() {
    this.getItemInfo();
    this.getPersonInfo();
    this.getImgList();
    this.id = this.$route.params.id;
    // console.log(this.disableArr);
  },
  computed:{
     
  },
  watch: {
    index(){
      if (this.isScroll){
        this.toScroll();
      }
      
    },
    disableArr(pre,next){
      console.log(next)
      console.log(pre);
      for(var key in this.calcBtnTwo){  
      //  console.log(key);
        this.calcBtnTwo[key].disable = false;
        if (!isInArray(key,pre)) {
          this.calcBtnTwo[key].disable = true;
        }
      } 
    },
    '$route' (to, from) {  
      if(to.params.id !==from.params.id) {
        location.reload();
      }
    }  
  }
}

</script>
<style lang="scss" scoped>
.no-answer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55%;
  flex-direction: column;
  div {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 700;
  }
}
.flex-1 {
  flex: 1;
}
.flex-2 {
  flex:0 0 39.8% !important;
}
.footer {
  position: fixed;
  bottom: 0;
  background-color: #fff;
  width: 100%;
  .calc-wrapper {
    display: flex;
    width:100%;
    height: 151px;
    .left {
      // flex: 0 0 80px;
      margin-top: 8px;
      margin-bottom: 3px;
      overflow:scroll;
      .left-con {
        padding-left:16px;
        padding-right:5px;
        display: flex;
        align-items: center;
        border:0;
        margin-bottom: 6px;
        
        span {
          height: 29px;
          line-height: 29px;
          padding: 0 8px;
          color: #fff;
          background-color: #a1a2a6;
          display: inline-block;
          border-radius: 5px 0 0 5px;
          margin-right: 0;
          &.active {
            background-color: #ff9000;
          }
        }
        .input {
          border: none;
          outline: none;
          height: 29px;
          color:#000;
          display: inline-block;
          border-radius: 0 5px 5px 0;
          width: 25px;
          padding-left: 13px;
          margin-left: 0;
          font-weight:bold;
          background-color: #e1e3e6;
        }
      }
    }
    .right {
      flex: 1;
      .right-con {
        display: flex;
        padding-top: 8px;
        padding-right: 16px;
        span {
          display: inline-block;
          flex: 1;
          height: 47px;
          color: #fff;
          background-image: url('../assets/images/read_paper/btn.png');
          background-size: cover;
          background-position: center bottom;
          background-repeat: no-repeat;
          line-height: 45px;
          text-align: center;
          border-radius: 5px;
          &.active {
            height: 44px;
            margin-top: 3px;
            background-image: url('../assets/images/read_paper/btn-active.png');
          }
          &.disabled {
            background-image: url('../assets/images/read_paper/btn-no.png');
          }
          &.danger {
            height: 37px;
            line-height:35px;
            background-image: url('../assets/images/read_paper/btn-danger.png');
          }
          &.danger-active {
            background-image: url('../assets/images/read_paper/btn-danger-active.png');
          }
          &.primary {
            height: 37px;
            line-height:35px;
            background-position-y: 93%;
            background-image: url('../assets/images/read_paper/btn-primary.png');
          }
          &:not(:last-child) {
            margin-right: 2px;
          }
        }
      }
    }
  }
  
}
.answer-wrapper {
  height: 64%;
  position:relative;
  z-index:0;
  .input-wrapper {
    position:fixed;
    top: 40%;
    left:35%;
    width:160px;
    .circle {
      width:8px;
      height:8px;
      border:2px solid #fff;
      border-radius:50%;
      background-color:#000;
      position:absolute;
      top:50%;
      transform:translateY(-50%);
      &:nth-of-type(1) {
        left:-5px;
      }
      &:nth-of-type(2) {
        right:-3px;
      }
    }
    textarea {
      color:#000;
      text-shadow:1px 1px 1px #999;
      background:rgba(255,255,255,0.1);
      width:147px;
      overflow-y:scroll;
      resize:none;
      outline:none;
      line-height: 16px;
      padding: 5px 4px;
      border-radius:8px;
      border: 1px solid #a1a2a6;
    }
    
  }
  .right {
    position:absolute;
    width:25px;
    height:25px;
    background: url('../assets/images/read_paper/right.png') no-repeat center;
    background-size: contain;
  }
  .error {
    position:absolute;
    width:20px;
    height:20px;
    background: url('../assets/images/read_paper/error.png') no-repeat center;
    background-size: contain;
  }
  .line {
    position:absolute;
    width:200px;
    height:2px;
    border-radius:3px;
    background-color:#ff7a00;
    transform-origin: top left;
  }
  .text {
    position:absolute;
    color:#ff7a00;
    font-size:15px;
    max-width: 30%;
    word-wrap: break-word;
  }
  img {
    height: 255px;
    width: 100%;
    transform: translateY(-50%);
    margin-top: 58%;
  }
}
.header {
  height: 50px;
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: .9rem;
  font-weight: bold;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .back-img {
    margin-left: 8px;
    width: 8px;
  }
  .edit-img,.count-img {
    margin-left: -14px;
    
    width: 9vw;
    &:nth-of-type(3){
      margin-right: -10px;
    }
  }
  .paper-num {
    margin: 0 -10px;
  }
  .back-comment {
    color: #ff8719;
    margin-right: 10px;
  }
  .line {
    width: 1px;
    background: #f0f2f5;
    height: 66%;
  }
}
.option-btn {
  margin: 10px auto 60px;
  height: 40px;
  width: 92%;
  display: flex;
  justify-content: center;
  border-radius: 5px;
  z-index:1;
  
  div {
    flex: 1;
    margin-right: 2px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    transition: background-image .3s linear;  
  }
  .move-img{
    border-radius:3px 0 0 3px;
    margin-right: 1px;
    background-image: url('../assets/images/read_paper/move.png');
    &.active{
      background-image: url('../assets/images/read_paper/move-active.png');
    }
  }
  .yes-img{
    background-image: url('../assets/images/read_paper/yes.png');
    &.active{
      background-image: url('../assets/images/read_paper/yes-active.png');
    }
  }
  .close-img{
    background-image: url('../assets/images/read_paper/close.png');
    &.active{
      background-image: url('../assets/images/read_paper/close-active.png');
    }
  }
  .line-img{
    background-image: url('../assets/images/read_paper/line.png');
    &.active{
      background-image: url('../assets/images/read_paper/line-active.png');
    }
  }
  .text-img{
    background-image: url('../assets/images/read_paper/text.png');
    &.active{
      background-image: url('../assets/images/read_paper/text-active.png');
    }
  }
  .fav-img{
    background-image: url('../assets/images/read_paper/fav.png');
    &.active{
      background-image: url('../assets/images/read_paper/fav-active.png');
    }
  }
  .back-img{
    background-image: url('../assets/images/read_paper/back.png');
    &.active{
      background-image: url('../assets/images/read_paper/back-active.png');
    }
  }
  .restart-img{
    background-image: url('../assets/images/read_paper/restart.png');
    &.active{
      background-image: url('../assets/images/read_paper/restart-active.png');
    }
    margin-right: 0px;
  }
  .tool{
    border-radius:0 3px 3px 0;
    background-image: url('../assets/images/read_paper/tool.png');
    background-repeat: no-repeat;
  }
}
</style>
