
# BuyIT Frontend Dokumentáció

## Áttekintés

A BuyIT frontend egy webalapú e-kereskedelmi felület, amely HTML, CSS és JavaScript technológiákat használ. A felület lehetővé teszi a termékek böngészését, kosárba helyezését, bejelentkezést, valamint adminisztratív műveletek végrehajtását.

## Használt technológiák

- **HTML5** – Oldalszerkezet
- **CSS3** – Stílusok (külön fájlokban)
- **JavaScript** – Interaktivitás (külön fájlokban)
- **Font Awesome** – Ikonokhoz
- **Google Fonts** – Egyedi betűtípusokhoz
- **SweetAlert2** – Figyelmeztetések és modális ablakok

## Főbb oldalak

### `home.html`
- Főoldal, termékkeresővel és kategóriaválasztóval (Telefonok, Tabletek, Laptopok)
- Kosár ikon, belépés és admin gomb
- Dinamikusan tölti be a termékeket JavaScript segítségével

### `login.html`
- E-mail és jelszavas bejelentkezés
- Átirányítás regisztrációra, ha nincs fiók

### `cart.html`
- Kosár tartalmának megjelenítése
- Továbblépés fizetéshez / adatok megadásához

### `admin.html`
- Admin vezérlőpult
- Gombok: felhasználók, rendelések, termék hozzáadás, statisztikák
- Összegző statisztikák: felhasználók száma, eladott termékek, rendelések, heti bevétel

### Egyéb fájlok
- `addItem.html`, `addAddress.html`, `addPayment.html`: adatrögzítő űrlapok
- `admin_users.html`, `admin_orders.html`: adminisztrációs listák
- `laptops.html`, stb.: kategória szerinti terméklista

## Fájlszerkezet (részlet)

```
frontend/
├── home.html
├── login.html
├── cart.html
├── admin.html
├── js/
│   ├── home.js
│   ├── cart.js
│   └── login.js
├── css/
│   ├── home.css
│   ├── cart.css
│   └── login.css
```

## Kapcsolat backenddel

A JavaScript fájlok API-hívásokat kezdeményeznek (nem látható itt, de valószínűleg REST endpointokra). Feltételezhetően a backend szolgáltatja a termékeket, bejelentkezést és egyéb adatokat.

---

Készítette: _(automatikusan generált)_
