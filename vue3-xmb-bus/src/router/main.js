const mainRoute = [
  {
    path: 'todoList',
    component: () => import('../views/todoList/todoList.vue'),
    meta: { title: '待办事项' }
  },
  {
    path: 'announcement',
    component: () => import('../views/announcement/announcement.vue'),
    meta: { title: '消息通知' }
  }
];

export default mainRoute;