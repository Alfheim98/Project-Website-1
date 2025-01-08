const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const menuToggler = document.querySelector(".menu-toggler");

let collapsedSidebarHeight = "56px"; 
let fullSidebarHeight = "calc(100vh - 32px)"; 

sidebarToggler.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

const toggleMenu = (isMenuActive) => {
  sidebar.style.height = isMenuActive ? `${sidebar.scrollHeight}px` : collapsedSidebarHeight;
  menuToggler.querySelector("span").innerText = isMenuActive ? "close" : "menu";
}


menuToggler.addEventListener("click", () => {
  toggleMenu(sidebar.classList.toggle("menu-active"));
});


window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    sidebar.style.height = fullSidebarHeight;
  } else {
    sidebar.classList.remove("collapsed");
    sidebar.style.height = "auto";
    toggleMenu(sidebar.classList.contains("menu-active"));
  }
});


window.onload = async function () {
  const classSelect = document.getElementById("class");
  const studentNumberInput = document.getElementById("student-number");
  const firstNameInput = document.getElementById("first-name");
  const middleInitialInput = document.getElementById("middle-initial");
  const lastNameInput = document.getElementById("last-name");
  const form = document.getElementById("add-student-form");

  // Reset class on new navigation
  const referrer = document.referrer;
  if (!referrer.includes("addstudent.html")) {
      localStorage.removeItem("selectedClass");
  }

  // Fetch the user's subjects and populate the dropdown
  try {
      const response = await fetch('/getsubjects');
      if (!response.ok) throw new Error("Failed to fetch subjects");

      const subjects = await response.json();
      subjects.forEach(subject => {
          const option = document.createElement("option");
          option.value = subject.id; // Use subject ID as the value
          option.textContent = `${subject.subject_name} (${subject.section})`;
          classSelect.appendChild(option);
      });
  } catch (error) {
      console.error(error);
      alert("Error loading subjects. Please try again.");
  }

  // Preserve selected class if it exists in localStorage
  const selectedClass = localStorage.getItem("selectedClass");
  if (selectedClass) {
      classSelect.value = selectedClass;
  }

  classSelect.addEventListener("change", () => {
      localStorage.setItem("selectedClass", classSelect.value);
  });

  // Format Student Number
  studentNumberInput.addEventListener("input", (event) => {
      let value = event.target.value.replace(/[^0-9]/g, "");
      if (value.length > 2) {
          value = `${value.slice(0, 2)}-${value.slice(2, 7)}`;
      }
      event.target.value = value.slice(0, 8); // Limit to 7 digits + hyphen
  });

  // Capitalize First Name
  firstNameInput.addEventListener("input", (event) => {
      event.target.value = capitalizeInput(event.target.value);
  });

  // Ensure Middle Initial is a single capital letter
  middleInitialInput.addEventListener("input", (event) => {
      event.target.value = event.target.value.slice(0, 1).toUpperCase();
  });

  // Capitalize Last Name
  lastNameInput.addEventListener("input", (event) => {
      event.target.value = capitalizeInput(event.target.value);
  });

  // Handle form submission
  // Handle form submission
// Handle form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const studentNumber = studentNumberInput.value;
    const firstName = firstNameInput.value;
    const middleInitial = middleInitialInput.value;
    const lastName = lastNameInput.value;
    const selectedClass = classSelect.value;

    // Create the full name
    const fullName = `${firstName} ${middleInitial}. ${lastName}`;

    // Log the data to check before sending it to the server
    console.log("Sending data to the server:", {
        studentNumber,
        fullName,
        firstName,
        middleInitial,
        lastName,
        subjectId: selectedClass,
    });

    // Validate
    if (!selectedClass) {
        alert("Please select a class");
        return;
    }

    try {
        const response = await fetch('/addstudent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentNumber,
                fullName,
                firstName,
                middleInitial,
                lastName,
                subjectId: selectedClass,
            }),
        });

        if (response.ok) {
            document.getElementById("status-message").textContent = "Student added successfully!";
            document.getElementById("status-message").style.color = "green";

            // Reset inputs except class
            studentNumberInput.value = "";
            firstNameInput.value = "";
            middleInitialInput.value = "";
            lastNameInput.value = "";
        } else {
            const errorMessage = await response.text();
            console.error('Server error:', errorMessage);
            document.getElementById("status-message").textContent = `Error adding student: ${errorMessage}`;
            document.getElementById("status-message").style.color = "red";
        }
    } catch (error) {
        console.error("Error adding student:", error);
        document.getElementById("status-message").textContent = "Error adding student.";
        document.getElementById("status-message").style.color = "red";
    }
});




};

// Capitalize Input Function
function capitalizeInput(value) {
  return value
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
}
