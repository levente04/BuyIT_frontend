const logo = document.getElementsByClassName('menu-logo')[0]


logo.addEventListener('click', () => {
    window.location.href = ('./home.html')
})

async function fetchUsers() {
    try {
        let response = await fetch("http://localhost:3000/users"); // Adjust if needed
        let users = await response.json();

        let userList = document.getElementById("userList"); // Make sure you have a <ul> or <div> with this ID
        userList.innerHTML = "";

        users.forEach(user => {
            let li = document.createElement("li");
            li.textContent = `ID: ${user.id} - Name: ${user.name} - Email: ${user.email}`;
            userList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

fetchUsers();
