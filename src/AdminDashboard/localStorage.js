export function setToken(token) {
  sessionStorage.setItem("AccessToken",token);
}

export function clearToken() {
  sessionStorage.removeItem("AccessToken");
}

export function getToken() {
  return sessionStorage.getItem("AccessToken");
}
