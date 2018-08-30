# website-stack
Before start always run `npm i` to install all the required dependencies.

## FILES STRUCTURE

### SCSS

---`main.scss` is the master file

	|
	
	|-`PARTIALS`<br>
	
	|		|
	
    |		-`_common.scss`
	
	|			contains all the commons page's styles
	
	|		|
	
    |		-`_utils.scss`
	
	|			contains all mixins except of media queries
	
	|		|
	
    |		-`_barba.scss` 
	
	|			contains scss for all barba's animations
	
	|		|
	
    |		-`_browser-corrections.scss`
	
	|			contains scss for correct layout on browser
	
	|		|
	
    |		-`_media.scss`
	
	|			contains media queries mixins
	
	|		|
	
    |		-`_cookies.scss`
	
	|			contains scss for style cookie popup
	
	|		|
	
    |		-`_main-variables.scss` 
	
	|			contains all constant variables
	
	|
	
	|-`PAGES`
	
            |
			
    		-`_index.scss`
			
            contains scss for relative page

### JS

---`main.js` contains all the commons page's javascript

	|
	
	|-`barba.js`
	
	|   contains all code for barba's animation
	
	|
	
	|-`index.js`
	
	|   contains all code for index page

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

### CSS

<!-- inject:css -->
<!-- endinject -->

### Javascript
<!-- inject:js -->
<!-- endinject -->

### Facebook
<!-- inject:facebookpixel:html -->
<!-- endinject -->

### Google Analytics
<!-- inject:googleanalytics:html -->
<!-- endinject -->

### Header
<!-- inject:header:html -->
<!-- endinject -->

### Footer
<!-- inject:footer:html -->
<!-- endinject -->

### Vendor remote code
<!-- inject:vendorremotecode:html -->
<!-- endinject -->


