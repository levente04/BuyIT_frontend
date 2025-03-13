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
async function fetchUserName() {
    try {
        const response = await fetch('/api/getUsername', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok && data.name) {
            document.getElementById("name").value = data.name;
            belepesText.textContent = data.name; // Display username in UI
        } else {
            belepesText.textContent = 'Belépés';
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
}

// Handle login/logout system
document.addEventListener("DOMContentLoaded", async function () {
    await fetchUserName(); // Fetch user info on page load

    belepesText.addEventListener('click', async function (e) {
        e.preventDefault();

        if (belepesText.textContent !== 'Belépés') {
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
                                    window.location.href = 'home.html';
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
                if (confirm("Biztosan ki szeretnél lépni?")) {
                    try {
                        const logoutResponse = await fetch('/api/logout', {
                            method: 'POST',
                            credentials: 'include',
                        });

                        if (logoutResponse.ok) {
                            alert("Sikeres kijelentkezés!");
                            window.location.href = 'home.html';
                        } else {
                            alert("Hiba történt a kijelentkezés során!");
                        }
                    } catch (error) {
                        alert("Hiba történt a kijelentkezés során!");
                        console.error('Error logging out:', error);
                    }
                }
            }
        }
    });
});

// Handle form submission
document.addEventListener("DOMContentLoaded", function () {
    const messageBox = document.createElement("p");
    messageBox.id = "messageBox";
    messageBox.style.color = "#e74c3c";
    messageBox.style.fontWeight = "bold";
    messageBox.style.marginTop = "10px";
    messageBox.style.textAlign = "center";
    document.querySelector(".container").appendChild(messageBox);

    proceedToPayButton.addEventListener("click", async function () {
        messageBox.innerText = "";

        const formData = {
            city: document.getElementById("city").value.trim(),
            address: document.getElementById("address").value.trim(),
            note: document.getElementById("note").value.trim(),
            postcode: document.getElementById("postCode").value.trim(),
            tel: document.getElementById("tel").value.trim()
        };

        if (!formData.city || !formData.address || !formData.postcode || !formData.tel) {
            messageBox.innerText = "Kérjük, töltsd ki az összes mezőt!";
            return;
        }

        const phoneRegex = /^[0-9+\-\s()]{6,20}$/;
        if (!phoneRegex.test(formData.tel)) {
            messageBox.innerText = "Kérjük, adj meg egy érvényes telefonszámot!";
            return;
        }

        const postcodeRegex = /^\d{4}$/;
        if (!postcodeRegex.test(formData.postcode)) {
            messageBox.innerText = "Kérjük, adj meg egy érvényes irányítószámot (4 számjegy)!";
            return;
        }

        try {
            messageBox.innerText = "Feldolgozás...";
            messageBox.style.color = "#3498db";

            const response = await fetch('/api/createOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                messageBox.innerText = "Rendelés sikeresen létrehozva!";
                messageBox.style.color = "#2ecc71";

                setTimeout(() => {
                    window.location.href = './addPayment.html';
                }, 1000);
            } else {
                messageBox.innerText = data.error || "Hiba történt a rendelés során.";
                messageBox.style.color = "#e74c3c";
            }
        } catch (error) {
            messageBox.innerText = "Hálózati hiba történt.";
            messageBox.style.color = "#e74c3c";
            console.error('Error creating order:', error);
        }
    });
});
