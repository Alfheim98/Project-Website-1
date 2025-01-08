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

document.addEventListener("DOMContentLoaded", () => {
  const studentCountElement = document.querySelector(".dashboard-box.blue p");
  const subjectCountElement = document.querySelector(".dashboard-box.red p");

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard-stats");
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      
      const data = await response.json();

      // Update the DOM with the counts
      studentCountElement.innerHTML = `${data.students}<br>Student Listed`;
      subjectCountElement.innerHTML = `${data.subjects}<br>Manage Class`;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Fetch the stats on page load
  fetchDashboardStats();
});

