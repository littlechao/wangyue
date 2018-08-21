<!-- 阅卷进度 质量控制 组员管理 配额管理 -->
<template>
  <div style="height: 100%;display:  felx;display:  flex;flex-direction:  column;">
    <div class="header">
      <img class="back-img" src="../assets/images/return-white.png" alt="">
      <div class="tabs">
        <span v-for="(item,index) in headerCon" :key="index" @click="headerClick(index)" :class="{'active':item.active}">{{item.name}}</span>
        <!-- <span class="active">阅卷进度</span>
        <span>质量控制</span>
        <span>组员管理</span>
        <span>配额管理</span> -->
      </div>
    </div>
    <div class="notice" v-show="headerIndex==1">点击任何一行，可以查看教师明细</div>
    <div class="container container-one" v-show="headerIndex==1">
      <div class="tabs-con">
        <span v-for="(item,index) in optionCon" :key="index" @click="optionClick(index)" class="tabs-item" :class="{'active':item.active}">{{item.name}}</span>
        <!-- <span class="tabs-item active">评卷指标</span>
        <span class="tabs-item" @click="">评卷量</span>
        <span class="tabs-item">评卷库</span> -->
      </div>
      <div  class="list-table">
        <table v-show="tableIndex ==1" style="">
          <thead>
            <tr>
              <th>题块1</th>
              <th><div>题目</div><div>别名</div></th>
              <th><div>提交速度</div><div>(秒/份)</div></th>
              <th>平均分</th>
              <th>标准差</th>
              <th>剩余小时</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{tableData.length}}</td>
              <td>{{item.name}}</td>
              <td>{{item.readStudent}}</td>
              <td>{{item.readNum}}</td>
              <td>{{item.readStudent}}</td>
              <td>{{item.readNum}}</td>
            </tr>
          </tbody>
        </table>
        <table  v-show="tableIndex ==2" style="">
          <thead>
            <tr>
              <th>题块2</th>
              <th>题目别名</th>
              <th>在线教师</th>
              <th>已阅学生</th>
              <th>已评率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableDataTwo" @click="cloumnClick(item)" class="fadeIn animated" :style="{ display: item.parent?'none':''}" :key="item.id">
                <td v-if="!item.parent">{{item.index}}</td>
                <td v-if="!item.parent">{{item.name}}</td>
                <td v-if="!item.parent">{{item.readStudent}}</td>
                <td v-if="!item.parent">{{item.readNum}}</td>
                <td v-if="!item.parent">{{item.readStudent}}</td>
                <td v-if="item.parent" colspan="6" ref="tableTwo" style="height:0px">
                  <div class="teacher-info">
                    <div class="table-header">题块1：a-1(1)评卷教师明细</div>
                    <table>
                      <thead>
                        <tr style="line-height: 20px;">
                          <th>教师ID</th>
                          <th>教师名称</th>
                          <th>在线状态</th>
                          <th>总批阅量</th>
                          <th>配额设定</th>
                          <th><div>配额</div><div>完成率</div></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="items in tableDataTwo"  :key="items.id">
                            <td>{{items.index}}</td>
                            <td>{{items.name}}</td>
                            <td>{{items.readStudent}}</td>
                            <td>{{items.readNum}}</td>
                            <td>{{items.readStudent}}</td>
                            <td>{{items.readNum}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
            </tr>
            
          </tbody>
        </table>
        <table  v-show="tableIndex ==3" style="">
          <thead>
            <tr>
              <th>题块2</th>
              <th>题目别名</th>
              <th>在线教师</th>
              <th>已阅学生</th>
              <th>已评率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableDataTwo" :key="item.id">
                <td v-if="!item.parent">{{item.index}}</td>
                <td v-if="!item.parent">{{item.name}}</td>
                <td v-if="!item.parent">{{item.readStudent}}</td>
                <td v-if="!item.parent">{{item.readNum}}</td>
                <td v-if="!item.parent">{{item.readStudent}}</td>
                <td v-if="item.parent" colspan="6">
                  <div class="teacher-info">
                    <div class="table-header">题块1：a-1(1)评卷教师明细</div>
                    <table>
                      <thead>
                        <tr style="line-height: 20px;">
                          <th>教师ID</th>
                          <th>教师名称</th>
                          <th>在线状态</th>
                          <th>总批阅量</th>
                          <th>配额设定</th>
                          <th><div>配额</div><div>完成率</div></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="items in tableDataTwo"  :key="items.id">
                            <td>{{items.index}}</td>
                            <td>{{items.name}}</td>
                            <td>{{items.readStudent}}</td>
                            <td>{{items.readNum}}</td>
                            <td>{{items.readStudent}}</td>
                            <td>{{items.readNum}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
    <div class="container container-two" v-show="headerIndex==2">
      <div class="title">a-1(2)阅卷数据分布曲线</div>
      <div class="my-chart">
        <div  id="myChart" :style="{height: '200px',width:'94vw'}"></div>
      </div>
      <div class="infomation">
        <div class="info-header">
          <span class="active">评卷指标</span><span>评卷一致性</span>
        </div>
        <div class="table-con">
          <table v-show="tableIndex ==1" style="">
            <thead>
              <tr>
                <th>教师姓名</th>
                <th>评卷量</th>
                <th>评卷速度</th>
                <th>平均分</th>
                <th>标准差</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.id">
                <td>{{tableData.length}}</td>
                <td>{{item.name}}</td>
                <td>{{item.readStudent}}</td>
                <td>{{item.readNum}}</td>
                <td>{{item.readStudent}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="btn-warpper">
          <span>查看组员最近的评卷数据</span>
        </div>
      </div>
     
    </div>
     <div class="container container-three" v-show="headerIndex==3">
        <div class="option-wrapper">
          <div class="item">
            <img src="../assets/images/table/1.png" alt="">
            <div class="text">本题置为试评</div>
          </div>
          <div class="item">
            <img src="../assets/images/table/2.png" alt="">
            <div class="text">从基库选择</div>
          </div>
        </div>
        <div class="option-wrapper">
          <div class="item">
            <img src="../assets/images/table/3.png" alt="">
            <div class="text">批量添加教师</div>
          </div>
          <div class="item">
            <img src="../assets/images/table/4.png" alt="">
            <div class="text">从其他题调度</div>
          </div>
        </div>
        
        <h1>当前题块评卷教师</h1>
        <div class="infomation">
          
          <div class="info-header">
            <span class="active">评卷指标</span><span>评卷一致性</span>
          </div>
          <div class="table-con">
            <table v-show="tableIndex ==1" style="">
              <thead>
                <tr>
                  <th>教师名</th>
                  <th>评卷账号</th>
                  <th>密码</th>
                  <th><div style="line-height:20px;">评卷</div><div style="line-height:20px;">状态</div></th>
                  <th>所属学校</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in tableData" :key="item.id">
                  <td>1</td>
                  <td>{{item.name}}</td>
                  <td>{{item.readStudent}}</td>
                  <td>{{item.readNum}}</td>
                  <td>{{item.readStudent}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="btn-warpper">
            <span>查看组员最近的评卷数据</span>
          </div>
        </div>
        <div class="footer">
          <div><img src="" alt="">上一题</div>
          <div>a-1(2)</div>
          <div><img src="" alt="">下一题</div>
        </div>
     </div>
      <div class="container container-four" v-show="headerIndex==4">4</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      headerCon:[{
        name:'阅卷进度',
        active:true
      },{
        name:'质量控制',
        active:false
      },{
        name:'组员管理',
        active:false
      },{
        name:'配额管理',
        active:false
      }],
      optionCon:[{
        name:'评卷指标',
        active:true
      },{
        name:'评卷量',
        active:false
      },{
        name:'评卷库',
        active:false
      }],
      tableIndex:'1',
      headerIndex:'1',
      tableData:[{
          "index":"1",
          "name":"$a-1(1)",
          "readStudent":"0/100",
          "readNum":"10%",
          "isShow":false,
          "divHide":{
            "readStudent":"0/100",
            "readNum":"10%"
          }
        },{
          "index":"2",
          "name":"$a-1(1)",
          "readStudent":"0/100",
          "readNum":"10%",
           "isShow":false
      }],
      tableDataTwo:[{
          "index":"1",
          "name":"$a-1(1)",
          "readStudent":"0/100",
          "readNum":"10%",
          "isShow":false,
          "divHide":{
            "readStudent":"0/100",
            "readNum":"10%"
          }
        },{
          "parent":"1",
          'content':"213"
        },{
          "index":"2",
          "name":"$a-1(1)",
          "readStudent":"0/100",
          "readNum":"10%",
           "isShow":false
        },{
          "parent":"2",
          'content':"213"
        },{
          "index":"3",
          "name":"$a-1(1)",
          "readStudent":"0/100",
          "readNum":"10%",
           "isShow":false
        },{
          "parent":"3",
          'content':"213"
      },],
      tableDataThree:[{
        "index":"1",
        "name":"$a-1(1)",
        "readStudent":"0/100",
        "readNum":"10%",
        "isShow":false,
        "divHide":{
          "readStudent":"0/100",
          "readNum":"10%"
        }
      },{
        "parent":"1",
        'content':"213"
      },{
        "index":"2",
        "name":"$a-1(1)",
        "readStudent":"0/100",
        "readNum":"10%",
          "isShow":false
      },{
        "parent":"2",
        'content':"213"
      },{
        "index":"3",
        "name":"$a-1(1)",
        "readStudent":"0/100",
        "readNum":"10%",
          "isShow":false
      },{
        "parent":"3",
        'content':"213"
    }]
    };
  },
  mounted(){
    this.drawLine();
    console.log( document.getElementById('canvas'));
    // document.getElementById('canvas').style.width= document.body.clientWidth-20+'px';
    // document.getElementsByClassName('container-two')[0].style.height= document.body.clientHeight-50-40+'px';
  },
  methods: {
    cloumnClick(data) {
      console.log(data)
      console.log(this.$refs);
      if (this.$refs.tableTwo[data.index-1].parentNode.style.display == "none") {
        this.$refs.tableTwo[data.index-1].parentNode.style.display = "";
      } else {
        this.$refs.tableTwo[data.index-1].parentNode.style.display = "none";
      }
      
    },
    drawLine(){
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
                data:['个人','主体'],
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
                // data:option.data
                data : ['周一','周二','周三','周四']
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
                  data:[10,20,30,40,50]
              },
              {
                  name:'主体',
                  type:'line',
                  itemStyle : {  
                      normal : {  
                          color:'#ff7900',
                          lineStyle:{  
                              color:'#ffa801'  
                          }  
                      }  
                  },  
                    data:[130,203,303,80,50]
              }
            ]
        });
        // myChart.setOption( {
        //   xAxis: {
        //       type: 'category',
        //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        //   },
        //   yAxis: {
        //       type: 'value'
        //   },
        //   backgroundColor:'#fff',
        //   series: [{
        //       data: [80, 92, 91, 94, 120, 130, 120],
        //       type: 'line',
        //       smooth: true
        //   },{
        //       data: [82, 93, 90, 93, 129, 133, 132],
        //       type: 'line',
        //       smooth: true
        //   },{
        //       data: [20, 32, 91, 94, 120, 130, 130],
        //       type: 'line',
        //       smooth: true
        //   }]
        // });
    },
    headerClick(index) {
      this.headerCon.map((item,index)=>{
        item.active=false;
      })
      this.headerCon[index].active =true;
      this.headerIndex = index+1;
    },
    optionClick(index){
      this.optionCon.map((item,index)=>{
        item.active=false;
      })
      this.optionCon[index].active =true;
      this.tableIndex = index+1;
    },
    tdClick(item){
      console.log(status)
      item.isShow=!item.isShow
    }
  }
}

</script>
<style lang="scss" scoped>
.teacher-info {
  margin-left: -10px;
  .table-header {
    background-color: #ffeacb;
    border-top: 3px solid #ff9400;
    padding-left: 10px;
  }
  table {
    border-bottom: 5px solid #e0e4e7;
    width: 100%;
    tr {
      background-color: #fff !important;
      border-bottom: 1px solid #e0e4e7;
    }
    tr th {
      text-align: left;
      font-weight: 700;
      padding-left: 10px;
      color: #000;
      word-break: normal;
      white-space: nowrap;
    }
    // tr td :nth-of-type(even){
    //   background:#ff0000;
    // }
    thead tr {
     
      font-size: 10px;
      th {
        font-weight: 700;
        vertical-align:middle;
        transform: scale(.9);
      }
      div {
        line-height: 12px !important;
      }
      
    }
    tbody tr{
      height: 40px;
      line-height: 40px;
      td{
        padding-left: 10px;
        color: #6f6f6f;
        button {
          background: #fff;
          border: 1px solid #a1a2a6;
          border-radius: 4px;
          padding: 3px 10px;
          outline: none;
           color: #6f6f6f;
        }
      }
    }
    tbody tr:nth-of-type(odd){
      background:#f0f2f5;
    }
  }
}
.list-table {
  padding: 15px 15px 0;
  padding-bottom: 20px;
  overflow: scroll;
  table {
    width: 100%;
    line-height: 45px;
    &:nth-of-type(2),&:nth-of-type(3) {
      tr th {
        line-height: 45px;
      }
     
    }
    tr th {
      text-align: left;
      font-weight: 700;
      padding-left: 10px;
    }
    // tr td :nth-of-type(even){
    //   background:#ff0000;
    // }
    thead tr {
      // line-height: 40px;
      th {
        vertical-align:middle;
      }
      div {
        line-height: 20px;
      }
      
    }
    tbody tr{
      height: 40px;
      line-height: 40px;
      td{
        padding-left: 10px;
        color: #6f6f6f;
        button {
          background: #fff;
          border: 1px solid #a1a2a6;
          border-radius: 4px;
          padding: 3px 10px;
          outline: none;
           color: #6f6f6f;
        }
      }
    }
    tbody tr:nth-of-type(odd){
      background:#f0f2f5;
    }
  }
}
.notice {
  flex:0 0 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  background:linear-gradient(left, #ff7b00,#ffaa00);
}

.header {
  flex: 0 0 50px;
  width: 100%;
  line-height: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  background:linear-gradient(left, #ff7b00,#ffaa00); 
  .tabs {
    width: 82%;
    display: flex;
    align-items: center;
    justify-content: center;
    background:rgba(255,187,52,.8);
    border-radius: 5px;
    span {
      &.active {
        background: #fff;
        color: #4b4b4b;
        border-radius: 5px;
      }
      flex: 1;
      height: 30px;
      line-height: 30px;
      display: inline-block;
     
      color: #fff;
      font-size: 12px;
    }
  }
  img {
    width: 8px;
    margin-right: 4%;
    margin-left: 4%;
  }
  .back-img {
    left: 1rem;
  }
}
.container-one {
  flex: 1;
  display: flex;
  flex-direction: column;
  .tabs-con {
    flex: 0 0 40px;
    width: 100%;
    background: #f0f2f5;
    display: flex;
    .tabs-item {
      flex: 1;
      display: inline-block;
      padding: 12px 25px;
      font-weight: 700;
      &.active {
        color:#ff9f00;
        background: #fff;
      }
    }
  } 
}
.container-two {
  flex: 1;
  overflow: scroll;
  background-color: #f6f6f6;
  padding: 20px 10px 58px;
  height: 82%;
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    display:flex;
    width: 100%;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    background-color: #fff;
    div {
      text-align: center;
      color: #ff7a01;
    }
    div:nth-of-type(1) {
      flex: 1
    }
    div:nth-of-type(2) {
      height: 34px;
      background-color: #f1f2f6;
      line-height: 34px;
      color: #19191b;
      flex: 2
    }
    div:nth-of-type(3) {
      flex: 1
    }
  }
  .title {
    color: #19191b;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .infomation {
    margin-top: 20px;
    background-color: #fff;
    padding-bottom: 20px;
    .info-header {
      display: flex;
      span {
        &.active {
          border-bottom-color: #ff7c00;
          color: #ff7c00;
        }
        flex: 1;
        text-align: center;
        display: inline-block;
        line-height: 30px;
        font-weight: 700;
        border-bottom: 2px solid #f1f2f6;
      }
    }
    .table-con {
      margin-top: 10px;
      padding: 0 10px;
      table {
        
        border: 1px solid #e2e3e7;
        width: 100%;
        line-height: 45px;
        &:nth-of-type(2),&:nth-of-type(3) {
          tr th {
            line-height: 45px;
          }
        }
        tr th {
          text-align: left;
          font-weight: 700;
          padding-left: 10px;
        }
        thead{
          border-bottom: 1px solid #e2e3e7;
          tr {
            th {
              vertical-align:middle;
            }
          }
        }
        tbody tr{
          height: 40px;
          line-height: 40px;
          background-color: #fff !important;
          &:not(:last-child) {
            border-bottom: 1px solid #e2e3e7;
          }
          td{
            padding-left: 10px;
            color: #6f6f6f;
            button {
              background: #fff;
              border: 1px solid #a1a2a6;
              border-radius: 4px;
              padding: 3px 10px;
              outline: none;
              color: #6f6f6f;
            }
          }
        }
        tbody tr:nth-of-type(odd){
          background:#f0f2f5;
        }
      }
    }
    .btn-warpper {
      text-align: center;
      span {
        display: inline-block;
        text-align: center;
        line-height: 35px;
        width: 94%;
        border: 1px solid #ff7a01;
        color: #ff7a01;
        border-radius: 3px;
        margin-top: 10px;
      }
    }
    
  }
}
.container-three {
  flex: 1;
  overflow: scroll;
  background-color: #f6f6f6;
  padding: 20px 15px 58px;
  .option-wrapper {
    background-color: #fff;
    display: flex;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #ff7b00;
      margin-left: 20px;
      margin-right: 10px;
    }
    .item {
      flex: 1;
      height: 75px;
      display: flex;
      align-items: center;
      font-size: 15px;
      color: #19191a;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    display:flex;
    width: 100%;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    background-color: #fff;
    div {
      text-align: center;
      color: #ff7a01;
    }
    div:nth-of-type(1) {
      flex: 1
    }
    div:nth-of-type(2) {
      height: 34px;
      background-color: #f1f2f6;
      line-height: 34px;
      color: #19191b;
      flex: 2
    }
    div:nth-of-type(3) {
      flex: 1
    }
  }
  .title {
    color: #19191b;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 10px;
  }
  h1 {
    margin-top: 30px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .infomation {
    background-color: #fff;
    padding-bottom: 20px;
    .info-header {
      display: flex;
      span {
        &.active {
          border-bottom-color: #ff7c00;
          color: #ff7c00;
        }
        flex: 1;
        text-align: center;
        display: inline-block;
        line-height: 30px;
        font-weight: 700;
        border-bottom: 2px solid #f1f2f6;
      }
    }
    .table-con {
      margin-top: 10px;
      padding: 0 10px;
      table {
        
        border: 1px solid #e2e3e7;
        width: 100%;
        line-height: 45px;
        &:nth-of-type(2),&:nth-of-type(3) {
          tr th {
            line-height: 45px;
          }
        }
        tr th {
          text-align: left;
          font-weight: 700;
          padding-left: 10px;
        }
        thead{
          border-bottom: 1px solid #e2e3e7;
          tr {
            th {
              vertical-align:middle;
            }
          }
        }
        tbody tr{
          height: 40px;
          line-height: 40px;
          background-color: #fff !important;
          &:not(:last-child) {
            border-bottom: 1px solid #e2e3e7;
          }
          td{
            padding-left: 10px;
            color: #6f6f6f;
            button {
              background: #fff;
              border: 1px solid #a1a2a6;
              border-radius: 4px;
              padding: 3px 10px;
              outline: none;
              color: #6f6f6f;
            }
          }
        }
        tbody tr:nth-of-type(odd){
          background:#f0f2f5;
        }
      }
    }
    .btn-warpper {
      text-align: center;
      span {
        display: inline-block;
        text-align: center;
        line-height: 35px;
        width: 94%;
        border: 1px solid #ff7a01;
        color: #ff7a01;
        border-radius: 3px;
        margin-top: 10px;
      }
    }
    
  }
}
</style>