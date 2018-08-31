
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

//ADD BARBA TRANSITION LAYER
$("body").append('<div class="page-barba-overlay"></div>');

//SET TIMING VARIABLE FOR ANIMATION COERENCE
var timinig = {
    'fastest': 0.8,
    'fast': 1,
    'slow': 1.2,
    'slowest': 1.6
};
  