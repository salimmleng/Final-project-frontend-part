

const getAllvaccines = () => {
  const token = localStorage.getItem("token");
  fetch("http://127.0.0.1:8000/api/vaccines/",{
      // headers: {
      //     Authorization: `Token ${token}`,
      //   },

  })
      .then((res) => res.json())
      .then((vaccines) => {
          console.log(vaccines)
          
          const allvaccines = document.getElementById("vaccine-container")
          vaccines.forEach((vaccine) => {
              console.log(vaccine)
              const div = document.createElement("div")
              div.classList.add("col-md-4","mb-4")
              
              div.innerHTML = `
                  <div class="card ">
                    <img src="static/images/meas.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h6>Vaccine: ${vaccine.name}</h6>
                        <h6>Vaccine ID: ${vaccine.id}</h6>
                        <h6>Manufacturer: ${vaccine.manufacturer}</h6>
                        <h6>Batch Number: ${vaccine.batch_number}</h6>
                        <h6>Expiry date: ${vaccine.expiry_date}</h6>
                        <a href="vaccine_detail.html?id=${vaccine.id}" class="btn btn-outline-primary" type="submit">Show details</a>
                    </div>
                </div>
     
                             
          `
          allvaccines.appendChild(div)

          })

      })

}
getAllvaccines()


















const getQueryParams = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  const getVaccineDetail = () => {
    const vaccineId = getQueryParams("id");
    const token = localStorage.getItem("token");
    console.log(vaccineId)
    fetch(`http://127.0.0.1:8000/api/vaccines/${vaccineId}/`,{
        method: "GET",
        // headers: {
        //     Authorization: `Token ${token}`,
        //   },

    })
        .then((res) => res.json())
        .then((vaccine) => {
            console.log(vaccine)
            
            const allvaccines = document.getElementById("vaccine_detail-container")
            const div = document.createElement("div")
              div.classList.add("col-md-4","mb-4")

              let buttonHTML = ""
               if (token){
                  buttonHTML = `
                         <button
                            type="button"
                            class="btn btn-info"
                            data-bs-toggle="modal"
                            data-bs-target="#addModal"
                            >
                            Book dose
                          </button>
                  `
               }
               else{
                  buttonHTML = '<p><a class="text-decoration-none text-danger" href="Registration.html">Register to book dose</a></p>'
               }
              
              div.innerHTML = `
                  <div class="card ">
                    <img src="static/images/meas.jpg" class="card-img-top2" alt="...">
                    <div class="card-body">
                        <h6>Vaccine: ${vaccine.name}</h6>
                        <h6>Vaccine: ${vaccine.id}</h6>
                        <h6>Manufacturer: ${vaccine.manufacturer}</h6>
                        <h6>Batch Number: ${vaccine.batch_number}</h6>
                        <h6>Expiry date: ${vaccine.expiry_date}</h6>
                        ${buttonHTML}
                        
                    </div>
                </div>
                       
          `
          allvaccines.appendChild(div)
        })


}

getVaccineDetail()

  // add dose 


const loadDates = ()=>{
    // const token = localStorage.getItem("token");
    const vID = getQueryParams("id");
    fetch(`http://127.0.0.1:8000/vaccine/api/available_dates/?id=${vID}`
       
    )
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        console.log(item)
        const parent = document.getElementById("date-container");
        const option = document.createElement("option");
        option.value = item.id;
        option.innerText = item.date;
        parent.appendChild(option);
      });
      console.log(data);
    });

}


loadDates()


const loadHospitalname = ()=>{
  // const token = localStorage.getItem("token");
  const vID = getQueryParams("id");
  fetch(`http://127.0.0.1:8000/vaccine/api/available_hospitals/?id=${vID}`
     
  )
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      console.log(item)
      const parent = document.getElementById("center-container");
      const option = document.createElement("option");
      option.value = item.id;
      option.innerText = item.name;
      parent.appendChild(option);
    });
    console.log(data);
  });

}


loadHospitalname()



const handleTakeVaccine=(event)=>{
    
    event.preventDefault();
    const vaccine = getQueryParams("id");
    const mobile = document.getElementById("mobile_no").value
    const firstDose_date = document.getElementById("date-container")
    const selectedDate = firstDose_date.options[firstDose_date.selectedIndex]
    const center = document.getElementById("center-container")
    const selectedCenter = center.options[center.selectedIndex]
    const patientID = localStorage.getItem("user_id")


    const info ={
      user: patientID,
      vaccine_status: "Pending",
      firstDose_date_id: parseInt(selectedDate.value),
      mobile_no: mobile,
      vaccine_center_id: parseInt(selectedCenter.value),
      cancel: false,
      vaccine_id: parseInt(vaccine),


    }
    
    console.log(JSON.stringify(info))
    
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/vaccine/api/doses/", {
      method: "POST",
      headers: { "content-type": "application/json",
             Authorization: `Token ${token}`,
       },
      body: JSON.stringify(info),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showAlert("First dose scheduled successfully!", "success");
        $("#addModal").modal("hide");
         
      });
      
     
}

const showAlert = (message, type) => {
  const alertContainer = document.getElementById("alert-container");
  alertContainer.innerHTML = `
      <div class="custom-alert ${type}">
          ${message}
          <span class="close-btn" onclick="this.parentElement.style.display='none'">&times;</span>
      </div>
  `;
};


document.getElementById("bookingForm").addEventListener("submit", handleTakeVaccine);

// review section


const submitReview = (event) => {
  event.preventDefault();
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;
  const vaccineId = getQueryParams("id");
  const token = localStorage.getItem("token");

  fetch("http://127.0.0.1:8000/vaccine/reviews/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
          vaccine: vaccineId,
          rating: rating,
          comment: comment,
      }),
  })
  .then((res) => res.json())
  .then((data) => {
      console.log(data);
      // alert("Review submitted successfully!");
      document.getElementById("review-form").reset();
  })
  .catch((error) => {
      console.error("Error:", error);
      alert("Failed to submit review. Please try again.");
  });
};

document.getElementById("review-form").addEventListener("submit", submitReview);
