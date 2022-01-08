export const authGuard = (auth) => (to, from, next) => {
  if (to.meta.auth) {
    const loggedIn = auth.loggedIn()
    const hasRole = typeof to.meta.auth !== 'string' || auth.hasRole(to.meta.auth)

    if (!loggedIn | !hasRole) {
      return next('/')
    }
  }

  next()
}
