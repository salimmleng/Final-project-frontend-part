
function loadDoctorNavbar() {
  fetch("navber.html")
      .then((res) => res.text())
      .then((data) => {
          document.getElementById("navbar").innerHTML = data;
          const dynamicContent = document.querySelector(".navbar-collapse .d-flex");

          const token = localStorage.getItem("token");

          if (token) {
              dynamicContent.innerHTML = `
                  
                  <button class="profile-btn mx-2"><a href="./doc_dashboard.html" class="btn-bold">Profile</a></button>
                  <button class="logout-btn"><a onclick="handleLogout()" class="btn-bold">Logout</a></button>
              `;
          } else {
              dynamicContent.innerHTML = `
                  <a href="./login.html" class="btn btn-success mx-2">Login</a>
                  <a href="./registration.html" class="btn btn-danger mx-2">Register</a>
              `;
          }
      });
}

function loadPatientNavbar() {
  fetch("navber.html")
      .then((res) => res.text())
      .then((data) => {
          document.getElementById("navbar").innerHTML = data;
          const dynamicContent = document.querySelector(".navbar-collapse .d-flex");

          const token = localStorage.getItem("token");

          if (token) {
              dynamicContent.innerHTML = `
                  <button class="profile-btn mx-2"><a href="./patient_profile.html" class="btn-bold">Profile</a></button>
                  <button class="logout-btn"><a onclick="handleLogout()" class="btn-bold">Logout</a></button>
              `;
          } else {
              dynamicContent.innerHTML = `
                  <a href="./login.html" class="btn btn-success mx-2">Login</a>
                  <a href="./registration.html" class="btn btn-danger mx-2">Register</a>
              `;
          }
      });
}

const userRole = localStorage.getItem('userRole');

if (userRole === 'doctor') {
  loadDoctorNavbar();
} else if (userRole === 'patient') {
  loadPatientNavbar();
} else {
  fetch("navber.html")
  .then((res) => res.text())
  .then((data) => {
      document.getElementById("navbar").innerHTML = data;
      const dynamicContent = document.querySelector(".navbar-collapse .d-flex");

      dynamicContent.innerHTML = `
          <a href="./login.html" class="submit-btn text-white mx-2">Login</a>
          <a href="./registration.html" class="btn btn-outline-danger btn-bold btn-deep">Register</a>
      `;
  });
}





