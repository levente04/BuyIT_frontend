const logo = document.getElementsByClassName('menu-logo')[0]
const tablets = document.getElementsByClassName('tablets')[0]
const laptops = document.getElementsByClassName('laptops')[0]
const iconAdmin = document.getElementsByClassName('icon-admin')[0]

logo.addEventListener('click', () => {
    window.location.href = './home.html'
})

tablets.addEventListener('click', () => {
    window.location.href = './tablets.html'
})

laptops.addEventListener('click', () => {
    window.location.href = './laptops.html'
})

iconAdmin.addEventListener('click', () => {
    window.location.href = './admin.html'
})