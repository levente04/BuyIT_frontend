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
                <td><button onclick="deleteOrder(${order.order_id})" id="btndelete">Rendelés törlése</button></td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error("Hiba a rendelési adatok lekérdezésekor:", error));
}

function deleteOrder(orderId) {
    if (!confirm("Biztosan törölni szeretné ezt a rendelést?")) return;

    fetch(`/api/deleteOrder/${orderId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "Rendelés törölve!");
        fetchOrders(); // Refresh the table after deletion
    })
    .catch(error => console.error("Hiba a rendelés törlésekor:", error));
}