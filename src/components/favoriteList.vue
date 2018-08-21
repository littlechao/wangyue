<!-- 收藏夹 -->
<template>
  <div class="fadeInLeft animated" style="height:100%; width:100%;background:#f0f2f5;position:fixed;top:0;z-index:9" v-show="showFav">
     <div class="header">
      <img src="../assets/images/close.png" @click="closeFav" alt="">
      收藏夹
    </div>
    <div class="favorit-wrapper">
      <!-- <div class="favorit-item">
        <div class="item-left">
          <div class="title">密号:12345</div>
          <div class="content">这题得出错率太高了，下次注意啊</div>
          <div class="time">2018-10-10 12:03:03</div>
        </div>
        <div class="item-right"></div>
      </div> -->
      <div v-for="(item,index) in dataList" :key="index" class="favorit-item">
        <div class="item-left">
          <div class="title">密号:{{item[0]}}</div>
          <div class="content">{{item[1]}}</div>
          <div class="time">{{item[2]}}</div>
        </div>
        <div class="item-right" @click="showPic(item)"></div>
      </div>
      
    </div>
    <div class="footer">
      <div>
        <input type="text" v-model="inputValue" placeholder="请输入收藏理由">
        <span @click="addFavorate">收藏</span>
      </div>
    </div>
    <alert-tem :is-show="alertShow" :alert-text="alertText"  @onchange="change"></alert-tem>
    <div class="show-img" v-show="isShow" @click="cancleImg($event)">
      <img :src="showImg" class="scale_img" alt="">
    </div>
  </div>
</template>

<script>
import { ShowFavorite,AddFavorite } from "../api/api.js"
import AlloyFinger from 'alloyfinger'
import Transform from 'css3transform'

import alert from './alert/alert';

export default {
  data () {
    return {
      dataList:[],
      inputValue:'',
      alertShow:false,
      alertText:"收藏理由不能为空",
      isShow:false,
      showImg:'',
      af:''
    };
  },
  props:{
    showFav:{
      
    },
    path:{

    },
    paper:{

    }
  },
  components:{
    alertTem:alert
  },
  methods: {
    AlloyFinger(){
     
      var _this = this;
      let swordEle = document.getElementsByClassName('scale_img')[0];
      
      let bwidth, bheight, swidth, sheight;
      // bwidth = swordEle.offsetWidth;
      // bheight = swordEle.offsetHeight;
      // swordEle.scaleX ="1.5"
      Transform(swordEle);
      swordEle.translateX = 0;
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
          console.log(swordEle.translateX)
          swordEle.translateX += evt.deltaX;
          swordEle.translateY += evt.deltaY;
        },
        swipe: function (evt) {
        //  console.log("swipe" + evt.direction);
        }
      });
    },
    cancleImg(ev){
      console.log(ev)
      if (ev.target.tagName.toLowerCase() !== "img") {
        this.isShow = false;
      }
    },
    showPic(item) {
      // if (this.af) {
      //   this.af = this.af.destroy();
      let swordEle = document.getElementsByClassName('scale_img')[0];
      swordEle.translateX = 0;
      swordEle.translateY = 0;
      document.getElementsByClassName('scale_img')[0].style.transform ="perspective(500px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
      // }
      // this.af = this.af.destroy();
      // this.af = this.AlloyFinger();
      // document.getElementsByClassName('scale_img')[0].style.transform ="perspective(500px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
      console.log(item[3])
      this.showImg = item[3];
      this.isShow = true;
    },
    change(){
      this.alertShow =! this.alertShow;
    },
    closeFav() {
      this.showFav =false;
      this.$emit("onchange",this.showFav)
    },
    favorite(){
      // {examid:"EXAM115",subjectid:33,userid:1658,itemid:1}
      var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      var param = {
        examid:sessObj.examid,
        subjectid:sessObj.subjectid,
        itemid:sessObj.itemid,
        userid:sessObj.u
      };
      this.dataList=[];
      ShowFavorite(param).then((res)=>{
        console.log(res)
        res.d.map((item,index)=>{
          this.dataList.push(item.split("\t"))
        });
        console.log(this.dataList)
      })
    },
    addFavorate(){
      if (!this.inputValue) {
         this.alertShow =! this.alertShow;
         return;
      }
      // {examid:"EXAM115",
      // subjectid:33,userid:1658,itemid:1,paperid:111347,
      // path:"http://52.83.161.249:8013/cut/33/115/1/1/111347_1.jpg",
      // desc:"dsafdsa"}
      var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      var param = {
        examid:sessObj.examid,
        subjectid:sessObj.subjectid,
        itemid:sessObj.itemid,
        userid:sessObj.u,
        paperid:this.paper,
        desc:this.inputValue,
        path:this.path
      };
      AddFavorite(param).then((res)=>{
        console.log(res)
        this.inputValue='';
        this.favorite();
      })
    }
  },
  created(){
    this.favorite();
  },
  mounted(){
    this.af = this.AlloyFinger();
  }
}

</script>
<style lang="scss" scoped>
.show-img {
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,.4);
  z-index:10;
  img {
    width: 80%;
    position: absolute;
    top: 30%;
    left: 10%;
  }
}
.header {
  height: 50px;
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  background: #fff;
  position: fixed;
  z-index: 9;
  img {
    vertical-align: middle;
    position: absolute;
    right: 10px;
    top:50%;
    margin-top: -20px;
    height: 40px;
  }
}
.favorit-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  /* margin-bottom: 64px; */
  /* box-sizing: border-box; */
  padding-top: 60px;
  box-sizing: border-box;
  padding-bottom: 60px;
  overflow: scroll;
}
.favorit-item {
  background: #fff;
  display: flex;
  width:90%;
  justify-content: space-between;
  margin: 0 auto;
  padding: 15px 5px 15px 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  // &:last-child {
  //   margin-bottom: 60px;
  // }
  // &:first-child {
  //   margin-top: 60px;
  // }
  .item-left {
    width: 86%;
    .content {
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      font-weight: bold;
      width: 60%;
      margin: 3px 0 5px;
      height: 25px;
      line-height: 25px;
    }
    .time {
      color:#d3d4d5;
    }
  }
  .item-right {
    width: 14%;
    background: url("../assets/images/enter.png") no-repeat center;
    transform: scale(.6);
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  // padding: 8px 20px 10px ;
  width: 100%; 
  background: #f0f2f5;
  div {
    display: flex;
    align-items: center;
    height: 55px;
    padding: 0 20px;
  }
  input {
    border: none;
    height: 33px;
    border-radius: 5px;
    margin-right: 1%;
    flex: 4;
    outline: none;
    padding-left: 10px;
    font-size:16px;
    border:none;
  }
  span {
    border: none;
    background:linear-gradient(left, #ff7b00,#ffa900);  
    color: #fff;
    height: 35px;
    line-height: 35px;
    flex: 1;
    display: inline-block;
    text-align: center;
    border-radius: 5px;
    font-size:16px;
  }
  
}
</style>