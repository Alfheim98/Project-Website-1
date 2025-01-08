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

const toggleSearch = () => {
  const searchForm = document.querySelector('.search-form');
  const searchButton = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-input');

  searchButton.addEventListener('click', () => {
    searchForm.classList.toggle('active-search');
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchInput.value = '';
      searchForm.classList.remove('active-search');
    }
  });
};

toggleSearch();


window.onload = async function () {
  const searchInput = document.querySelector('.search-input');
  const tbody = document.querySelector('.class-info-table tbody');

  // Fetch and populate the classes for the search bar
  const fetchClasses = async () => {
      try {
          const response = await fetch('/getsubjects');
          if (!response.ok) throw new Error('Failed to fetch classes');

          const classes = await response.json();
          const datalist = document.createElement('datalist');
          datalist.id = 'class-datalist';

          classes.forEach(classItem => {
              const option = document.createElement('option');
              option.value = `${classItem.subject_name} (${classItem.section})`;
              option.dataset.classId = classItem.id; // Store class ID for search
              datalist.appendChild(option);
          });

          document.body.appendChild(datalist);
          searchInput.setAttribute('list', 'class-datalist');
      } catch (error) {
          console.error('Error fetching classes:', error);
      }
  };

  // Fetch and display students for a selected class
  const attachDeleteHandlers = () => {
    const deleteButtons = document.querySelectorAll('.delete-button');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const studentNumber = event.target.dataset.studentId;

            if (confirm('Are you sure you want to delete this student?')) {
                try {
                    const response = await fetch(`/deletestudent/${studentNumber}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        alert('Student deleted successfully');
                        // Refresh the student list after deletion
                        const searchInput = document.querySelector('.search-input');
                        const selectedClass = [...document.querySelectorAll('#class-datalist option')].find(
                            option => option.value === searchInput.value
                        );

                        if (selectedClass) {
                            const classId = selectedClass.dataset.classId;
                            await fetchStudents(classId);
                        }
                    } else {
                        const errorMessage = await response.text();
                        alert(`Error: ${errorMessage}`);
                    }
                } catch (error) {
                    console.error('Error deleting student:', error);
                    alert('An error occurred while deleting the student');
                }
            }
        });
    });
};

// Call this function after fetching and rendering students
const fetchStudents = async (classId) => {
    const tbody = document.querySelector('.class-info-table tbody');
    try {
        const response = await fetch(`/getstudents?classId=${classId}`);
        if (!response.ok) throw new Error('Failed to fetch students');

        const students = await response.json();
        tbody.innerHTML = '';

        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.student_number}</td>
                <td>${student.full_name}</td>
                <td>${student.section}</td>
                <td>
                    <button class="delete-button" data-student-id="${student.student_number}">
                        Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        attachDeleteHandlers(); // Attach delete handlers after rendering rows
    } catch (error) {
        console.error('Error fetching students:', error);
        tbody.innerHTML = '<tr><td colspan="5">Error loading students</td></tr>';
    }
};  



  // Event listener for the search input
  searchInput.addEventListener('input', async (event) => {
      const selectedClass = [...document.querySelectorAll('#class-datalist option')].find(
          option => option.value === searchInput.value
      );

      if (selectedClass) {
          const classId = selectedClass.dataset.classId;
          await fetchStudents(classId);
      }
  });

  // Initialize
  fetchClasses();
};
