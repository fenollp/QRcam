var browser = {}, app, Port, cfg, _;

app = {"name":"Imagus", "version":"0.9.8.37"};
if (document instanceof window.HTMLDocument) {
    browser = document.documentElement || document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(cb) { return window.setTimeout(cb, 25) };

    if (!window.MutationObserver)
        window.MutationObserver = window.WebKitMutationObserver || window.MozMutationObserver;

    if (browser.style) {
        _ = browser.style;
        browser = {"wheel": "onwheel" in browser ? "wheel" : "mousewheel",
                   "transition": ("webkitTransition" in _ ? "webkitT" : "t") + "ransition",
                   "transition_css": ("webkitTransition" in _ ? "-webkit-" : "") + "transition",
                   "transform": ("webkitTransform" in _ ? "webkitT" : "t") + "ransform",
                   "transform_css": ("webkitTransform" in _ ? "-webkit-" : "") + "transform",
                   "zoom-in": this.chrome || this.mx || this.safari ? "-webkit-zoom-in" : "zoom-in"
                  };
        _ = null;
    }
}

function buildNodes(host,nodes) {
    if (!host || !Array.isArray(nodes))
        return;
    if (!nodes.length)
        return host;

    var doc = host.ownerDocument;
    var fragment = doc.createDocumentFragment();

    for (var i=0, l=nodes.length; i<l; i++) {
        if (!nodes[i])
            continue;
        if (typeof nodes[i] === "string") {
            fragment.appendChild(doc.createTextNode(nodes[i]));
            continue;
        }
        var node = doc.createElement(nodes[i].tag);
        if (nodes[i].attrs)
            for (var attr in nodes[i].attrs)
                if (attr === "style")
                    node.style.cssText = nodes[i].attrs[attr];
        else
            node.setAttribute(attr, nodes[i].attrs[attr]);

        if (nodes[i].nodes)
            buildNodes(node,nodes[i].nodes);
        else if (nodes[i].text)
            node.textContent = nodes[i].text;
        fragment.appendChild(node);
    }

    if (fragment.childNodes.length)
        host.appendChild(fragment);
    return host;
}

window.addEventListener("message", function(e) {
    if (!e.data.hasOwnProperty("IMGS_message_CMD"))
        return;
    e.stopImmediatePropagation();
    if (browser.onmessage)
        browser.onmessage(e);
}, true);

window.addEventListener("keydown", function(e) {
    if (browser.onkeydown)
        browser.onkeydown(e);
}, true);

browser.chrome = true;
Port = {
    listen: function(listener) {
        if (this.listener)
            (chrome.runtime && chrome.runtime.onMessage || chrome.extension.onMessage).removeListener(this.listener);
        this.listener = listener;
        if (listener)
            chrome.extension.onMessage.addListener(this. listener);
    },
    send: function(message) {
        setTimeout(function() {
            if (Port.listener)
                chrome.extension.sendMessage(message,Port.listener);
            else chrome.extension.sendMessage(message);
        }, 0);
    }
};

if (window.location.protocol === "chrome-extension:") {
    _ = function(s) { return chrome.i18n.getMessage(s) || s; };
    browser.insertHTML = function(n,html) { n.innerHTML = html; };
}
