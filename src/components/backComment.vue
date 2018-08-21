<!-- 回评 -->
<template>
  <div class="fadeInLeft animated" style="position:fixed; width:100%;top:0;height:100%;background:#f0f2f5;z-index:9;display:  flex;flex-direction:  column;" v-if="showStatus">
    <div class="header">
        回评
        <img class="setting-img" @click="closeCount" src="../assets/images/close.png" alt="">
    </div>
    <div class="container" style="padding:30px 15px 20px;">
      <div class="title">请选择要回评的题块<span>（列表最上面一条为最近提交的题块）</span></div>
      <div class="con-header">
        <div>密号</div>
        <div>评分</div>
        <div>评卷时间</div>
      </div>
      <div class="content" v-for="item in dataList" :key="item.id">
        <div style="text-decoration: underline;color: #ffa900;" @click="backClick(item)">{{item.Paperid}}</div>
        <div>{{item.Score}}</div>
        <div>{{item.Rescoretime}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetMarkedBuffer } from "../api/api.js"
export default {
  data () {
    return {
      showStatus:'',
      dataList:[],
      tableData:[{
          "index":"123456",
          "name":"25",
          "readStudent":"2018-12-12 22:32:12"
        },{
          "index":"456342",
          "name":"15",
          "readStudent":"2017-07-17 09:23:12"
        },{
          "index":"065433",
          "name":"33",
          "readStudent":"2017-12-12 12:16:11"
        },{
          "index":"213556",
          "name":"45",
          "readStudent":"2018-4-14 12:14:18"
        }]
    };
  },
  props:{
    showBack:{

    } 
  },
  methods: {
    closeCount() {
      this.showStatus =false;
      this.$emit("onchange",this.showStatus)
    },
    backClick(data){
      this.showStatus =false;
      // sessionStorage.put("backItem",data);
      this.$emit("onback",data)
    },
    backComment(){
   // {examid:"EXAM115",subjectid:"33",userid:"1658",itemid:"1",tasktype:"N",iFetchRoleid:0,iProblem:0}
      var sessObj = JSON.parse(sessionStorage.getItem("jumpObj"));
      var param = {
        examid:sessObj.examid,
        subjectid:sessObj.subjectid,
        itemid:sessObj.itemid,
        userid:sessObj.u,
        tasktype:"N",
        iFetchRoleid:0,
        iProblem:0
      };
      this.dataList=[];
      GetMarkedBuffer(param).then((res)=>{
        console.log(res)
        res.d.map((item,index)=>{
          this.dataList.push(item)
        });
        console.log(this.dataList)
      })
    }
  },
  created(){
     
  },
  watch: {
    showBack (){
      this.backComment();
      console.log(123)
      this.showStatus = this.showBack;
    }
  }
}

</script>
<style lang="scss" scoped>
.header {
  flex:0 0 50px;
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  position: relative;
  background: #fff;
  img {
    vertical-align: middle;
    position: absolute;
    top:50%;
    margin-top: -20px;
    height:40px;
  }
  .back-img {
    left: 1rem;
  }
  .setting-img {
   
    right: 1rem;
  }
}
.container {
  height: 100%;
  overflow: scroll;
  .title {
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 15px;
    span {
      font-weight: normal;
      color: #a2a3a7;
      font-size: 12px;
    }
  }
  .con-header {
    font-weight: bold;
  }
  .con-header{
    border-radius: 5px 5px 0 0;
  }
  .content:last-child {
    border-radius: 0 0 5px 5px;
  }
  .con-header ,.content {
    display: flex;
    align-items: center;
    margin-bottom: 1px;
    background: #fff;
    div {
      padding: 15px 15px;
    }
    div:nth-of-type(1) {
      flex: 0 0 20%;
      padding-left:25px;
    }
    div:nth-of-type(2) {
      flex: 0 0 10%;
    }
    div:nth-of-type(3) {
      flex: 1;
    }
  }
  
}
</style>