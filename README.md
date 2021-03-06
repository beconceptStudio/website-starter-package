# website-stack
Before start always run `npm i` to install all the required dependencies.

## LIBRARIES AND FRAMEWORK USED

###	Barba.js


Url: http://barbajs.org/

Licence: https://github.com/luruke/barba.js/blob/master/LICENSE


### Bowser


Url: https://github.com/lancedikson/bowser

Version: 1.9.4

Licence: https://github.com/lancedikson/bowser/blob/master/LICENSE


### Bootstrap


Url: https://getbootstrap.com/

Version: 4.1.3

Licence: https://github.com/twbs/bootstrap/blob/v4-dev/LICENSE


## FILES STRUCTURE

### SCSS

```
main.scss is the master file
└── PARTIALS
│   ├── _common.scss  contains all the commons page's styles
|   |
│   ├── _utils.scss   contains all mixins except of media queries
|   |
│   ├── _barba.scss   contains scss for all barba's animations
|   |
│   ├── _browser-corrections.scss   contains scss for correct layout on browser
|   |
│   ├── _media.scss   contains media queries mixins
|   |
│   ├── _cookies.scss   contains scss for style cookie popup
|   |
│   └── _main-variables.scss   contains all constant variables
│   
└── PAGES
    └── _index.scss   contains scss for relative page
```


### JS
```
│   
└── main.js contains all the commons page's javascript
│   
└── barba.js   contains all code for barba's animation
│   
└── index.js   contains all code for index page
```
### SCSS

## SPECIAL COMMANDS

### `gulp`
run gulp's watch task

### `gulp production`
run gulp's production task

### `gulp production --visual`
run gulp's production task and run browsersync with prod as root

### `gulp production --cdn [cdn's url]`
run gulp's production task and replace all `/assets` and `/dist` with `cdn-url/assets/` and `cdn-url/dist/`

## HOW TO INJECT REPETITIVE CODE:

### FONTS
```
<!-- inject:fonts:html -->
<!-- endinject -->
```

### CSS
```
<!-- inject:css -->
<!-- endinject -->
```
### Javascript
```
<!-- inject:js -->
<!-- endinject -->
```
### Facebook
```
<!-- inject:facebookpixel:html -->
<!-- endinject -->
```

### Google Analytics
```
<!-- inject:googleanalytics:html -->
<!-- endinject -->
```

### Header
```
<!-- inject:header:html -->
<!-- endinject -->
```

### Footer
```
<!-- inject:footer:html -->
<!-- endinject -->
```

### Vendor remote code
```
<!-- inject:vendorremotecode:html -->
<!-- endinject -->
```


## Creators


**Alessio Bortolotti**

- <https://twitter.com/ale92bort>
- <https://github.com/TheBorto>

**Andrea Ruggeri**

- <https://twitter.com/andrearugge>
- <https://github.com/andrearugge>

**Ivan Bosnjak**

- <https://www.facebook.com/BosnjakIvan>

