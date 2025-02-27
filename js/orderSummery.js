const logo = document.getElementsByClassName('menu-logo')[0]
const phones = document.getElementsByClassName('phones')[0]
const tablets = document.getElementsByClassName('tablets')[0]
const laptops = document.getElementsByClassName('laptops')[0]

const proceedToOrder = document.getElementsByClassName('proceedToOrder')[0]
const backToPayment = document.getElementsByClassName('backToPayment')[0]

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

proceedToOrder.addEventListener('click', () => {
    window.location.href = './successfulOrder.html'
})

backToPayment.addEventListener('click', () => {
    window.location.href = './addPayment.html'
})