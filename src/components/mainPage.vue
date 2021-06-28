<template>
  <div class="page-container">
    <div class="login-form-left-side">
      <div class="login-btn-wrap">
        <button class="login-btn" v-on:click="study">Study</button>
      </div>

    </div>

  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'mainPage',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created () {
  },
  methods:{
    study: function(){
      alert("test");
      //기기 테스트
      let userAgent = navigator.userAgent;

      //browser 일 경우
      let browser = userAgent.match(/Windows/);
      if(browser){
        this.$router.push('/studySample');
      }

      //ios 일 경우
      let iosV = userAgent.match(/iphon|iPad|iPod/);
      //android 일 경우
      let androidV = userAgent.match(/android/);
      if(androidV){
        alert(androidV);
        if(userAgent.match(/Chrome/)){
          alert("clcik");
          location.href = "intent://edulab#Intent;scheme=htmltest;package=com.edulab.htmltest;end";

        }
      }


    }
  }

}

</script>
