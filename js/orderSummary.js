const belepesText=document.getElementsByClassName('belepes-text')[0]
const logo = document.getElementsByClassName('menu-logo')[0]
const phones = document.getElementsByClassName('phones')[0]
const tablets = document.getElementsByClassName('tablets')[0]
const laptops = document.getElementsByClassName('laptops')[0]

const proceedToOrder = document.getElementsByClassName('proceedToOrder')[0]
const backToPayment = document.getElementsByClassName('backToPayment')[0]

logo.addEventListener('click', () => {
    window.location.href = './home.html'
})

phones.addEventListener('click', () => {
    window.location.href = './phones.html'
})

tablets.addEventListener('click', () => {
    window.location.href = './tablets.html'
})

laptops.addEventListener('click', () => {
    window.location.href = './laptops.html'
})

proceedToOrder.addEventListener('click', () => {
    window.location.href = './successfulOrder.html'
})

backToPayment.addEventListener('click', () => {
    window.location.href = './addPayment.html'
})

document.addEventListener("DOMContentLoaded", async function () {
    const loginButton = document.querySelector('.icon-profile');

    try {
        // Fetch the username to check if the user is logged in
        const response = await fetch('/api/getUsername', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            // User is logged in
            belepesText.textContent = data.name; // Set the user's name

            // Add logout modal logic
            belepesText.addEventListener('click', (e) => { 
                e.preventDefault(); // Prevent default action
            
                // Show SweetAlert confirmation dialog
                Swal.fire({
                    title: "Biztosan ki szeretnél lépni?",
                    text: "A kijelentkezés után visszatérsz a főoldalra.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Kilépés",
                    cancelButtonText: "Mégse"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const logoutResponse = await fetch('/api/logout', {
                                method: 'POST',
                                credentials: 'include',
                            });
            
                            if (logoutResponse.ok) {
                                Swal.fire({
                                    title: "Sikeres kijelentkezés!",
                                    icon: "success",
                                    timer: 1500,
                                    showConfirmButton: false
                                }).then(() => {
                                    window.location.href = 'home.html'; // Redirect after SweetAlert closes
                                });
                            } else {
                                Swal.fire({
                                    title: "Hiba történt!",
                                    text: "Nem sikerült kijelentkezni.",
                                    icon: "error",
                                    confirmButtonText: "OK"
                                });
                            }
                        } catch (error) {
                            Swal.fire({
                                title: "Hiba!",
                                text: "Valami hiba történt kijelentkezés közben.",
                                icon: "error",
                                confirmButtonText: "OK"
                            });
                            console.error('Error logging out:', error);
                        }
                    }
                });
            });

        } else {
            // User is not logged in
            belepesText.textContent = 'Belépés';

            // Redirect to login page when clicked
            belepesText.addEventListener('click', () => {
                window.location.href = "login.html";
            });
        }
    } catch (error) {
        console.error('Error fetching username:', error);
        belepesText.textContent = 'Belépés';
        belepesText.addEventListener('click', () => {
            window.location.href = "login.html";
        });
    }
    
    // Fetch and display order summary
    try {
        const summaryResponse = await fetch("/api/getSummary", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Important for authentication
        });
        
        if (!summaryResponse.ok) {
            throw new Error(`API error: ${summaryResponse.status}`);
        }
        
        const cartItems = await summaryResponse.json();
        const cartTable = document.getElementById("cartTable").getElementsByTagName("tbody")[0];
        let subtotal = 0; // Initialize subtotal
        
        // Clear existing table rows if any
        cartTable.innerHTML = "";

        cartItems.forEach(item => {
            let row = cartTable.insertRow();
            
            // Create image column
            let imgCell = row.insertCell(0);
            imgCell.innerHTML = `<img src="images/${item.image}" alt="${item.itemName}">`;

            // Product name column
            let nameCell = row.insertCell(1);
            nameCell.innerHTML = `<h1 class="productName">${item.itemName}</h1>`;
            
            // Quantity column
            let quantityCell = row.insertCell(2);
            quantityCell.innerHTML = `<p class="quantity">${item.quantity}</p>`;

            // Price column
            let priceCell = row.insertCell(3);
            priceCell.innerHTML = `<p class="price">${parseFloat(item.itemPrice).toLocaleString()} Ft</p>`;
            
            // Item total column (price × quantity)
            let itemTotalCell = row.insertCell(4);
            const itemTotal = parseFloat(item.itemPrice) * item.quantity;
            itemTotalCell.innerHTML = `<p class="itemTotal">${itemTotal.toLocaleString()} Ft</p>`;

            // Add item total to subtotal
            subtotal += itemTotal;
        });

        const deliveryFee = 1490;
        const totalPrice = subtotal + deliveryFee;

        // Update price display
        document.getElementById("subtotal").textContent = subtotal.toLocaleString();
        document.getElementById("deliveryFee").textContent = deliveryFee.toLocaleString();
        document.getElementById("total").textContent = `Végösszeg: ${totalPrice.toLocaleString()} Ft`;
        
        // Handle empty cart
        const emptyCartMessage = document.getElementById("emptyCartMessage");
        const summaryContainer = document.getElementById("summaryContainer");
        
        if (cartItems.length === 0 && emptyCartMessage && summaryContainer) {
            emptyCartMessage.style.display = "block";
            summaryContainer.style.display = "none";
        } else if (emptyCartMessage && summaryContainer) {
            emptyCartMessage.style.display = "none";
            summaryContainer.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching order summary:", error);
        
        // Display error message to user
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.textContent = "Nem sikerült betölteni a rendelés adatait. Kérjük, próbáld újra később.";
        
        const cartTable = document.getElementById("cartTable");
        if (cartTable) {
            cartTable.parentNode.insertBefore(errorMessage, cartTable);
        }
    }
});