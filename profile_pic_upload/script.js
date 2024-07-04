const selectImage = document.querySelector(".select-image");
const inputFile = document.querySelector("#file");
const imgArea = document.querySelector(".img-area");
const element = document.getElementById("submit");
element.classList.add("invisible");

selectImage.addEventListener("click", function () {
  inputFile.click();
});

inputFile.addEventListener("change", function () {
  const image = this.files[0];
  if (image.size < 10000000) {
    const reader = new FileReader();
    reader.onload = () => {
      const allImg = imgArea.querySelectorAll("img");
      allImg.forEach((item) => item.remove());
      const imgUrl = reader.result;
      const img = document.createElement("img");
      img.src = imgUrl;
      imgArea.appendChild(img);
      imgArea.classList.add("active");
      imgArea.dataset.img = image.name;
      if (element.classList.contains("invisible")) {
        element.classList.remove("invisible");
      }
    };
    reader.readAsDataURL(image);
  } else {
    alert("Image size more than 10MB");
  }
});

function submit_img() {
  const image = inputFile.files[0];
  if (image) {
    const formData = new FormData();
    formData.append("image", image); // 'image' is the key required by ImageBB API

    // Uploading pic to ImageBB, then get the URL and store it in our database
    const apiKey = "8fd0dea37bef163ec5e52f7b7748398e";
    const apiUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    fetch(apiUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          let profile_pic = data.data.url;
		  console.log(profile_pic);
          // Code to store the imageUrl in your database
          const info = {
            profile_pic,
          };
          const url =
            "http://127.0.0.1:8000/user_profile/add_profile_pic_during_register/";
          fetchDataWithAuth(url, info, "POST");
        } else {
          console.error("Image upload failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

/// autc and fech

async function fetchDataWithAuth(url, info, method) {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");
  console.log(access,refresh);
  
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
    }
     else if (response.status === 401) {
      // Unauthorized, attempt to refresh the token
      console.log(response);
      while(1){}
     // return await fetchWithRefreshToken();
     
    }
     else {
      throw new Error("Request failed");
    }
  }

  /////////////////

  async function fetchWithRefreshToken() {
    const refreshResponse = await fetch(
      "http://127.0.0.1:8000/api/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: refresh }),
      }
    );

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
    window.location.href = `../landing.html`;
  }
}
////////////////
