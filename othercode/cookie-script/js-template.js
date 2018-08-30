!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function g(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}return function e(l){function C(e,n,o){var t;if("undefined"!=typeof document){if(1<arguments.length){if("number"==typeof(o=g({path:"/"},C.defaults,o)).expires){var r=new Date;r.setMilliseconds(r.getMilliseconds()+864e5*o.expires),o.expires=r}o.expires=o.expires?o.expires.toUTCString():"";try{t=JSON.stringify(n),/^[\{\[]/.test(t)&&(n=t)}catch(e){}n=l.write?l.write(n,e):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),e=(e=(e=encodeURIComponent(String(e))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var i="";for(var c in o)o[c]&&(i+="; "+c,!0!==o[c]&&(i+="="+o[c]));return document.cookie=e+"="+n+i}e||(t={});for(var a=document.cookie?document.cookie.split("; "):[],s=/(%[0-9A-Z]{2})+/g,f=0;f<a.length;f++){var p=a[f].split("="),d=p.slice(1).join("=");this.json||'"'!==d.charAt(0)||(d=d.slice(1,-1));try{var u=p[0].replace(s,decodeURIComponent);if(d=l.read?l.read(d,u):l(d,u)||d.replace(s,decodeURIComponent),this.json)try{d=JSON.parse(d)}catch(e){}if(e===u){t=d;break}e||(t[u]=d)}catch(e){}}return t}}return(C.set=C).get=function(e){return C.call(C,e)},C.getJSON=function(){return C.apply({json:!0},[].slice.call(arguments))},C.defaults={},C.remove=function(e,n){C(e,"",g(n,{expires:-1}))},C.withConverter=e,C}(function(){})});
var csCookies = Cookies.noConflict();
        var
          cookieScriptWindow = window.document,
          cookieScripts = document.getElementsByTagName("script"),
          cookieScriptSrc = cookieScripts[cookieScripts.length - 1].src,
          cookieQuery = null,
          cookieScriptSource = "cookie-script.com",
          cookieScriptDomain = "",
          cookieScriptReadMore = "##COOKIE_POLICY_URL##",
          cookieId = "##COOKIE_SCRIPT_ID##",//insert here cookie-script id
          cookieScriptDebug = 0,
          cookieScriptShowBadge=true,
          cookieScriptCurrentUrl = window.location.href,
          cookieScriptAcceptClass = '.##ACCEPT_CLASS##',
          cookieScriptMoreClass = '.##MORE_CLASS##',
				cookieScriptRejectClass = '.##REJECT_CLASS##',
				cookieBannerClass = ".##COOKIE_BANNER_CLASS##",
		cookieScriptLoadJavaScript = function (d, b) {
var c = document.getElementsByTagName("head")[0],
a = document.createElement("script");
a.type = "text/javascript", a.src = d, b != undefined && (a.onload = a.onreadystatechange = function () {
(!a.readyState || /loaded|complete/.test(a.readyState)) && (a.onload = a.onreadystatechange = null, c && a.parentNode && c.removeChild(a), a = undefined, b())
}), c.insertBefore(a, c.firstChild)
},

          InjectCookieScript = function () {
			  			  
if (window.location.protocol == "https:") cookieScriptStatsDomain = "";
else                                      cookieScriptStatsDomain = "chs03.";
cookieScriptCreateCookie = function (n, t, i) {
	if (window.location.protocol == "https:")
                var cookieScriptSecureCookie = ";secure";
              else
                var cookieScriptSecureCookie = "";
              var u = "",
                r, f;
              i && (r = new Date, r.setTime(r.getTime() + i * 864e5), u = "; expires=" + r.toGMTString()), f = "", cookieScriptDomain != "" && (f = "; domain=" + cookieScriptDomain), document.cookie = n + "=" + t + u + f + "; path=/" + cookieScriptSecureCookie;
            },

              cookieScriptReadCookie = function (n) {
				  for (var r = n + "=", u = document.cookie.split(";"), t, i = 0; i < u.length; i++) {
					  for (t = u[i]; t.charAt(0) == " ";) t = t.substring(1, t.length);
					  if (t.indexOf(r) == 0) return t.substring(r.length, t.length)
                }
                return null
              };

            cookieQuery(function () {
              cookieQuery( cookieBannerClass, cookieScriptWindow).remove();  
              cookieScriptAddBox = function () {
								cookieQuery("body", cookieScriptWindow).append('<!-- inject:js --><!-- endinject -->');
								
                cookieQuery( cookieBannerClass, cookieScriptWindow).fadeIn(1000);

                cookieQuery( cookieScriptAcceptClass, cookieScriptWindow).click(function () {
					                  cookieScriptAcceptFunction();
                });

                cookieQuery( cookieScriptRejectClass, cookieScriptWindow).click(function () {
					                  cookieScriptRejectFunction();
                });

                cookieQuery( cookieScriptMoreClass, cookieScriptWindow).click(function () {
					                  window.open(cookieScriptReadMore, '_blank');
                  return false;
                })

              }
				
	cookieScriptCurrentValue=cookieScriptReadVar("action");
	if(cookieScriptCurrentValue == "accept")
		cookieScriptAllowJS();
	if(cookieScriptCurrentValue == "accept" || cookieScriptCurrentValue == "reject")
	{
		return false;
	}              cookieScriptAddBox();
              cookieScriptAltIframe();
				            });
			  function cookieScriptAltIframe() {
              cookieQuery('iframe' + '[data-cookiescript="accepted"]').not(':has([src])').each(function () {
                var ifrm = this;

                ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;

                ifrm.document.open();
                ifrm.document.write(cookieQuery(this).attr("alt"));
                ifrm.document.close();
              });
            }

            function cookieScriptAcceptFunction() {

              cookieQuery(cookieBannerClass, cookieScriptWindow).fadeOut(200);
				cookieScriptAddVar("action", "accept");
              cookieScriptAllowJS();
              cookieQuery("#csconsentcheckbox").prop("checked", true);
              if (typeof cookieScriptShowBadge === "undefined") cookieScriptShowBadge=true;
              if(!cookieScriptShowBadge) return false;
            }

            function cookieScriptRejectFunction() {
				cookieScriptAddVar("action", "reject");
              cookieScriptClearAllCookies();
              cookieQuery(cookieBannerClass, cookieScriptWindow).fadeOut(200);
              cookieQuery("#csconsentcheckbox").prop("checked", false);
              if (typeof cookieScriptShowBadge === "undefined") cookieScriptShowBadge=true;
              if(!cookieScriptShowBadge) return false;
            }

            function cookieScriptAddVar(name,value){
            	var cookieConsentName="CookieScriptConsent";
            	try {
            		var jsonCookie=JSON.parse(cookieScriptReadCookie(cookieConsentName));
            	} catch(e) {
					console.log(e);
					return false;
				}

				if(jsonCookie==null)
				{
					var jsonCookie={};
					jsonCookie[name]=value
				}
				else //todo Add is object
				{
					jsonCookie[name]=value;
				}
				try{
					var newCookieVal=JSON.stringify(jsonCookie);
				} catch(e){
					console.log(e);
					return false;
				}
				cookieScriptCreateCookie(cookieConsentName, newCookieVal, 30);
            }

            function cookieScriptReadVar(name){
            	var cookieConsentName="CookieScriptConsent";
            	try {
            		var jsonCookie=JSON.parse(cookieScriptReadCookie(cookieConsentName));
            	} catch(e) {
					console.log(e);
					return null;
				}

				if(jsonCookie==null)
				{
					return null;
				}
				else //todo Add is object
				{
					return jsonCookie[name];
				}
            }
            function cookieScriptDebug(text) {
              if (cookieScriptDebug) console.log(text);
            }

            function cookieScriptEnableCheckbox(){

				if(cookieScriptReadVar("action") == "accept")
				{
					cookieQuery("#csconsentcheckbox").prop("checked", true);
				}
				cookieQuery("#csconsentcheckbox").change(function() {
					if(this.checked) {
						cookieScriptAcceptFunction();
					}
					else{
						cookieScriptRejectFunction();
					}
				});
				cookieQuery("#csconsentlink").click(function() {
				});


            }
            cookieScriptEnableCheckbox();
			
	function cookieScriptClearAllCookies(){
		var cookies = csCookies.get();
		for(var cookie in cookies) {
			if(cookie=='CookieScriptConsent') { continue; }
			
			if(!csCookies.remove(cookie))
			{
				var cookiePossibleHosts=[window.location.host, '.'+window.location.host];
				//now removing subdomains
				var regexParse = new RegExp('[a-z\-0-9]{2,63}\.[a-z\.]{2,6}$');
				var urlParts = regexParse.exec(window.location.host);
				var cookieSubdomain=window.location.host.replace(urlParts[0],'').slice(0, -1);
				if(cookieSubdomain != '') cookiePossibleHosts.push(window.location.host.substr(cookieSubdomain.length));
				for(var cookiePossibleHost in cookiePossibleHosts)
				{
					if(csCookies.remove(cookie, { path: '/',domain: cookiePossibleHosts[cookiePossibleHost] }) && cookieScriptDebug)
					console.log('deleting cookie:'+cookie+'| domain:'+cookiePossibleHosts[cookiePossibleHost]);
				}
			}
		}
	}

	
	if(cookieScriptReadVar("action") != "accept")
		setTimeout(cookieScriptClearAllCookies,500);
		function cookieScriptAllowJS(){
			cookieQuery('img'+'[data-cookiescript="accepted"]').each(function () {
				cookieQuery(this).attr('src', cookieQuery(this).attr("data-src"));
       		});
			cookieQuery('script'+'[type="text/plain"]'+'[data-cookiescript="accepted"]').each(function () {
				if (cookieQuery(this).attr('src')) {
					cookieQuery(this).after('<script type="text/javascript" src="' + cookieQuery(this).attr("src") + '"><\/script>')
				} else {
					cookieQuery(this).after('<script type="text/javascript">' + cookieQuery(this).html() + '<\/script>')
				}
				cookieQuery(this).empty()
       		});
			cookieQuery('iframe'+'[data-cookiescript="accepted"]').each(function () {
				cookieQuery(this).attr('src', cookieQuery(this).attr("data-src"));
       		});
			cookieQuery('embed'+'[data-cookiescript="accepted"]').each(function () {
				cookieQuery(this).replaceWith(cookieQuery(this).attr('src',cookieQuery(this).attr("data-src"))[0].outerHTML);
       		});
			cookieQuery('object'+'[data-cookiescript="accepted"]').each(function () {
				cookieQuery(this).replaceWith(cookieQuery(this).attr('data',cookieQuery(this).attr("data-data"))[0].outerHTML);
       		});
			cookieQuery('link'+'[data-cookiescript="accepted"]').each(function () {
				cookieQuery(this).attr('href', cookieQuery(this).attr("data-href"));
			});
		}

		          };


window.jQuery && jQuery.fn && /^(1\.[8-9]|2\.[0-9]|1\.1[0-2]|3\.[0-9])/.test(jQuery.fn.jquery) ? (cookieScriptDebug && window.console && console.log("Using existing jQuery version " + jQuery.fn.jquery), cookieQuery = window.jQuery, InjectCookieScript()) : (cookieScriptDebug && window.console && console.log("Loading jQuery 1.8.1 from ajax.googleapis.com"), cookieScriptLoadJavaScript(("https:" == document.location.protocol ? "https://" : "http://") + "ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js", function () {cookieQuery = jQuery.noConflict(!0), InjectCookieScript();}));