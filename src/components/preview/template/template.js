export default "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t\t<link href=\"https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css\" rel=\"stylesheet\" />\n\t\t<style>\n\t\t\t.loader-wrapper {\n\t\t\t\theight: 100vh;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t}\n\t\t\t.loader {\n\t\t\t\twidth: 24px;\n\t\t\t\theight: 24px;\n\t\t\t\tdisplay: block;\n\t\t\t\tmargin: 15px auto;\n\t\t\t\tposition: relative;\n\t\t\t\tcolor: #d1d5db;\n\t\t\t\tbox-sizing: border-box;\n\t\t\t\tanimation: rotation 1.5s linear infinite;\n\t\t\t}\n\t\t\t.loader::after,\n\t\t\t.loader::before {\n\t\t\t\tcontent: '';\n\t\t\t\tbox-sizing: border-box;\n\t\t\t\tposition: absolute;\n\t\t\t\twidth: 18px;\n\t\t\t\theight: 18px;\n\t\t\t\ttop: 50%;\n\t\t\t\tleft: 50%;\n\t\t\t\ttransform: scale(0.5) translate(0, 0);\n\t\t\t\tbackground-color: #d1d5db;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tanimation: loader 1.5s infinite ease-in-out;\n\t\t\t}\n\t\t\t.loader::before {\n\t\t\t\tbackground-color: #2563eb;\n\t\t\t\ttransform: scale(0.5) translate(-24px, -24px);\n\t\t\t}\n\n\t\t\t@keyframes rotation {\n\t\t\t\t0% {\n\t\t\t\t\ttransform: rotate(0deg);\n\t\t\t\t}\n\t\t\t\t100% {\n\t\t\t\t\ttransform: rotate(360deg);\n\t\t\t\t}\n\t\t\t}\n\t\t\t@keyframes loader {\n\t\t\t\t50% {\n\t\t\t\t\ttransform: scale(1) translate(-50%, -50%);\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t\t<script>\n\t\t\t// Create a public directory\n\t\t\tlet static = {};\n\n\t\t\tlet popup = false;\n\n\t\t\t// Create the script tag\n\t\t\tlet script = createScript('');\n\t\t\tdocument.head.appendChild(script);\n\n\t\t\t// Create the style tag\n\t\t\tconst style = document.createElement('style');\n\t\t\tdocument.head.appendChild(style);\n\n\t\t\t// Intercept console messages\n\t\t\tconst levels = ['log', 'warn', 'error'];\n\t\t\tlevels.forEach((level) => {\n\t\t\t\tconsole[level] = (text) => reply(level, text);\n\t\t\t});\n\n\t\t\tfunction reply(type = 'log', data) {\n\t\t\t\tif (popup) {\n\t\t\t\t\twindow.opener.postMessage({\n\t\t\t\t\t\ttype: type,\n\t\t\t\t\t\tdata: data\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tparent.postMessage({\n\t\t\t\t\t\ttype: type,\n\t\t\t\t\t\tdata: data\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t// Generate a new script tag to re-run the script\n\t\t\tfunction createScript(src) {\n\t\t\t\tconst script = document.createElement('script');\n\t\t\t\tscript.setAttribute('type', 'module');\n\t\t\t\tscript.innerHTML = src;\n\t\t\t\treturn script;\n\t\t\t}\n\n\t\t\tfunction update(e) {\n\t\t\t\tswitch (e.data.type) {\n\t\t\t\t\tcase 'url':\n\t\t\t\t\t\tdocument.body.addEventListener('click', (clickEvent) => {\n\t\t\t\t\t\t\t// If it's not a left click, ignore it\n\t\t\t\t\t\t\tif (event.which !== 1) return;\n\t\t\t\t\t\t\t// If it's a click combined with some key combination, ignore it.\n\t\t\t\t\t\t\tif (event.metaKey || event.ctrlKey || event.shiftKey) return;\n\t\t\t\t\t\t\t// If the event default has already been prevented, ignore it.\n\t\t\t\t\t\t\tif (event.defaultPrevented) return;\n\n\t\t\t\t\t\t\t// Traverse the event target to find the link node if present, else return.\n\t\t\t\t\t\t\t// Inspired by https://github.com/sveltejs/svelte-repl\n\t\t\t\t\t\t\tlet link = event.target;\n\t\t\t\t\t\t\twhile (link && link.nodeName !== 'A') link = link.parentNode;\n\t\t\t\t\t\t\tif (!link || link.nodeName !== 'A') return;\n\n\t\t\t\t\t\t\t// If it's not an application link, ignore it.\n\t\t\t\t\t\t\tif (\n\t\t\t\t\t\t\t\tlink.hasAttribute('download') ||\n\t\t\t\t\t\t\t\tlink.getAttribute('rel') === 'external' ||\n\t\t\t\t\t\t\t\tlink.target\n\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\treturn;\n\n\t\t\t\t\t\t\t// All base cases are now handled, so consume this event and prevent the default behavior.\n\t\t\t\t\t\t\tevent.preventDefault();\n\n\t\t\t\t\t\t\t// Handle relative and hash URLs as these should redirect to within the application.\n\t\t\t\t\t\t\t// Hash URLs are used by libraries like react-router.\n\t\t\t\t\t\t\tif (link.href.startsWith(e.origin)) {\n\t\t\t\t\t\t\t\tconst url = new URL(link.href);\n\t\t\t\t\t\t\t\tif (url.hash[0] === '#') {\n\t\t\t\t\t\t\t\t\t// Load the hash url\n\t\t\t\t\t\t\t\t\twindow.location.hash = url.hash;\n\t\t\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t\t\t} else if (url.pathname.endsWith('.html')) {\n\t\t\t\t\t\t\t\t\t// Load the static file\n\t\t\t\t\t\t\t\t\tdocument.body.innerHTML = static['public' + url.pathname];\n\t\t\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t// Open the link in a new window as this is the expected behavior.\n\t\t\t\t\t\t\twindow.open(link.href, '_blank');\n\t\t\t\t\t\t});\n\t\t\t\t\t\tbreak;\n\t\t\t\t\tdefault:\n\t\t\t\t\t\t// Update the filesystem for public files\n\t\t\t\t\t\tstatic = e.data.compiled.public;\n\n\t\t\t\t\t\t// Load the index.html file\n\t\t\t\t\t\tif ('public/index.html' in static) {\n\t\t\t\t\t\t\tdocument.body.innerHTML = static['public/index.html'];\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\t// Load the script bundle\n\t\t\t\t\t\tdocument.head.removeChild(script);\n\t\t\t\t\t\tscript = createScript(e.data.compiled.js);\n\t\t\t\t\t\tdocument.head.appendChild(script);\n\n\t\t\t\t\t\t// Load the styles\n\t\t\t\t\t\tstyle.innerHTML = e.data.compiled.css;\n\t\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (window.opener && window.opener !== window) {\n\t\t\t\tpopup = true;\n\t\t\t\treply('system', 'loaded');\n\t\t\t\twindow.addEventListener('beforeunload', () => {\n\t\t\t\t\treply('system, quit');\n\t\t\t\t});\n\t\t\t}\n\n\t\t\t// Listen for new commands\n\t\t\twindow.addEventListener('message', update);\n\t\t</script>\n\t</head>\n\t<body>\n\t\t<div class=\"loader-wrapper\">\n\t\t\t<div class=\"loader\"></div>\n\t\t</div>\n\t</body>\n</html>\n";