const btnLogin = document.getElementById('btnLogin');

btnLogin.addEventListener('click', login);

async function login() {
    const email = document.getElementById('email').value;
    const psw = document.getElementById('psw').value;

    console.log(email, psw);
    
    const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ email, psw }),
        credentials: 'include'
    });

    const data = await res.json();
    console.log(data);
    
    if (res.ok) {
        Swal.fire("Sikeres bejelentkezés!"). then(() => {
            window.location.href = './home.html';
        });
    } else if (data.errors) {
        let errorMessage = data.errors.map(error => error.error).join("\n");

        Swal.fire({
            title: "Hiba történt!",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "OK"
        });
    } else if (data.error) {
        Swal.fire({
            title: "Hiba!",
            text: data.error,
            icon: "error",
            confirmButtonText: "OK"
        });
    } else {
        Swal.fire({
            title: "Ismeretlen hiba",
            text: "Valami hiba történt, próbáld újra!",
            icon: "error",
            confirmButtonText: "OK"
        });
    }
}