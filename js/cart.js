let cartList = JSON.parse(localStorage.getItem('cart')) || []
let products = []

/* main */
main()

/*=================== function ===================*/
function main() {
    if (cartList.length > 0) {
        window.addEventListener('DOMContentLoaded', handleCartNum())
        renderCartListData()
    } else {
        document.querySelector('.list').innerHTML =
            "<h3>購物車空空的耶</h3><center><button onclick=window.location.href='./'><span>購物去 </span></button></center>"
        document.querySelector('.checkout').setAttribute('disabled', 'true')
        calculateTotal()
    }
}

// Get selected product total to cart
function handleCartNum() {
    document.querySelectorAll('.qty').forEach((qty) => {
        let num = cartList.length
        if (num) {
            qty.innerHTML = num
        }
    })
}

// Get products list
function productList() {
    cartList.forEach((i) => {
        products.push({
            name: `${i.name}`,
            id: `${i.id}`,
            color: `顏色：${i.color.name}`,
            size: `尺寸：${i.size}`,
            imgURL: `${i.main_image}`,
            qty: `${i.qty}`,
            price: `${i.price}`,
            stock: `${i.stock}`,
        })
    })
}

// Create HTML layout to render data
function renderCartListData() {
    productList()
    let list = document.querySelector('.list')
    products.forEach((product) => {
        // create element
        let row = document.createElement('div')
        let content = document.createElement('a')
        let picture = document.createElement('div')
        let productIMG = document.createElement('img')
        let details = document.createElement('div')
        let number = document.createElement('div')
        let select = document.createElement('select')
        let price = document.createElement('div')
        let subtotal = document.createElement('div')
        let remove = document.createElement('div')
        let trashBin = document.createElement('img')

        // set attribute
        row.setAttribute('class', 'row')
        content.setAttribute('class', 'content')
        content.setAttribute('href', `product.html?id=${product.id}`)
        picture.setAttribute('class', 'picture')
        productIMG.setAttribute('src', `${product.imgURL}`)
        productIMG.setAttribute('alt', `${product.name}`)
        details.setAttribute('class', 'details')
        number.setAttribute('class', 'num')
        price.setAttribute('class', 'price')
        subtotal.setAttribute('class', 'subtotal')
        remove.setAttribute('class', 'remove')
        trashBin.setAttribute('alt', 'remove-item button')

        // set inner content
        details.innerHTML += `
            ${product.name}
            <br>
            ${product.id}
            <br>
            <br>
            ${product.color}
            <br>
            ${product.size}
        `
        for (let i = 1; i <= product.stock; i++) {
            let opt
            // select current qty
            if (parseInt(product.qty) === i) {
                opt = `<option value="${i}" selected>${i}</option>`
            } else {
                opt = `<option value="${i}">${i}</option>`
            }
            select.innerHTML += opt
        }
        price.innerHTML += `NT. ${product.price}`
        subtotal.innerHTML += `NT. ${product.price * product.qty}`

        // append elements
        picture.appendChild(productIMG)
        content.append(picture, details)
        number.appendChild(select)
        remove.appendChild(trashBin)
        row.append(content, number, price, subtotal, remove)
        list.appendChild(row)
    })
    modifyQTY()
    deleteProduct()
    calculateTotal()
}

// Modify quantity feature
function modifyQTY() {
    let selects = document.querySelectorAll('select')
    for (let i = 0; i < selects.length; i++) {
        selects[i].addEventListener('change', (e) => {
            let sub = document.querySelectorAll('.subtotal')[i + 1]
            cartList[i].qty = e.currentTarget.selectedIndex + 1
            localStorage.setItem('cart', JSON.stringify(cartList))
            sub.innerText = `NT. ${
                parseInt(cartList[i].qty) * parseInt(cartList[i].price)
            }`
            calculateTotal()
        })
    }
}

// Remove item feature
function deleteProduct() {
    let removes = document.querySelectorAll('.remove')
    for (let i = 1; i < removes.length; i++) {
        removes[i].addEventListener('click', () => {
            alert('已從購物車中移除')
            cartList.splice(i - 1, 1)
            localStorage.setItem('cart', JSON.stringify(cartList))
            cartList = JSON.parse(localStorage.getItem('cart'))
            document.querySelector('.list').innerHTML = ''
            products = []
            main()
        })
    }
}

// Calculate subtotal, freight, and total price
function calculateTotal() {
    let total = document.querySelector('.total')
    let totalfee = document.querySelector('.totalfee')
    let amount = 0
    if (cartList.length > 0) {
        cartList.forEach((product) => {
            amount += parseInt(product.price) * parseInt(product.qty)
        })
        total.innerHTML = amount
        totalfee.innerHTML = parseInt(total.innerHTML) + 60
    } else {
        total.innerHTML = '0'
        totalfee.innerHTML = '0'
        document.querySelector('.freight').innerHTML = '0'
    }
}

/*======= Initialize TapPay as website payment service =======*/

// SetupSDK
TPDirect.setupSDK(
    12348,
    'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF',
    'sandbox'
)

// TPDirect.card.setup(config)
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****',
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY',
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'CCV',
    },
}

TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        input: {
            color: 'gray',
        },
        // Styling ccv field
        'input.cvc': {
            'font-size': '16px',
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px',
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px',
        },
        // style focus state
        ':focus': {
            color: 'black',
        },
        // style valid state
        '.valid': {
            color: 'green',
        },
        // style invalid state
        '.invalid': {
            color: 'red',
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            input: {
                color: 'orange',
            },
        },
    },
})

// TPDirect.card.onUpdate(callback)
let submitButton = document.querySelector('.checkout')
TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime && cartList.length !== 0) {
        // Enable submit Button to get prime.
        submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.cvc === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.cvc === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
})

// Get Prime & submit
let primeKey
let recipientName = document.querySelector('.name-input')
let recipientEmail = document.querySelector('.email-input')
let recipientPhone = document.querySelector('.phone-input')
let recipientAddr = document.querySelector('.address-input')

/* exported onSubmit */
function onSubmit(event) {
    // check if all data are filled correctly
    const nameRegex = /^([a-zA-Z\u4e00-\u9fa5]{1,10})$/
    const emailRegex = /^([a-z0-9_-]+)@([\da-z-]+)\.([a-z]{2,6})$/
    const phoneRegex = /^0[0-9]{8,9}$/
    const addrRegex = /^([a-zA-Z0-9\u4e00-\u9fa5]+)$/
    if (!nameRegex.test(recipientName.value)) {
        alert('請填入正確的收件人姓名')
        return
    } else if (!emailRegex.test(recipientEmail.value)) {
        alert('請填入正確的 Email')
        return
    } else if (!phoneRegex.test(recipientPhone.value)) {
        alert('請填入正確的聯絡電話')
        return
    } else if (!addrRegex.test(recipientAddr.value)) {
        alert('請填入正確的收件地址')
        return
    }

    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('信用卡資訊填寫錯誤')
        return
    }

    // Get prime from TapPay server
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('資料傳送失敗，請重新傳送')
            console.log('get prime error ' + result.msg)
            return
        }
        console.log('get prime 成功，prime: ' + result.card.prime)
        primeKey = result.card.prime
        setData()
        sendToCheckoutAPI()
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
}

// Set data to send
let cart
function setData() {
    let radioBtns = document.getElementsByName('time-input')
    let time
    for (let i = 0; i < radioBtns.length; i++) {
        if (radioBtns[i].checked === true) {
            time = radioBtns[i].value
        }
    }
    let productList = []
    cartList.forEach((item) => {
        let product = {
            id: item.id,
            name: item.name,
            price: item.price,
            color: {
                name: item.color.name,
                code: item.color.code,
            },
            size: item.size,
            qty: item.qty,
        }
        productList.push(product)
    })
    cart = {
        prime: primeKey,
        order: {
            shipping: 'delivery',
            payment: 'credit_card',
            subtotal: parseInt(document.querySelector('.total').textContent),
            freight: 60,
            total: parseInt(document.querySelector('.totalfee').textContent),
            recipient: {
                name: recipientName.value,
                phone: recipientPhone.value,
                email: recipientEmail.value,
                address: recipientAddr.value,
                time: time,
            },
            list: productList,
        },
    }
}

// Send prime and other order information to Check Out API by "post"
function sendToCheckoutAPI() {
    showLoading()
    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://api.appworks-school.tw/api/1.0/order/checkout')
    xhr.setRequestHeader('Content-type', 'application/json')
    // get FB token and send to api
    let token
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            token = response.authResponse.accessToken
        }
    })
    if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    xhr.send(JSON.stringify(cart))
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('Success')
            window.localStorage.clear()
            let response = JSON.parse(xhr.responseText)
            window.location.href = `thankyou.html?number=${response.data.number}`
        } else if (xhr.status === 400) {
            console.log('Client Error' + xhr.responseText)
        } else if (xhr.status === 500) {
            console.log('Server Error' + xhr.responseText)
        }
    }
}

// Show loading.gif when loading
function showLoading() {
    document.querySelector('.loading').style.display = 'block'
}
