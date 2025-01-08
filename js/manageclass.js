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
  const tableBody = document.querySelector('.class-info-table tbody');

  try {
      const response = await fetch('/getsubjects'); // Fetch subjects for the logged-in user
      const subjects = await response.json();

      if (subjects.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="5">No subjects found</td></tr>';
          return;
      }

      subjects.forEach((subject, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${index + 1}</td>
              <td>${subject.subject_code}</td>
              <td>${subject.subject_name}</td>
              <td>${subject.section}</td>
              <td>
                  <button class="delete-btn" onclick="deleteSubject(${subject.id})">Delete</button>
              </td>
          `;
          tableBody.appendChild(row);
      });
  } catch (error) {
      console.error('Error fetching subjects:', error);
      tableBody.innerHTML = '<tr><td colspan="5">Error loading subjects</td></tr>';
  }
};

// Handle subject deletion
async function deleteSubject(subjectId) {
  const response = await fetch(`/deletesubject/${subjectId}`, { method: 'DELETE' });

  if (response.ok) {
      alert('Subject deleted successfully');
      location.reload();
  } else {
      alert('Failed to delete subject');
  }
}
