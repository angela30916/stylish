let loginPage = document.querySelector('.member-card')
let logoutPage = document.querySelector('.fb-login')
let signInObj = {
    provider: 'facebook',
    access_token: '',
}

/* main */
initFB()

// Get selected product total to cart
window.addEventListener('DOMContentLoaded', function handleCartNum() {
    document.querySelectorAll('.qty').forEach((qty) => {
        let cartList = JSON.parse(localStorage.getItem('cart')) || []
        if (cartList.length !== 0) {
            qty.innerHTML = cartList.length
        }
    })
})

/*===================Function===================*/

// Initiate FB api
function initFB() {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '263540411744939',
            cookie: true,
            xfbml: true,
            version: 'v8.0',
        })
        FB.AppEvents.logPageView()
        if (window.location.pathname.includes('/profile')) {
            checkLoginState()
        }
    }
    ;(function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) {
            return
        }
        js = d.createElement(s)
        js.id = id
        js.src = 'https://connect.facebook.net/zh_TW/sdk.js'
        fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
}

// Check login status
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            if (window.location.pathname.includes('/profile')) {
                token = response.authResponse.accessToken
                signInObj.access_token = token
                logoutPage.style.display = 'none'
                loginPage.style.display = 'block'
                /* getUserData(renderProfilePage) */
                sendToken(renderProfilePage)
            } else {
                window.location.href = 'profile.html'
            }
        } else {
            if (window.location.pathname.includes('/profile')) {
                login()
            } else {
                window.location.href = 'profile.html'
            }
        }
    })
}

// FB login & get user's token
let token // acess token
function login() {
    FB.login(
        function (response) {
            if (response.status === 'connected') {
                token = response.authResponse.accessToken
                signInObj.access_token = token
                logoutPage.style.display = 'none'
                loginPage.style.display = 'block'
                /* getUserData(renderProfilePage) */
                sendToken(renderProfilePage)
            }
        },
        {
            scope: 'email',
            auth_type: 'rerequest',
        }
    )
}

/*
// Get user's profile from FB api
let userName
let userId
let userEmail
let userPicURL
function getUserData(render) {
    FB.api(
        '/me',
        {
            fields: 'id,name,email,picture.width(150).height(150)',
        },
        function (response) {
            userName = response.name
            userId = response.id
            userEmail = response.email
            userPicURL = response.picture.data.url
            render()
        }
    )
}
*/

// Render data to profile page
let upic = document.querySelector('.user-pic')
let uname = document.querySelector('.user-name')
let uemail = document.querySelector('.user-email')
function renderProfilePage(response) {
    upic.style.backgroundImage = `url(${response.data.user.picture})`
    uname.innerHTML = `${response.data.user.name}`
    uemail.innerHTML = `${response.data.user.email}`
    /*
    upic.style.backgroundImage = `url(${userPicURL})`
    uname.innerHTML = `${userName}`
    uemail.innerHTML = `${userEmail}`
    */
}

// FB logout
/* exported logout */
function logout() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            FB.logout(function () {
                loginPage.style.display = 'none'
                logoutPage.style.display = 'block'
            })
        }
    })
}

// Post acess token to Sign In API
function sendToken(render) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://api.appworks-school.tw/api/1.0/user/signin')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(signInObj))
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('Success')
            const response = JSON.parse(xhr.responseText)
            render(response)
        } else if (xhr.status === 403) {
            console.log('Sign In Failed' + xhr.responseText)
        } else if (xhr.status === 400) {
            console.log('Client Error' + xhr.responseText)
        } else if (xhr.status === 500) {
            console.log('Server Error' + xhr.responseText)
        }
    }
}
