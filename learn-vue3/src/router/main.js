const mainRoute = [
  {
    path: 'index',
    name: 'index',
    component: () => import('../views/home/index.vue'),
    meta: { title: '首页' }
  }
];

export default mainRoute;