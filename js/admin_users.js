const logo = document.getElementsByClassName('menu-logo')[0];
const usersContainer = document.getElementById('users-container'); // The container where users will be displayed

logo.addEventListener('click', () => {
    window.location.href = './home.html';
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch users from the backend
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

        // Display each user with their name and email
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user-item');
            userElement.setAttribute('data-user-id', user.user_id);

            userElement.innerHTML = `
                <div class="user-details">
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <button class="btn-delete" onclick="removeUser(${user.user_id})">Remove</button>
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
