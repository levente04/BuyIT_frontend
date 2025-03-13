const logo = document.getElementsByClassName('menu-logo')[0]
const phones = document.getElementsByClassName('phones')[0]
const tablets = document.getElementsByClassName('tablets')[0]
const laptops = document.getElementsByClassName('laptops')[0]
const btnusers = document.getElementsByClassName('users')[0]
const btnaddproduct = document.getElementsByClassName('addproduct')[0]

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

btnusers.addEventListener('click', () => {
    window.location.href = './admin_users.html'
})

btnorders.addEventListener('click', () => {
    window.location.href = './admin_orders.html'
})

btnaddproduct.addEventListener('click', () => {
    window.location.href = './addItem.html'
})

document.addEventListener("DOMContentLoaded", async function () {
    try {
        let response = await fetch('/api/usercount')
        let data = await response.json()

        if (response.ok) {
            document.querySelector("#users p").textContent = data.userCount
        } else {
            console.error("Error in response:", data.error)
        }
    } catch (error) {
        console.error("Error fetching user count:", error)
    }
})

