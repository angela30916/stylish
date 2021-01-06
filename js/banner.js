let slideIndex = 1
let visuals = document.getElementsByClassName('visual')
let dots = document.getElementsByClassName('dot')
let timer

/* main */
getBannerData(renderBanner)

/*===================function===================*/

// Get marketing campaigns data from API
function getBannerData(callback) {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const campaignObject = JSON.parse(xhr.responseText)
            callback(campaignObject)
        } else if (xhr.status === 500) {
            console.log(xhr.responseText)
        }
    }
    xhr.open(
        'GET',
        'https://api.appworks-school.tw/api/1.0//marketing/campaigns'
    )
    xhr.send()
}

// Create HTML Layout to render data
function renderBanner(data) {
    let campaignObject = data.data
    for (let i = 0; i < campaignObject.length; i++) {
        let story = document.createElement('div')
        story.setAttribute('class', 'story')
        let storyText = `${campaignObject[i].story}`.replace(/\r\n/g, '<br>')
        story.innerHTML = storyText

        let visual = document.createElement('a')
        visual.setAttribute('class', 'visual')
        visual.setAttribute(
            'href',
            `product.html?id=${campaignObject[i].product_id}`
        )
        visual.setAttribute(
            'style',
            `background-image: url('${campaignObject[i].picture}');`
        )
        visual.appendChild(story)
        document
            .getElementsByClassName('banner')[0]
            .appendChild(visual)
            .cloneNode(true)
    }

    // create dots
    let circle = document.createElement('div')
    circle.setAttribute('class', 'circle')
    for (let i = 0; i < campaignObject.length; i++) {
        let dot = document.createElement('a')
        dot.setAttribute('class', 'dot')
        circle.appendChild(dot).cloneNode(true)
    }
    document
        .getElementsByClassName('banner')[0]
        .appendChild(circle)
        .cloneNode(true)

    showInit()
    timer = window.setInterval(nextSlides, 5000)
    clickToChange()
    mouseStop()
}

// Preset slide style
function presetStyle() {
    for (let i = 0; i < visuals.length; i++) {
        visuals[i].style.opacity = '0'
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].style.backgroundColor = 'white'
    }
}

// Show initial slide
function showInit() {
    presetStyle()
    visuals[0].style.zIndex = '100'
    visuals[0].style.opacity = '1'
    dots[0].style.backgroundColor = 'black'
}

// Change to next slide every 5 seconds
function nextSlides() {
    presetStyle()
    visuals[slideIndex].style.zIndex = '100'
    visuals[slideIndex].style.opacity = '1'
    dots[slideIndex].style.backgroundColor = 'black'

    if (slideIndex >= dots.length - 1) {
        slideIndex = 0
    } else {
        slideIndex++
    }
}

// Change slide if click the dot
function clickToChange() {
    for (let i = 0; i < 3; i++) {
        let dot = document.getElementsByClassName('dot')[i]
        let visual = document.getElementsByClassName('visual')[i]
        dot.addEventListener('click', () => {
            presetStyle()
            dot.style.backgroundColor = 'black'
            visual.style.zIndex = '100'
            visual.style.opacity = '1'
            if (slideIndex < 2) {
                slideIndex = i + 1
            } else {
                slideIndex = 0
            }
        })
    }
}

// Stop slide if users mouse over
function mouseStop() {
    for (let i = 0; i < visuals.length; i++) {
        visuals[i].addEventListener('mouseover', () => {
            window.clearInterval(timer)
        })
        visuals[i].addEventListener('mouseout', () => {
            timer = window.setInterval(nextSlides, 5000)
        })
    }
}
