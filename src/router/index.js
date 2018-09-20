import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/indexmusic',
      name: 'icon-music',
      component() {
        return System.import("../views/indexmusic/index.vue")
      }
    },
    {
      path: '/faxianmusic',
      name: 'icon-wangyiyunyinlezizhi-copy',
      component() {
        return System.import("../views/faxianmusic/index.vue")
      }
    },
    {
      path: '/radiomusic',
      name: 'icon-diantai',
      component() {
        return System.import("../views/radiomusic/index.vue")
      }
    },
    {
      path: '/',
      name: 'icon-diantai',
      redirect: '/indexmusic'
    }
  ]
})
