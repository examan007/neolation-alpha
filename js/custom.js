
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

function bindToButtom() {
    const button = document.querySelectorAll('#home .btn.btn-default.btn-lg')[0]
    button.addEventListener("click", (event)=> {
        console.log("Button: " + this)
        const image = document.getElementById('zoom-image')
        image.classList.add('zoom-image-clicked');
        const container = document.querySelectorAll('#home .overlay-div2')[0]
        container.setAttribute("style", "display: none")
    })
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
        const origvalue = saved[key]
        if (origvalue != value) {
            saved[key] = get()
        }
        set(value)
    }
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
    changeAttributeList(0, true)

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
}

function scrollToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0; // For modern browsers
    document.body.scrollTop = 0; // For older browsers
}

// ISOTOPE FILTER
jQuery(document).ready(function($){
    bindToButtom()
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