// MANIPULAR MENU

const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

// 51:43 esta contando somente produtos que inseridos que forem diferentes, se adicionar 2x o mesmo item não contabiliza no length

//     const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
//     cartCounter.innerHTML = totalQuantity;

// testei essa solução aqui e funcionou: coloca as classes max-h-64  e overflow-y-auto na div dos itens, fica assim:

// <div id="cart-itens" class="flex justify-between mb-2 flex-col max-h-64 overflow-y-auto"></div>


let cart = [];



//ABRIR MODAL CART
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
    
})

//FECHAR CLICKOUT
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    //console.log(parentButton);
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //ADD TO CART
        addToCart(name, price)
    }
    
})

// FUNÇÃO ADD TO CART
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        //Se o item já existe, aumenta apenas a quantidade + 1
        // console.log(existingItem);
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    

    updateCartModal();
}

// ATUALIZAR O CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                 <p class="font-medium">${item.name}</p>
                 <p>Qtde: ${item.quantity}</p>
                 <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                
                <button class="remove-from-cart-btn font-bold" data-name="${item.name}">
                    Remover
                </button>
                
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })
    
    
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

//  FUNÇAO REMOVER
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex( item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();


    }

}


addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})
//FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){

        Toastify({
            text: "Ops! A loja de CupCake está fechada...",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar "pru ZapZap"
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "92982297266"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,"_blank")

    cart = [];
    updateCartModal();
    
})

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}