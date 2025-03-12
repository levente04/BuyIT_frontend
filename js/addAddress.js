const belepesText = document.getElementsByClassName('belepes-text')[0];
const logo = document.getElementsByClassName('menu-logo')[0];
const phones = document.getElementsByClassName('phones')[0];
const tablets = document.getElementsByClassName('tablets')[0];
const laptops = document.getElementsByClassName('laptops')[0];

const proceedToPayButton = document.getElementById("btnProceedToPay");
const backToCartButton = document.getElementById("btnBackToCart");

// Navigation handling
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

backToCartButton.addEventListener('click', () => {
    window.location.href = './cart.html';
});

// Display the user's name in the input field if they're logged in
fetch('/api/getUsername', {
    method: 'GET',
    credentials: 'include'
})
.then(response => response.json())
.then(data => {
    if (data.name) {
        document.getElementById("name").value = data.name;
    }
})
.catch(error => console.error('Error fetching user:', error));

// Handle login/logout system
document.addEventListener("DOMContentLoaded", async function () {
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

            // Add logout functionality
            belepesText.addEventListener('click', (e) => { 
                e.preventDefault(); // Prevent default action
            
                // Show SweetAlert confirmation dialog (assumes SweetAlert is loaded)
                if (typeof Swal !== 'undefined') {
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
                } else {
                    // Fallback if SweetAlert is not loaded
                    if (confirm("Biztosan ki szeretnél lépni?")) {
                        fetch('/api/logout', {
                            method: 'POST',
                            credentials: 'include',
                        })
                        .then(response => {
                            if (response.ok) {
                                alert("Sikeres kijelentkezés!");
                                window.location.href = 'home.html';
                            } else {
                                alert("Hiba történt a kijelentkezés során!");
                            }
                        })
                        .catch(error => {
                            alert("Hiba történt a kijelentkezés során!");
                            console.error('Error logging out:', error);
                        });
                    }
                }
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

// Handle form submission
document.addEventListener("DOMContentLoaded", function () {
    // Create and append a message box for status messages
    const messageBox = document.createElement("p");
    messageBox.id = "messageBox";
    messageBox.style.color = "#e74c3c"; // Red for errors
    messageBox.style.fontWeight = "bold";
    messageBox.style.marginTop = "10px";
    messageBox.style.textAlign = "center";
    document.querySelector(".container").appendChild(messageBox);

    // Add event listener to the proceed button
    proceedToPayButton.addEventListener("click", async function () {
        messageBox.innerText = ""; // Clear any previous messages

        // Collect form data
        const formData = {
            city: document.getElementById("city").value.trim(),
            address: document.getElementById("address").value.trim(),
            postcode: document.getElementById("postCode").value.trim(),
            tel: document.getElementById("tel").value.trim()
        };

        // Basic form validation
        if (!formData.city || !formData.address || !formData.postcode || !formData.tel) {
            messageBox.innerText = "Kérjük, töltsd ki az összes mezőt!";
            return;
        }

        // Validate phone number format (optional)
        const phoneRegex = /^[0-9+\-\s()]{6,20}$/;
        if (!phoneRegex.test(formData.tel)) {
            messageBox.innerText = "Kérjük, adj meg egy érvényes telefonszámot!";
            return;
        }

        // Validate postcode (optional - adjust for Hungarian postcodes)
        const postcodeRegex = /^\d{4}$/;
        if (!postcodeRegex.test(formData.postcode)) {
            messageBox.innerText = "Kérjük, adj meg egy érvényes irányítószámot (4 számjegy)!";
            return;
        }

        try {
            // Show loading indicator (optional)
            messageBox.innerText = "Feldolgozás...";
            messageBox.style.color = "#3498db"; // Blue for processing

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
                // Success - change message color and text
                messageBox.innerText = "Rendelés sikeresen létrehozva!";
                messageBox.style.color = "#2ecc71"; // Green for success
                
                // Redirect to confirmation page after a short delay
                setTimeout(() => {
                    window.location.href = './orderConfirmation.html';
                }, 1000);
            } else {
                // Error from server
                messageBox.innerText = data.error || "Hiba történt a rendelés során.";
                messageBox.style.color = "#e74c3c"; // Red for errors
            }
        } catch (error) {
            // Network or other error
            messageBox.innerText = "Hálózati hiba történt.";
            messageBox.style.color = "#e74c3c"; // Red for errors
            console.error('Error creating order:', error);
        }
    });
});