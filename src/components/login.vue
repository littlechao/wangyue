<!-- 登陆页面 -->
<template>
  <div>
    <div class="header">
      <img src="../assets/images/return.png" alt="">
      评卷系统登录
    </div>
    <div class="title">
      <img src="../assets/images/title.png" alt="">
    </div>
    <div class="container">
      <div class="input-warapper">
        <span class="text">评卷账号</span>
        <input type="text" id="name" v-model="name" maxlength="11" placeholder="请输入评卷账号">
      </div>

      <div class="input-warapper">
        <span class="text">评卷密码</span>
        <input type="password" v-model="password" id="password" placeholder="请输入评卷密码">
      </div>
      <p>若您没有评卷账号，请联系本校考务相关老师申请</p>
      <!-- <router-link to="/blocklist"> -->
      <div class="submit-btn" @click="login">登录</div>
      <p v-show="isError" style="text-align:center;color:#ff4053">您输入的身份或密码有误,请核实后重新输入</p>
      <!-- </router-link> -->
    </div>
    <!-- <alert-tem :is-show="alertShow" :alert-text="12321" @onchange="change"></alert-tem> -->
  </div>
  
</template>

<script>
import { login } from "../api/api.js";
import {getUrlParms} from '../assets/js/util.js'
import alert from './alert/alert';
export default {
  data () {
    return {
      isError:false,
      name:"13888888888",
      password:'123456',
      alertShow:true
    };
  },

  components: {
    alertTem:alert
  },
  created () {
    var index = this.$route.params.param.indexOf("=");
    if (this.$route.params.param.indexOf("userid")!=='-1' && this.$route.params.param.indexOf("pswd")!=='-1') {
      var param = JSON.parse(this.$route.params.param.slice(index+1))
      console.log(param)
      if (param) {
        this.login(param.userid,param.pswd)
      }
    }
    
  },
  methods: {
    change(val){
      this.alertShow =!this.alertShow;
      console.log(val)
    },
    login(name,password){
      console.log(123);
      var params = {
        userid:this.name ||name,
        pswd:this.password ||password
      };
      login(params).then((res)=>{
        console.log(res)
        if (!res.d) {
          this.isError =true;
        } else {
          window.sessionStorage.setItem('access-user',true);
          this.$router.push({
            path: '/blocklist/'+res.d.split('?u=')[1]
            // path: '/blocklist'
          })
          
        }
      });
    }
  }
}

</script>
<style  lang="scss" scoped>
.header {
  height: 50px;
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 4.3vw;
  font-weight: bold;
  position: relative;
  img {
    vertical-align: middle;
    position: absolute;
    left: 10px;
    top:50%;
    margin-top: -8px;
    height: 15px;
  }
}
.title {
  height: 150px;
  width: 100%;
  background:url('../assets/images/headerImg.png') no-repeat center;  
  
  background-size:cover;
  position: relative;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 23%;
    transform: translate(-50%,-50%);
  }
}
.container {
  padding: 6% 7%;
  p{
    width: 100%;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    text-align: left;
    color:#6f6f6f;
    margin-top: 10px;
    font-size: 13px;
    transform: scale(0.9);
    margin-left: -5px;
  }
  .submit-btn {
    height: 50px;
    background-size: contain;
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 15px;
    margin-top: 20px;
    background-image: url('../assets/images/submit_btn.png');
    background-repeat: no-repeat;
  }
  .input-warapper {
    border-radius: 5px;
    height: 45px;
    line-height: 45px;
    padding-left: 15px;
    background-color: #f0f2f5;
    &:nth-of-type(1) {
      margin-bottom: 4%;
    }
    .text {
      font-weight: bold;
      margin-right: 15px;
    }
    input {
      font-size: 14px;
      outline: none;
      border: none;
      background-color: #f0f2f5;
    }
  }
}
::-webkit-input-placeholder{
    color: #a1a2a6;
}
</style>