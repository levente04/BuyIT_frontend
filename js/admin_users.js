const logo = document.getElementsByClassName('menu-logo')[0]


logo.addEventListener('click', () => {
    window.location.href = ('./home.html')
})

async function fetchUsers() {
    try {
        let response = await fetch("/users"); // Adjust URL if needed
        let users = await response.json();

        let tableBody = document.getElementById("userTableBody");
        tableBody.innerHTML = ""; // Clear existing rows

        users.forEach(users => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td class="name">${users.name}</td>
                <td class="email">${users.email}</td>
                <td><button type="button" class="btnmanage">Kezel</button></td>
                <td><button type="button" class="btndetails">Részletek</button></td>
                <td><button type="button" class="btndeluser" data-id="${users.user_id}">Felhasználó törlése</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Attach event listeners for delete buttons
        document.querySelectorAll(".btndeluser").forEach(button => {
            button.addEventListener("click", async function () {
                let userId = this.getAttribute("data-id");
                await deleteUser(userId);
            });
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

async function deleteUser(userId) {
    if (!confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) return;

    try {
        let response = await fetch(`/users/${userId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Felhasználó törölve!");
            fetchUsers(); // Refresh the user list
        } else {
            alert("Hiba történt a törlés során.");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

// Load users when the page loads
fetchUsers();


