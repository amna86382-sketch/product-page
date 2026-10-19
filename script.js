
const products = [
    { id: 1, name: "Wireless Headphones", price: 3500 },
    { id: 2, name: "Smart Watch", price: 5000 },
    { id: 3, name: "Travel Backpack", price: 2200 },
    { id: 4, name: "Casual Sneakers", price: 4000 },
    { id: 5, name: "Bluetooth Speaker", price: 2800 },
    { id: 6, name: "Coffee Mug", price: 600 }
];
// Cart state
let cart = {};
// Select HTML elements
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartButton = document.getElementById("clear-cart");
// Format price in Pakistani Rupees
function formatPrice(price) {
    return "Rs. " + price.toLocaleString("en-PK");
}
// Add product to cart
document.querySelectorAll(".add-to-cart").forEach(function(button) {
    button.addEventListener("click", function() {
        const id = Number(button.dataset.id);
 if (cart[id]) {
 cart[id].quantity++;
 } else {
 const product = products.find(function(item) {
 return item.id === id;
  });
 cart[id] = {
 ...product,
  quantity: 1
       };
 }
        updateCart();
    });
});
// Increase or decrease quantity
function changeQuantity(id, amount) {
    if (!cart[id]) return;

    cart[id].quantity += amount;

    if (cart[id].quantity <= 0) {
        delete cart[id];
    }
    updateCart();
}
// Update cart count, items and total
function updateCart() {
    const items = Object.values(cart);

    const totalQuantity = items.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);

    const totalPrice = items.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    // Update cart count
    cartCount.textContent = totalQuantity;

    // Update total price
    cartTotal.textContent = formatPrice(totalPrice);

    // Show empty cart message
    if (items.length === 0) {
        cartItems.innerHTML =
            '<p class="text-muted">Your cart is empty.</p>';
        return;
    }
    // Display cart products
    cartItems.innerHTML = items.map(function(item) {
        return `
      <div class="cart-item">
      <div class="row align-items-center g-3">
     <div class="col-12 col-md-4">
    <div class="cart-item-name">${item.name}</div>
    <small>${formatPrice(item.price)} each</small>
 </div>
    <div class="col-6 col-md-4">
    <div class="quantity-controls">
 <button
     class="btn btn-outline-secondary"
      data-action="decrease"
      data-id="${item.id}"
     aria-label="Decrease ${item.name} quantity"
 >−</button>
 <span>${item.quantity}</span>
 <button
       class="btn btn-outline-secondary"
     data-action="increase"
     data-id="${item.id}"
   aria-label="Increase ${item.name} quantity"
  >+</button>
</div>
 </div>
  <div class="col-6 col-md-4 text-end">
  <div class="cart-item-price">
         ${formatPrice(item.price * item.quantity)}
</div>
  <button
      class="btn btn-sm btn-link text-danger p-0"
      data-action="remove"
      data-id="${item.id}"
  >Remove</button>
  </div>
  </div>
   </div>
     `;
    }).join("");
}
// Handle cart quantity and remove buttons
cartItems.addEventListener("click", function(event) {
    const button = event.target.closest("button");
    if (!button) return;
    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    if (action === "increase") {
        changeQuantity(id, 1);
    } else if (action === "decrease") {
        changeQuantity(id, -1);
    } else if (action === "remove") {
        delete cart[id];
        updateCart();
    }
});
// Clear entire cart
clearCartButton.addEventListener("click", function() {
    cart = {};
    updateCart();
});
// Initial display
updateCart();
