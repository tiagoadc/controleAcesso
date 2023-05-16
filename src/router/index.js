
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login.vue'
import store from '../store/index'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    
    if (store.state.authLogin != true) {
      
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      
      next()
    }
  } else {
    
    next() // make sure to always call next()!
  }
  
})

export default router



