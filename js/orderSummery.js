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
});


fetch("/api/cart/items")
.then(response => response.json())
.then(cartItems => {
    const cartTable = document.getElementById("cartTable").getElementsByTagName("tbody")[0];
    let subtotal = 0; // Initialize subtotal

    cartItems.forEach(item => {
        let row = cartTable.insertRow();
        
        // Image column
        let imgCell = row.insertCell(0);
        let img = document.createElement("img");
        img.src = item.image.startsWith("http") ? item.image : "/" + item.image;
        img.alt = item.product_name;
        imgCell.appendChild(img);

        // Product name column
        let nameCell = row.insertCell(1);
        nameCell.innerHTML = `<h1 class="productName">${item.itemName}</h1>`;

        // Price column
        let priceCell = row.insertCell(2);
        priceCell.innerHTML = `<p class="price">${parseFloat(item.itemPrice).toLocaleString()} Ft</p>`;

        // Add item price to subtotal (ensure it's a number)
        subtotal += parseFloat(item.itemPrice) || 0;
    });

    const deliveryFee = 1490;
    const totalPrice = subtotal + deliveryFee;

    // Update price display
    document.getElementById("subtotal").textContent = subtotal.toLocaleString();
    document.getElementById("total").textContent = `Végösszeg: ${totalPrice.toLocaleString()} Ft`;
})
.catch(error => console.error("Error fetching cart items:", error));