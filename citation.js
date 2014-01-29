/*jslint browser:true, sloppy:true*/
function citationjs() {
    // citation.js
    // Get the latest source at: http://github.com/user24/citation.js
    //
    var i, l,
        allLinks,
        namedLinks = {},
        windowLocationSansHash;
    
    function getEventTarget(event) {
        // Modified from http://www.quirksmode.org/js/events_properties.html
        var target;
        if (!event) {
            event = window.event;
        }
        if (event.target) {
            target = event.target;
        } else if (event.srcElement) {
            target = event.srcElement;
        }
        if (target.nodeType === 3) {
            // defeat Safari bug
            target = target.parentNode;
        }
    
        return target;
    }
    
    function followCitation(event) {
        var target,
            existingClassName;
        // Get the element that this event was fired on
        target = getEventTarget(event);
        // Store existing class
        existingClassName = namedLinks[target.hash].parentNode.className;
        // Add the clicked class
        namedLinks[target.hash].parentNode.className += " clicked";
        // Scroll the parent into view with a tiny timeout to avoid selecting text which sometimes happens
        setTimeout(function scrollIntoView() {
            namedLinks[target.hash].parentNode.scrollIntoView();
        }, 10);
        // Update the hash on the URL if we can
        if (window.history && window.history.pushState) {
            window.history.pushState({}, target.hash, target.hash);
            // Stop the native hash event
            event.preventDefault();
        }
        // Remove the class after a short while.
        setTimeout(function removeClass() {
            namedLinks[target.hash].parentNode.className = existingClassName;
        }, 250);
    }
    
    function removeHash(href) {
        var indexOfHash = href.indexOf("#");
        if (indexOfHash === -1) {
            indexOfHash = href.length;
        }
        href = href.substring(0, indexOfHash);
        return href;
    }

    // Attach click handlers to all A elements that are internal # links
    windowLocationSansHash = removeHash(window.location.href);
    allLinks = document.getElementsByTagName("A");
    l = allLinks.length;
    for (i = 0; i < l; i += 1) {
        if (allLinks[i].hash.substring(0, 1) === "#" && removeHash(allLinks[i].href) === windowLocationSansHash) {
            allLinks[i].onclick = followCitation;
        }
        // Store named links for easy access
        if (allLinks[i].name) {
            namedLinks["#" + allLinks[i].name] = allLinks[i];
        }
    }
}