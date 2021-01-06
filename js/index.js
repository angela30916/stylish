// Get search content
let url = window.location.search
let searchParams = new URLSearchParams(url)
let key = searchParams.get('tag')

let page // next_paging number
let scrollToNext = true // scroll to next page

/* main */
if (key) {
    catColorRecover()
    if (key === 'women' || key === 'men' || key === 'accessories') {
        getProductData(key, renderProduct)
        catFocus(key)
        popState()
    } else {
        getKeywordData(key, renderProduct)
    }
    clickCat()
} else {
    catColorRecover()
    getProductData('all', renderProduct)
    key = 'all'
    clickCat()
}

// Infinite Scroll
window.addEventListener('scroll', () => {
    var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
    var windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
    var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight
    if (scrollToNext) {
        if (scrollTop + windowHeight + 100 >= scrollHeight && page) {
            loadingAni()
            getNextPageData(key, page, renderProduct)
        } else {
            stoploadingAni()
        }
    }
})

// Get selected product total to cart
window.addEventListener('DOMContentLoaded', function handleCartNum() {
    document.querySelectorAll('.qty').forEach((qty) => {
        let cartList = JSON.parse(localStorage.getItem('cart')) || []
        if (cartList.length !== 0) {
            qty.innerHTML = cartList.length
        }
    })
})

/*===================function===================*/

// Get data of all products from API server dynamically
function getProductData(cat, callback) {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            callback(data)
        } else if (xhr.status === 400) {
            console.log(xhr.responseText)
        }
    }
    xhr.open('GET', `https://api.appworks-school.tw/api/1.0/products/${cat}`)
    xhr.send()
}

// Get next page data
function getNextPageData(cat, nextPage, callback) {
    scrollToNext = false
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            callback(data)
        } else if (xhr.status === 400) {
            console.log(xhr.responseText)
        }
    }
    xhr.open(
        'GET',
        `https://api.appworks-school.tw/api/1.0/products/${cat}?paging=${nextPage}`
    )
    xhr.send()
}

// Create Pages for Product Categories
function clickCat() {
    for (let i = 0; i < 3; i++) {
        let arr = ['women', 'men', 'accessories']
        let tag1 = document.querySelectorAll('.nav a')[i]
        let tag2 = document.querySelectorAll('.m-nav a')[i]
        tag1.addEventListener('click', () => {
            document.getElementById('product').innerHTML = ''
            catColorRecover()
            tag1.style.color = '#8b572a'
            tag2.style.color = '#fff'
            getProductData(`${arr[i]}`, renderProduct)
            key = `${arr[i]}`
            urlHistory(`${arr[i]}`)
            popState()
        })
        tag2.addEventListener('click', () => {
            document.getElementById('product').innerHTML = ''
            catColorRecover()
            tag1.style.color = '#8b572a'
            tag2.style.color = '#fff'
            getProductData(`${arr[i]}`, renderProduct)
            key = `${arr[i]}`
            urlHistory(`${arr[i]}`)
            popState()
        })
    }
}

// Change category color when clicked from other pages
function catFocus(cat) {
    for (let i = 0; i < 3; i++) {
        let arr = ['women', 'men', 'accessories']
        let tag1 = document.querySelectorAll('.nav a')[i]
        let tag2 = document.querySelectorAll('.m-nav a')[i]
        if (cat === arr[i]) {
            tag1.style.color = '#8b572a'
            tag2.style.color = '#fff'
        }
    }
}

// Reset catagory text colors when clicked
function catColorRecover() {
    document.querySelectorAll('.nav a').forEach((element) => {
        element.style.color = '#3f3a3a'
    })
    document.querySelectorAll('.m-nav a').forEach((element) => {
        element.style.color = '#828282'
    })
}

// History API for AJAX, just to create an URL tag name for category
function urlHistory(cat) {
    let state = { url: `?tag=${cat}` }
    history.pushState(state, '', `?tag=${cat}`)
}

// Redirect to the right page when click previous/next page
function popState() {
    window.onpopstate = function () {
        if (history.state) {
            location.href = history.state.url
        } else {
            location.href = 'index.html'
        }
    }
}

//Apply Product Search API to build search feature for our customers
function getKeywordData(key, callback) {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            callback(data)
        } else if (xhr.status === 400) {
            console.log(xhr.responseText)
        }
    }
    xhr.open(
        'GET',
        `https://api.appworks-school.tw/api/1.0/products/search?keyword=${key}`
    )
    xhr.send()
}

// Create HTML Layout to render data
function renderProduct(data) {
    page = data.next_paging
    let product = data.data
    stoploadingAni()
    for (let i = 0; i < product.length; i++) {
        let img = document.createElement('img')
        img.setAttribute('src', `${product[i].main_image}`)
        img.setAttribute('alt', `${product[i].title}`)

        let colors = document.createElement('div')
        colors.setAttribute('class', 'colors')

        // get colors for each product
        for (let j = 0; j < product[i].colors.length; j++) {
            let color = document.createElement('div')
            color.className = 'color'
            color.style.backgroundColor = `#${product[i].colors[j].code}`
            colors.appendChild(color).cloneNode(true)
        }

        let name = document.createElement('div')
        name.setAttribute('class', 'name')
        let nameText = document.createTextNode(product[i].title)
        name.appendChild(nameText)

        let price = document.createElement('div')
        price.setAttribute('class', 'price')
        let priceText = document.createTextNode(`TWD.${product[i].price}`)
        price.appendChild(priceText)

        let item = document.createElement('a')
        item.setAttribute('class', 'item')
        item.setAttribute('href', `product.html?id=${product[i].id}`)
        item.append(img, colors, name, price)

        // append items to div#product
        document.getElementById('product').appendChild(item).cloneNode(true)
    }
    // if search no products
    if (!document.getElementById('product').innerHTML) {
        document.getElementById('product').innerHTML =
            '<h2>沒有搜尋到任何產品哦！</h2>'
    }
    scrollToNext = true
}

// Enable loading animation
function loadingAni() {
    document.getElementsByClassName('loader-ellips')[0].style.display = 'block'
}

// Disable loading animation
function stoploadingAni() {
    document.getElementsByClassName('loader-ellips')[0].style.display = 'none'
}
