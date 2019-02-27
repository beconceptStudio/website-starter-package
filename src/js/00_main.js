
//START BROWSER DETECTION
var browserType = "";
browserType += (bowser.chrome==undefined?'':"chrome");
browserType += (bowser.firefox==undefined?'':"firefox");
browserType += (bowser.msedge==undefined?'':"edge");
browserType += (bowser.msie==undefined?'':"ie");
browserType += (bowser.safari==undefined?'':"safari");
browserType += (bowser.opera==undefined?'':"opera");
$("html").addClass(browserType);
$("html").addClass(browserType + "-" + bowser.version);
//END BROWSER DETECTION

// SAVE WINDOW WIDTH AND HEIGHT
var windowWidth = $(window).width(),
    windowHeight = $(window).height();

// SET RESPONSIVE BREAKPOINTS
var breakpoints = {
  "breakpointSM": 576,
  "breakpointMD": 992,
  "breakpointLG": 992,
  "breakpointXL": 1200
};

//SET TIMING VARIABLE FOR ANIMATION COERENCE
var timinig = {
    'fastest': 0.8,
    'fast': 1,
    'slow': 1.2,
    'slowest': 1.6
};

//DEFINE SCROLLBAR
// var scrollbar; 



//DEFINE IF IS MOBILE
var md = new MobileDetect(window.navigator.userAgent);
// if (md.mobile()) {
//     //DO SOMETHING
// }


$(document).ready(function(){
    // uncomment this if you use scrollbar addons
    // scrollbar= Scrollbar.init(document.getElementById("scroll-wrapper"));
    // scrollbar.track.xAxis.hide();
    $("body").addClass($(".pageclass").val());
    
    //add rel="nofollow" to all external link
    $('a').each(function()
    {
      var reg_exp = new RegExp('/' + window.location.host + '/');
      if (!reg_exp.test(this.href))
      {
        // External Link Found  
        $(this).attr('rel','nofollow');
      }
    });
});