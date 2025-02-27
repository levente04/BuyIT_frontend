const logo = document.getElementsByClassName('menu-logo')[0]
const phones = document.getElementsByClassName('phones')[0]
const tablets = document.getElementsByClassName('tablets')[0]
const laptops = document.getElementsByClassName('laptops')[0]

const proceedToPay = document.getElementsByClassName('proceedToPay')[0]
const backToAddress = document.getElementsByClassName('backToAddress')[0]

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
    window.location.href = './orderSummery.html'
})

backToAddress.addEventListener('click', () => {
    window.location.href = './addAddress.html'
})