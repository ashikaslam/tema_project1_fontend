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
	  const apiKey = '8fd0dea37bef163ec5e52f7b7748398e';
	  const apiUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;
  
	  fetch(apiUrl, {
		method: 'POST',
		body: formData
	  })
	  .then(response => response.json())
	  .then(data => {
		if (data.success) {
		  let profile_pic = data.data.url;
		  // Code to store the imageUrl in your database
		 const info={
			profile_pic,
		 };
		 //  jwt 
         const token = localStorage.getItem("access");
         const refresh = localStorage.getItem("refresh");

         //
		  fetch("http://127.0.0.1:8000/user_profile/add_profile_pic_during_register/", {
			method: "POST",
			headers: { Authorization: `Bearer ${token}`,
				     "Content-Type": "application/json" },
			body: JSON.stringify(info),
		  })
		  .then(res => res.json())
		  .then(data => {
			console.log(data);
		  })
		  .catch(err => {
			console.error(err);
		  });
		} else {
		  console.error("Image upload failed");
		}
	  })
	  .catch(error => {
		console.error("Error:", error);
	  });
	}
  }
  



