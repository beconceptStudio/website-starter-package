var FadeInGallery = function (gallerySelector, galleryWrapperSelector) {
    this.gallerySelector = gallerySelector;
    this.galleryWrapperSelector = galleryWrapperSelector;
    this.onAction = 0;
    this.timing = 4000;
    this.interval = null;
};
  
FadeInGallery.prototype.initialize = function() {
    var gallery = this;
    //initialize gallery slides number and index
    var attr = $(gallery.galleryWrapperSelector).attr("data-slides");

    // For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
    if (typeof attr !== typeof undefined && attr !== false) {
    // Do nothing
    }else{
        $(gallery.galleryWrapperSelector).attr("data-slides", $(gallery.galleryWrapperSelector + " img[data-slide]").length);
        $(gallery.galleryWrapperSelector).attr("data-index", "0");
    }
    gallery.interval = setInterval(function(){
        var max = parseInt($(gallery.galleryWrapperSelector).attr("data-slides"));
        var actual = parseInt($(gallery.galleryWrapperSelector).attr("data-index"));
        var next = parseInt($(gallery.galleryWrapperSelector).attr("data-index"));
        if(actual + 1 == max){
            next = 0;
        }else{
            next = actual + 1;
        }
        console.log(actual);
        var t = new TimelineLite();
        
        t.to(".slider--images img[data-slide=" + actual + "]", 1, {autoAlpha: 0}, 0)
         .to(".slider--images img[data-slide=" + next + "]", 1, {autoAlpha: 1}, 0);
        
        $(gallery.galleryWrapperSelector).attr("data-index", next);
    }, gallery.timing);
};