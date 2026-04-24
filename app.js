// =======================
// Carrito de Compras
// =======================

let cart = [];

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;

    // Botón para eliminar producto
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1); // elimina el producto del array
      updateCart(); // refresca la vista
    });

    li.appendChild(removeBtn);
    cartItems.appendChild(li);
    total += item.price;
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = total;
}

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", e => {
    const product = e.target.closest(".product");
    const item = {
      id: product.dataset.id,
      name: product.dataset.name,
      price: parseInt(product.dataset.price)
    };
    cart.push(item);
    updateCart();
    document.getElementById("cart").style.display = "block";
  });
});

document.getElementById("cart-btn").addEventListener("click", () => {
  const cartSection = document.getElementById("cart");
  cartSection.style.display = cartSection.style.display === "none" ? "block" : "none";
});

// =======================
// Auth0 Login/Logout
// =======================

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");

(async () => {
  window.client = await auth0.createAuth0Client({
    domain: "dev-0amwgx56x45lz7qg.us.auth0.com",
    clientId: "XSVf6w9gS6UuJmBiuXulDiMz7GS6RiDL",
    authorizationParams: { redirect_uri: location.origin },
  });

  // Manejo de errores en el redirect
  if (location.search.includes("error=")) {
    const params = new URLSearchParams(location.search);
    alert(`Error: ${params.get("error")} — ${params.get("error_description")}`);
    history.replaceState({}, "", location.pathname);
    return;
  }

  // Callback después de login
  if (location.search.includes("code=") && location.search.includes("state=")) {
    await window.client.handleRedirectCallback();
    history.replaceState({}, "", location.pathname);
  }

  if (await window.client.isAuthenticated()) {
    const user = await window.client.getUser();
    userInfo.textContent = `Bienvenido, ${user.email}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
})();

// Eventos de login/logout
loginBtn.addEventListener("click", () => {
  client.loginWithRedirect();
});

logoutBtn.addEventListener("click", () => {
  client.logout({ logoutParams: { returnTo: location.origin } });
});
