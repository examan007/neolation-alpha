
// PRELOADER
	jQuery(window).load(function() {
        // will first fade out the loading animation
	jQuery(".sk-spinner").fadeOut();
        // will fade out the whole DIV that covers the website.
	jQuery(".preloader").delay(1000).fadeOut("slow");
});

// NIVO LIGHTBOX
$('.iso-box-section a').nivoLightbox({
        effect: 'fadeScale',
    });

function isTouchScreen() {
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        console.log('Touch device - use tap events');
        return "Tap"
    } else {
        console.log('Non-touch device - use click events');
        return "Click"
    }

}
var CompletionMethodObj = function () {
    var timeoutobj = null
    function showOverlay() {
      document.getElementById('overlay').style.display = 'flex';
    }
    function hideOverlay() {
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('overlay-success').style.display = 'none';
      document.getElementById('overlay-failure').style.display = 'none';
    }
    function isPended() {
        if (timeoutobj === null) {
            return false
        } else {
            return true
        }
    }
    document.getElementById('overlay').
     addEventListener("click", (event)=> {
              event.preventDefault();
              if (isPended() === false) {
                  hideOverlay()
              }
          })
    document.getElementById('overlay-success').
     textContent = "Message successfully sent. " + isTouchScreen() + " to continue."
    document.getElementById('overlay-failure').
     textContent = "Message NOT sent. " + isTouchScreen() + " to continue."

    return {
        isPended: function () {
            return isPended()
        },
        receiveResponse: function (message) {
            console.log("Completion: received response [" + message + "]")
            document.getElementById('overlay-success').style.display = 'block';
            if (timeoutobj !== null) {
                window.clearTimeout(timeoutobj)
                timeoutobj = null
            }
        },
        timeoutResponse: function () {
            timerobj = null
            console.log("Failure: timeout")
            document.getElementById('overlay-failure').style.display = 'block';
        },
        setTimeout: function () {
           timeoutobj = window.setTimeout(() => {
           this.timeoutResponse()
          }, 10000)
        },
        sendMessage: function (message) {
            if (this.isPended() === false) {
              showOverlay()
              this.setTimeout()
              LoginManager('https://alt000.neolation.com').getAuthenticationCookie('#email-form')
            }
        }
   }
}

function bindToButton() {
    CompletionObj = CompletionMethodObj()
    const keys = [
        'section',
        'footer',
        'navbar'
    ]
    const names = [
        'style',
        'style',
        'style'
    ]
    const values = [
        'display: none;',
        'display: none;',
        'display: none;',
    ]
    const saved = []
    function changeAttribute(key, value, get, set) {
        try {
            const origvalue = saved[key]
            if (origvalue != value) {
                saved[key] = get()
            }
        } catch (e) {
            console.log(e.stack)
        }
        try {
            set(value)
        } catch (e) {
            console.log(e.stack)
        }
    }
    function injectPageDown(menu) {
        var pageDownEvent = new KeyboardEvent('keydown', {
          key: 'PageDown',
          bubbles: true,
          cancelable: true
        })
        menu.dispatchEvent(pageDownEvent);
        console.log("clicked menu")
    }

    const menu = document.getElementById('home-menu')
    menu.addEventListener("click", (event)=> {
        window.scrollTo(0, window.scrollY + window.innerHeight);
        //menu.setAttribute("style", "display: none;")
        //injectPageDown(menu)
    })

    function getFormValues() {
      var form = document.getElementById("email-form");
      var formData = {};
      for (var i = 0; i < form.elements.length; i++) {
        var element = form.elements[i];
        if ((element.tagName === "INPUT" || element.tagName === "TEXTAREA") && element.type !== "button") {
          formData[element.name] = element.value;
        }
      }
      console.log(formData);
      const login = document.getElementById("login")
      const url = login.getAttribute('newdata')
      //login.setAttribute('data', url)
      //console.log("data=" + url)
      console.log(login.innerHTML)
      //showLogin("login")

      CompletionObj.sendMessage()
    }
    const send = document.getElementById('email-form')
     send.addEventListener("submit", (event)=> {
         event.preventDefault();
         console.log("send button")
         getFormValues()
     })

    const button = document.querySelectorAll('#home .btn.btn-default.btn-lg')[0]
    button.addEventListener("click", (event)=> {
        console.log("Button: " + this)
        const image = document.getElementById('zoom-image')
        image.classList.add('zoom-image-clicked')
        window.setTimeout(() => {
            const zoom = document.getElementById('zoom-container')
            image.classList.remove('fade-out')
            zoom.classList.add('faded')
        }, 2000)
        const keys = [
            '#home .overlay-div2',
            '#nodeview'
//            '#bubbleview'
        ]
        const values = [
            "display: none;",
            "display: block;"
        ]
        const delays = [
            0,
            2000
        ]
        function activateElements(index) {
            if (index < keys.length) {
                const key = keys[index]
                const newvalue = values[index]
                const container = document.querySelectorAll(key)[0]
                console.log(`key=${key}`)
                changeAttribute(key, newvalue,
                    () => {
                        return container.getAttribute('style')
                    },
                    (newvalue) => {
                        window.setTimeout(() => {
                            //const remote = document.getElementById('bubblechart')
                            const remote = document.getElementById('nodechart')
                            const url = remote.getAttribute('newdata')
                            remote.setAttribute('data', url)
                            container.setAttribute('style', newvalue)
                            window.setTimeout(() => {
                                changeAttributeList(0, false)
                            }, 2000)
                        }, delays[index])
                    }
                )
                activateElements(index + 1)
            }
        }
        activateElements(0)

    })
    function changeAttributeList(index, flag) {
        if (index < keys.length) {
            const key = keys[index] + names[index]
            console.log(`processing ${key}`)
            function getNewValue() {
                if (flag) {
                    return values[index]
                } else {
                    return saved[key]
                }
            }
            const newvalue = getNewValue()
            document.querySelectorAll(keys[index]).
             forEach((element) => {
                changeAttribute(key, newvalue,
                    () => {
                        return element.getAttribute(names[index])
                    },
                    (newvalue) => {
                        element.setAttribute(names[index], newvalue)
                    })
             })
             changeAttributeList(index + 1, flag)
        }
    }
    //changeAttributeList(0, true)

    const section = document.getElementById('home')
    const key = 'section' + 'style'
    changeAttribute(key, saved[key],
        () => {
            return section.getAttribute('style')
        },
        (newvalue) => {
            section.setAttribute('style', newvalue)
        }
    )

    window.addEventListener('message', function(event) {
        if (event.isTrusted === true) {
            var message = event.data;
            CompletionObj.receiveResponse(message)
        }
    })
}

function scrollToTop() {
    window.scrollTo(0, 0);
    //document.documentElement.scrollTop = 0; // For modern browsers
    //document.body.scrollTop = 0; // For older browsersr
}

// ISOTOPE FILTER
jQuery(document).ready(function($){
    bindToButton()
    window.setTimeout(() => {
        scrollToTop()
    }, 1000)
	if ( $('.iso-box-wrapper').length > 0 ) { 

	    var $container 	= $('.iso-box-wrapper'), 
	    	$imgs 		= $('.iso-box img');

	    $container.imagesLoaded(function () {

	    	$container.isotope({
				layoutMode: 'fitRows',
				itemSelector: '.iso-box'
	    	});

	    	$imgs.load(function(){
	    		$container.isotope('reLayout');
	    	})

	    });

	    //filter items on button click

	    $('.filter-wrapper li a').click(function(){

	        var $this = $(this), filterValue = $this.attr('data-filter');

			$container.isotope({ 
				filter: filterValue,
				animationOptions: { 
				    duration: 750, 
				    easing: 'linear', 
				    queue: false, 
				}              	 
			});	            

			// don't proceed if already selected 

			if ( $this.hasClass('selected') ) { 
				return false; 
			}

			var filter_wrapper = $this.closest('.filter-wrapper');
			filter_wrapper.find('.selected').removeClass('selected');
			$this.addClass('selected');

	      return false;
	    }); 

	}

});


// MAIN NAVIGATION
 $('.main-navigation').onePageNav({
        scrollThreshold: 0.2, // Adjust if Navigation highlights too early or too late
        scrollOffset: 75, //Height of Navigation Bar
        filter: ':not(.external)',
        changeHash: true
    }); 

    /* NAVIGATION VISIBLE ON SCROLL */
    mainNav();
    $(window).scroll(function () {
        mainNav();
    });

    function mainNav() {
        var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        if (top > 40) $('.sticky-navigation').stop().animate({
            "opacity": '1',
            "top": '0'
        });
        else $('.sticky-navigation').stop().animate({
            "opacity": '0',
            "top": '-75'
        });
    }


// HIDE MOBILE MENU AFTER CLIKING ON A LINK
    $('.navbar-collapse a').click(function(){
        $(".navbar-collapse").collapse('hide');
    });


// WOW ANIMATED 
$(function()
{
    new WOW().init();
});