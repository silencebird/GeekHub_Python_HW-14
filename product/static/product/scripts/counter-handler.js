if (!document.body) {
} else {
    const counterHandler = () => {
        const counter = document.querySelector('#product-detail__counter');
        const total_amount = document.querySelector('#product-details__total-amount');
        const addToCart = document.querySelector('#product-details__add-to-cart-btn');
        if (total_amount && counter && addToCart) {
            addToCart.disabled = true;
            const price = total_amount.dataset.price;
            counter.addEventListener('click', e => {
                const totalPrice = +e.target.value * (+price);
                total_amount.innerText = totalPrice;
                addToCart.disabled = e.target.value <= 0;
            })


        }

    };
    const addToCartHandler = () => {
        const addToCart = document.querySelector('#product-details__add-to-cart-btn');
        const counter = document.querySelector('#product-detail__counter');
        const total_amount = document.querySelector('#product-details__total-amount');
        if (counter && addToCart && total_amount) {
            addToCart.addEventListener('click', e => {
                e.preventDefault();
                const id = addToCart.dataset.productId;
                const productTitle = addToCart.dataset.productTitle;
                const productPrice = addToCart.dataset.productPrice;
                const qty = counter.value;
                counter.value = 0;
                total_amount.innerText = '0';
                const data = {
                    id: +id,
                    productTitle: productTitle,
                    productPrice: +productPrice,
                    qty: +qty
                };
                if (!sessionStorage.getItem(`Product-${id}`)) {
                    sessionStorage.setItem(`Product-${id}`, JSON.stringify(data));
                } else {
                    const session = JSON.parse(sessionStorage.getItem(`Product-${id}`));
                    data.qty += +session['qty'];
                    sessionStorage.setItem(`Product-${id}`, JSON.stringify(data));
                }
                alert(`${qty} product(s):  added to your cart, total amount:${+qty * (+productPrice)}$`);

            })
        }


    };

    class Cart {

        render() {
            this.cart = document.querySelector('#cart');
            this.cartList = document.querySelector('#cart .cart-list');
        }

        setTotalAmount() {
            let sum = 0;
            Object.keys(sessionStorage).forEach(key => {
                if (`${key}`.includes('Product-')) {
                    const product = JSON.parse(sessionStorage.getItem(`${key}`));
                    sum += (+product.qty) * (+product.productPrice);
                }
            });
            this.totalAmount = sum
        }

        getTotalAmount(amountNode) {
            if (this.totalAmount) {
                amountNode.innerText = `Total amount: ${this.totalAmount}$`;
            }
            else {
                amountNode.innerText = 'Your cart is empty';
            }
        }

        fillCart() {
            const totalAmount = document.createElement('p');
            this.setTotalAmount();
            if (this.cart && this.cartList) {
                Object.keys(sessionStorage).forEach(key => {
                    if (`${key}`.includes('Product-')) {
                        const product = JSON.parse(sessionStorage.getItem(`${key}`));
                        console.log(product);
                        //create product item in cart node
                        const productItem = document.createElement('li');
                        const title = document.createElement('h4');
                        const qty = document.createElement('p');
                        const price = document.createElement('p');
                        const deleteButton = document.createElement('button');
                        deleteButton.addEventListener('click', e => {
                            this.deleteButtonHandler(e, this.cartList, `${key}`, totalAmount)
                        });
                        //append products to cart
                        this.cartList.appendChild(productItem);
                        productItem.appendChild(title);
                        productItem.appendChild(qty);
                        productItem.appendChild(price);
                        productItem.appendChild(deleteButton);
                        //add css class to product item
                        this.addCssClass(productItem, 'product-item');
                        this.addCssClass(title, 'product-item__title');
                        this.addCssClass(qty, 'product-item__qty');
                        this.addCssClass(price, 'product-item__price');
                        this.addCssClass(deleteButton, 'product-item__delete-button');
                        //fill product item from session storage
                        title.innerText = `Product name: ${product.productTitle}`;
                        qty.innerText = `Quantity: ${product.qty} item(s)`;
                        price.innerText = `One item price: ${product.productPrice}$`;
                        deleteButton.innerText = '\u2716';
                    }
                });
                this.cartList.appendChild(totalAmount);
                this.addCssClass(totalAmount, 'cart__total-amount');
                this.getTotalAmount(totalAmount)
            }
        }

        addCssClass(node, name) {
            node.classList.add(name);
        };


        deleteButtonHandler(e, parent, id, totalAmount) {
            e.preventDefault();
            sessionStorage.removeItem(id);
            const currentItem = e.target.parentElement;
            parent.removeChild(currentItem);
            this.updateTotalAmount(totalAmount);
            this.checkOrders();
        }


        checkOrders() {
            let haveProduct = false;
            const formWrapper = document.querySelector('#cart .checkout-form__wrapper');
            Object.keys(sessionStorage).forEach(key => {
                if (`${key}`.includes('Product-')) {
                    haveProduct = true
                }
            });
            formWrapper.disabled = !haveProduct;
        }

        updateTotalAmount(totalAmount) {
            this.setTotalAmount();
            this.getTotalAmount(totalAmount)
        }
    }

    class CheckoutFrom {


        checkOrders() {
            let haveProduct = false;
            const formWrapper = document.querySelector('#cart .checkout-form__wrapper');
            if (formWrapper) {
                Object.keys(sessionStorage).forEach(key => {
                    if (`${key}`.includes('Product-')) {
                        haveProduct = true
                    }
                });
                formWrapper.disabled = !haveProduct;
            }
        }

        render() {
            this.form = document.querySelector('#cart .checkout-form');
            this.checkOrders();
            this.inputs = document.querySelectorAll('.checkout-form__input');
            this.submitButton = document.querySelector('#cart .checkout-form__submit-button');
            if (this.submitButton) {
                this.submitButton.addEventListener('click', e => this.submitButtonHandler(e))
            }

        }

        submitButtonHandler(e) {
            console.log(this.inputs);
            e.preventDefault();
            if (this.formValid()) {
                this.submitData();
            }
        }

        formValid() {
            let valid = true;
            [].forEach.call(this.inputs, input => {
                console.log(!input.validity.valid);
                if (!input.validity.valid) {
                    input.classList.add("checkout-form__input_error");
                    valid = false;
                }
            });
            return valid
        }

        submitData() {
            const orderData = this.getOrderData();
            console.log(orderData);
            if (Object.keys(orderData).length) {
                const url = this.form.dataset.apiUrl;
                const csrftoken = this.getCookie('csrftoken');
                const formData = this.getFormData();
                fetch(`${url}`, {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-type': 'application/json',
                        'X-CSRFToken': `${csrftoken}`
                    },
                    body: JSON.stringify({
                        "client_fullname": `${formData.fullName}`,
                        "client_address": `${formData.address}`,
                        "client_phone_number": `${formData.phoneNumber}`,
                        "client_email": `${formData.email}`,
                        "orders": {
                            'order': JSON.stringify(orderData),
                        }
                    })
                })
                    .then(this.cleanSessionStorage())
                    .then((data) => {
                        alert('Your order on process. Wait for call. Thank you for using our store.')
                    })
                    .then((data) => {
                        document.location.href = '';
                    })
                    .catch((err) => {
                        console.error(err)
                    });
            }
        }

        getFormData() {
            return [].reduce.call(this.inputs, (formData, currInput) => {
                formData[currInput.name] = currInput.value;
                return formData
            }, {});
        }

        getOrderData() {
            const sessionData = Object.keys(sessionStorage).reduce((data, key) => {
                if (`${key}`.includes('Product-')) {
                    const product = JSON.parse(sessionStorage.getItem(`${key}`));
                    data.push(product);
                    return data
                }
            }, []);
            if (Object.keys(sessionData).length) {
                return sessionData
            }
            else {
                return {}
            }
        }


        getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                let cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    let cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        cleanSessionStorage() {
            sessionStorage.clear();
        }
    }

    counterHandler();
    addToCartHandler();
    const cart = new Cart();
    cart.render();
    cart.fillCart();
    const checkoutForm = new CheckoutFrom();
    checkoutForm.render();

}
