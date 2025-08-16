export default defineNuxtRouteMiddleware((to) => {
  if (typeof window !== 'undefined') {
    console.log("Running auth middleware on client side");
    const authData = JSON.parse(localStorage.getItem("sb-api-auth-token"));

    if (!authData && to.path !== "/login") {
      return navigateTo("/login");
    }

    try {
      if (!authData?.user) {
        localStorage.removeItem("sb-api-auth-token");
        return navigateTo("/login");
      }
    } catch {
      localStorage.removeItem("sb-api-auth-token");
      return navigateTo("/login");
    }
  }
});