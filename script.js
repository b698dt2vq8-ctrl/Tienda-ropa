/* ==================================================
   MENÚ PRINCIPAL
================================================== */
const menuToggle = document.getElementById("menuToggle");
const mainMenu = document.getElementById("mainMenu");

if (menuToggle && mainMenu) {
  menuToggle.addEventListener("click", () => {
    mainMenu.classList.toggle("active");
  });
}

/* ==================================================
   SUBMENÚS
================================================== */
document.querySelectorAll(".has-submenu > span").forEach(span => {
  span.addEventListener("click", e => {
    e.stopPropagation();
    span.parentElement.classList.toggle("active");
  });
});

/* ==================================================
   BUSCADOR
================================================== */
const searchInput = document.getElementById("searchInput");
const products = document.querySelectorAll(".product");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    products.forEach(product => {
      const title = product.querySelector("h3").textContent.toLowerCase();
      product.style.display = title.includes(value) ? "block" : "none";
    });
  });
}

/* ==================================================
   FILTRO POR CATEGORÍA
================================================== */
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;

    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    products.forEach(product => {
      product.style.display =
        category === "all" || product.dataset.category === category
          ? "block"
          : "none";
    });
  });
});

/* ==================================================
   CAMBIO DE IMAGEN
================================================== */
function cambiarImagen(imgId, nuevaSrc) {
  const img = document.getElementById(imgId);
  if (img) img.src = nuevaSrc;
}

/* ==================================================
   CARRITO
================================================== */
const cartIcon = document.querySelector(".cart-icon");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");
const cartCountElement = document.querySelector(".cart-count");

let cart = [];

cartIcon?.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
});

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
}

closeCartBtn?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);

/* ==================================================
   AGREGAR AL CARRITO
================================================== */
document.querySelectorAll(".add-cart").forEach(button => {
  button.addEventListener("click", () => {
    const product = button.closest(".product");

    const tallaSelect = product.querySelector('select[name="talla"]');
    const talla = tallaSelect?.value;
    if (tallaSelect && !talla) {
      alert("Selecciona una talla");
      return;
    }

    const colorBtn = product.querySelector(".color.active");
    if (!colorBtn) {
      alert("Selecciona un color");
      return;
    }
    const color = colorBtn.dataset.color;

    const name = product.querySelector("h3").textContent;
    const price = parseFloat(product.querySelector(".price").textContent.replace(/[^0-9.]/g, ""));
    const img = product.querySelector("img").src;

    const existing = cart.find(p =>
      p.name === name && p.talla === talla && p.color === color
    );

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, img, talla, color, qty: 1 });
    }

    updateCartCount();
    renderCart();

    button.textContent = "Agregado ✓";
    setTimeout(() => button.textContent = "Agregar al carrito", 1000);
  });
});

/* ==================================================
   RENDER CARRITO
================================================== */
function renderCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price * item.qty;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" class="cart-item-img">

        <div class="cart-item-info">
          <div class="cart-item-top">
            <span>${item.name}</span>
            <button class="remove" data-i="${i}">&times;</button>
          </div>

          <div class="cart-item-meta">
            <span class="cart-size">${item.talla}</span>
            <span class="cart-color" style="background:${item.color}"></span>
          </div>

          <div class="cart-item-controls">
            <button class="dec" data-i="${i}">−</button>
            <span>${item.qty}</span>
            <button class="inc" data-i="${i}">+</button>
          </div>

          <strong>$${(item.price * item.qty).toFixed(2)}</strong>
        </div>
      </div>
    `;
  });

  cartTotalElement.textContent = total.toFixed(2);

  document.querySelectorAll(".inc").forEach(b =>
    b.onclick = () => (cart[b.dataset.i].qty++, updateCartCount(), renderCart())
  );
  document.querySelectorAll(".dec").forEach(b =>
    b.onclick = () => {
      const i = b.dataset.i;
      cart[i].qty > 1 ? cart[i].qty-- : cart.splice(i, 1);
      updateCartCount();
      renderCart();
    }
  );
  document.querySelectorAll(".remove").forEach(b =>
    b.onclick = () => (cart.splice(b.dataset.i, 1), updateCartCount(), renderCart())
  );
}

/* ==================================================
   CONTADOR
================================================== */
function updateCartCount() {
  cartCountElement.textContent = cart.reduce((a, p) => a + p.qty, 0);
}

/* ==================================================
   SELECCIÓN DE COLOR
================================================== */
document.querySelectorAll(".product .color").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".colores").querySelectorAll(".color")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

/* ==================================================
   WHATSAPP DRAWER
================================================== */
const whatsappBtn = document.querySelector(".whatsapp-btn");
const whatsappDrawer = document.getElementById("whatsappDrawer");
const closeWhatsapp = document.getElementById("closeWhatsapp");

whatsappBtn?.addEventListener("click", () => {
  closeCart();
  whatsappDrawer.classList.add("open");
});

closeWhatsapp?.addEventListener("click", () => {
  whatsappDrawer.classList.remove("open");
});

/* ==================================================
   ENVIAR PEDIDO POR WHATSAPP
================================================== */
function enviarWhatsappPedido() {

  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const nombre = document.getElementById("wpNombre").value.trim();
  const ci = document.getElementById("wpCI").value.trim();
  const direccion = document.getElementById("wpDireccion").value.trim();
  const numeroCasa = document.getElementById("wpNumero").value.trim();
  const pago = document.querySelector('input[name="pago"]:checked');

  if (!nombre || !ci || !direccion || !pago) {
    alert("Por favor completa los campos obligatorios");
    return;
  }

  /* =============================
     MENSAJE
  ============================== */
  let mensaje = `🛍️ *NUEVO PEDIDO*\n\n`;

  mensaje += `👤 *Cliente:* ${nombre}\n`;
  mensaje += `🪪 *CI:* ${ci}\n\n`;

  mensaje += `📍 *Dirección:*\n${direccion}`;
  if (numeroCasa) {
    mensaje += `, #${numeroCasa}`;
  }
  mensaje += `\n\n`;

  mensaje += `💳 *Pago:* ${pago.value}\n\n`;

  mensaje += `🛒 *Productos:*\n`;

  let total = 0;

  cart.forEach(item => {
    mensaje += `• ${item.name}\n`;
    mensaje += `  Talla: ${item.talla}\n`;
    mensaje += `  Color: ${item.color}\n`;
    mensaje += `  Cant: ${item.qty}\n`;
    mensaje += `  Precio: $${(item.price * item.qty).toFixed(2)}\n\n`;
    total += item.price * item.qty;
  });

  mensaje += `💰 *TOTAL: $${total.toFixed(2)}*`;

  /* =============================
     WHATSAPP (ESTO ES CLAVE)
  ============================== */
  const telefono = "5355786816"; // 👈 TU NÚMERO CON CÓDIGO DE PAÍS
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

