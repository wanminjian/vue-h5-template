import router from '@/router'
import { USER_DATA } from '@/utils/const'
import * as cookieUtil from '@/utils/cookieutil'

const whiteList = ['/login', '/register']

router.beforeEach(async (to, from, next) => {
  // determine whether the user has logged in
  const hasToken = cookieUtil.get(USER_DATA)
  if (hasToken) {
    if (to.path === '/login') {
      // 已经登录，跳转到首页
      next({ path: '/holders' })
    } else if(to.matched.length === 0){
      next({ path: '/holders' })
    } else {
      next()
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})
