<!-- alert提示框 -->
<template>
  <div style="height:100%; width:100%;position:fixed;top:0;left:0; z-index:99;" v-show="isShow">
    <div class="wrapper">
      <div class="container">
        <div class="text" v-text="alertText"></div>
        <div class="btn" @click="alertClick">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  props:{
    alertText:{
    },
    isShow:{

    }
  },
  methods: {
    alertClick(){
      this.$emit("onchange",true);
    }
  }
}

</script>
<style lang="scss" scoped>
.wrapper {
  position: fixed;
  background: rgba(0, 0, 0, .3);
  height: 100%;
  width: 100%;
 
  .container {
    position: relative;
    left: 50%;
    top: 50%;
    width: 80%;
    height: 80px;
    transform: translate(-50%,-50%);
    // left: 50%;
    // margin-top: 50%;
    // margin-left:50%;
    text-align: center;
    .text {
      padding: 12px 15px;
      line-height: 30px;
      background-color: #fff;
    }
    .btn {
      color: #ff7a00;
      font-size: 15px;
      height: 45px;
      line-height: 45px;
      background-color: #fff;
      border-top: 1px solid #f0f2f5;
    }
  }
}
</style>