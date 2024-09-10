const city_name = document.getElementById("location")
const searchBtn = document.getElementById("search-btn")
const jobSection = document.getElementById("job-section")
const search = document.getElementById("search")
let roleInput = document.getElementById("roleInput")
let locationInput = document.getElementById("locationInput")
let nextPageBtn = document.getElementById("next");
let prevPageBtn = document.getElementById("prev");

//This function is used to get Date when the job is posted in localstring format
const getdate = (date) => {
  const curdate = new Date(date);
  const dateString = curdate.toDateString();
  const extractedDate = new Date(dateString).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return extractedDate
}

//Global variable declarations
let totalJobs = 0;
let totalPageCount = 0;
let jobsPerPage = 10;

//Function to fetch Jobs from the here country is "India" and page depends on no. of page
const fetchJobs = async (country, page, roleValue, locationValue) => {
  const API_KEY = 'YOUR_API_KEY'; // Replace with your Adzuna API key
  const API_ID =  'YOUR_API_ID';  // Replace with your Adzuna API ID
  const startIndex = (page - 1) * jobsPerPage
  try {
    let API_URL = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${API_ID}&app_key=${API_KEY}&results_per_page=50&content-type=application/json`;

    if (roleValue) {
      API_URL += `&what=${encodeURIComponent(roleValue)}`;
    }
    if (locationValue) {
      API_URL += `&where=${encodeURIComponent(locationValue)}`;
    }
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      console.group("successs")
      const alljobs = data.results;

      //Sort the job in decreasing order of date of creation
      alljobs.sort((a, b) => {
        const dateA = new Date(a.created);
        const dateB = new Date(b.created);
        return dateB - dateA;
      });
      totalJobs = alljobs.length;
      const jobsForPage = alljobs.slice(startIndex, startIndex + jobsPerPage);

      jobSection.innerHTML = ""
      jobsForPage.forEach(createjobcard);
      window.scrollTo(0, 0); // This move the scrill bar to top after loading a page
      togglePageButtons();

    } else {
      jobSection.innerHTML = ""
      nextPageBtn.style.display = "none";
      const noData = document.createElement("h1")
      noData.innerHTML = "No Jobs Found for Your Search"
      noData.className = "no-result-msg"
      jobSection.appendChild(noData);
      console.log("No more job found")
      return;
    }
  } catch (error) {
    jobSection.innerHTML = ""
    jobSection.style.height = "100vh"
    nextPageBtn.style.display = "none";
    const noData = document.createElement("h1")
    noData.innerHTML = "Sorry 😔 Error fetching job Please Try Again Later"
    noData.className = "no-result-msg"
    jobSection.appendChild(noData);
    console.error('Error loading jobs:', error);
    console.log("Error fetching job :", error)
  }

  totalPageCount = Math.ceil(totalJobs / jobsPerPage);
};

//This is used to create job card for all jobs
const createjobcard = (job) => {

  // Creating job cards 
  const card = document.createElement("div")
  card.className = "card"

  // Main header of card 
  const cardHeader = document.createElement("h3")
  cardHeader.className = "card-header"
  cardHeader.textContent = `${job.title} (Location :  ${job.location.display_name} )`
  card.appendChild(cardHeader)

  // Body of card 
  const cardBody = document.createElement("div")
  cardBody.className = "card-body"

  const cardTitle = document.createElement("h4")
  cardTitle.className = "card-title"
  cardTitle.textContent = `${job.company.display_name} (job id : ${job.id})`
  cardBody.appendChild(cardTitle)

  const cardText = document.createElement("p")
  cardText.className = "card-text"
  cardText.textContent = `${job.description}`
  cardBody.appendChild(cardText)
  const cardBottom = document.createElement("div")
  cardBottom.className = "card-bottom"
  const datecreated = document.createElement("p")
  datecreated.className = "card-text job-date"
  datecreated.textContent = `Date Job created : ${getdate(job.created)}`
  cardBottom.appendChild(datecreated)

  // Link for apply 
  const button = document.createElement("a")
  button.className = "btn btn-primary"
  button.href = job.redirect_url
  button.textContent = `Apply Here`
  button.target = "_blank"
  cardBottom.appendChild(button)
  cardBody.appendChild(cardBottom)
  card.appendChild(cardBody)
  jobSection.appendChild(card)
}

//Function for Controlling Next and Previous button

const addPageButtonEventListeners = () => {
  nextPageBtn.textContent = "Next";
  nextPageBtn.addEventListener("click", fetchNextPage);

  prevPageBtn.textContent = "Previous";
  prevPageBtn.addEventListener("click", fetchPreviousPage);
};

//Function for Fetching next page

const fetchNextPage = () => {
  const remainingJobs = totalJobs - currentPage * jobsPerPage;

  if (remainingJobs > 0) {
    currentPage++;
    fetchJobs('in', currentPage,roleValue,locationValue);
    setTimeout(() => {
      togglePageButtons();
    }, 2000);
  }
};

//Function for Fetching previous page
const fetchPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    fetchJobs('in', currentPage,roleValue,locationValue);
    setTimeout(() => {
      togglePageButtons();
    }, 2000);
  }
};

//This function control the page buttons that when to show next and when previous button
const togglePageButtons = () => {
  const nextPageBtn = document.getElementById("next");
  const prevPageBtn = document.getElementById("prev");

  if (currentPage === 1) {
    prevPageBtn.style.display = "none";
    nextPageBtn.style.marginBottom = "20px";
  } else {
    prevPageBtn.style.display = "inline";
  }

  // You can modify this condition based on your requirements
  if (currentPage === totalPageCount) {
    nextPageBtn.style.display = "none";
    prevPageBtn.style.marginBottom = "20px";
  } else {
    nextPageBtn.style.display = "inline";
  }
};

let currentPage = 1;
let roleValue;
let locationValue;

if(search){
  search.addEventListener('click', () => {
    try {
      roleValue = roleInput.value.toLowerCase();
      locationValue = locationInput.value.toLowerCase();
      if (!roleValue && !locationValue) {
        alert("Input Either Role or Location to Search Specific Jobs Otherwise Visit All Job Page")
      }
      else {
        currentPage = 1;
        fetchJobs('in', currentPage, roleValue, locationValue)
          setTimeout(() => {
            addPageButtonEventListeners();
            togglePageButtons(); // Call togglePageButtons after the data is loaded
            document.getElementById("pagination-buttons").style.display = "block"; // Show the pagination buttons
          }, 5000)
        }
      }catch(error){
        console.log("Error fetching Jobs :" ,error)
      }
  });
}
else{
try {
  fetchJobs('in', currentPage);

  setTimeout(() => {
    addPageButtonEventListeners();
    togglePageButtons(); // Call togglePageButtons after the data is loaded
    document.getElementById("pagination-buttons").style.display = "block"; // Show the pagination buttons
  }, 5000);

} catch (error) {
  console.error('Error loading jobs:', error);
}
}