// Auth utilities
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userId")
  }
}

export const setUserRole = (role: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userRole", role)
  }
}

export const getUserRole = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userRole")
  }
  return null
}

export const setUserId = (id: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userId", id)
  }
}

export const getUserId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId")
  }
  return null
}

export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("authToken")
  }
  return false
}
