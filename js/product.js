// Get product id from url
let url = window.location.search
let searchParams = new URLSearchParams(url)
let id = searchParams.get('id')

let button
let cartList = JSON.parse(localStorage.getItem('cart')) || []

/* main */
if (id) {
    getProductDetailsData(id, renderProductDetails)
} else {
    window.location.href = './'
}
// load cart number
window.addEventListener('DOMContentLoaded', handleCartNum())

/*===================function===================*/

// Get data of product details from API server dynamically
function getProductDetailsData(id, callback) {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            callback(data)
        } else if (xhr.status === 400) {
            console.log(xhr.responseText)
        } else if (xhr.status === 500) {
            console.log(xhr.responseText)
        }
    }
    xhr.open(
        'GET',
        `https://api.appworks-school.tw/api/1.0/products/details?id=${id}`
    )
    xhr.send()
}

// Create HTML Layout to render data
function renderProductDetails(data) {
    let productDetails = data.data
    catFocus(productDetails)
    stoploadingAni()
    /*
    <div class="main-img">
        <img src="https://api.appworks-school.tw/assets/201807242228/main.jpg" alt="精緻扭結洋裝">
    </div>
    */
    let img = document.createElement('img')
    img.setAttribute('src', `${productDetails.main_image}`)
    img.setAttribute('alt', `${productDetails.title}`)
    let mainImg = document.createElement('div')
    mainImg.classList.add('main-img')
    mainImg.appendChild(img)
    /*
    <div class="details">
        <div class="name">精緻扭結洋裝</div>
        <div class="id">201902191210</div>
        <div class="price">TWD.999</div>
        <div class="colors">
            <span class="title">顏色 &ensp;|</span>
            <div class="color selected" style="background-color: rgb(69, 203, 212)" alt="FFFFFF"></div>
            <div class="color" style="background-color: rgb(255, 221, 221)"></div>
        </div>
        <div class="sizes">
            <spna class="title">尺寸 &ensp;|</spna>
            <div class="size selected">S</div>
            <div class="size">M</div>
            <div class="size no-stock">L</div>
            <div class="size no-stock">XL</div>
        </div>
        <div class="quantity">
            <span class="title">數量 &ensp;|</span>
            <div class="qty-selector">
                <div class="op">-</div>
                <div class="value">1</div>
                <div class="op">+</div>
            </div>
        </div>
        <div class="add-to-cart">
            <button>加入購物車</button>
        </div>
        <div class="summary">
            實品顏色依單品照為主
            <br />
            <br />
            棉 100%
            <br />
            厚薄：薄
            <br />
            彈性：無
            <br />
            <br />
            清洗：手洗 產地：越南
        </div>
    </div>
    */
    let name = document.createElement('div')
    name.classList.add('name')
    name.innerHTML = `${productDetails.title}`

    let id = document.createElement('div')
    id.classList.add('id')
    id.innerHTML = `${productDetails.id}`

    let price = document.createElement('div')
    price.classList.add('price')
    price.innerHTML = `TWD.${productDetails.price}`

    let colorTitle = document.createElement('span')
    colorTitle.classList.add('title')
    colorTitle.innerHTML = '顏色 &ensp;|'
    let colors = document.createElement('div')
    colors.setAttribute('class', 'colors')
    colors.insertAdjacentElement('beforeend', colorTitle)
    productDetails.colors.forEach((e) => {
        let color = document.createElement('div')
        color.classList.add('color')
        color.setAttribute('style', `background-color: #${e.code}`)
        color.setAttribute('alt', `${e.code}`) // for stock-check
        color.setAttribute('data-name', `${e.name}`)
        colors.insertAdjacentElement('beforeend', color)
    })

    let sizeTitle = document.createElement('span')
    sizeTitle.classList.add('title')
    sizeTitle.innerHTML = '尺寸 &ensp;|'
    let sizes = document.createElement('div')
    sizes.setAttribute('class', 'sizes')
    sizes.insertAdjacentElement('beforeend', sizeTitle)
    productDetails.sizes.forEach((e) => {
        let size = document.createElement('div')
        size.classList.add('size')
        size.insertAdjacentHTML('beforeend', `${e}`)
        sizes.insertAdjacentElement('beforeend', size)
    })

    let qtyTitle = document.createElement('span')
    qtyTitle.classList.add('title')
    qtyTitle.innerHTML = '數量 &ensp;|'

    let op1 = document.createElement('div')
    op1.classList.add('op')
    op1.setAttribute('data-value', '-1')
    op1.innerHTML = '-'

    let value = document.createElement('div')
    value.classList.add('value')
    value.innerHTML = '1'

    let op2 = document.createElement('div')
    op2.classList.add('op')
    op2.setAttribute('data-value', '1')
    op2.innerHTML = '+'

    let qtySelector = document.createElement('div')
    qtySelector.classList.add('qty-selector')
    qtySelector.append(op1, value, op2)

    let qty = document.createElement('div')
    qty.classList.add('quantity')
    qty.append(qtyTitle, qtySelector)

    button = document.createElement('button')
    button.innerHTML = '加入購物車'

    let addCart = document.createElement('div')
    addCart.classList.add('add-to-cart')
    addCart.appendChild(button)

    let summary = document.createElement('div')
    summary.classList.add('summary')
    summary.innerHTML = `
    ${productDetails.note}
    <br />
    <br />
    ${productDetails.texture}
    <br />
    ${productDetails.description.replace(/\n/g, '<br />')}
    <br />
    <br />
    清洗：${productDetails.wash}
    <br />
    產地：${productDetails.place}
    `
    // Append to div.details
    let details = document.createElement('div')
    details.classList.add('details')
    details.append(name, id, price, colors, sizes, qty, addCart, summary)

    /*
    <div class="sep">
        <div class="sep-title">更多產品資訊</div>
        <div class="line"></div>
    </div>
    */
    let sepTitle = document.createElement('div')
    sepTitle.classList.add('sep-title')
    sepTitle.innerHTML = '更多產品資訊'

    let line = document.createElement('div')
    line.classList.add('line')

    let sep = document.createElement('div')
    sep.classList.add('sep')
    sep.append(sepTitle, line)

    /*
    <div class="description">
        <div class="story">
            O.N.S is all about options, which is why we took our
            staple polo shirt and upgraded it with slubby linen
            jersey, making it even lighter for those who prefer
            their summer style extra-breezy.
        </div>
        <div class="product-img">
            <img src="temp/0.jpg" alt="精緻扭結洋裝" />
            <img src="temp/1.jpg" alt="精緻扭結洋裝" />
        </div>
    </div>
    */

    let story = document.createElement('div')
    story.classList.add('story')
    story.innerHTML = `${productDetails.story}`

    let img1 = document.createElement('img')
    img1.setAttribute('src', `${productDetails.images[0]}`)
    img1.setAttribute('alt', `${productDetails.title}`)

    let img2 = document.createElement('img')
    img2.setAttribute('src', `${productDetails.images[1]}`)
    img2.setAttribute('alt', `${productDetails.title}`)

    let productImg = document.createElement('div')
    productImg.classList.add('product-img')
    productImg.append(img1, img2)

    let descript = document.createElement('div')
    descript.classList.add('description')
    descript.append(story, productImg)

    // Append all element to div.container
    let container = document.querySelector('.container')
    container.append(mainImg, details, sep, descript)

    // Set title of HTML
    document.title = `${productDetails.title} | Stylish 產品資訊`

    // Handle product variants
    preSelect(productDetails)
    document
        .querySelectorAll('.color')
        .forEach((color) => color.addEventListener('click', handleColorChange))
    document
        .querySelectorAll('.size')
        .forEach((size) => size.addEventListener('click', handleSizeChange))
    document
        .querySelectorAll('.op')
        .forEach((op) => op.addEventListener('click', handleQTYChange))

    addToCart()
}

// Focus category & redirect when clicked
function catFocus(data) {
    for (let i = 0; i < 3; i++) {
        let arr = ['women', 'men', 'accessories']
        let tag1 = document.querySelectorAll('.nav a')[i]
        let tag2 = document.querySelectorAll('.m-nav a')[i]
        if (data.category === arr[i]) {
            tag1.style.color = '#8b572a'
            tag2.style.color = '#fff'
        }
    }
}

// Disable loading animation
function stoploadingAni() {
    document.getElementsByClassName('loader-ellips')[0].style.display = 'none'
}

/* ===== Handle product variants ===== */
let variants
let variant

// Select first in-stock color and size when loaded
function preSelect(data) {
    variants = data.variants
    for (let i = 0; i < variants.length; i++) {
        if (variants[i].stock > 0) {
            variant = {
                colorCode: variants[i].color_code,
                size: variants[i].size,
                qty: 1,
            }
            break
        }
    }
    renderVariants()
}

// Get stock of color-size set
function getStock(colorCode, size) {
    // return the value of the first element in the provided array that satisfies the provided testing function, otherwise return undefined
    return variants.find((v) => v.color_code === colorCode && v.size === size)
        .stock
}

// Click color
function handleColorChange(e) {
    // refer to the element to which the event handler has been attached： this === e.currentTarget
    const color = e.currentTarget.getAttribute('alt')
    variant.colorCode = color
    // get selected color and its initial in-stock size
    if (getStock(color, variant.size) === 0) {
        variant.size = variants.find(
            (v) => v.color_code === color && v.stock > 0
        ).size
    }
    // reset qty once clicked
    variant.qty = 1
    renderVariants()
}

// Click size
function handleSizeChange(e) {
    const size = e.currentTarget.textContent
    variant.size = size
    // disabled size with no stock
    if (getStock(variant.colorCode, size) === 0) {
        return
    }
    variant.qty = 1
    renderVariants()
}

// Quantity option
function handleQTYChange(e) {
    // custom data attributes (data-*)
    const val = e.currentTarget.dataset.value
    const stock = getStock(variant.colorCode, variant.size)
    variant.qty += parseInt(val)
    variant.qty = Math.max(1, variant.qty) // no less than 1
    variant.qty = Math.min(stock, variant.qty) // no more than stock
    renderVariants()
}

// Render variant
function renderVariants() {
    document.querySelectorAll('.color').forEach((color) => {
        if (color.getAttribute('alt') === variant.colorCode) {
            color.classList.add('selected')
        } else {
            color.classList.remove('selected')
        }
    })
    document.querySelectorAll('.size').forEach((size) => {
        size.classList.remove('selected')
        size.classList.remove('no-stock')
        if (size.textContent === variant.size) {
            size.classList.add('selected')
        } else if (getStock(variant.colorCode, size.textContent) === 0) {
            size.classList.add('no-stock')
        }
    })
    document.querySelector('.value').textContent = variant.qty
}

/* ===== Shopping cart implementation ===== */

// Add selected data to shopping cart
function addToCart() {
    button.addEventListener('click', (event) => {
        event.preventDefault() // prevent auto send

        // selected item object
        let selectedColor = document.querySelector('.colors .selected')
        let selectedId = document.querySelector('.id')
        let selectedImage = document.querySelector('.main-img img')
        let selectedName = document.querySelector('.name')
        let selectedPrice = document.querySelector('.price')
        let selectedQTY = document.querySelector('.value')
        let selectedSize = document.querySelector('.sizes .selected')
        let maxStock = getStock(
            selectedColor.getAttribute('alt'),
            selectedSize.textContent
        )
        let item = {
            color: {
                code: selectedColor.getAttribute('alt'),
                name: selectedColor.dataset.name,
            },
            id: parseInt(selectedId.textContent),
            main_image: selectedImage.getAttribute('src'),
            name: selectedName.textContent,
            price: parseInt(selectedPrice.textContent.slice(4)),
            qty: parseInt(selectedQTY.textContent),
            size: selectedSize.textContent,
            stock: maxStock,
        }

        // add selected item to cart
        let index
        if (cartList.length > 0) {
            for (let i = 0; i < cartList.length; i++) {
                if (
                    cartList[i].color.code === item.color.code &&
                    cartList[i].size === item.size &&
                    cartList[i].id === item.id
                ) {
                    index = i
                }
            }
            if (index >= 0) {
                cartList[index].qty = item.qty
            } else {
                cartList.push(item)
            }
        } else {
            cartList.push(item)
        }

        localStorage.setItem('cart', JSON.stringify(cartList))
        alert('已加入購物車')
        handleCartNum()
    })
}

// Add selected product total to cart
function handleCartNum() {
    document.querySelectorAll('.qty').forEach((qty) => {
        let num = cartList.length
        if (num) {
            qty.innerHTML = num
        }
    })
}
