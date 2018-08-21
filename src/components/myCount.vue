<!-- 我的统计 -->
<template>
  <div :class="{'fadeInLeft':isShow,'animated':true}" style="position:fixed; z-index:3; width:100%;top:0;height:100%;background:#f0f2f5; padding-bottom:20px;" v-show="isShow">
     <div  class="header">
        <div class="refresh"  @click="countRload">
          <img class="back-img" src="../assets/images/refresh.png" alt="">
          <span>刷新</span>
        </div>
        <div style="font-size:14px;">我的统计</div>
        <img class="setting-img" @click="closeCount" src="../assets/images/close.png" alt="">
      </div>
    <div style="padding:20px 12px 0;height: 100%;overflow:scroll;">
      <div class="title-wrapper">
        <div class="title-header">
          <span>当前题块号:{{blockIndex}}</span>
          <span>题目别名:{{otherName}}</span>
        </div>
        <div class="con-wrapper">
          <div class="con-item">
            <span>学生总数</span>
            <span v-text="totleStudent[0]">639</span>
          </div>
          <div class="con-item">
            <span>已出成绩人数</span>
            <span v-text="totleStudent[1]"></span>
          </div>
          <div class="con-item">
            <span>剩余待阅人数</span>
            <span v-text="totleStudent[2]"></span>
          </div>
        </div>
      </div>
      <div class="title-wrapper">
        <div class="title-header">
          <span>我的阅卷指标</span>
        </div>
        <div class="con-wrapper  read-paper">
          <div class="con-item-socer">
            <span>我给出的平均分</span>
            <span v-text="scoreFirst[0]||'-'"></span>
          </div>
          <div class="con-item-socer">
            <span>集体给出的平均分</span>
            <span v-text="scoreSecond[0]||'-'"></span>
          </div>
        </div>
        <div class="con-wrapper  read-paper">
          <div class="con-item-socer">
            <span>我给出的标准差</span>
            <span v-text="scoreFirst[1]||'-'"></span>
          </div>
          <div class="con-item-socer">
            <span>集体给出的标准差</span>
            <span v-text="scoreSecond[1]||'-'"></span>
          </div>
        </div>
        <div class="con-wrapper read-paper">
          <div class="con-item-socer">
            <span>我的平均速度(秒/份)</span>
            <span v-text="scoreFirst[2]||'-'"></span>
          </div>
          <div class="con-item-socer">
            <span>集体平均速度(秒/份)</span>
            <span v-text="scoreSecond[2]||'-'">21.70</span>
          </div>
        </div>
      </div>
      <div class="my-chart">
        <div  id="myChart" :style="{height: '300px',width:'94vw'}"></div>
      </div>
    </div>
   
  </div>
</template>

<script>
import { ShowReport,drawPersonAndAll } from "../api/api.js";

export default {
  data () {
    return {
      isShow:false,
      scoreFirst:[],
      scoreSecond:[],
      totleStudent:[],
      blockIndex:'',
      option:{
        data:[],
        dataTwo:[],
        dataThree:[]
      }
    };
  },
  props:{
    toShow:{

    },
    otherName:{

    }
  },
  mounted(){
    // this.drawLine();
  },
  methods: {
    closeCount() {
      this.isShow =false;
      this.$emit("onchange",this.isShow)
    },
    drawLine(option){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            title: {
                text: '给分分布曲线'
            },
            tooltip : {
              trigger: 'axis'
            },
            legend: {
                data:['个人','全体'],
                // orient: 'vertical',  //垂直显示
                // y: 'center',    //延Y轴居中
                x: 'right', //居右显示
                // selectedMode: 'single', 
                // padding:-0.5 //调节legend的位置
            },
            backgroundColor:'#fff',
            calculable : true,
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                boundaryGap : false,
                data:option.data
                // data : ['周一','周二','周三','周四','周五','周六','周日']
              }
            ],
            yAxis : [
              {
                type : 'value'
              }
            ],
            series : [
              {
                  name:'个人',
                  type:'line',
                  itemStyle : {  
                      normal : {  
                          color:'#35a9fe',  
                          lineStyle:{  
                              color:'#32a9fd'  
                          }  
                      }  
                  },  
                  data:option.dataTwo
              },
              {
                  name:'全体',
                  type:'line',
                  itemStyle : {  
                      normal : {  
                          color:'#ff7900',
                          lineStyle:{  
                              color:'#ffa801'  
                          }  
                      }  
                  },  
                    data:option.dataThree
              }
            ]
        });
    },
    showReport() {
      // {examid:"EXAM115",subjectid:33,userid:1658,itemid:1}
      var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      const param = {
        examid:sessObj.examid,
        subjectid:sessObj.subjectid,
        userid:sessObj.u,
        itemid:sessObj.itemid
      };
      ShowReport(param).then((res)=>{
        this.scoreFirst=res.d[0].split(",");
        this.scoreSecond=res.d[1].split(",");
        this.totleStudent=res.d[2].split(",");
      });
    },
    drowCount() {
      // {examid:"EXAM115",subjectid:33,userid:1658,itemid:1}
      var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      const param = {
        examid:sessObj.examid,
        subjectid:sessObj.subjectid,
        userid:sessObj.u,
        itemid:sessObj.itemid
      };
      drawPersonAndAll(param).then((res)=>{
        console.log(res)
        this.option ={
          data:[],
          dataTwo:[],
          dataThree:[]
         }
        res.d.map((item,index)=>{
          this.option.data.push(item.split(",")[0])
          this.option.dataTwo.push(item.split(",")[1])
          this.option.dataThree.push(item.split(",")[2])
        });
        console.log(this.option)
        this.drawLine(this.option);
      });
    },
    countRload() {
      // this.isShow = !this.isShow
      var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      this.blockIndex = sessObj.itemid;
      this.drowCount();
    }
  },
  created() {
    var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
    this.blockIndex = sessObj.itemid;
    this.drowCount();
  },
  watch: {
    toShow (){
      this.showReport();
      this.isShow = this.toShow;
    }
  }
}

</script>
<style lang="scss" scoped>
#myChart {
  div {
    width:100% !important;
  }
}
.my-chart {
  height:390px;
  margin-top:25px;
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
  .refresh {
    line-height: 50px;
    font-size: 14px;
    img{
      height: 18px;
      vertical-align: text-top;
    }
    span {
      font-size: 14px;
    }
  }
  
  .back-img {
    margin-left: 1rem;
  }
  .setting-img {
    height: 40px;
    margin-right: 1rem;
  }
}

.title-wrapper {
  &:nth-of-type(2) {
    margin-top: 30px;
  }
  .read-paper {
    margin-top: 8px;
  }
  .title-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: 16px;
    span:nth-of-type(1) {
      font-weight: bold;
    }
    span:nth-of-type(2) {
      color: #a1a2a6;
    }
  }
  .con-wrapper {
    display: flex;
    justify-content: space-between;
    .con-item-socer {
      display: flex;
      background: #fff;
      flex: 1;
      padding: 12px 8px;
      align-items: center;
      border-radius:3px;
      span{

      }
      &:nth-of-type(1) {
        margin-right: 5px;
      }
      span:nth-of-type(2) {
        margin-left: 5px;
        color: #ff7a00;
        font-weight: bold;
        font-size: 14px;
        flex:1;
      }
      span:nth-of-type(1) {
        font-size: 11px;
        flex:4;
      }
    }
    .con-item {
      display: flex;
      flex-direction: column;
      background: #fff;
      flex: 1;
      padding: 10px 8px;
      font-size:14px;
      border-radius:3px;
      &:nth-of-type(1) {
        padding-left: 15px;
      }
      &:nth-of-type(2) {
        margin: 0 2px;
       
      }
      span:nth-of-type(2) {
        margin-top: 10px;
        color: #ff7a00;
        font-weight: bold;
         font-size: 20px;
      }
      
    }
  } 
}
</style>