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
    const table = document.querySelector('.class-info-table');
    const tableHeader = table.querySelector('thead tr'); // Target the header row
    const tableBody = table.querySelector('tbody');
    const downloadButton = document.getElementById('download-button');
    let currentClassName = ""; // Track the selected class name

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
                option.dataset.className = classItem.subject_name;
                datalist.appendChild(option);
            });

            document.body.appendChild(datalist);
            searchInput.setAttribute('list', 'class-datalist');
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    // Utility function to format date into day-month-year
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Function to delete student and refresh attendance records
const deleteStudent = async (studentNumber) => {
    try {
        const response = await fetch(`/deletestudent/${studentNumber}`, { method: 'DELETE' });

        if (response.ok) {
            // After deleting, refresh the attendance records for the current class
            alert('Student and attendance records deleted successfully');
            await fetchAttendanceRecords(currentClassName); // Refresh the records
        } else {
            const errorMessage = await response.text();
            alert(`Error: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('An error occurred while deleting the student.');
    }
};

    // Fetch and display attendance records grouped by dates
    const fetchAttendanceRecords = async (className) => {
        tableHeader.innerHTML = `
            <th>#</th>
            <th>Student No.</th>
            <th>Student Name</th>
            <th>Section</th>
        `; // Reset table headers
        tableBody.innerHTML = ''; // Clear table body
        currentClassName = className; // Update the current class name for downloading
    
        try {
            const response = await fetch(`/api/attendance?className=${className}`);
            if (!response.ok) throw new Error('Failed to fetch attendance records');
    
            const records = await response.json();
    
            if (records.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">No attendance records found</td></tr>';
                return;
            }
    
            // Group records by date and student
            const dateSet = new Set();
            const attendanceData = {};
    
            records.forEach(record => {
                const date = formatDate(record.attendance_date);
                dateSet.add(date);
    
                if (!attendanceData[record.student_number]) {
                    attendanceData[record.student_number] = {
                        full_name: record.full_name,
                        section: record.section,
                        attendance: {},
                    };
                }
                attendanceData[record.student_number].attendance[date] = record.status;
            });
    
            // Create dynamic headers for each unique date
            const uniqueDates = Array.from(dateSet).sort();
            uniqueDates.forEach(date => {
                const th = document.createElement('th');
                th.textContent = date;
                th.id = 'attendance-header';
                tableHeader.appendChild(th);
            });
    
            // Sort students alphabetically by last name
            const sortedStudentNumbers = Object.keys(attendanceData).sort((a, b) => {
                const nameA = attendanceData[a].full_name;
                const nameB = attendanceData[b].full_name;
    
                // Split full name into parts and use the last part (last name)
                const lastNameA = nameA.split(' ').pop().toLowerCase();
                const lastNameB = nameB.split(' ').pop().toLowerCase();
    
                return lastNameA.localeCompare(lastNameB); // Compare last names alphabetically
            });
    
            // Populate table rows
            let rowIndex = 1;
            sortedStudentNumbers.forEach(studentNumber => {
                const student = attendanceData[studentNumber];
                let row = `
                    <tr>
                        <td>${rowIndex++}</td>
                        <td>${studentNumber}</td>
                        <td>${student.full_name}</td>
                        <td>${student.section}</td>
                `;
    
                // Add attendance status for each date
                uniqueDates.forEach(date => {
                    const status = student.attendance[date] || 'N/A'; 
                    row += `<td>${status}</td>`;
                });
    
                row += '</tr>';
                tableBody.insertAdjacentHTML('beforeend', row);
            });
    
            // Show the "Download" button after table data loads
            if (downloadButton) downloadButton.classList.remove('hidden');
        } catch (error) {
            console.error('Error fetching attendance records:', error);
            tableBody.innerHTML = '<tr><td colspan="5">Error loading attendance records</td></tr>';
        }
    };
    

    // Download table data as an Excel file with enhanced design
    const downloadAsExcel = () => {
        if (!currentClassName) {
            alert('Please select a class with data before downloading.');
            return;
        }
    
        const wb = XLSX.utils.book_new(); // Create a new workbook
        const wsData = []; // Worksheet data
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
    
        // Static headers
        const headers = ["#", "Student Number", "Student Name"];
        const dates = []; // Dynamic attendance dates
    
        // Fetch dynamic date headers
        tableHeader.querySelectorAll('th').forEach((th, index) => {
            const text = th.textContent.trim();
            if (index >= 4) dates.push(text);
        });
    
        headers.push(...dates, "Total Present", "Total Absent");
    
        // Title for the Excel sheet
        const now = new Date();
        const year = now.getFullYear();
        const monthName = monthNames[now.getMonth()];
        const title = `Attendance Sheet of ${monthName} ${year}`;
    
        // Step 1: Add the title to the first row
        wsData.push([title]);
    
        // Step 2: Add headers to the second row
        wsData.push(headers);
    
        // Step 3: Process table rows and ensure no duplicates
        let rowIndex = 0; // Start numbering rows from 1
        const studentSet = new Set();
    
        tableBody.querySelectorAll('tr').forEach((row) => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 3) return; // Skip rows with insufficient data
    
            const studentNumber = cells[1]?.textContent.trim() || '';
            const studentName = cells[2]?.textContent.trim() || '';
    
            if (!studentNumber || studentSet.has(studentNumber)) return;
            studentSet.add(studentNumber);
    
            const attendanceData = [];
            let presentCount = 0, absentCount = 0;
    
            // Parse attendance data
            for (let i = 4; i < cells.length; i++) {
                const status = cells[i]?.textContent.trim();
                attendanceData.push(status);
                if (status === 'P') presentCount++;
                if (status === 'A') absentCount++;
            }
    
            // Add row data
            wsData.push([
                ++rowIndex,
                studentNumber,
                studentName,
                ...attendanceData,
                presentCount,
                absentCount
            ]);
        });
    
        // Step 4: Add data to worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);
    
        // Merge the title row
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
    
        // Append the worksheet to the workbook and save
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance Records');
        XLSX.writeFile(wb, `${currentClassName}.xlsx`);
    };
    
    // Event listener for the download button
    downloadButton.addEventListener('click', downloadAsExcel);
    
    // Event listener for the search input
    searchInput.addEventListener('input', async () => {
        const selectedClass = [...document.querySelectorAll('#class-datalist option')].find(
            option => option.value === searchInput.value
        );
    
        if (selectedClass) {
            const className = selectedClass.dataset.className;
            await fetchAttendanceRecords(className);
        }
    });
    
    // Initialize
    fetchClasses();
  }    