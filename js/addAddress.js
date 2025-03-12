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

document.addEventListener("DOMContentLoaded", function () {
    const proceedToPayButton = document.getElementById("btnProceedToPay");
    const messageBox = document.createElement("p");
    messageBox.id = "messageBox";
    document.querySelector(".container").appendChild(messageBox);

    proceedToPayButton.addEventListener("click", async function () {
        messageBox.innerText = ""; // Clear any previous messages

        // Collect form data
        const formData = {
            city: document.getElementById("city").value,
            address: document.getElementById("address").value,
            postcode: document.getElementById("postCode").value,
            tel: document.getElementById("tel").value
        };

        // Validate form data
        if (!formData.city || !formData.address || !formData.postcode || !formData.tel) {
            messageBox.innerText = "Kérjük, töltsd ki az összes mezőt!";
            return;
        }

        try {
            // Send data to the backend
            const response = await fetch('/api/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                messageBox.innerText = "Rendelés sikeresen létrehozva!";
                // Optionally, redirect to a confirmation page
                window.location.href = './orderConfirmation.html';
            } else {
                messageBox.innerText = data.error || "Hiba történt a rendelés során.";
            }
        } catch (error) {
            messageBox.innerText = "Hálózati hiba történt.";
            console.error('Error creating order:', error);
        }
    });
});