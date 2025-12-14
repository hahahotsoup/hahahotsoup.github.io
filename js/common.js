window.$claudia = {
    throttle: function (func, time) {
        var wait = false
        return function () {
            if (wait) return
            wait = true

            setTimeout(function () {
                func()
                wait = false
            }, time || 100)
        }
    },
    fadeInImage: function(imgs, imageLoadedCallback) {
        var images = imgs || document.querySelectorAll('.js-img-fadeIn')

        function loaded(event) {
            var image = event.currentTarget

            image.ontransitionend = function () {
                image.ontransitionend = null
                image.style.transition = null
            }
            image.style.transition = 'opacity 320ms'
            image.style.opacity = 1

            if (image.parentElement && image.parentElement.classList.contains('skeleton')) {
                image.parentElement.classList.remove('skeleton')
            }
            imageLoadedCallback && imageLoadedCallback(image)
        }

        images.forEach(function (img) {
            if (img.complete) {
                return loaded({ currentTarget: img })
            }

            img.addEventListener('load', loaded)
        })
    },
    blurBackdropImg: function(image) {
        if (!image.dataset.backdrop) return

        var parent = image.parentElement //TODO: Not finish yes, must be a pure function
        var parentWidth = Math.round(parent.getBoundingClientRect().width)
        var childImgWidth = Math.round(image.getBoundingClientRect().width)

        var isCovered = parentWidth === childImgWidth
        var blurImg = parent.previousElementSibling //TODO: Not finish yes, must be a pure function

        isCovered ? blurImg.classList.add('is-hidden') : blurImg.classList.remove('is-hidden')
    },
    getSystemTheme(callback) {
        var media = window.matchMedia('(prefers-color-scheme: dark)')
        media.addEventListener('change', function (e){
            callback && callback(e.matches ? "dark" : "light")
        })

        callback && callback(media.matches ? 'dark' : 'light')
    },
    handleHeaderScroll() {
        var header = document.querySelector('.header-widget')
        if (!header) return

        var lastScrollTop = 0
        var scrollThreshold = 50

        window.addEventListener('scroll', this.throttle(function() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop

            if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                // 向下滚动，隐藏header
                header.style.transform = 'translateY(-100%)'
            } else {
                // 向上滚动，显示header
                header.style.transform = 'translateY(0)'
            }

            lastScrollTop = scrollTop
        }, 100))
    }
}

// 初始化header滚动效果
document.addEventListener('DOMContentLoaded', function() {
    window.$claudia.handleHeaderScroll()
})
