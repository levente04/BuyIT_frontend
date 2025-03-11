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

document.addEventListener("DOMContentLoaded", async function () {
    const proceedToPayButton = document.getElementById("btnProceedToPay");
    const messageBox = document.createElement("p");
    messageBox.id = "messageBox";
    document.querySelector(".container").appendChild(messageBox);

    async function getOrCreateCartId() {
        let cartId = localStorage.getItem("cartId");

        if (!cartId) {
            try {
                const response = await fetch("/api/createCart", { method: "POST" });
                const data = await response.json();

                if (response.ok && data.cartId) {
                    cartId = data.cartId;
                    localStorage.setItem("cartId", cartId);
                } else {
                    console.error("Failed to create cart");
                    return null;
                }
            } catch (error) {
                console.error("Error creating cart:", error);
                return null;
            }
        }
        return cartId;
    }

    proceedToPayButton.addEventListener("click", async function () {
        messageBox.innerText = "";

        const formData = {
            city: document.getElementById("city").value,
            address: document.getElementById("address").value,
            postcode: document.getElementById("postCode").value,
            tel: document.getElementById("tel").value
        };

        let cartId = await getOrCreateCartId();
        let token = localStorage.getItem("token");

        if (!cartId) {
            messageBox.innerText = "Hiba: Nincsenek termékek a kosárban!";
            return;
        }

        if (!token) {
            messageBox.innerText = "Hiba: Be kell jelentkeznie a rendeléshez!";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
            return;
        }

        try {
            const response = await fetch(`/api/createOrder/${cartId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                messageBox.innerText = "Rendelés sikeres!";
                localStorage.removeItem("cartId");
                setTimeout(() => {
                    window.location.href = "orderConfirmation.html";
                }, 2000);
            } else {
                messageBox.innerText = data.error || "Hiba történt a rendelés során.";
            }
        } catch (error) {
            messageBox.innerText = "Hálózati hiba történt.";
        }
    });
});

