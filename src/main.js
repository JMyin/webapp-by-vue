// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import Goods from './components/goods/goods';
import Seller from './components/seller/seller';
import Ratings from './components/ratings/ratings';

import './common/stylus/index.styl';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueResource);
// const goods = {
// 	template: Goods
// };
// const ratings = {
// 	template: Ratings
// };
// const seller = {
// 	template: Seller
// };
const routes = [
    {
      path: '/',
      redirect: '/goods'
    },
    { path: '/goods',
      component: Goods
    },
    { path: '/seller',
      component: Seller
    },
    { path: '/ratings',
      component: Ratings
    }
];
const router = new VueRouter({
  linkActiveClass: 'active',
  mode: 'hash',
  routes
});
/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App },
  ...App
});
// router.push('/goods');

