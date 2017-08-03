import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'todos',
      component: require('@/components/Todos')
    },
    {
      path: '/new',
      name: 'new',
      component: require('@/components/NewTodo')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
