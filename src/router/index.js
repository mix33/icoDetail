import Vue from 'vue'
import Router from 'vue-router'
import icoDetail from '@/components/icoDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'icoDetail',
      component: icoDetail
    }
  ]
})
