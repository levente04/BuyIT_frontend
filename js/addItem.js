document.getElementById('btnAdd').addEventListener('click', async () => {
    const itemName = document.getElementById('itemName').value;
    const itemCategory = document.getElementById('itemCategory').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const stock = document.getElementById('stock').value;
    const imageFile = document.getElementById('fileUpload').files[0];

    console.log(itemName, itemCategory, itemPrice, stock, imageFile);

    if (!itemName || !itemCategory || !itemPrice || !stock || !imageFile) {
        alert('Minden mezőt ki kell tölteni!');
        return;
    }

    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('itemCategory', itemCategory);
    formData.append('itemPrice', itemPrice);
    formData.append('stock', stock);
    formData.append('image', imageFile);

    try {
        const response = await fetch('http://localhost:3000/api/addItem', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
    
        const result = await response.json();
    
        if (response.ok) {
            alert('Termék sikeresen hozzáadva!');
            location.reload();
        } else {
            alert(result.error || "Hiba történt a termék hozzáadásakor!"); // ✅ Fixed: Use 'result' instead of 'data'
        }
    } catch (error) {
        console.error('Hiba:', error);
        alert('Hiba történt a termék hozzáadásakor!');
    }
    
});

