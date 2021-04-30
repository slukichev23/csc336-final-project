(function() {

  "use strict";

  window.addEventListener("load", init);

  // Variables
  let event_counter = 0; // This helps us keep track of events so that we can remove them from the icon menu in the bottom left
  let max_events = 5;

  function init() {
    // initialize function

    // adds click event to all states in the svg map
    const states = qsa("path");
    for (let i = 0; i < states.length; i++){
      // if we want to add an event of some kind of event to every state we can do it this way
      states[i].addEventListener("click", function() { // using click as an example
        this.style.fill = "rgb(100,255,100)";
      })
    }

    // changing a specific state's color example:
    // The id is the state's 2 letter code
    id("TX").style.fill = "rgb(255,200,200)" // colors Texas light red

    // adding 3 empty events
    add_event_icon();
    add_event_icon();
    add_event_icon();
    add_event_icon();
    add_event_icon();


  }
    // GAME FUNCTIONS

    // Function to add an event to the bottom left div
    // It will most likely have some sort of parameter so that
    // we can pick the icon to reflect what type of event this is

    function add_event_icon() {
      let event_icon = gen("img");
      event_icon.src = "images/event_icon_placeholder.png"
      event_icon.id = "event_number_" + event_counter.toString();
      // attaches event handler to event
      event_icon.addEventListener("click", event_icon_event_handler);
      // adds icon image to screen
      id("events-div").appendChild(event_icon);
      event_counter += 1;
    }

    function event_icon_event_handler() {
      console.log("Event icon has been clicked");
      id("event-popup").classList.remove("hidden");
      let icon = this; // reference to icon to remove it once player has made decision for the event
      // adds event handler to button (one for now)
      id("event-button").addEventListener("click", function() {
        // does stuff depending on the answer chosen
        //
        // --

        // closes event pop up
        id("event-popup").classList.add("hidden");
        // rmeoves icon
        icon.remove();

      })

    }


    // HELPER FUNCTIONS:

     // Returns random index number for a given length n.
     function random_amount(n) {
       // returns 0 through n-1
       return Math.floor(Math.random() * Math.floor(n));
     }

     /**
      * Returns the element that has the ID attribute with the specified value.
      * @param {string} idName - element ID
      * @returns {object} DOM object associated with id.
      */
     function id(idName) {
       return document.getElementById(idName);
     }

     /**
      * Returns a new element with the given tag name.
      * @param {string} tagName - HTML tag name for new DOM element.
      * @returns {object} New DOM object for given HTML tag.
      */
     function gen(tagName) {
       return document.createElement(tagName);
     }

     /**
      * Returns the first element that matches the given CSS selector.
      * @param {string} selector - CSS query selector.
      * @returns {object} The first DOM object matching the query.
      */
     function qs(selector) {
       return document.querySelector(selector);
     }

     /**
      * Returns the array of elements that match the given CSS selector.
      * @param {string} selector - CSS query selector
      * @returns {object[]} array of DOM objects matching the query.
      */
     function qsa(selector) {
       return document.querySelectorAll(selector);
     }

    }());
