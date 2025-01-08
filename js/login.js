function showRegister() {
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('registerBox').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('registerBox').classList.add('hidden');
    document.getElementById('loginBox').classList.remove('hidden');
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    // Send the login request to the server
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.text();
    
    if (result === 'Invalid username or password') {
        alert(result);
    } else {
        // Redirect to the dashboard if login is successful
        window.location.href = '/dashboard';
    }
}

// Function to handle registration
async function register() {
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!newUsername || !newPassword || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Send the registration request to the server
    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, confirmPassword })
    });

    const result = await response.text();

    if (result === 'Registration successful, you can now log in') {
        alert(result);
        showLogin();
    } else {
        alert('Error during registration');
    }
}