const logo = document.getElementsByClassName('menu-logo')[0]
const phones = document.getElementsByClassName('phones')[0]
const laptops = document.getElementsByClassName('laptops')[0]
const iconAdmin = document.getElementsByClassName('icon-admin')[0]

logo.addEventListener('click', () => {
    window.location.href = './home.html'
})

phones.addEventListener('click', () => {
    window.location.href = './phones.html'
})

laptops.addEventListener('click', () => {
    window.location.href = './laptops.html'
})

iconAdmin.addEventListener('click', () => {
    window.location.href = './admin.html'
})