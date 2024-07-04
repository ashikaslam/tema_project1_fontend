


  async function fetchDataWithAuth(url,info,method) {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  async function fetchWithAccessToken() {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(info),
    });

    if (response.status === 200) {
      return response.json();
    } else if (response.status === 401) {
      // Unauthorized, attempt to refresh the token
      return await fetchWithRefreshToken();
    } else {
      throw new Error("Request failed");
    }
  }



  /////////////////

  async function fetchWithRefreshToken() {
    const refreshResponse = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refresh }),
    });

    if (refreshResponse.status === 200) {
      const refreshData = await refreshResponse.json();
      localStorage.setItem("access", refreshData.access);
      localStorage.setItem("refresh", refreshData.refresh);

      // Retry the original request with the new access token
      return await fetchWithAccessToken();
    } else {
      // Refresh token failed, redirect to login
      window.location.href = `landing.html`;
    }
  }

  try {
    return await fetchWithAccessToken();
  } catch (error) {
    console.error(error);
    window.location.href = `landing.html`;
  }
}
////////////////

















// // Include this in each file where you need the fetchDataWithAuth function

// const config = {
//   baseUrl: window.location.origin,
//   paths: {
//       login: '/path/to/login.html',
//       userProfile: '/path/to/userprofile.html',
//       index: '/path/to/index.html'
//   }
// };
