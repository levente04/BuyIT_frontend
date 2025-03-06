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

fetch("/api/cart/items")
.then(response => response.json())
.then(cartItems => {
    const cartTable = document.getElementById("cartTable").getElementsByTagName("tbody")[0];
    let subtotal = 0; // Initialize subtotal

    cartItems.forEach(item => {
        let row = cartTable.insertRow();
        
        // Image column
        let imgCell = row.insertCell(0);
        let img = document.createElement("img");
        img.src = item.image.startsWith("http") ? item.image : "/" + item.image;
        img.alt = item.product_name;
        imgCell.appendChild(img);

        // Product name column
        let nameCell = row.insertCell(1);
        nameCell.innerHTML = `<h1 class="productName">${item.itemName}</h1>`;

        // Price column
        let priceCell = row.insertCell(2);
        priceCell.innerHTML = `<p class="price">${parseFloat(item.itemPrice).toLocaleString()} Ft</p>`;

        // Add item price to subtotal (ensure it's a number)
        subtotal += parseFloat(item.itemPrice) || 0;
    });

    const deliveryFee = 1490;
    const totalPrice = subtotal + deliveryFee;

    // Update price display
    document.getElementById("subtotal").textContent = subtotal.toLocaleString();
    document.getElementById("total").textContent = `Végösszeg: ${totalPrice.toLocaleString()} Ft`;
})
.catch(error => console.error("Error fetching cart items:", error));