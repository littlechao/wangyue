<!-- 题块列表 -->
<template>
  <div style="z-index:3;display:  flex;flex-direction:  column;height:100%;">
    <div class="header">
      <img class="back-img" @click="back" src="../assets/images/return.png" alt="">
      题块列表
      <!-- <img class="setting-img" src="../assets/images/setting.png" alt=""> -->
    </div>
    <div class="title">
      <div class="title-wrapper">
        <div class="select-name">
          <span>考试名称</span>
          <div class="input-wrapper" @click="changeSelect" style="width:100%;margin-left:20px;">
            <!-- <el-select  v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value" >
              </el-option>
            </el-select> -->
             <select @change="changeOption">
              <option value="item.value" v-for="(item,index) in selectData">{{item.name}}</option>  
            </select>
            <span :class="{ 'input-icon': true, 'to-rotate': isRotate }"></span>
            <!-- <span class="input-val">四川省2018联测促改活动</span>
            <span v-bind:class="{ 'input-icon': true, 'to-rotate': isRotate }">1</span> -->
          </div>
        </div>
       
        <!-- <select name="" id="exeamName"  style="opacity:1;position:absolute;">
          <option value="1">四川省2018联测促改活动</option>
          <option value="1">四川省2018联测促改活动</option>
          <option value="1">四川省2018联测促改活动</option>
        </select> -->
        <div class="user-info">
          <div>科目：<span v-text="subject"></span> </div>
          <div>教师：<span v-text="userName"></span> </div>
        </div>
      </div>
    </div>
    <div class="tabs">
      <span class="tabs-item">评卷</span>
    </div>
    <div class="list-table fadeIn animated" :style="{display:isShow?'':'none'}">
      <table>
        <thead>
           <tr>
            <th>题块号</th>
            <th>题目别名</th>
            <th>剩余试卷</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
           <!--  题块	题目	提交速度(秒/份)	平均分	标准差	注册教师	在线教师	剩余小时数	在册学生	已评学生	已评率 -->
          <!-- {"Subjectid":33,"Subject":"km","Itemid":1,
          "Itemalias":"22","F0":1,"F1":1,"F2":1,"F3":2,"F4":1,
          "Examname":"ex","Examid":"EXAM115","Remain":165}, -->
          <tr v-for="item in optionData" :key="item.Itemalias">
            <td>{{item.Itemid}}</td>
            <td>{{item.Itemalias}}</td>
            <td>{{item.Remain}}</td>
            <td><button @click="jumpRead(item.Itemid,item)">评卷</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {getHeaderIteminfo, getTaskboard,transLink,GetSubjectAllItemReportEx } from "../api/api.js";
export default {
  data () {
    return {
        subject:'',
        userName:'',
        selectValue: '',
        optionData:'',
        selectData:[],
        isShow:false,
        tableData:[{
          "index":"0",
          "name":"$a-1(1)",
          "readStudent":"12/100",
          "readNum":"12%"
        },{
          "index":"2",
          "name":"$a-1(2)",
          "readStudent":"34/100",
          "readNum":"34%"
        },{
          "index":"1",
          "name":"$a-1(3)",
          "readStudent":"63/100",
          "readNum":"63%"
        }],
        tableDataTwo:[{
          "index":"1",
          "name":"$b-1(1)",
          "readStudent":"12/100",
          "readNum":"12%"
        },{
          "index":"2",
          "name":"$b-1(2)",
          "readStudent":"22/100",
          "readNum":"22%"
        },{
          "index":"3",
          "name":"$b-4(3)",
          "readStudent":"65/100",
          "readNum":"65%"
        },{
          "index":"3",
          "name":"$b-4(3)",
          "readStudent":"65/100",
          "readNum":"65%"
        },{
          "index":"3",
          "name":"$b-4(3)",
          "readStudent":"65/100",
          "readNum":"65%"
        }],
        tableDataThree:[{
          "index":"1",
          "name":"$c-1(1)",
          "readStudent":"12/100",
          "readNum":"12%"
        },{
          "index":"2",
          "name":"$c-1(2)",
          "readStudent":"22/100",
          "readNum":"22%"
        },{
          "index":"0",
          "name":"$c-4(3)",
          "readStudent":"65/100",
          "readNum":"65%"
        },{
          "index":"2",
          "name":"$c-4(3)",
          "readStudent":"65/100",
          "readNum":"65%"
        },{
          "index":"1",
          "name":"$c-4(3)",
          "readStudent":"65/100",
          "readNum":"65%"
        },{
          "index":"0",
          "name":"$c-4(3)",
          "readStudent":"65/100",
          "readNum":"65%"
        },{
          "index":"2",
          "name":"$c-4(3)",
          "readStudent":"65/100",
          "readNum":"65%"
        },{
          "index":"1",
          "name":"$c-4(3)",
          "readStudent":"65/100",
          "readNum":"65%"
        },{
          "index":"0",
          "name":"$c-4(3)",
          "readStudent":"65/100",
          "readNum":"65%"
        }],
        isRotate:false,
        jumpObj:{
          chkcode:this.getRandom(),
          examid:'',
          userid:'',
          subjectid:'',
          itemid:'',
          u:''
        } 
    };
  },
  created(){
    
    document.title = "元高分";

    var token = this.$route.params.token;
    this.optionData = this.tableData;
    var _self = this;
    // document.body.addEventListener("click", function(el){
    //    console.log(el.toElement.nodeName.toLowerCase() !== 'select');
    //   if (el.toElement.nodeName.toLowerCase() !== 'select'){
    //     _self.isRotate = false;
    //   } else {
    //      _self.isRotate = !_self.isRotate;
    //   };
    // });
    this.transLink({u:token}).then((res)=>{
      // {crypedUserid:"32860B1228CDAF94",examid:"EXAM115",subjectid:"33"}
      // console.log(res)
      // const param = {
      //   crypedUserid:token,
      //   examid:res.d[1].split("$")[2],
      //   subjectid:res.d[1].split("$")[0]
      // };
      var name = res.d[1].split("$")[3]+"("+res.d[1].split("$")[1]+")";
      this.selectData.push({name:name,value:res.d[1].split("$")[2]});

      console.log(res.d[0].split("$"))
      this.jumpObj.u = res.d[0].split("$")[0];   //u
      this.jumpObj.subjectid = res.d[1].split("$")[0];   //u
      this.jumpObj.userid = token;   //u
      this.jumpObj.examid = res.d[1].split("$")[2];   //examid

      this.userName = res.d[0].split("$")[1];
      this.subject = res.d[1].split("$")[1];

      const param = {
        u:this.jumpObj.u,
        examid:res.d[1].split("$")[2],
        subjectid:res.d[1].split("$")[0]
      };
      console.log(param)
      getHeaderIteminfo(param).then((data)=>{
        console.log(data)
        var itemArray = [];
        data.d.map((item)=>{
          var c = item.split("\t");
          itemArray.push(c[0]);
        })
        console.log(itemArray)
        var listParam = {
          examid:res.d[1].split("$")[2],
          subjectid:res.d[1].split("$")[0],
          crypedUserid:token
        }
        this.getList(listParam);
      })
      // {examid:"EXAM115",subjectid:"33",itemlist:"(1,2,3,4,5,6,7,8,9,10,11,15,16,17,18,19,20)"}
     
    });
  },
  components: {},

  methods: {
    back(){
      this.$router.go(-1)
    },
    getRandom(){
        return Math.floor(Math.random() * 899999) + 100000;
    },
    jumpRead(id,item) {  //跳转阅卷页面
     
      // var tmp= "<td><a class=\"btn btn-primary btnnormal\" href=# targ=\"../normal.aspx?examid=" + vexm +
      //           "&userid=" + u + "&subjectid=" + vsubjectid + "&itemid=" + vitemid +
      //           "&chkcode=" + chkcode + "&u=" + vuserid + "\">进 入</a></td>";
      this.jumpObj.otherName = item.Itemalias; 
      this.jumpObj.itemid = id;   //u
      console.log(this.jumpObj)
      window.sessionStorage.setItem("jumpObj",JSON.stringify(this.jumpObj));
      this.$router.push({
        path: `/readPaper/${id}`,
      })
    },
    changeOption(el){
      this.selectValue = el.target.value;
      console.log(el.target.value);
      if (el.target.value == 2 ) {
         this.optionData = this.tableDataTwo;
      }
     
    },
    changeSelect(){
      // this.isRotate = !this.isRotate;
    },
    transLink(pram){
      return new Promise(resolve=>{
        transLink(pram).then((res)=>{
          resolve(res)
        })         
      })
    },
    getList(pram) {
      // console.log(pram)
      // GetSubjectAllItemReportEx(pram).then((res)=>{
      //     this.isShow = !this.isShow;
      //     this.optionData = res.d.map(function(item,index){
      //       return item.split("\t");
      //     });
      //    console.log(this.optionData)
       
      // });
      getTaskboard(pram).then((res)=>{
        console.log(res.d)
        this.optionData= res.d;
        this.isShow = !this.isShow;
      })
      
    }
  },
  filters: {
    toNum: function (value) {
      console.log(parseFloat(value))
      return parseFloat(value)
    }
  }
}

</script>
<style lang="scss" scoped>
.list-table {
  padding: 15px 15px 0;
  padding-bottom: 20px;
  flex: 1;
  overflow: scroll;
  table {
    width: 100%;
    tr th {
      text-align: left;
      font-weight: 700;
      padding-left: 1.8vw;
    }
    // tr td :nth-of-type(even){
    //   background:#ff0000;
    // }
    thead tr {
      height: 40px;
      line-height: 40px;
    }
    tbody tr{
      height: 40px;
      line-height: 40px;
      td{
        padding-left: 1.8vw;
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
.tabs {
  width: 100%;
  flex: 0 0 40px;
  background: #f0f2f5;
  .tabs-item {
    width: 11%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    display: inline-block;
    padding: 0 25px;
    font-weight: 700;
    background-color: #fff;
    color:#ff9f00;
  }
}
.header {
  flex: 0 0 50px;
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  position: relative;
  img {
    vertical-align: middle;
    position: absolute;
    top:50%;
    height: 22px;
    transform: translateY(-50%);
  }
  .back-img {
    left: 1rem;
  }
  .setting-img {
    right: 1rem;
  }
}
.title {
  flex: 0 0 100px;
  background:linear-gradient(left, #ff7b00,#ffa900);  
  position: relative;
  .title-wrapper {
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 92%;
    .user-info {
      padding: 0 4.5% 0 5%;
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
      div {
        display: inline-block;
        color:#fff;
        font-weight: bold;
        span {
          // letter-spacing:2px;
        }
      }
    }
  }
  .select-name {
    // width: 100%;
    border-radius: 5px;
    background: rgba(255,255,255,.2);
    padding: 0px 15px;
    color:#fff;
    display: flex;
    align-items: center;
    height:5vh;
    .input-wrapper {
      position: relative;
      select {
        font-size: 14px;
        width: 100%;
        border: none;
        appearance:none;
        outline: none;
        padding-left: 10px;
        color: #fff;
        background: rgba(255,255,255,0);
      }
      .input-val {
        display:inline-block;
        height:35px;
        line-height:35px;
        width: 80%;
      }
      .input-icon {
        position: absolute;
        top: 50%;
        margin-top: -8px;
        right: 0px;
        height: 10px;
        width: 10px;
        background: url("../assets/images/select.png") no-repeat center;
        background-size: cover;
        transition: transform 0.1s linear; 
      }
      .to-rotate {
        transform: rotate(-180deg);
      }
    }
   
    span {
      font-size: 14px;
      font-weight: bold;
      flex: 0 0 60px;
      height: 28px;
      line-height: 28px;
    }
    ul {
      flex: 1;
      padding-left: 20px;
      display: inline-block;
      overflow: hidden;
      height: 28px;
      font-size: 12px;
      li {
        height: 28px;
        line-height: 28px;
      }
    }
  }
}
</style>