/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
    // {
    //     path: '/',
    //     redirect: '/login',
    // },
    {

        path: '/login',
        name: 'Login',
        component: () => import('@/views/user/login'),
        meta: {title: '登录页', keepAlive: false, index: 1}
    },
    {
        path: '/',
        name: 'tab',
        component: () => import('@/views/user/tabbar'),
        children: [
            {
                path: 'holders',
                name: 'holdList',
                component: () => import('@/views/user/holdList'),
                meta: {title: '我的持仓列表', keepAlive: false, index: 2}
            },

            {
                path: 'user/pay',
                name: 'pay',
                component: () => import('@/views/user/payList'),
                meta: {title: '入金记录', keepAlive: false, index: 4}
            },
            {
                path: 'user/trade',
                name: 'trade',
                component: () => import('@/views/user/tradeList'),
                meta: {title: '交易记录', keepAlive: false, index: 5}
            }
        ]
    },
    {
        path: '/product/:id',
        name: 'productInfo',
        component: () => import('@/views/user/productInfo'),
        meta: {title: '产品详情', keepAlive: false, index: 3}
    },
];
