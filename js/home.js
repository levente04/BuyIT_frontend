const belepesText=document.getElementsByClassName('belepes-text')[0]
const phones = document.getElementsByClassName('phones')[0]
const tablets = document.getElementsByClassName('tablets')[0]
const laptops = document.getElementsByClassName('laptops')[0]

const iconAdmin = document.getElementsByClassName('icon-admin')[0]
const iconBasket = document.getElementsByClassName('icon-basket')[0]

phones.addEventListener('click', () => {
    window.location.href = './phones.html'
})

tablets.addEventListener('click', () => {
    window.location.href = './tablets.html'
})

laptops.addEventListener('click', () => {
    window.location.href = './laptops.html'
})

document.addEventListener("DOMContentLoaded", async function () {
    let isLoggedIn = false;

    try {
        const response = await fetch('/api/getUsername', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            isLoggedIn = true;
            belepesText.textContent = data.name;
            localStorage.setItem("user_id", data.user_id);
        } else {
            belepesText.textContent = 'Belépés';
        }
    } catch (error) {
        console.error('Error fetching username:', error);
        belepesText.textContent = 'Belépés';
    }

    // Cart icon click event
    const iconBasket = document.getElementsByClassName('icon-basket')[0];

    iconBasket.addEventListener("click", function (event) {
        if (!isLoggedIn) {
            event.preventDefault();
            Swal.fire({
                title: "Bejelentkezés szükséges!",
                text: "A kosár megtekintéséhez először be kell jelentkezned.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Bejelentkezés",
                cancelButtonText: "Mégse"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = './login.html'; // Redirect to login page
                }
            });
        } else {
            window.location.href = './cart.html'; // Proceed if logged in
        }
    });
});

// Function to reuse existing modal for login prompt
function showLoginPrompt() {
    const modal = document.getElementById("logoutModal");
    const modalContent = modal.querySelector(".modal-content");

    // Update modal content for login prompt
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <p>You must log in to access your cart.</p>
        <button id="loginRedirect">Log in</button>
        <button id="cancelLogin">Cancel</button>
    `;

    modal.style.display = "block"; // Show modal

    // Close modal when clicking X or cancel button
    modal.querySelector(".close").onclick = () => modal.style.display = "none";
    document.getElementById("cancelLogin").onclick = () => modal.style.display = "none";

    // Redirect to login page
    document.getElementById("loginRedirect").onclick = () => {
        window.location.href = "login.html";
    };
}


document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/getRole', {
        method: 'GET',
        credentials: 'include', // Include the authentication cookie
    })
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        const userRole = data.role; // Get the role from the parsed response
        const adminLink = document.getElementsByClassName('icon-admin')[0]; // Admin button

        if (!adminLink) return; // Ensure the element exists

        // Disable admin access for non-admin users
        if (userRole !== "admin") {
            adminLink.addEventListener("click", function (event) {
                event.preventDefault(); // Stop navigation
                alert("Access Denied! You are not an admin.");
            });
        } else {
            // Enable admin access for admin users
            adminLink.addEventListener("click", function () {
                window.location.href = './admin.html';
            });
        }
    })
    .catch(error => {
        console.error("Error fetching user role:", error);
    });
});


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

document.addEventListener("DOMContentLoaded", async () => {
    const productsContainer = document.querySelector(".row");

    try {
        const response = await fetch("/api/getProducts");
        const products = await response.json();
        renderProducts(products, productsContainer);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
});

// Separate function to render the products
function renderProducts(products, productsContainer) {
    productsContainer.innerHTML = ""; // Clear the container

    products.forEach(products => {
        const productCard = document.createElement("div");
        productCard.classList.add("card");

        productCard.innerHTML = `
            <div class="card-body">
                <div class="pic-div">
                    <img src="/images/${products.image}" alt="${products.itemName}">
                </div>
            </div>
            <div class="termek-nev">
                <span>${products.itemName}</span>
            </div>
            <div class="card-footer">
                <span>${products.itemPrice} Ft</span>
                <div class="kosar">
                    <button type="button" class="btnKosar" data-id="${products.product_id}">Kosárba</button>
                </div>
            </div>
        `;

        productsContainer.appendChild(productCard);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");

    const cartCountElement = document.getElementById('cartCount');

    // Function to update cart count from API
    async function updateCartCount() {
        try {
            const response = await fetch('/api/cart/count', {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                cartCountElement.textContent = data.count; // Update cart number
                cartCountElement.style.display = data.count > 0 ? 'flex' : 'none';
            } else {
                console.error('Failed to fetch cart count:', data);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    }

    updateCartCount();

    document.body.addEventListener('click', async (event) => {
        if (event.target && event.target.classList.contains('btnKosar')) {
            const productId = event.target.dataset.id;

            try {
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ product_id: productId }),
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('Product added to cart:', data);

                    event.target.textContent = "Kosárban";
                    event.target.style.backgroundColor = "green";
                    event.target.style.color = "white";
                    event.target.style.border = "2px solid green";
                    event.target.style.cursor = "default"; 
                    event.target.disabled = true;

                    const kosarDiv = event.target.closest('.kosar');
                    if (kosarDiv) {
                        kosarDiv.style.backgroundColor = "green";
                        kosarDiv.style.border = "2px solid green";
                    }

                    updateCartCount();
                } else {
                    console.error('Failed to add product to cart:', data);
                }
            } catch (error) {
                console.error('Error adding product to cart:', error);
            }
        }
    });
});

async function updateCartIndicator() {
    console.log("Checking cart count...");
    
    // Get user ID from localStorage (or sessionStorage)
    const userId = localStorage.getItem("user_id"); 
    localStorage.setItem("user_id", data.user_id);

    if (!userId) {
        console.error("User ID not found! Cannot fetch cart count.");
        return;
    }

    try {
        const response = await fetch(`/api/cart/count/${userId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();
        console.log("Cart count response:", data);

        const exclamationMark = document.getElementById("cartAlert");

        if (data.count > 0) {
            exclamationMark.style.display = "inline"; // Show ❗
        } else {
            exclamationMark.style.display = "none"; // Hide if empty
        }
    } catch (error) {
        console.error("Error fetching cart count:", error);
    }
}

const txttxt = document.getElementById('search1');
const search_form = document.getElementById('search_form')

search_form.addEventListener('submit', (event) => {
    event.preventDefault();
});

txttxt.addEventListener('input', () => {
    searchingProduct(txttxt.value);
});


async function searchingProduct(searchQuery) {
    console.log(searchQuery);

    const res = await fetch(`/api/search/${searchQuery}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
        credentials: 'include'
    });

    const data = await res.json();
    console.log(data);

    renderProducts(data)

}
// Run when page loads
document.addEventListener("DOMContentLoaded", updateCartIndicator);

// Also update when an item is added
document.body.addEventListener("click", async (event) => {
    if (event.target.classList.contains('btnKosar')) {
        await updateCartIndicator();
    }
});















