function Registration() {
  let isValid = true;

  // Get form data
  let first_name = document.getElementById("firstName").value;
  let last_name = document.getElementById("lastName").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  let date_of_birth = document.getElementById("birthDate").value;
  let email = document.getElementById("emailAddress").value;
  var gender = document.querySelector('input[name="gender"]:checked').value;
  console.log(gender);
  // Clear previous error messages
  document.getElementById("firstNameError").style.display = "none";
  document.getElementById("lastNameError").style.display = "none";
  document.getElementById("passwordError").style.display = "none";
  document.getElementById("confirmPasswordError").style.display = "none";
  document.getElementById("birthDateError").style.display = "none";
  document.getElementById("emailAddressError").style.display = "none";

  // Validate fields
  if (first_name.length < 2) {
    document.getElementById("firstNameError").innerText =
      "First name must be at least 2 characters long";
    document.getElementById("firstNameError").style.display = "block";
    isValid = false;
  }
  if (last_name.length < 2) {
    document.getElementById("lastNameError").innerText =
      "Last name must be at least 2 characters long";
    document.getElementById("lastNameError").style.display = "block";
    isValid = false;
  }
  if (!validateName(first_name)) {
    document.getElementById("firstNameError").innerText =
      "Name must contain only English alphabets (a-z, A-Z)";
    document.getElementById("firstNameError").style.display = "block";
    isValid = false;
  }
  if (!validateName(last_name)) {
    document.getElementById("lastNameError").innerText =
      "Name must contain only English alphabets (a-z, A-Z)";
    document.getElementById("lastNameError").style.display = "block";
    isValid = false;
  }

  if (date_of_birth === "") {
    document.getElementById("birthDateError").innerText =
      "This field cannot be empty";
    document.getElementById("birthDateError").style.display = "block";
    isValid = false;
  }
  if (!validateEmail(email)) {
    isValid = false;
  }

  // Validate password length
  if (password.length < 6) {
    document.getElementById("passwordError").innerText =
      "Password must be at least 6 characters long";
    document.getElementById("passwordError").style.display = "block";
    isValid = false;
  }

  // Validate password match
  if (password != confirmPassword) {
    document.getElementById("confirmPasswordError").innerText =
      "Passwords do not match";
    document.getElementById("confirmPasswordError").style.display = "block";
    isValid = false;
  }

  // Validate birth date
  let today = new Date();
  let inputBirthDate = new Date(date_of_birth);
  let age = today.getFullYear() - inputBirthDate.getFullYear();
  let monthDiff = today.getMonth() - inputBirthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < inputBirthDate.getDate())
  ) {
    age--;
  }

  if (age < 14) {
    document.getElementById("birthDateError").innerText =
      "You must be at least 14 years old";
    document.getElementById("birthDateError").style.display = "block";
    isValid = false;
  }
  if (age > 120) {
    document.getElementById("birthDateError").innerText = "You are too  old";
    document.getElementById("birthDateError").style.display = "block";
    isValid = false;
  }

  ///
  let location = localStorage.getItem("location");
  if (location != 1 && isValid) {
    if (
      confirm(
        "For better performance, we need to access your location. Do you allow it?"
      )
    ) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            var latitude1 = position.coords.latitude;
            var longitude1 = position.coords.longitude;
            localStorage.setItem("latitude", latitude1);
            localStorage.setItem("longitude", longitude1);
            localStorage.setItem("location", 1);
          },
          (error) => {
            console.error("Error Code = " + error.code + " - " + error.message);
            localStorage.setItem("location", 1);
            localStorage.setItem("latitude", null);
            localStorage.setItem("longitude", null);
          }
        );
      }
    } else {
      localStorage.setItem("location", 1);
    }
  }
  let latitude = localStorage.getItem("latitude");
  let longitude = localStorage.getItem("longitude");
  ///
  /// data taking complte
  let info = {
    first_name,
    last_name,
    password,
    date_of_birth,
    email,
    latitude,
    longitude,
    gender,
  };
  console.log(info);
  /// request making
  if (isValid) {
    fetch("http://127.0.0.1:8000/auth/signup/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(info),
    })
      .then((res) => {
        return res.json(); // Explicitly return res.json()
      })

      .then((data) => {
        if ("message" in data) {
          let email = data.email;
          let token1 = data.token1;
          let token2 = data.token2;
          localStorage.setItem("email", email);
          localStorage.setItem("token1", token1);
          localStorage.setItem("token2", token2);
          if (data.status == 1) {
            window.location.href = `otp_verification/index.html`;
          }
          // 'message' property exists, perform your action
        } else {
          let errorString = data.error;
          if (
            errorString ==
            "{'email': [ErrorDetail(string='user with this email already exists.', code='unique')]}"
          ) {
            document.getElementById("emailAddressError").innerText =
              "user with this email already exists.";
            document.getElementById("emailAddressError").style.display =
              "block";
          }
        }

        //console.log("inside data ");
        // console.log(data);
        // console.log(data.status)

        // if (data.status==1){
        //   console.log("helllo inside")
        //   window.location.href=`otp.html?url=${data.activaton_url}`;
        // }
      })

      .catch((err) => {
        console.log("inside err ");
        console.log(err);
        localStorage.clear();
      });
  }
  ///
  return isValid;
}

// extra code
function validateName(name) {
  // Regular expression to match only English alphabets (a-z and A-Z)
  const regex = /^[A-Za-z]+$/;
  return regex.test(name);
}

// Function to validate email address
function validateEmail(email) {
  // Regular expression to validate email address
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Check if the email field is empty
  if (email === "") {
    document.getElementById("emailAddressError").innerText =
      "This field cannot be empty";
    document.getElementById("emailAddressError").style.display = "block";
    return false;
  }
  // Check if the email address is valid
  else if (!emailRegex.test(email)) {
    document.getElementById("emailAddressError").innerText =
      "Please enter a valid email address";
    document.getElementById("emailAddressError").style.display = "block";
    return false;
  } else {
    document.getElementById("emailAddressError").style.display = "none";
    return true;
  }
}
//////////////////////////////////

function login() {
  let isValid = true;
  let password = document.getElementById("password1").value;
  let email = document.getElementById("emailAddress1").value;
  // Clear previous error messages
  document.getElementById("passwordError").style.display = "none";
  document.getElementById("emailAddressError").style.display = "none";

  console.log(password, email);

  if (!validateEmail(email)) {
    isValid = false;
  }
  if (password.length < 6) {
    document.getElementById("passwordError").innerText =
      "Password must be at least 6 characters long";
    document.getElementById("passwordError").style.display = "block";
    isValid = false;
  }
  ///
  /// data taking complte
  let info = {
    password,
    email,
  };
  console.log(info);
  /// request making
  if (isValid) {
    fetch("http://127.0.0.1:8000/auth/login/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(info),
    })
      .then((res) => {
        return res.json(); // Explicitly return res.json()
      })

      .then((data) => {
        if ("message" in data) {
          if (data.status == 1) {
            console.log(data);
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("profile_id", data.profile_id);
            localStorage.setItem("profile_picture", data.profile_picture);
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            window.location.href = `../profile_pic_upload/index.html`;
            window.location.href = `index.html`;
          } else {
            document.getElementById("passwordError").innerText =
              "Your email address and password do not match our records. Please check your credentials and try again.";
            document.getElementById("passwordError").style.display = "block";
            isValid = false;
          }
        } else {
          document.getElementById("passwordError").innerText =
            "Your email address and password do not match our records. Please check your credentials and try again.";
          document.getElementById("passwordError").style.display = "block";
          isValid = false;
        }
      })

      .catch((err) => {
        document.getElementById("passwordError").innerText =
          "Your email address and password do not match our records. Please check your credentials and try again.";
        document.getElementById("passwordError").style.display = "block";
        isValid = false;
        localStorage.clear();
      });
  }
}
