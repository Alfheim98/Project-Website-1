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


// Populate subjects dropdown from the database
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  document.getElementById('date').value = now.getDate();
  document.getElementById('month').value = now.getMonth() + 1;
  document.getElementById('year').value = now.getFullYear();

  const subjectDropdown = document.getElementById('subject');
  subjectDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';

  fetch('/api/subjects')
      .then(response => response.json())
      .then(subjects => {
          subjectDropdown.innerHTML = '<option value="" disabled selected>Select Subject</option>';
          if (subjects.length === 0) {
              subjectDropdown.innerHTML = '<option value="">No subjects available</option>';
              return;
          }
          subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = JSON.stringify({
                id: subject.id,
                name: subject.subject_name,
                section: subject.section
            });
            option.textContent = `${subject.subject_name} - ${subject.section}`;
            subjectDropdown.appendChild(option);
        });
        
      });

  document.getElementById('confirm-button').addEventListener('click', () => {
      const selectedSubject = JSON.parse(document.getElementById('subject').value);
      if (!selectedSubject) {
          alert('Please select a subject.');
          return;
      }

      const { id: subjectId, name: subjectName, section } = selectedSubject;
      const date = document.getElementById('date').value;
      const month = document.getElementById('month').value;
      const year = document.getElementById('year').value;

      fetch(`/api/subjects/${subjectId}/students`)
          .then(response => response.json())
          .then(data => {
              document.getElementById('subject-title').textContent = `${subjectName} (${section})`;
              document.getElementById('attendance-info').textContent = `Attendance for ${subjectName}`;
              document.getElementById('attendance-date').textContent = `Date: ${date}-${month}-${year}`;
              document.getElementById('attendance-display').classList.remove('hidden');

              const tbody = document.querySelector('.class-info-table tbody');
              tbody.innerHTML = '';
              data.data.forEach((student, index) => {
                  const row = document.createElement('tr');
                  row.innerHTML = `
                      <td>${index + 1}</td>
                      <td>${student.student_number}</td>
                      <td>${student.full_name}</td>
                      <td>${section}</td>
                      <td><input type="checkbox" class="attendance-checkbox"></td>
                  `;
                  tbody.appendChild(row);
              });

              document.getElementById('save-button').classList.remove('hidden');
          })
          .catch(error => console.error('Error fetching students:', error));
  });

  document.getElementById('save-button').addEventListener('click', () => {
    const rows = document.querySelectorAll('.class-info-table tbody tr');
    const attendanceRecords = [];
    const selectedSubject = JSON.parse(document.getElementById('subject').value);
    const { name: className, section } = selectedSubject;
    const date = `${document.getElementById('year').value}-${document.getElementById('month').value.padStart(2, '0')}-${document.getElementById('date').value.padStart(2, '0')}`;

    rows.forEach(row => {
        const studentNumber = row.children[1].textContent;
        const fullName = row.children[2].textContent;
        const isChecked = row.querySelector('.attendance-checkbox').checked;

        attendanceRecords.push({
            class: className,
            section: section,
            student_number: studentNumber,
            full_name: fullName,
            attendance_date: date,
            status: isChecked ? 'P' : 'A'
        });
    });

    fetch('/api/attendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceRecords)
    })
        .then(response => {
            if (response.ok) {
                alert('Attendance saved successfully!');
            } else {
                alert('Failed to save attendance.');
            }
        })
        .catch(error => console.error('Error saving attendance:', error));
});

});
