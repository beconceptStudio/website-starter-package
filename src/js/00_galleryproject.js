var GalleryProject = function (gallerySelector, galleryWrapperSelector) {
    this.gallerySelector = gallerySelector;
    this.galleryWrapperSelector = galleryWrapperSelector;
    this.galleryTransitionClass = "gallery-transition";
    this.arrowLeft = ".i-arrowSX";
    this.arrowRight = ".i-arrowDX";  
    this.onAction = 0;
};
  
GalleryProject.prototype.initialize = function() {
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
    $(gallery.galleryWrapperSelector).append('<div class="' + gallery.galleryTransitionClass + '"></div>');

    $(document).on("click", gallery.gallerySelector + " " + gallery.arrowLeft, function(){
        console.log("click left");
        if(gallery.onAction == 0){
            gallery.onAction = 1;
            var index = parseInt($(gallery.galleryWrapperSelector).attr("data-index"));
            var max = parseInt($(gallery.galleryWrapperSelector).attr("data-slides"));
            
            if(index > 0){
            inde = index - 1;
            }else{           
                index = $(gallery.galleryWrapperSelector).attr("data-slides") - 1;
            }
            console.log(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass);
            $(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass).css("right", 0);
            $(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass).css("left", "auto");
            TweenMax.to(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass, 0.5, {
                width: $(gallery.galleryWrapperSelector).width(),
                onComplete: function(){
                    index = index - 1;
                    $(gallery.galleryWrapperSelector + " img").removeClass("active");
                    $(gallery.galleryWrapperSelector + " img[data-slide=" + index +"]").addClass("active");
                    
                    $(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass).css("left", 0);
                    $(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass).css("right", "auto");
                    TweenMax.to(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass, 0.5, {
                        width: 0,
                        onComplete: function(){
                            $(gallery.galleryWrapperSelector).attr("data-index", index);
                            gallery.onAction = 0;
                        }
                    });
                }
                
            });
        }
    });

    
    $(document).on("click", gallery.gallerySelector + " " + gallery.arrowRight, function(){
        if(gallery.onAction == 0){
            gallery.onAction = 1;
            var index = parseInt($(gallery.galleryWrapperSelector).attr("data-index"));
            var max = parseInt($(gallery.galleryWrapperSelector).attr("data-slides"));
        
            if(index < max - 1){
            index = index + 1;
            }else{
                index  = 0;
            }

            TweenMax.to(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass, 0.5, {
                width: $(gallery.galleryWrapperSelector).width(),
                onComplete: function(){
                    $(gallery.galleryWrapperSelector + " img").removeClass("active");
                    $(gallery.galleryWrapperSelector + " img[data-slide=" + index +"]").addClass("active");
                    
                    $(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass).css("right", 0);
                    $(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass).css("left", "auto");
                    TweenMax.to(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass, 0.5, {
                        width: 0,
                        onComplete: function(){
                            $(gallery.galleryWrapperSelector).attr("data-index", index);
                            $(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass).css("left", 0);
                            $(gallery.galleryWrapperSelector + " ." + gallery.galleryTransitionClass).css("right", "auto");
                            gallery.onAction = 0;
                        }
                    });
                }
                
            });
        }
    });
};