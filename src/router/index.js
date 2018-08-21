import Vue from 'vue'
import Router from 'vue-router'

import blockList from '../components/blockList'
import login from '../components/login'
import favoriteList from '../components/favoriteList'
import backComment from '../components/backComment'
import myCount from '../components/myCount'
import readPaper from '../components/readPaper'
import optionCon from '../components/optionCon'
import alert from '../components/alert/alert'


Vue.use(Router)

var router =  new Router({
  routes: [
    {
      path: '/',
      redirect: '/param=""'
    },
    {
      path: '/:param',
      component: login
    },
    {
      path: '/blocklist/:token',
      component: blockList
    },
    {
      path: '/favoriteList',
      component: favoriteList
    },
    {
      path: '/backComment',
      component: backComment
    },
    {
      path: '/myCount',
      component: myCount
    },
    {
      path: '/readPaper/:id',
      name:'readPaper',
      component: readPaper
    },
    {
      path: '/optionCon',
      name:'optionCon',
      component: optionCon
    },
    {
      path: '/alert',
      name:'alert',
      component: alert
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to.path.indexOf('param') !== -1)
  console.log(to.path.startsWith('/'))
  if (to.path.indexOf('param') !== -1) {
    window.sessionStorage.removeItem('access-user')
    next()
  } else {  //如果不是跳转的登录页面，就需要验证是否存在storage,不存在就需要重新去登陆
    let user = JSON.parse(window.sessionStorage.getItem('access-user'))
    if (!user) {
      next({path: '/'})
    } else {
      next()
    }
  }
});

export default router