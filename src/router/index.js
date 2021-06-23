import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
/* eslint-disable */
import Login from '@/components/Login'
import mainPage from '@/components/mainPage'
import studySample from '@/views/studySample'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/mainPage',
      name: 'mainPage',
      component: mainPage
    },
    {
      path: '/studySample',
      name: 'studySample',
      component: studySample
    }
  ]
})
