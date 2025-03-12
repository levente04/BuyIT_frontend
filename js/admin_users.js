const logo = document.getElementsByClassName('menu-logo')[0];
const usersContainer = document.getElementById('users-container'); // The container where users will be displayed

logo.addEventListener('click', () => {
    window.location.href = './home.html';
});

document.addEventListener("DOMContentLoaded", async () => {
    const usersContainer = document.getElementById("usersContainer");

    if (!usersContainer) {
        console.error("Error: Element with ID 'usersContainer' not found.");
        return;
    }

    try {
        const response = await fetch('/api/admin/users', { credentials: 'include' });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const users = await response.json();

        if (users.length === 0) {
            usersContainer.innerHTML = "<p>No users found.</p>";
            return;
        }

        usersContainer.innerHTML = ""; // Clear previous content

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user-item');
            userElement.setAttribute('data-user-id', user.user_id);

            userElement.innerHTML = `
                <div class="user-details">
                    <p><strong>Név:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                </div>
            `;

            // Create delete button dynamically
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn-delete");
            deleteButton.textContent = "Törlés";
            deleteButton.addEventListener("click", () => removeUser(user.user_id));

            userElement.appendChild(deleteButton);
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
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ user_id }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to delete user");
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            title: "User Removed!",
            text: data.message,
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            // Remove user from the DOM instead of reloading
            document.querySelector(`[data-user-id="${user_id}"]`).remove();
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
