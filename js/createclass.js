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


document.getElementById('subjectCode').addEventListener('input', async function () {
  const subjectCode = this.value;

  if (subjectCode.length < 3) { // Optional: Wait until a few characters are typed to avoid unnecessary requests
      return;
  }

  // Fetch subject name based on the entered subject code
  try {
      const response = await fetch(`/getsubjectname?subjectCode=${subjectCode}`);
      const data = await response.json();

      if (data.subjectName) {
          document.getElementById('subjectName').value = data.subjectName;
      } else {
          document.getElementById('subjectName').value = ''; // Clear the field if not found
      }
  } catch (error) {
      console.error('Error fetching subject name:', error);
  }
});

// Handle form submission to add a subject
document.getElementById('class-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const subjectCode = document.getElementById('subjectCode').value;
  const subjectName = document.getElementById('subjectName').value;
  const section = document.getElementById('section').value;

  const response = await fetch('/addsubject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectCode, subjectName, section })
  });

  const result = await response.text();
  alert(result);
});
