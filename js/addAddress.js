const belepesText=document.getElementsByClassName('belepes-text')[0]
const logo = document.getElementsByClassName('menu-logo')[0]
const phones = document.getElementsByClassName('phones')[0]
const tablets = document.getElementsByClassName('tablets')[0]
const laptops = document.getElementsByClassName('laptops')[0]

const proceedToPay = document.getElementsByClassName('proceedToPay')[0]
const backToHome = document.getElementsByClassName('backToCart')[0]

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

proceedToPay.addEventListener('click', () => {
    window.location.href = './addPayment.html'
})

backToHome.addEventListener('click', () => {
    window.location.href = './cart.html'
})

fetch('/api/getUsername')
.then(response => response.json())
.then(data => {
    document.getElementById("name").value = data.name;
})
.catch(error => console.error('Error fetching user:', error));

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

const btnProceedToPay = document.getElementById('btnProceedToPay');

btnProceedToPay.addEventListener('click', addAddress);

async function addAddress() {
    const note = document.getElementById('note').value;
    const postcode = document.getElementById('postCode').value;
    const city = document.getElementById('city').value;
    const address = document.getElementById('address').value;

    // You need to fetch user_id and order_id dynamically
    const user_id = getUserId();  // Replace this with actual logic to get user_id
    const order_id = getOrderId(); // Replace this with actual logic to get order_id

    // Check if all required fields are filled
    if (!note || !postcode || !city || !address || !user_id || !order_id) {
        alert("Tölts ki minden mezőt!");
        return;
    }

    console.log("Sending data:", { order_id, user_id, note, postcode, city, address });

    try {
        const res = await fetch('/api/addAddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order_id, user_id, note, postcode, city, address })
        });

        const data = await res.json();
        console.log("Response data:", data);

        if (res.ok) {
            alert(data.message);
            window.location.href = '../addPayment.html'; // Redirect to next page
        } else {
            alert(data.error || 'Hiba történt');
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Hálózati hiba. Próbáld újra!");
    }
}

// Simulating getting user_id dynamically (you can replace it with actual logic)
function getUserId() {
    // Example: Get user_id from sessionStorage, localStorage, or from an authenticated session
    return localStorage.getItem('user_id') || 1;  // Replace with actual logic
}

// Simulating getting order_id dynamically (you can replace it with actual logic)
function getOrderId() {
    // Example: Get order_id from session, URL params, or a global variable
    return localStorage.getItem('order_id') || 123;  // Replace with actual logic
}
