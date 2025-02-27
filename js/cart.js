const belepesText=document.getElementsByClassName('belepes-text')[0]
const logo = document.getElementsByClassName('menu-logo')[0];
const phones = document.getElementsByClassName('phones')[0];
const tablets = document.getElementsByClassName('tablets')[0];
const laptops = document.getElementsByClassName('laptops')[0];

const proceedToPay = document.getElementsByClassName('proceedToPay')[0]; 
const backToHome = document.getElementsByClassName('backToHome')[0];

logo.addEventListener('click', () => {
    window.location.href = './home.html';
});

phones.addEventListener('click', () => {
    window.location.href = './phones.html';
});

tablets.addEventListener('click', () => {
    window.location.href = './tablets.html';
});

laptops.addEventListener('click', () => {
    window.location.href = './laptops.html';
});

proceedToPay.addEventListener('click', () => {
    window.location.href = './addAddress.html';
});

backToHome.addEventListener('click', () => {
    window.location.href = './home.html';
});

// Consolidate fetching and displaying cart items
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('http://localhost:3000/api/cart/getItems', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }

        const cartItems = await response.json();
        const cartContainer = document.getElementById('cart-items');

        if (cartItems.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        cartContainer.innerHTML = ""; // Clear previous content

        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
            <div class="cart-item-content">
                <img src="http://localhost:3000/images/${item.image}" alt="${item.itemName}" width="100">
                <div class="item-details">
                    <p class="item-name">${item.itemName}</p>
                    <p class="item-quantity">${item.quantity} x ${item.itemPrice} Ft</p>
                    <button class="btndel" onclick="removeFromCart(${item.product_id})">Remove</button>
                </div>
            </div>
        `;
            cartContainer.appendChild(itemElement);
        });

    } catch (error) {
        console.error("Error loading cart:", error);
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const loginButton = document.querySelector('.icon-profile');

    try {
        // Fetch the username to check if the user is logged in
        const response = await fetch('http://localhost:3000/api/getUsername', {
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
                            const logoutResponse = await fetch('http://localhost:3000/api/logout', {
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

// Function to handle item removal
function removeFromCart(product_id) {
    fetch("http://localhost:3000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ product_id }),
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: "Termék eltávolítva!",
            text: data.message,
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            // Update UI after item removal
            removeItemFromDOM(product_id);
            updateCartSummary();
        });
    })
    .catch(error => {
        Swal.fire({
            title: "Hiba!",
            text: "Nem sikerült eltávolítani a terméket.",
            icon: "error",
            confirmButtonText: "OK"
        });
        console.error("Error removing item:", error);
    });
}

// Function to remove item from the DOM after removal
function removeItemFromDOM(product_id) {
    const itemDiv = document.querySelector(`.cart-item[data-product-id="${product_id}"]`);
    if (itemDiv) {
        itemDiv.remove();  // Remove the item element from the DOM
    }
}

// Function to update cart summary (total price and count)
function updateCartSummary() {
    fetch("http://localhost:3000/api/cart/getItems", {
        credentials: "include"
    })
    .then(response => response.json())
    .then(cartItems => {
        const totalContainer = document.querySelector(".total");
        const cartCountElement = document.getElementById("cart-count");

        if (cartItems.length === 0) {
            totalContainer.innerHTML = "Végösszeg: 0 Ft";  // Display 0 when cart is empty
            cartCountElement.textContent = 0;  // Display 0 items in the cart
            return;
        }

        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.itemPrice * item.quantity; // Recalculate total price
        });

        totalContainer.innerHTML = `Végösszeg: ${totalPrice} Ft`;  // Update total price
        cartCountElement.textContent = cartItems.length;  // Update item count

        // Show or hide the cart count exclamation mark based on item count
        const cartIcon = document.getElementById("cart-icon");
        if (cartItems.length > 0) {
            cartIcon.classList.add("show-exclamation");
        } else {
            cartIcon.classList.remove("show-exclamation");
        }
    })
    .catch(error => console.error("Error updating cart summary:", error));
}

// Function to display cart items when the page loads
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('http://localhost:3000/api/cart/getItems', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }

        const cartItems = await response.json();
        const cartContainer = document.getElementById('cart-items');
        const totalContainer = document.querySelector(".total");

        if (cartItems.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            totalContainer.innerHTML = "Végösszeg: 0 Ft";  // Display 0 when cart is empty
            return;
        }

        cartContainer.innerHTML = ""; // Clear previous content
        let totalPrice = 0;

        cartItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.setAttribute("data-product-id", item.product_id); // Set product_id as data attribute

            const itemTotalPrice = item.itemPrice * item.quantity;
            totalPrice += itemTotalPrice;

            itemDiv.innerHTML = `
                <img src="http://localhost:3000/images/${item.image}" alt="${item.itemName}">
                <div class="item-details">
                    <p>${item.itemName}</p>
                    <p>${item.quantity} x ${item.itemPrice} Ft</p>
                    <p><strong>Összesen: ${itemTotalPrice} Ft</strong></p>
                </div>
                <button class="btndel" onclick="removeFromCart(${item.product_id})">Törlés</button>
            `;
            cartContainer.appendChild(itemDiv);
        });

        totalContainer.innerHTML = `Végösszeg: ${totalPrice} Ft`;  // Update total price
    } catch (error) {
        console.error("Error loading cart:", error);
    }
});


function updateCartCount() {
    fetch("http://localhost:3000/api/cart/count", { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            const cartCountElement = document.getElementById("cart-count");
            if (cartCountElement) {
                cartCountElement.textContent = data.count; // Update cart count
            }

            const cartIcon = document.getElementById("cart-icon");
            if (cartIcon) {
                if (data.count > 0) {
                    cartIcon.classList.add("show-exclamation");
                } else {
                    cartIcon.classList.remove("show-exclamation");
                }
            }
        })
        .catch(error => console.error("Error updating cart count:", error));
}


function updateTotalPrice() {
    let totalPrice = 0;
    document.querySelectorAll(".cart-item").forEach(item => {
        const priceText = item.querySelector(".item-quantity").textContent; // "2 x 500 Ft"
        const [quantity, price] = priceText.match(/\d+/g).map(Number); // Extract numbers
        totalPrice += quantity * price;
    });

    document.querySelector(".total").innerHTML = `Végösszeg: ${totalPrice} Ft`;
}



function fetchCartItems() {
    fetch("http://localhost:3000/api/cart/items", {
        credentials: "include", // Send authentication token if needed
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById("cart-items").innerHTML = `<p>${data.error}</p>`;
            return;
        }
        displayCartItems(data);
    })
    .catch(error => console.error("Error fetching cart items:", error));
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('http://localhost:3000/api/cart/getItems', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }

        const cartItems = await response.json();
        const cartContainer = document.getElementById('cart-items');

        if (cartItems.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            document.querySelector(".total").innerHTML = "Végösszeg: 0 Ft";  // Display 0 when cart is empty
            return;
        }

        cartContainer.innerHTML = ""; // Clear previous content
        let totalPrice = 0;  // Initialize the total price variable

        cartItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');

            // Correct price calculation for each item
            const itemTotalPrice = item.itemPrice * item.quantity;  // Calculate total price for this item
            totalPrice += itemTotalPrice;  // Add the item total price to the overall total

            itemDiv.innerHTML = `
                <img src="http://localhost:3000/images/${item.image}" alt="${item.itemName}">
                <div class="item-details">
                    <p>${item.itemName}</p>
                    <p>${item.quantity} x ${item.itemPrice} Ft</p>
                    <p><strong>Összesen: ${itemTotalPrice} Ft</strong></p>
                </div>
                <button class="btndel" onclick="removeFromCart(${item.product_id})">Törlés</button>
            `;
            cartContainer.appendChild(itemDiv);
        });

        // Update the total price on the page after calculating all items' total price
        document.querySelector(".total").innerHTML = `Végösszeg: ${totalPrice} Ft`;
    } catch (error) {
        console.error("Error loading cart:", error);
    }
});



function removeFromCart(product_id) {
    fetch("http://localhost:3000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ product_id }),
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: "Termék eltávolítva!",
            text: data.message,
            icon: "success",
            timer: 1500, // Closes automatically after 1.5 seconds
            showConfirmButton: false
        }).then(() => {
            fetchCartItems(); // Refresh cart after SweetAlert closes
        });
    })
    .catch(error => {
        Swal.fire({
            title: "Hiba!",
            text: "Nem sikerült eltávolítani a terméket.",
            icon: "error",
            confirmButtonText: "OK"
        });
        console.error("Error removing item:", error);
    });
}



