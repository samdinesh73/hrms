// Logout utility function
export function logout() {
  // Clear localStorage
  localStorage.removeItem("authToken")
  localStorage.removeItem("userId")
  localStorage.removeItem("userRole")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userName")

  // Clear auth cookie
  document.cookie = "authToken=; path=/; max-age=0; SameSite=Strict"
}
