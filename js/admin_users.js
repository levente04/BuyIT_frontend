const logo = document.getElementsByClassName('menu-logo')[0]


logo.addEventListener('click', () => {
    window.location.href = ('./home.html')
})

async function fetchUsers() {
    try {
        let response = await fetch("/api/getUsers"); // Adjust URL if needed
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

fetchUsers();


