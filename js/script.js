
const 
    //Boton ABRIR carrito
    btnOpenShoppingCart = document.querySelector(".shoppingCart__icon"),
    //Boton cerrar carrito
    shoppingCartCloseIcon = document.querySelector(".shoppingCart__closeIcon"),
    //Boton ABRIR menu izquierdo
    btnOpenLeftMenu = document.querySelectorAll(".icon__openMenu"),
    //Boton CERRAR menu izquierdo
    btnCloseLeftMenu = document.querySelector(".leftMenu__closeIcon"),
    //Contenedor padre menu izquierdo
    leftMenu = document.querySelector(".leftMenu"),
    //Badge
    badge = document.querySelector(".header__user--badge"),
    //Contendor de productos a la venta
    containerProducts = document.querySelector(".Products"),
    //Contenedor PADRE del carrito
    shoppingCart = document.querySelector(".shoppingCart"),
    //Boton finalizar compra
    finishPurchase = document.querySelector(".btnFinishPurchase"),
    //Boton vaciar carrito
    emptyCartBackground = document.querySelector(".emptyShoppingCart__container");

let 
    //Titulo "Carrito"
    titleShoppingCart = document.querySelector(".shoppingCart__title"),
     //Titulos de carrito 
     cartListTitles = shoppingCart.querySelector(".shoppingCart__listTitles"),
    //Contendor secundario de carrito
    cartProductsContainer = shoppingCart.querySelector(".shoppingCart__productsContainer"),
    //Contendor de precio final
    finalPriceContainer = document.querySelector(".finalPriceContainer"),
    //Texto de precio final
    finalPriceElement = document.querySelector(".shoppingCart__finalPriceContainer--text"),
    //Contenedor 
    cartButtonsContainer = document.querySelector(".shopping__cart--container")

// Array para guardar los productos agregados al carrito
let cartProducts = [];

//Carrito de compras ABRIR
btnOpenShoppingCart.addEventListener("click", () => {shoppingCart.classList.toggle("show"); });
//Menu izquierdo ABRIR Y CERRAR
btnOpenLeftMenu.forEach((btn) => {
    btn.addEventListener("click", () => {
        leftMenu.classList.toggle("show")
    });
});
btnCloseLeftMenu.addEventListener("click", () => {leftMenu.classList.toggle("show"); });

// Capturar los valores de cada uno de los productos agregados al carrito
containerProducts.addEventListener("click", event => {
    if(event.target.classList.contains("Products__card--btn")){
        const product = event.target.closest(".Products__card");
        const imageProductSrc = product.querySelector(".Products__card--img").src;
        const name = product.querySelector(".Products__card--title").textContent;
        let price = product.querySelector(".Products__card--text").textContent.split(':')[1].trim();
        addToShoppingCart(imageProductSrc, name, price);
    }
});

// Agregando los objetos que son productos dentro del array
const addToShoppingCart = (imageProductSrc, name, price) => {
    price = parseFloat(price.replace(/[^0-9.]/g, "")); 
    const existingProduct = cartProducts.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cartProducts.push({ imageProductSrc, name, price, quantity: 1 });
    }
    createVisualCart(); 
    updateBadge();
};

// Crear carrito visual
const createVisualCart = () => {
    if (cartProducts.length === 0){
        emptyCartBackground.style.display = "flex"
    }else{
        emptyCartBackground.style.display = "none"
    }

    if (cartProducts.length > 0){
    
        //Titulo de "CARRITO""
    if(!titleShoppingCart){
        titleShoppingCart = document.createElement("h2")
        titleShoppingCart.classList.add("shoppingCart__title")
        titleShoppingCart.innerHTML = `CARRITO`;
        shoppingCart.append(titleShoppingCart)
    }
    
    // Agregar tiulos si no existen
    if (!cartListTitles) {
        cartListTitles = document.createElement("ul");
        cartListTitles.classList.add("shoppingCart__listTitles");
        shoppingCart.append(cartListTitles);
    }

    cartListTitles.innerHTML = `
        <li class="shoppingCart__list--element">Producto</li>
        <li class="shoppingCart__list--element">Nombre producto</li>
        <li class="shoppingCart__list--element to-left">Cantidad</li>
        <li class="shoppingCart__list--element to-right">Precio</li>
    `;

    // Creacion del contenedor de productos si no existe
    if (!cartProductsContainer) {
        cartProductsContainer = document.createElement("div");
        cartProductsContainer.classList.add("shoppingCart__productsContainer");
        shoppingCart.append(cartProductsContainer)
    }

    // Limpiar contenedor antes de agregar productos
    cartProductsContainer.innerHTML = "";

     // Creacion de cada producto dentro del carrito
     cartProducts.forEach(({ imageProductSrc, name, price, quantity }) => {
        const shoppingCartProductContainer = document.createElement("div");
        shoppingCartProductContainer.classList.add("shoppingCart__containerProduct");
        shoppingCartProductContainer.innerHTML = `
            <img src="${imageProductSrc}" alt="${name}" class="shoppingCart__imageProduct">
            <span class="shoppingCart__productContainer--span">${name}</span>
            <div class="shoppingCart__quantityConatiner">
                <button class="btn-decreaseQuantity normal-btn">-</button>
                <span>${quantity}</span>
                <button class="btn-increaseQuantity normal-btn">+</button>
            </div>
            <span class="shoppingCart__price">$${(price * quantity).toFixed(2)} MXN</span>
            <i class="fa-regular fa-trash-can general__icon delete-product-btn"></i>
        `;
        cartProductsContainer.append(shoppingCartProductContainer);
    });

    //Creacion del contendro del total de la compra
    if(!finalPriceContainer){
        finalPriceContainer = document.createElement("div")
        finalPriceContainer.classList.add("shoppingCart__finalPriceContainer")

        finalPriceElement = document.createElement("p")
        finalPriceElement.classList.add("shoppingCart__finalPriceContainer-text")

        finalPriceContainer.append(finalPriceElement)
        shoppingCart.append(finalPriceContainer)
    }

     let finalPrice = calculateFinalPrice()
    finalPriceElement.innerHTML = `El total de la compra es: $${finalPrice.toFixed(2)} MXN`
    
    //Creacion del contenedor de los botones de Vaciar y finalizar compra
    if (!cartButtonsContainer){
        cartButtonsContainer = document.createElement("div")
        cartButtonsContainer.classList.add("shopping__cart--container")

        //Vaciar Carrito
        const btnEmptyShoppingCart = document.createElement("button");
        btnEmptyShoppingCart.classList.add("btnEmptyShoppingCart", "btn__general");
        btnEmptyShoppingCart.innerHTML = `
            <span class="btn__general--span">
                <i class="fa-solid fa-trash btn__general--icon"></i> Vaciar carrito
            </span>
        `;

        //Finalizar compra
        const btnFinishPurchase = document.createElement("button");
        btnFinishPurchase.classList.add("btnFinishPurchase", "btn__general");
        btnFinishPurchase.innerHTML = `
            <span class="btn__general--span">
                <i class="fa-solid fa-check-circle btn__general--icon"></i> Finalizar compra
            </span>
        `;

        cartButtonsContainer.append(btnEmptyShoppingCart);
        cartButtonsContainer.append(btnFinishPurchase);

        document.querySelector(".shoppingCart").append(cartButtonsContainer);
    }
 }
    }
   
// Botones del carrito de cada producto con DELEGACION DE EVENTOS
shoppingCart.addEventListener("click", event => {
    
    //Cerrar carrito
    if(event.target.classList.contains("shoppingCart__closeIcon")){
        shoppingCart.classList.toggle("show");
    }

    //Vaciar carrito visual ("DOM") y array
    if(event.target.classList.contains("btnEmptyShoppingCart")){
       emptyCart();
    }

    //Finalizar compra
    if(event.target.classList.contains("btnFinishPurchase")){
       alert(`Su total a pagar es: $${calculateFinalPrice()} MXN`)
       emptyCart();
    }

    // Incrementar cantidad de productos con btn
    if(event.target.classList.contains("btn-increaseQuantity")){
        const productContainer = event.target.closest(".shoppingCart__containerProduct");
        const productName = productContainer.querySelector(".shoppingCart__productContainer--span").textContent;
        const product = cartProducts.find(item => item.name === productName);
        if (product) {
            product.quantity += 1;
            createVisualCart(); 
            updateBadge();
        }
    }

    // Decrementar cantidad de productos con btn
    if(event.target.classList.contains("btn-decreaseQuantity")){
        const productContainer = event.target.closest(".shoppingCart__containerProduct");
        const productName = productContainer.querySelector(".shoppingCart__productContainer--span").textContent;
        const productIndex = cartProducts.findIndex(item => item.name === productName);
        if (productIndex !== -1) {
            if (cartProducts[productIndex].quantity > 1) {
                cartProducts[productIndex].quantity -= 1;
                createVisualCart(); // Actualizamos la visualización
                updateBadge();
            } else {
                if (confirm(`¿Estás seguro de eliminar el producto: ${productName}?`)) {
                    cartProducts.splice(productIndex, 1);
                    productContainer.remove();
                    createVisualCart(); 
                    updateBadge();
                }
            }
        }
    }

    // Eliminar producto del carrito
    if(event.target.classList.contains("delete-product-btn")){
        const productContainer = event.target.closest(".shoppingCart__containerProduct");
        const productName = productContainer.querySelector(".shoppingCart__productContainer--span").textContent;
        const productIndex = cartProducts.findIndex(item => item.name === productName);
        if (productIndex !== -1) {
            cartProducts.splice(productIndex, 1);
            productContainer.remove();
            createVisualCart(); 
            updateBadge();
        }
    }
});

//Calcular el precio final de los productos agregados al carrito
const calculateFinalPrice = () => {
    return cartProducts.reduce((total, producto)=> total + producto.price * producto.quantity, 0)
}

//Actualizar el badge
const updateBadge = () => {
    const totalProducts = cartProducts.reduce((total, product) => total + product.quantity, 0 )
    badge.textContent = totalProducts;
    badge.style.display = totalProducts !== 0 ? "block" : "none"
}

const emptyCart = () => {
    if (titleShoppingCart) {
        titleShoppingCart.remove();
        titleShoppingCart = null;
    }
    if (cartListTitles) {
        cartListTitles.remove();
        cartListTitles = null;
    }
    if (cartProductsContainer) {
        cartProductsContainer.remove();
        cartProductsContainer = null;
    }
    if(finalPriceContainer){
        finalPriceContainer.remove();
        finalPriceContainer = null
    }
    if (cartButtonsContainer) {
        cartButtonsContainer.remove();
        cartButtonsContainer = null;
    }

    cartProducts = [];
    createVisualCart();
    updateBadge();
};
