

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
                    <img src="http://127.0.0.1:8000/${vaccine.image}" class="card-img-top2" alt="...">
                    <div class="card-body">
                        <h6 class="card-title mb-2">Vaccine: ${vaccine.name}</h6>
                        <p class="card-text">Manufacturer: ${vaccine.manufacturer}</p>
                        <p class="card-text">Batch Number: ${vaccine.batch_number}</p>
                        <p class="card-text">Age limit: ${vaccine.age_limit}</p>
                        <p class="card-text">Expiry date: ${vaccine.expiry_date}</p>
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
                    <img src="http://127.0.0.1:8000/${vaccine.image}" class="card-img-top2" alt="...">
                    <div class="card-body">
                       <h6 class="card-title">Vaccine: ${vaccine.name}</h6>
                        <p class="card-text">Manufacturer: ${vaccine.manufacturer}</p>
                        <p class="card-text">Batch Number: ${vaccine.batch_number}</p>
                        <p class="card-text">Age limit: ${vaccine.age_limit}</p>
                        <p class="card-text">Expiry date: ${vaccine.expiry_date}</p>
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
        localStorage.setItem(`bookedDose_${vaccine}`, "true");  // store dose id
        displayReviewForm();
         
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


// display review form

const displayReviewForm = () => {
  const vaccineId = getQueryParams("id");
  const formContainer = document.getElementById("review-form-container");

  const hasBookedDose = localStorage.getItem(`bookedDose_${vaccineId}`) === "true";

  if (hasBookedDose) {
    formContainer.innerHTML = `
      <div class="mx-auto w-75 mt-5">
        <h3 class="text-center my-2">Review this vaccine</h3>
        <form id="review-form" class="pt-2 bord" onsubmit="submitReview(event)">
          <div class="mb-3">
            <label for="rating" class="form-label mx-2">Rating</label>
            <select id="rating" class="form-select" required>
              <option value="⭐">⭐</option>
              <option value="⭐⭐">⭐⭐</option>
              <option value="⭐⭐⭐">⭐⭐⭐</option>
              <option value="⭐⭐⭐⭐">⭐⭐⭐⭐</option>
              <option value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="comment" class="form-label mx-2">Comment</label>
            <textarea class="form-control" id="comment" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary mx-2 my-2">Submit</button>
        </form>
      </div>
    `;
  } else {
    formContainer.innerHTML = "<p class='text-center text-warning fw-bold'>You must book a dose before giving a review.</p>";
  }
};

// Call displayReviewForm to set initial state
displayReviewForm();


// review section


const submitReview = (event) => {
  event.preventDefault();
  const reviewerID = localStorage.getItem("user_id")
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
          reviewer: reviewerID,
          vaccine_id: parseInt(vaccineId),
          rating: rating,
          comment: comment,
      }),
  })
  .then((res) => res.json())
  .then((data) => {
      console.log(data);
      // alert("Review submitted successfully!");
     
  })
  .catch((error) => {
      console.error("Error:", error);
      alert("Failed to submit review. Please try again.");
  });
};

// display review

const displayReview = () => {
  const vaccineId = getQueryParams("id");
  const token = localStorage.getItem("token");
  console.log(vaccineId)
  fetch(`http://127.0.0.1:8000/vaccine/reviews/${vaccineId}/`,{
      method: "GET",
      headers: {
          Authorization: `Token ${token}`,
        },

  })
      .then((res) => res.json())
      .then((reviews) => {
          console.log(reviews)

          const allReviews = document.getElementById("review-container");
          allReviews.innerHTML = ""; 
          
          if (reviews.length === 0) {
            allReviews.innerHTML = "<p class='text-center fw-bold'>No reviews found for this vaccine.</p>";
          } else {
            reviews.forEach((review) => {
              const div = document.createElement("div");
              div.classList.add("col-md-4", "mb-4");
    
              div.innerHTML = `
                <div class="card mb-4">
                  <img src="static/images/vac-icon.png" class="card-img-top2" alt="...">
                  <div class="card-body">
                    <h6>Rating: ${review.rating}</h6>
                    <h6>Reviewer: ${review.reviewer.first_name}</h6>
                    <h6>Review: ${review.comment}</h6>
                    <h6>Created at: ${review.created_at}</h6>
                  </div>
                </div>
              `;
              allReviews.appendChild(div);
      })
    }

})


}
displayReview()























