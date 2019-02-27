var BlurEffect = function (containerSelector, textSelector) {
    this.containerSelector = containerSelector;
    this.textSelector = textSelector;
    this.offset = -300;
    this.reverse = false;
    this.translateDuration = .7;
    this.translateDelay = 0;
    this.translateVal = 70;
    this.blurDuration = .5;
    this.blurDelay = 0.1;
    this.textElement = document.querySelector(textSelector);
};
  
BlurEffect.prototype.initialize = function() {

    //create Scene
    var effect = this;
    effect.scrollMagicController = new ScrollMagic();

    var sectionAnimation = new TimelineLite();
    var filterElement = {
        blur: 5
    };
    effect.textElement.style.filter = 'blur(' + filterElement.blur + 'px)';
    sectionAnimation
        .staggerFrom(effect.textSelector, effect.translateDuration, { autoAlpha:0, y: effect.translateVal}, 0)
        .to(filterElement, effect.blurDuration, {
            rotation:0.01,
            blur: 0, 
            force3D:true,
            onUpdate: function(){
                effect.textElement.style.filter = 'blur(' + filterElement.blur + 'px)';
            }}, effect.blurDelay)
    
    // Create the Scene and trigger when visible
    var sectionBioScene = new ScrollScene({
      triggerElement: effect.containerSelector,
      offset: this.offset,
      reverse: effect.reverse
    })
    .setTween(sectionAnimation)
    .addTo(effect.scrollMagicController);
    
}

var FadeInEffect = function (containerSelector, textSelector) {
    this.containerSelector = containerSelector;
    this.textSelector = textSelector;
    this.offset = -300;
    this.reverse = false;
    this.translateDuration = .7;
    this.translateDelay = 0;
    this.translateVal = 70;
};
  
FadeInEffect.prototype.initialize = function() {

    //create Scene
    var effect = this;
    effect.scrollMagicController = new ScrollMagic();

    var sectionAnimation = new TimelineLite();
    var filterElement = {
        blur: 5
    };
    
    sectionAnimation
        .staggerFromTo(effect.textSelector, effect.translateDuration, { autoAlpha: 0, y: effect.translateVal}, { autoAlpha: 1, y: 0}, 0);
    
    // Create the Scene and trigger when visible
    var sectionBioScene = new ScrollScene({
      triggerElement: effect.containerSelector,
      offset: this.offset,
      reverse: effect.reverse
    })
    .setTween(sectionAnimation)
    .addTo(effect.scrollMagicController);
    
}

