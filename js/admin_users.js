const logo = document.getElementsByClassName('menu-logo')[0]


logo.addEventListener('click', () => {
    window.location.href = ('./home.html')
})

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/admin/users', {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const users = await response.json();
        if (users.length === 0) {
            usersContainer.innerHTML = "<p>No users found.</p>";
            return;
        }

        usersContainer.innerHTML = ""; // Clear previous content

        users.forEach(users => {
            const userElement = document.createElement('div');
            userElement.classList.add('user-item');
            userElement.setAttribute('data-user-id', users.user_id);

            userElement.innerHTML = `
                <div class="user-details">
                    <p><strong>Name:</strong> ${users.name}</p>
                    <p><strong>Email:</strong> ${users.email}</p>
                    <button class="btn-delete" onclick="removeUser(${users.user_id})">Remove</button>
                </div>
            `;

            usersContainer.appendChild(userElement);
        });

    } catch (error) {
        console.error("Error loading users:", error);
    }
});

// Function to remove user
function removeUser(user_id) {
    fetch("/api/admin/removeUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_id }),
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: "User Removed!",
            text: data.message,
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            // Refresh users list after SweetAlert closes
            location.reload();
        });
    })
    .catch(error => {
        Swal.fire({
            title: "Error!",
            text: "Failed to remove user.",
            icon: "error",
            confirmButtonText: "OK"
        });
        console.error("Error removing user:", error);
    });
}

// Fetch current admin details and manage logout
document.addEventListener("DOMContentLoaded", async () => {
    const adminName = document.getElementById('admin-name');

    try {
        const response = await fetch('/api/admin/getDetails', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            // Admin is logged in
            adminName.textContent = `Welcome, ${data.name}`; // Set the admin's name

            // Logout logic
            logoutButton.addEventListener('click', async (e) => {
                e.preventDefault();

                Swal.fire({
                    title: "Are you sure you want to log out?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Log Out",
                    cancelButtonText: "Cancel"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const logoutResponse = await fetch('/api/admin/logout', {
                                method: 'POST',
                                credentials: 'include',
                            });

                            if (logoutResponse.ok) {
                                Swal.fire({
                                    title: "Logged out successfully!",
                                    icon: "success",
                                    timer: 1500,
                                    showConfirmButton: false
                                }).then(() => {
                                    window.location.href = 'login.html'; // Redirect after SweetAlert closes
                                });
                            } else {
                                Swal.fire({
                                    title: "Error!",
                                    text: "Logout failed.",
                                    icon: "error",
                                    confirmButtonText: "OK"
                                });
                            }
                        } catch (error) {
                            Swal.fire({
                                title: "Error!",
                                text: "There was an error logging out.",
                                icon: "error",
                                confirmButtonText: "OK"
                            });
                            console.error('Error logging out:', error);
                        }
                    }
                });
            });

        } else {
            // Admin not logged in
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error('Error fetching admin details:', error);
        window.location.href = "login.html";
    }
});


