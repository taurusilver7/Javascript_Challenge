//  Sticky numbers

let navbar = $('.number');

$(window).scroll(function() {
    // console.log(window.innerHeight);
    // console.log($(".section-2").offset().top);
    let offsetTop = $('.section-2').top - window.innerHeight;
    if($(window).scrollTop() > offsetTop) {
        navbar.addClass('sticky');
    } else {
        navbar.removeClass('sticky');
    }
});


//  Counter Animation

let nCount = function(selector) {
    $(selector).each(function() {
        $(this).animate ({
            Counter:$(this).text()
        }, {
            duration:4000,
            easeing: 'swing',
            step: function(value) {
                $(this).text(Math.ceil(value));
            }
        });
    });
};

let a = 0;

$(window).scroll(() => {
    let offsetTop = $('.numbers').offset().top - window.innerHeight;
    if(a==0 && $(window).scrollTop() >= offsetTop) {
        a++;
        nCount('.rect > h1');
    }
});