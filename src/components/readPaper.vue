<!-- 阅卷页面 -->
<template>
  <div style="height:100%;background:#f0f2f5; display:flex;flex-direction: column;">
    <img v-bind:src="amswerImgTwo" alt="" id="imgRotai" style="position:fixed;top:-999999999px;z-index:-999;">
    
    <div class="header">
      <img class="back-img" @click="back" src="../assets/images/return.png" alt="">
      <span class="paper-type" v-text="paperType"></span>
      <div class="line"></div>
      <span class="paper-num">阅卷量：{{totleNum}}</span>
      <div class="line"></div>
      <!-- <img class="edit-img"  src="../assets/images/read_paper/edit-active.png" alt=""> -->
      <img class="edit-img" :src="editImg" @click="editClick"  alt="">
      <img class="count-img" @click="showCount" src="../assets/images/read_paper/count.png" alt="">
      <span class="back-comment" @click="showBack">回评</span>
    </div>
    <!-- <div id="showError"></div> -->
    <div id="toolDom" class="option-btn" style="">
      <div v-show="editStatus" v-for="(item,index) in optionClass" :key="index" @click="optionClick(index)" v-bind:class="item" >
      </div>
      <div v-show="editStatus" v-drag class="tool"></div>
    </div> 
    <!-- <select name="" v-show="!noAnswer&&!abnormalStatus" id="abnormal" @change="selectChange($event)">
      <option value="1" selected>看不清</option>
      <option value="2">非本题</option>
      <option value="3">答错题</option>
      <option value="4">无法判断</option>
    </select>  -->
    <p style="position:fixed;top:38%;width:100%;text-align:center;color:#ccc;" id="toNormal">双击恢复图片位置</p>
    <div v-show="!noAnswer" class="answer-wrapper">
      <div style="position:relative;"  class="anwer-img">
        <img v-bind:src="amswerImg"  alt="">
        <div v-for="(item,index) in answerOption" :class="item.type" v-text="item.value" :style="{top:item.top,left:item.left,width:item.width,transform: 'rotate('+(item.rotate)+'deg)'}"></div>
        <!-- <div class="text" style="left:20%;top:30%;">发生范德萨分</div> -->
        <div v-dragTwo class="input-wrapper" v-show="showText">
          <div class="circle"></div>
          <textarea  id="areaText" v-model="textareaValue" rows="1" ></textarea>
          <div class="circle"></div>
        </div>
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
            <span @click="!abnormalStatus&&!noAnswer&&jumpNext(1)" id="abnormalBtn" :class="{'disabled-btn':abnormalStatus,'danger':!abnormalStatus,'flex-1':true}">异常</span>
            <span @click="!noAnswer&&jumpNext(2)" class="danger flex-1">零分</span>
            <span @click="!noAnswer&&jumpNext(3)" class="danger flex-1">满分</span>
            <span @click="!noAnswer&&!halfStatus&&jumpNext(4)" v-show="showHalf" :class="{'disabled-btn':halfStatus,'primary':!halfStatus,'flex-1':true}">+0.5</span>
            <span @click="!noAnswer&&jumpNext(5)" v-show="showHalf" class="primary flex-1">提交</span>
            <span @click="!noAnswer&&jumpNext(5)" v-show="!showHalf"   class="primary flex-2">提交</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 异常 -->
    
    <back-comment  :show-back="showStatus" @onback="commentBack" @onchange="changeBack"></back-comment>
    <favorite-list :path="favPoth" :paper="paperId"  :show-fav="showFav" @onchange="changeFav"></favorite-list>
    <my-count :other-name="otherName" :to-show="isShow" @onchange="changeStatus"></my-count>
    <alert-tem :is-show="alertShow" :alert-text="alertText"  @onchange="change"></alert-tem>

     <vue-pickers
      :show="showPicker"
      :columns="columns"
      :defaultData="defaultData"
      :selectData="pickData"
      @cancel="close"
      @confirm="confirmFn"></vue-pickers>
  </div>
</template>

<script>
import {getAngle,numToArr,isInArray,numToArrTwo,getOneArr,getTwoArr,getTypeNum} from '../assets/js/util.js'
import { GetPersonInfoInDB,GetItemInfo,GetUnMarkBuffer,submitSmart,PopTaskAll } from "../api/api.js"
import AlloyFinger from 'alloyfinger'
import Transform from 'css3transform'


import myCount from './myCount';
import backComment from './backComment';
import favoriteList from './favoriteList';
import alert from './alert/alert';

import vuePickers from 'vue-pickers'

export default {
  data () {
    return {
      showPicker: false,
      columns: 1,
      //  <option value="1" selected>看不清</option>
      // <option value="2">非本题</option>
      // <option value="3">答错题</option>
      // <option value="4">无法判断</option>
      defaultData: [
        {
          text: '看不清',
          value: 1
        }
      ],
      pickData: {
        // 第一列的数据结构
        data1: [
          {
            text: '看不清',
            value: 1
          },
          {
            text: '非本题',
            value: 2
          },
          {
            text: '答错题',
            value: 3
          },
          {
            text: '无法判断',
            value: 4
          }
        ]
      },
      halfStatus:false,
      abnormalStatus:false,  //回评异常按钮灰
      paperType:'正常卷',//试卷类型
      alertText:'',
      alertShow:false,
      alertType:'',    // 1存在分数为空，无法提交  2存在非法分数，请重新选择后提交
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
      amswerImgTwo:'',
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
      otherName:"",
      timer:'',
      bufferLen:'',
      imgRotai:{
        width:'',
        height:''
      },   //原图片尺寸,
      mono:''
    };
  },
  mounted() {
    var _this =this;

    var lastClickTime = 0;
    var clickTimer;
    document.getElementsByClassName("answer-wrapper")[0].addEventListener('click', (event) => {
      var nowTime = new Date().getTime();
      if (nowTime - lastClickTime < 400) {
          /*双击*/
          lastClickTime = 0;
          clickTimer && clearTimeout(clickTimer);
          
          // document.getElementsByClassName('anwer-img')[0].style.transform ="perspective(500px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
          let swordEle = document.getElementsByClassName('anwer-img')[0];
          
          swordEle.translateX = 0;
          swordEle.translateY = 0;  
          swordEle.scaleX = 1; 
          swordEle.scaleY = 1; 
          // document.getElementById("showError").innerText = swordEle.style.transform;
          console.log(swordEle.style.transform) 
      } else {
          /*单击*/
          lastClickTime = nowTime;
          clickTimer = setTimeout(() => {
              // console.log('单击');
          }, 400);
      }
    });

    // document.body.addEventListener('dblclick', function () {  
    //   document.getElementsByClassName('anwer-img')[0].style.transform ="perspective(500px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
    //   let swordEle = document.getElementsByClassName('anwer-img')[0];
    //   swordEle.translateX = 0;
    //   swordEle.translateY = 0;
    // }, false);

    setTimeout(function(){
      var leftWidth = document.getElementsByClassName("left-container")[0].offsetWidth;
      var btnWidth = document.getElementById("abnormalBtn").offsetWidth;
      var btnHeight = document.getElementById("abnormalBtn").offsetHeight;
       console.log(leftWidth,btnWidth);
       document.getElementById("abnormal").style.left = leftWidth +'px';
       document.getElementById("abnormal").style.width = btnWidth +'px';
       document.getElementById("abnormal").style.height = btnHeight +'px';
    },500)
   
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    const nav = document.getElementsByClassName("footer")[0];
    console.log(nav)
    if(isAndroid) {
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        window.onresize = function () {
            const nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            if (document.activeElement.tagName == 'TEXTAREA') {
                if (clientHeight > nowClientHeight) {
                    //键盘弹出的事件处理
                    nav.style.bottom = '-50vw'
                }else {
                    nav.style.bottom = '0'
                }
            }
        }
    }
     
      var _this = this;
      var oMove = document.getElementsByClassName("anwer-img")[0];
      var poxXStart,poxYStart,poxXend,poxYend,linePosition={};
      oMove.addEventListener('touchstart', function(ev) {
        console.log(ev)
        if (ev.target.nodeName.toLowerCase() !== "textarea") {
          var oInput = document.getElementsByClassName("input-wrapper")[0];
          console.log(oInput.offsetTop,oInput.offsetLeft)
          _this.answerOption.push({
            type:'text',
            top:oInput.offsetTop+'px',
            left:oInput.offsetLeft+'px',
            value:_this.textareaValue
          });
          // this.showText =false;
          _this.textareaValue = '';
          _this.showText =false;
        }
        ev.preventDefault();
        var posX= ev.changedTouches[0].clientX;
        var posY= ev.changedTouches[0].clientY;
        poxXStart = ev.changedTouches[0].clientX;
        poxYStart = ev.changedTouches[0].clientY;
       
        console.log(posY,oMove)
        console.log(oMove)
        // return
        if (posY>=document.getElementsByClassName("anwer-img")[0].offsetTop*1&&posY<=document.getElementsByClassName("anwer-img")[0].offsetTop*1+document.getElementsByClassName("anwer-img")[0].offsetHeight*1) {
          linePosition ={
            top:posY-oMove.offsetTop,
            left:posX-document.getElementsByClassName("anwer-img")[0].offsetLeft*1
          }
          console.log(_this.optionType)
          if (_this.optionType&&_this.optionType!=="line"&&_this.optionType!=="text") {
            _this.answerOption.push({
              type:_this.optionType,
              top:posY-oMove.offsetTop-10+'px',
              left:posX-10-oMove.offsetLeft*1+'px'
            })
          }
        }
        function drowLine(ev) {
          var topY =document.getElementsByClassName("anwer-img")[0].offsetTop*1+document.getElementsByClassName("anwer-img")[0].offsetHeight*1;
          var topYTwo = document.getElementsByClassName("anwer-img")[0].offsetTop*1;
          console.log(ev.changedTouches[0].clientY,topY,topYTwo)
          //限制x轴区域
          if (ev.changedTouches[0].clientX>oMove.offsetLeft&&ev.changedTouches[0].clientX<oMove.offsetLeft*1+oMove.offsetWidth*1) {
            poxXend= ev.changedTouches[0].clientX;
          } else if (ev.changedTouches[0].clientX<oMove.offsetLeft) {
            poxXend= oMove.offsetLeft;
          } else if (ev.changedTouches[0].clientX>oMove.offsetLeft*1+oMove.offsetWidth*1) {
            poxXend= oMove.offsetLeft*1+oMove.offsetWidth*1;
          }
          // poxXend= ev.changedTouches[0].clientX>oMove.offsetWidth?oMove.offsetWidth:ev.changedTouches[0].clientX;  //限制画线区域X
          poxYend= ev.changedTouches[0].clientY>topY?topY:ev.changedTouches[0].clientY<topYTwo?topYTwo:ev.changedTouches[0].clientY;  //限制划线区域Y
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
      oMove.addEventListener('touchmove', function(ev) {
        document.getElementById("areaText").blur();
        const nav = document.getElementsByClassName("footer")[0];
        nav.style.bottom = '0';
      });
     
      this.AlloyFinger(); //图片绑定移动缩放事件
  },
  components:{
    myCount:myCount,
    backComment:backComment,
    favoriteList:favoriteList,
    alertTem:alert,
    vuePickers
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
            console.log(ev)
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
          var oDiv = document.getElementsByClassName("anwer-img")[0];
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

              oMove.style.top=t+'px';

              if (touch.clientY<oDiv.offsetTop*1) {
                  oMove.style.top='0px';
              } else if (touch.clientY>oDiv.offsetTop*1+oDiv.offsetHeight*1-30) {
                  oMove.style.top=oDiv.offsetHeight*1-30+'px';
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
              // console.log(document.getElementById("areaText"))
                document.getElementById("areaText").focus();
            }.bind(this),false);
         },false);
      }
    }
  },
  methods: {
    close() {
      this.showPicker = false
    },
    confirmFn(val) {
     
      this.showPicker = false;
      this.inputAnswer('',-1);
      // console.log(val)
      // this.defaultData = [val.select1]
    },
    toShow() {
      this.showPicker = true
    },
    dbImg() {
      console.log("+++")
    },
    commentBack(val){   //回评
      this.halfStatus =true;
      this.abnormalStatus =true;
      this.paperType = '回评卷';
      this.showStatus =!this.showStatus;
      // console.log(this.whichImg)
      this.showImg.unshift(val);
      console.log(val)
      this.amswerImg = this.showImg[this.whichImg].Path1;
      this.favPoth = this.showImg[this.whichImg].Path1;
      this.paperId = this.showImg[this.whichImg].Paperid;
      this.answerOption = [];

      var markScore = val.Subscore.split(",");
      this.answerArr.map((item,index)=>{
        item.value = markScore[index];
      })
      if (val.Anno) {
        val.Anno.split('\t').map((item,index)=>{
        // console.log(item)
        // console.log(item.split("$"))
        var optionInfo = item.split("$");
        var oImg = document.getElementsByClassName("anwer-img")[0];
        var rotaiWidth = oImg.offsetWidth/this.imgRotai.width;
        var rotaiHeight = oImg.offsetHeight/this.imgRotai.height;
        if(optionInfo[0]!=='line'&&optionInfo[1]) {
          // console.log(optionInfo[1])
          if (optionInfo[0] == 'text') {
            this.answerOption.push({
              type:optionInfo[0],
              top:optionInfo[2]*rotaiHeight+'px',
              left:optionInfo[1]*rotaiWidth+'px',
              value:optionInfo[3]
            })
          } else {
            this.answerOption.push({
              type:optionInfo[0],
              top:optionInfo[2]*rotaiHeight+'px',
              left:optionInfo[1]*rotaiWidth+'px'
            })
          }
        } else if(optionInfo[0]=='line'&&optionInfo[1]) {
          this.answerOption.push({
            type:optionInfo[0],
            top:optionInfo[2]*rotaiHeight+'px',
            left:optionInfo[1]*rotaiWidth+'px',
            width:optionInfo[3]*rotaiWidth+'px',
            rotate:optionInfo[4]
          })
        }
         
        })
      }
     
      this.disableArr = this.disableBtn('back');
      console.log(this.showImg)
    },
    change() {
      this.alertShow = !this.alertShow;
      // console.log(this.alertType != 1 , this.alertType != 2)
      if (this.alertType != 1 && this.alertType != 2) {
        this.$router.push({
          path: '/login'
          // path: '/blocklist'
        })
      }
      
    },
    chooseItem(index){   //单个选择
      this.halfStatus =false;
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
      
    },
    AlloyFinger(){
      var _this = this;
      let swordEle = document.getElementsByClassName('anwer-img')[0];
      
      let bwidth, bheight, swidth, sheight;
      // bwidth = swordEle.offsetWidth;
      // bheight = swordEle.offsetHeight;
      // swordEle.scaleX ="1.5"
      Transform(swordEle);
      var initScale = 1;
      this.af = new AlloyFinger(swordEle, {
        touchStart: function (evt) {
          // console.log(evt)
        },
        touchMove: function (evt) {
          swordEle.style.translateX += evt.deltaX;
          swordEle.style.translateY += evt.deltaY;
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
        rotate: function (evt) {
          // swordEle.rotateZ += evt.angle;
        },
        pinch: function (evt) {
          //  document.getElementById("showError").innerText= JSON.stringify(evt)

          swordEle.scaleX = swordEle.scaleY = initScale * evt.zoom;
        },
        pressMove: function (evt) {
          // console.log(evt)
          // document.getElementById("showError").innerText= JSON.stringify(evt)
          // let widthDiff = bwidth - swidth;
          // let heightDiff = 100;
          // if (((evt.deltaX>0)&&(swordEle.translateX >=0))||((evt.deltaY>0)&&(swordEle.translateY >= heightDiff))||((swordEle.translateX<0)&&((evt.deltaX<0)))||((swordEle.translateY<0)&&((evt.deltaY<0)))) {
          //     swordEle.translateX += evt.deltaX;
          //   // }
          // } else {
            swordEle.translateX += evt.deltaX;
            swordEle.translateY += evt.deltaY;
          // }

          // console.log('pressmve:' + swordEle.translateX)
          // console.log('pressmve:' + swordEle.translateY)
        },
        swipe: function (evt) {
        //  console.log("swipe" + evt.direction);
        }
      });
    },
    calcScore(item) {  
      this.isScroll =true;  //是否自动滚动   
      // console.log(this.index)
      var optArr =  this.calcBtnTwo;
      for(var key in optArr){  
        //  console.log(optArr[key])  
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
        if (this.index !== this.answerArr.length-1){
          this.index+=1;
          // this.showHalf
        } else {
          setTimeout(()=>{
            this.nextAnswer();
          },300)
        }
      } else if (type==-1) {
         this.answerArr[this.index].value ='';
         this.mono = 1;
          this.nextAnswerTwo();
      } else {
         this.answerArr[this.index].value += val;
      }
      
      // console.log(this.index)
      for(var key in this.calcBtnTwo){  
        //  console.log(key);
        this.calcBtnTwo[key].active = false;
      } 
      setTimeout(()=>{
        console.log('this.index:'+this.index)
        console.log(this.answerArr[this.index])
        this.disableArr = this.disableBtn();
      },100);
      
      
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
      // console.log(this.isShow)
      this.isShow =true;
    },
    editClick() {
      if(this.optionType) {
        this.AlloyFinger();
        this.optionType = "";
        this.optionClass.map((item,index)=>{
          item.active = false;
        });
        this.optionClass[0].active = true;
      }
      
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
        document.getElementsByClassName('anwer-img')[0].style.transform ="perspective(500px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
        let swordEle = document.getElementsByClassName('anwer-img')[0];
        swordEle.translateX = 0;
        swordEle.translateY = 0;
        swordEle.scaleX = 1; 
        swordEle.scaleY = 1; 
      }
      // console.log(index === 1);
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
        if (this.index >1) {  //大于4个item
          scrollHeight+=eachHeight;
          document.getElementsByClassName('left-container')[0].scrollTop = scrollHeight;
        }
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
      if (!arr[this.index+1].value) {
        this.index+=1;
        this.showHalf = this.checkIsHalf();  //判断下一个是否需要+0.5
      } else {
        var flag = true;
        for (var i=this.index+1;i<arr.length;i++ ) {
          if(arr[i].value.length==2 || arr[i].value>=arr[i].max.slice(0,1)|| arr[i].value.length==arr[i].max.length){
            if(!arr[i].value) {
              flag =false;
            }
            if (flag) {
              this.index+=1;
              this.addActive();
              if (this.index==arr.length-1&&arr[this.index].value) {
                this.nextAnswer()
              }
            }
          } 
        }
      };
      console.log('this.index:'+this.index)
    },
    selectChange(ev){
      // var oSelect = document.getElementById("abnormal");
      // for(var i=0;i<oSelect.options.length;i++) {  
      //   console.log('_)***')
      //   oSelect.options[i].selected = false;  
      // }  
      console.log(ev);
      // ev.srcElement.selectedIndex = -1;
      // $(this)[0].selectedIndex = -1;
      this.inputAnswer('',-1);
      // document.getElementById("abnormal").options.length = 0;
      // var text = ['-1','看不清','非本题','答错题','无法判断'];
      // text.map((item,index)=>{
      //   document.getElementById("abnormal").options.add(new Option(item,index+1))
      // });
      // document.getElementById("abnormal").options[0].style.display ="none";
      // document.getElementById("abnormal").options[0].selected = true;
      // document.getElementById("abnormal").options[0].setAttribute("selected",true)
     
    },
    jumpNext(type){
      if(type==1) { //异常
        this.showPicker =true;
        return
      } else if(type==2){  //零分
      this.answerArr.map((item,index)=>{
          item.value = 0;
        });
        setTimeout(()=>{
           this.nextAnswer();
        },300);
        // this.inputAnswer(0,1);
      } else if(type==3){  //满分
        // this.nextAnswer();
        this.answerArr.map((item,index)=>{
          item.value = item .max;
        });
        setTimeout(()=>{
           this.nextAnswer();
        },300);
        // console.log(this.answerArr)
        // this.inputAnswer(this.answerArr[this.index].max,2);
      } else if(type==4){ //加0.5
        this.inputAnswer(0.5,3);
      } else if(type==5){
        if(!this.answerArr[this.index].value&&this.answerArr[this.index].value.toString()!='0') {
            this.alertText = "存在分数为空，无法提交";
            this.alertShow = true;
            this.alertType = 1;
            return;
        }
        if (this.index == this.answerArr.length-1){ 
          for(var i=0; i<this.answerArr.length; i++){
            if(!this.answerArr[i].value){
              this.alertText = "存在分数为空，无法提交";
              this.alertShow = true;
              this.alertType = 1;
              return;
            } else {
              this.nextAnswer();
            }
          }
        } else {
          if(this.answerArr.length>1) {
            this.index+=1;
            this.disableArr = this.disableBtn();
            console.log(this.index)
          }
        }
       
        // console.log(this.index,this.answerArr.length)
        // if (this.index !== this.answerArr.length){
        //   console.log(this.answerArr[this.index].value)
        //   // return 
        //   if (!this.answerArr[this.index].value){
        //     this.alertText = "存在分数为空，无法提交";
        //     this.alertShow = true;
        //     return;
        //   } else {
        //     if(this.answerArr.length>1) {
        //       this.index+=1;
        //       this.disableArr = this.disableBtn();
        //       console.log(this.index)
        //     }
        //   }
        // }
        // this.nextAnswer();
      }
      
      // this.nextAnswer();
    },
    changeAnswer(){  //已无任务
      this.whichImg =0;
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
    toOrigin(){  //输入框 按键回复原状
      document.getElementsByClassName('left-container')[0].scrollTop = 0;
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
      for(var key in this.calcBtnTwo){  
        //  console.log(key);
        this.calcBtnTwo[key].active = false;
      } 
      this.disableArr = this.disableBtn();
    },
    nextAnswerTwo(){ //异常
      // return new Promise(resolve=>{
        // if (this.id<this.showImg.length-1) {
        // this.$router.push({
        //   path: `/readPaper/${(this.id*1+1)}`,
        // });
        // this.submitToSmart()
         
          // console.log(res)
          this.abnormalStatus =false;
          this.paperType = '正常卷';
          this.index = 0;
          this.submitToSmart().then((res)=>{
            this.answerOption=[];
            this.saveOption=[];
            // this.whichImg+=1;
            this.toOrigin();
            if (this.showImg.length==1) {
              // this.changeAnswer();
              this.getImgList();
              return;
            }

            this.showImg.shift();
            this.amswerImg = this.showImg[this.whichImg].Path1;
            this.favPoth = this.showImg[this.whichImg].Path1;
            this.paperId = this.showImg[this.whichImg].Paperid;

            this.disableArr = this.disableBtn();
          });
        
              
      // } else {
      //   this.$router.push({
      //     path: `/readPaper/${0}`,
      //   });
      // }
      // })
     
    },
    nextAnswer(){
      // return new Promise(resolve=>{
        // if (this.id<this.showImg.length-1) {
        // this.$router.push({
        //   path: `/readPaper/${(this.id*1+1)}`,
        // });
        // this.submitToSmart()
          var flag =true;
          
          this.answerArr.forEach((item,index)=>{
            if(!item.value&&item.value.toString() !=="0") {
              this.alertText = "存在分数为空，无法提交";
              this.alertShow = true;
              this.alertType = 1;
              flag = false;
            }
            var isAvail = false;
            item.allowValue.map((itemAllow)=>{
              if(item.value == itemAllow) {
                isAvail = true;
              }
            });
            // var max = Math.max.apply(Math, item.allowValue);
            // console.log(item.value,max );
            if(!isAvail) {
              this.alertText = '第'+(index+1)+"项存在非法分数，请重新选择后提交";
              this.alertShow = true;
              this.alertType = 2;
              flag = false;
            }
          })
          if (!flag) {
            flag = true;
            return
          }
          // console.log(res)
          this.abnormalStatus =false;
          this.paperType = '正常卷';
          this.index = 0;
          this.submitToSmart().then((res)=>{
            this.answerOption=[];
            this.saveOption=[];
            // this.whichImg+=1;
            this.toOrigin();
            if (this.showImg.length==1) {
              // this.changeAnswer();
              this.getImgList();
              return;
            }

            this.showImg.shift();
            this.amswerImg = this.showImg[this.whichImg].Path1;
            this.favPoth = this.showImg[this.whichImg].Path1;
            this.paperId = this.showImg[this.whichImg].Paperid;

            this.disableArr = this.disableBtn();
          });
        
              
      // } else {
      //   this.$router.push({
      //     path: `/readPaper/${0}`,
      //   });
      // }
      // })
     
    },
    checkIsHalf(){
      var flag = false;
      var nextValue= '';
      if (!this.answerArr[this.index].value) {
        nextValue = 0.5;
      } else {
        nextValue = this.answerArr[this.index].value*1+0.5;
      }
      this.answerArr[this.index].allowValue.map((item)=>{
      console.log(nextValue,item ,nextValue == item)
        if (nextValue == item) {
          flag = true;
        }
      })
      return flag
    },
    disableBtn(type){
      var arr = this.answerArr;
      this.showHalf = this.checkIsHalf();
      console.log("this.showHalf:"+this.showHalf)
      
     
      //计算index
      // console.log(arr[this.index].value.toString(),arr[this.index].value.length)
      //添加背景颜色
      // console.log(this.showHalf,arr[this.index].value.length==arr[this.index].max.length)
      if (type == "back") {  //回评
        // if(arr[this.index].value.length==arr[this.index].max.length ||arr[this.index].value>arr[this.index].max.slice(0,1)){
          return [];
        // }
      }
      // console.log(arr[this.index].value.toString()==="0",!this.showHalf&&arr[this.index].value && arr[this.index].value>arr[this.index].max, !this.showHalf&&arr[this.index].value>arr[this.index].max.slice(0,1),!this.showHalf&&arr[this.index].value.length==arr[this.index].max.length,arr[this.index].value>=arr[this.index].max)
      // console.log(arr[this.index].value*1>=arr[this.index].max*1,arr[this.index].value,arr[this.index].max)

      if(arr[this.index].value.toString()==="0"||!this.showHalf&&arr[this.index].value&&Number.isInteger(arr[this.index].value) && arr[this.index].value>arr[this.index].max|| !this.showHalf&&arr[this.index].value>arr[this.index].max.slice(0,1)&&Number.isInteger(arr[this.index].value*1)||!this.showHalf&&arr[this.index].value.length==arr[this.index].max.length||arr[this.index].value*1>=arr[this.index].max*1) {
        if(this.index == this.answerArr.length-1){
          this.nextAnswer();
          return [];
        }
        
       
        this.autoScroll(); 
        // console.log(this.index,this.answerArr.length)
        if (this.index==this.answerArr.length) {
          this.nextAnswer();
          return numToArrTwo(arr[this.index].allowValue);
        }
      } else if (arr[this.index].value.toString().indexOf(".")!==-1||arr[this.index].value.length==arr[this.index].max.length) {
          return [];
      }
      this.addActive();
      if(arr[this.index].value) {
          if(arr[this.index].max.length==2||arr[this.index].value>=arr[this.index].max.slice(0,1)) {
            // console.log(arr[this.index].value,arr[this.index].max.slice(0))
            // if (arr[this.index].value == arr[this.index].max.slice(0,1)) {  //输入了最大十位
              // return numToArr(arr[this.index].max.slice(1),true);
              return getTypeNum(arr[this.index].allowValue,arr[this.index].value);
            // } else if(arr[this.index].value < arr[this.index].max.slice(0,1)){  //存在两位且十位小于最大数的十位
            //   return getOneArr(arr[this.index].allowValue);
            // } else if(arr[this.index].value*1 > arr[this.index].max.slice(0,1)*1&&this.showHalf) {
            //   return [];
            // } else {
            //   return getTwoArr(arr[this.index].allowValue);
            //   // return numToArr(arr[this.index].max.slice(1),true);
            // }
          } else if(this.showHalf){
            return []
          } else {
            return getOneArr(arr[this.index].allowValue);
            // return numToArr(10,true)
          }
      } else {
        
        // arr[this.index].allowValue.map((item,index)=>{
        //   // console.log(item)
        //   this.showHalf = false;
        //   if(!Number.isInteger(item*1)) {
        //     this.showHalf =true;
        //   }
        // });
        // if (arr[this.index].max>=9) {
          // return numToArr(10,false)
          return getOneArr(arr[this.index].allowValue);
        // }else {
        //   return numToArrTwo(arr[this.index].allowValue)
        // }
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
        isFirst:1,
        checkcode:sessObj.chkcode
      };
      GetUnMarkBuffer(param).then((res)=>{
        if(res.d.length == 0){
          this.bufferLen = 0;
          this.changeAnswer();
          // {examid:"EXAM115",subjectid:33,userid:1658,itemid:1,fetchroleid:0 }
          // this.timer = setInterval(function(){
          //   PopTaskAll({examid:sessObj.examid,subjectid:sessObj.subjectid,userid:sessObj.userid,itemid:sessObj.itemid,fetchroleid:0 }).then((res)=>{
          //     console.log(res)
          //   })
          // },5000)
          return;
        } else {
          this.noAnswer =false;
          this.bufferLen = res.d.length;
          // this.disableArr = this.disableBtn();//点击对应得item
        }
       
        this.showImg = res.d;
        this.amswerImgTwo = this.showImg[this.whichImg].Path1;

        // console.log(document.getElementById("imgRotai"))
        this.getImgNatural(this.showImg[this.whichImg].Path1);
        // document.getElementById("imgRotai").onload = function () {
        this.amswerImg = this.showImg[this.whichImg].Path1;
        this.favPoth = this.showImg[this.whichImg].Path1;
        this.paperId = this.showImg[this.whichImg].Paperid;
        this.downLoadTime = new Date();
        // }
      })
    },
    getImgNatural(url){
      var img =new Image();
      img.src = url;
      img.onload =()=>{
        this.imgRotai.width = img.width;
        this.imgRotai.height = img.height;
        console.log(this.imgRotai)
      }
    },
    getItemInfo(){
      // {examid:"EXAM115",subjectid:"33",itemid:"1"}
      var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      var param = {
        examid:sessObj.examid,
        subjectid:sessObj.subjectid,
        itemid:sessObj.itemid
      }
      console.log(param)
      // {examid: "EXAM115", subjectid: "33", itemid: "22"}
      GetItemInfo(param).then((res)=>{
        console.log(res)
        this.otherName=res.d[0][0];
        // console.log(this.otherName)
        res.d.map((item,index)=>{
          // console.log(item == 0.5);
          this.answerArr.push({
            text:item[1],
            value:'',
            active:true,
            length:item[item.length-1].length,
            allowValue:item.slice(2),
            max:item[item.length-1]
          });
          // console.log(this.answerArr);
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
      // console.log(sessObj);
      var param = {
        examid:sessObj.examid,
        subjectid:sessObj.subjectid,
        itemid:sessObj.itemid,
        userid:sessObj.u
      };
      // console.log(param);
      GetPersonInfoInDB(param).then((res)=>{
        // console.log(res.d.split("@")[4]=='无限'?"∞":res.d.split("@")[4])
        var num1 = res.d.split("@")[1];
        var num2 = res.d.split("@")[4]=='无限'?"∞":res.d.split("@")[4]
        this.totleNum = num1+' / '+ num2;
        // console.log(num1,num2)
      })
    },
    optionCon(){
      // console.log(this.answerOption);
      var con='';
      // right$x$y$	
      var oImg = document.getElementsByClassName("anwer-img")[0];
      var rotaiWidth = this.imgRotai.width/oImg.offsetWidth;
      var rotaiHeight = this.imgRotai.height/oImg.offsetHeight;
      this.answerOption.map((item,index)=>{
        if(item.type == "line") {
          con+=item.type+'$'+parseInt(parseInt(item.left)*rotaiWidth)+'$'+parseInt(parseInt(item.top)*rotaiHeight)+'$'+parseInt(parseInt(item.width)*rotaiWidth)+'$'+parseInt(item.rotate)+ "\t";
        } else if(item.type == "text") {
          con+=item.type+'$'+parseInt(parseInt(item.left)*rotaiWidth)+'$'+parseInt(parseInt(item.top)*rotaiHeight)+'$'+item.value+ "\t";
        } else {
          con+=item.type+'$'+parseInt(parseInt(item.left)*rotaiWidth)+'$'+parseInt(parseInt(item.top)*rotaiHeight)+'$'+ "\t";
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
        // var flag =false;
        // this.answerArr.map((item,index)=>{
        //   // console.log(item.value.toString()=='')
        //   if (item.value.toString()=='') {
        //     // flag =true;
        //   }
        // });
        // if (flag&&this.mono !== 1) {
        //   this.alertText = "存在分数为空，无法提交";
        //   this.alertShow = true;
        //   return;
        // }
      //  console.log(this.showImg)
      return new Promise((resolve)=>{
        // console.log(this.whichImg,this.bufferLen-1)
        if(this.whichImg<=this.bufferLen-1)(
          resolve()
        );
        var timeUsed = Math.floor((new Date() - this.downLoadTime) / 1000);
        if (timeUsed >= 600) {
            timeUsed = 600;
        } else if (timeUsed < 0) { //防止用户修改本地计算机时间
            timeUsed = 40;
        };
        var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
        // console.log(sessObj);
        var subscore = [];
        var score = 0;
        this.answerArr.map((item,index)=>{
          subscore.push(item.value);
          score += item.value*1;
        });
        // console.log(this.showImg)
        // console.log(this.whichImg)
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
        
        var parms = "{examid:\"" + sessObj.examid + "\",subjectid:" + sessObj.subjectid + ",userid:" + sessObj.u +
                           ",taskid:" + this.showImg[this.whichImg].Taskid + ",vtime:" + timeUsed + ",itemid:" + sessObj.itemid
                           + ",score:" + score + ",subscore:\"" + subscore.join(",")
                    + "\",memo:\"" + this.mono + "\",ann:\"" + this.optionCon() + "\",chkcode:" + sessObj.chkcode + "}";
        submitSmart(parms).then((res)=>{

            this.mono = "";
            if (res.d == 0) {
                this.alertText = "提交过程发生错误,来自:func_submit";
                this.alertShow = true;
                // alert("提交过程发生错误,来自:func_submit");
                return;
            } else if (res.d == -1) {
                this.alertText = "账号被别人占用,请重新登录并设置密码，或联系管理员";
                this.alertShow = true;
                // alert("账号被别人占用,请重新登录并设置密码，或联系管理员");
                return;
            } else if (res.d == -2) {
                this.alertText = "评卷人离开太久，为安全起见，系统要求您重新登录";
                this.alertShow = true;
                // alert("评卷人离开太久，为安全起见，系统要求您重新登录");
                return;
            } else if (res.d == 2) {
                // if ($("#stage").val() != "正评") {
                //     alert("请注意：系统从此开始进入正评阶段！");
                // }
                this.getPersonInfo()
                // this.totleNum = this.totleNum.split('/')[0]*1+1+' / '+ this.totleNum.split('/')[1];
                resolve(res);
            }
           
        })
      })
     
    }
  },
  created() {
    this.getItemInfo();
    this.getPersonInfo();
    this.getImgList();
    this.id = this.$route.params.id;
    var obj = JSON.parse(sessionStorage.getItem("jumpObj"));
    document.title = '题块'+obj.itemid+' : '+obj.otherName;
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
    whichImg(pre,next){
      // console.log(this.whichImg==this.bufferLen-1,"++++++++++",this.whichImg,this.bufferLen-1)
      // if (this.whichImg>=this.bufferLen-1) {
      //   // alert(1)
      //   //  {examid:"EXAM115",subjectid:33,userid:1658,itemid:1,fetchroleid:0 }
      //   var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      //   this.timer = setInterval(function(){
      //     PopTaskAll({examid:sessObj.examid,subjectid:sessObj.subjectid,userid:sessObj.u,itemid:sessObj.itemid,fetchroleid:0 }).then((res)=>{
      //       console.log(res)
      //       this.getImgList();
      //     })
      //   }.bind(this),5000);
      // } else {
      //   clearInterval(this.timer);
      // }
    },
    bufferLen(pre,next){
      // console.log(pre,next)
      // if (pre.toString()==="0") {
      //   // alert(2)
      //   //  {examid:"EXAM115",subjectid:33,userid:1658,itemid:1,fetchroleid:0 }
      //   var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      //   this.timer = setInterval(function(){
      //     PopTaskAll({examid:sessObj.examid,subjectid:sessObj.subjectid,userid:sessObj.u,itemid:sessObj.itemid,fetchroleid:0 }).then((res)=>{
      //       console.log(res);
      //       this.getImgList();
      //     })
      //   }.bind(this),5000);
      // } else {
      //   clearInterval(this.timer);
      // }
    },
    disableArr(pre,next){
      console.log(next)
      console.log(this.answerArr[this.index]);

      //判断当前题号是否需要+0.5
      
      // this.answerArr[this.index].allowValue.map((item)=>{
      //   var nextValue;
      //   if (!this.answerArr[this.index].value) {
      //      nextValue = 0.5;
      //   } else {
      //     nextValue = this.answerArr[this.index].value*1+0.5;
      //   }
       
      //   if (nextValue != item) {
      //     this.showHalf = false;
      //   } else {
      //     this.showHalf = true;
      //   }
      // })

      // this.showHalf = false;
      // this.answerArr[this.index].allowValue.map((item,index)=>{
      //   if(!Number.isInteger(item*1)) {
      //     this.showHalf =true;
      //   }
      // })

      //按钮取消按下效果
      if (this.answerArr[this.index].max.length==this.answerArr[this.index].value.length&&this.answerArr[this.index].max.length == 2||this.showHalf) {  
         for(var key in this.calcBtnTwo){  
          //  console.log(key);
            this.calcBtnTwo[key].active = false;
          } 
      }

      //按钮禁用
      for(var key in this.calcBtnTwo){  
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
#abnormal {
  position: fixed;
  bottom: 1%;
  height: 30px;
  width: 30px;
  left: 30%;
  z-index: 8;
  opacity: 0;
}
.no-answer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55%;
  flex-direction: column;
  flex: 1;
  padding-bottom: 40%;
  z-index: 1;
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
  flex: 0;
  z-index: 1;
  position: absolute;
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
          &.disabled-btn {
             height: 37px;
            line-height:35px;
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom:40%;
  z-index:0;
  .input-wrapper {
    position: absolute;
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
    width: 100%;
    // transform: translateY(-50%);
    // margin-top: 58%;
  }
}
.header {
  z-index: 1;
  flex: 0 0 50px;
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
  // flex: 0 0 40px;
  top:55px;
  left: 4%;
  height: 40px;
  margin: 10px auto 10px;
  width: 92%;
  display: flex;
  justify-content: center;
  border-radius: 5px;
  z-index:1;
  position: absolute;
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
