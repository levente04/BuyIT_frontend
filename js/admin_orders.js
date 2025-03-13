const logo = document.getElementsByClassName('menu-logo')[0];

logo.addEventListener('click', () => {
    window.location.href = './home.html';
});

document.addEventListener("DOMContentLoaded", function () {
    fetchOrders();
});

function fetchOrders() {
    fetch('/api/getAllOrders', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Replace with actual token if needed
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById("ordersTable").innerHTML = `<tr><td colspan="6">${data.error}</td></tr>`;
            return;
        }

        let tableBody = document.getElementById("ordersBody");
        tableBody.innerHTML = ""; // Clear existing rows

        data.forEach(order => {
            let row = document.createElement("tr");

            row.innerHTML = `
                <td>#${order.order_id}</td>
                <td>${order.name}</td>
                <td>${order.order_date}</td>
                <td>${order.postcode}, ${order.city}, ${order.address}</td>
                <td>${order.tel}</td>
                <td><button class="delete-btn" data-id="${order.order_id}">Rendelés törlése</button></td>
            `;

            tableBody.appendChild(row);
        });

        // Attach event listeners to delete buttons after table is populated
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const orderId = this.getAttribute("data-id");
                deleteOrder(orderId);
            });
        });
    })
    .catch(error => console.error("Hiba a rendelési adatok lekérdezésekor:", error));
}

function deleteOrder(orderId) {
    Swal.fire({
        title: "Biztos törölni szeretné?",
        text: "Ez a művelet nem visszavonható!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Igen, törlöm!",
        cancelButtonText: "Mégse"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/deleteOrder/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
                }
            })
            .then(response => response.json())
            .then(data => {
                Swal.fire("Törölve!", "A rendelés sikeresen törölve lett.", "success")
                .then(() => fetchOrders()); // Refresh the table after deletion
            })
            .catch(() => {
                Swal.fire("Hiba!", "Nem sikerült törölni a rendelést.", "error");
            });
        }
    });
}