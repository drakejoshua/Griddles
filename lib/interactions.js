/* 
    the InteractionController class

    this class acts as a controller/intermediate that allows us to register and load very
    complex interactions( like a triple-click or a swipe-up ) on element / DOM nodes directly

    for instance, you might have some elements on which you want monitor for complex interactions such as a
    swipe-up or swipe-down, instead of writing the individual javascript for each of these interactions, 
    you can just create an InteractionController and register the interaction and it's respective action for these
    elements on the controller, and voila, the interaction work as registered.

    -> " for each interation, there's a respective action to perform "

    you can use multiple InteractionControllers on multiple elements or one InteractionController
    on multiple elements.

    [!]: you can only register keystroke interactions on the document.body or inputtable elements

    the class allows you to:
        - register any amount of interaction and actions on any number of elements
        - load all resgistered interaction and their action on their respective elements
        - interactions can be swipe interactions( i.e. swipe-up, swipe-down, swipe-left, swipe-right ),
            numbered-clicks interactions( i.e single-click, double-click, triple-click, quad-click, any 
            number of clicks based on what you want ) and keystroke interactions( i.e single-keystroke: up, 
            down, ctrl, alt or shortcut keystokes: ctrl + alt + up, ctrl + f12, etc depends on what you want )

    how the class works:

    - first, import the InteractionController class and create an InteractionController instance:

        1 | import { InteractionController } from "interaction.js"
        2 | 
        3 | var interactionController = new InteractionController();


    - you the register interactions using the register() method of the instance: To register, you pass an object
      that has an element property( with it's value as a DOM node ), interactionType property( it's value must be a string 
      and depends on the interaction to be registered ) and any of the following additional properties based on the
      interactionType:
            
            + if any swipe interaction, interactionType property's value can be "swipe-up" ( for a swipe up interaction ), 
              "swipe-down" ( for a swipe down interaction ), "swipe-left", "swipe-right" and the object must have the startAction 
              and endAction properties which both have a function/callback as a value, the functions are to contain code to execute 
              at the start and end of the specified swipe interaction and are passed the interaction's element as the only argument on 
              execution. For a swipe-up interaction, e.g:

              {
                    element: document.getElementById( element ),
                    interactionType: "swipe-up",
                    startAction: function( element ) {
                        element.innerHTML = "you just swiped up";
                    },
                    endAction: function( element ) {
                        element.innerHTML = "back to normal";
                    }
              }

            + if it's a numbered-clicks interaction, interactionType property's value will be "numbered-clicks" and the object must
              have a number property( value specifies the number of clicks for the numbered-click interaction ), clickAction property 
              which is to have a function/callback as it's value, the function contains code to execute when that numbered-click 
              interaction happens, the function is passed the interaction's element as the only argument on execution. 
              For a triple-click interaction, e.g:

              {
                    element: document.getElementById( element ),
                    interactionType: "numbered-clicks",
                    number: 3,
                    clickAction: function( element ) {
                        element.innerHTML = "you just triple-clicked on me";
                    }
              }


            + if it's a keystroke interaction, interactionType property's value will be "keystroke" and the object must have a keys
              property which is to have an array of strings that specifies the keys( see allowed values below ) for the keystroke 
              interaction, keysAction property which is to have a function/callback as it's value, the function contains code to 
              execute when that keystroke interaction happens, the function is passed the interaction's element as the only argument 
              on execution. For a ( ctrl + alt + a ) interaction, e.g:

              [!]: you can only register keystroke interactions on the document.body or inputtable elements

              {
                    element: document.body,
                    interactionType: "keystroke",
                    keys: [ "ctrl", "alt", "a" ],
                    keysAction: function( element ) {
                        alert("you just pressed: ctrl + alt + a");
                    }
              }


              for the list of allowed values in the keys array , 
                    # "ctrl" - control key
                    # "alt" - alt key
                    # "meta" - meta key / windows key
                    # "tab" - tab key
                    # "shift" - shift key
                    # "up" - arrow up key
                    # "down" - arrow down key
                    # "left" - arrow left key
                    # "right" - arrow right key
                    # "enter" - enter key
                    # "backspace" - backspace key
                    # function keys - specified normally e.g: "f12", "f2"
                    # alphabetic keys - specified normally e.g: "a", "z", "d", 
                    # numeric keys - specified normally e.g: "1", "4", "8"
                    # symbols - specified normally e.g: "@", "!", "*"

            [!]: it's important to take note of certain normal key behaviour like for instance, if the shift key + 1 key gives !
                 normally then when specifying the key combo in the keys array: shift + 1 will be shift + ! as the shift key modified
                 the 1 key to give the ! ( these nuances are part of operating system and can't be controlled by the browser or the interaction
                 controller ). This change is most particularly noticed when using the shift key plus symbols or numerics, it doesn't happen
                 with the alt, control or other modifier keys.

                 the default action may also take place as control + s keys will still open the save dialog no matter what, the controller
                 can't prevent that.

        1 | ( cont'd from previous code example )
        2 | interactionController.register(
        3 |      {
        4 |              element: document.body,
        5 |              interactionType: "keystroke",
        6 |              keys: [ "ctrl", "alt", "a" ],
        7 |              keysAction: function( element ) {
        8 |                  alert("you just pressed: ctrl + alt + a");
        9 |              }
       10 |      }
       11 |  );
       12 | interactionController.register(
       13 |      {
       14 |            element: document.getElementById( element ),
       15 |            interactionType: "numbered-clicks",
       16 |            number: 3,
       17 |            clickAction: function( element ) {
       18 |                element.innerHTML = "you just triple-clicked on me";
       19 |            }
       20 |      }
       21 |  );
    

    - after registering the wanted interactions, you then load the registered interactions by using the loadRegisteredInteractions() method
      of the instance. Loading the interaction means the attachment of event listeners to the specified interaction elements.
      
      [!]: you should only load after you've registered all your wanted interactions, if after loading, you register another interaction and 
           re-load it can lead to bugs / errors in the UI.
        
        1 | ( cont'd from previous code example )
        2 | 
        3 | interactionController.loadRegisteredInteractions();


    - and yep, that's it your interactions are set up and will be handled in your UI.


    furthermore, you can tweak the config variables as found before the class code or directly below this documentation
    in order to increase/decrease the swipe distance to make before a valid swipe is counted or to increase/decrease the
    debouce time for the numbered-clicks interaction.
*/









// config variables
var touchOffset = 50,         // the swipe distance to make, before a valid swipe is counted
    clickTiming = 500;        // the number of milliseconds used for debouncing in numbered-clicks interactions






// the class code
class InteractionsController {

    // the class constructor
    constructor () {
        this._interactionsToLoadArray = [];   // used to initially store the list of registered interactions and their actions
        this._categorizedInteractionsToLoadArray = [];   // used to store the registered interactions into categories: swipe, keystroke, ...
    }


    // the register() method used to register an interaction in the controller
    register ( interaction ) {

        // on register, validate the interaction if it has an element and interaction type
        if ( interaction.element == null || interaction.interactionType == null ) {

            // throw an error if invalid
            throw "Interaction.js: invalid interaction data received, element or interactionType for an interaction is wrong, please check";

        } else {

            // continue parsing if valid


            // check if the interaction-type to be registered is present in the interactions 
            // to load array and get the index of that interaction type
            var loadedInteractionIndex = this._interactionsToLoadArray.findIndex(
                function( value ) {
                    if ( interaction.element == value.element && 
                        interaction.interactionType == value.interactionType ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            );


            // check the returned index if it's -1( meaning not present ), create an intermediate
            // object to keep the element, interactionType and related actions for that interaction
            // type 
            // if present/found, use the index and add the actions of the interaction to be registered
            // to the related actions array of that interaction type
            if ( loadedInteractionIndex == -1 ) {
                
                // check the interactionType of the interaction to register and add the it's actions to the
                // intermediate object
                switch ( interaction.interactionType ) {
                    case "swipe-up":                // for interactionType, "swipe-up"
                        this._interactionsToLoadArray.push(
                            {
                                element: interaction.element,
                                interactionType: interaction.interactionType,
                                startActions: [
                                    interaction.startAction
                                ],
                                endActions: [
                                    interaction.endAction
                                ]
                            }
                        )    
                    break;
                    
                    case "swipe-down":                // for interactionType, "swipe-down"
                        this._interactionsToLoadArray.push(
                            {
                                element: interaction.element,
                                interactionType: interaction.interactionType,
                                startActions: [
                                    interaction.startAction
                                ],
                                endActions: [
                                    interaction.endAction
                                ]
                            }
                        )    
                    break;
                    
                    case "swipe-left":                // for interactionType, "swipe-left"
                        this._interactionsToLoadArray.push(
                            {
                                element: interaction.element,
                                interactionType: interaction.interactionType,
                                startActions: [
                                    interaction.startAction
                                ],
                                endActions: [
                                    interaction.endAction
                                ]
                            }
                        )    
                    break;
                    
                    case "swipe-right":                // for interactionType, "swipe-right"
                        this._interactionsToLoadArray.push(
                            {
                                element: interaction.element,
                                interactionType: interaction.interactionType,
                                startActions: [
                                    interaction.startAction
                                ],
                                endActions: [
                                    interaction.endAction
                                ]
                            }
                        )    
                    break;

                    case "keystroke":                // for interactionType, "keystroke"
                        this._interactionsToLoadArray.push(
                            {
                                element: interaction.element,
                                interactionType: interaction.interactionType,
                                keysAndActions: [
                                    { 
                                        keys: interaction.keys,
                                        action: interaction.keysAction
                                    }
                                ]
                            }
                        )
                    break;

                    case "numbered-clicks":                // for interactionType, "numbered-clicks"
                        this._interactionsToLoadArray.push(
                            {
                                element: interaction.element,
                                interactionType: interaction.interactionType,
                                timing: clickTiming,
                                clickActions: [
                                    {
                                        number: interaction.number,
                                        action: interaction.clickAction
                                    }
                                ]
                            }
                        )
                    break;
                }
            } else {

                // check the interactionType of the interaction to register and add the it's actions to the
                // intermediate object
                switch ( interaction.interactionType ) {
                    case "swipe-up":                // for interactionType, "swipe-up"
                        this._interactionsToLoadArray[ loadedInteractionIndex ].startActions
                        .push( interaction.startAction );
                        
                        this._interactionsToLoadArray[ loadedInteractionIndex ].endActions
                        .push( interaction.endAction );
                    break;
                    
                    case "swipe-down":                // for interactionType, "swipe-down"
                        this._interactionsToLoadArray[ loadedInteractionIndex ].startActions
                        .push( interaction.startAction );
                        
                        this._interactionsToLoadArray[ loadedInteractionIndex ].endActions
                        .push( interaction.endAction );
                    break;
                    
                    case "swipe-left":                // for interactionType, "swipe-left"
                        this._interactionsToLoadArray[ loadedInteractionIndex ].startActions
                        .push( interaction.startAction );
                        
                        this._interactionsToLoadArray[ loadedInteractionIndex ].endActions
                        .push( interaction.endAction ); 
                    break;
                    
                    case "swipe-right":                // for interactionType, "swipe-right"
                        this._interactionsToLoadArray[ loadedInteractionIndex ].startActions
                        .push( interaction.startAction );
                        
                        this._interactionsToLoadArray[ loadedInteractionIndex ].endActions
                        .push( interaction.endAction );
                    break;

                    case "keystroke":                // for interactionType, "keystroke"
                        this._interactionsToLoadArray[ loadedInteractionIndex ].keysAndActions
                        .push( 
                            {
                                keys: interaction.keys,
                                action: interaction.keysAction
                            }
                        );
                    break;

                    case "numbered-clicks":                // for interactionType, "numbered-clicks"
                        this._interactionsToLoadArray[ loadedInteractionIndex ].clickActions
                        .push( 
                            {
                                number: interaction.number,
                                action: interaction.clickAction
                            }
                        );
                    break;
                }
            }
        }
    }

    // the _categorizeInteractionsToLoad() method used to categorize the interactions to load into 
    // their various categories as swipe, keystroke or numbered-clicks
    _categorizeInteractionsToLoad () {

        // iterate through the interactions-to-load-array in order to find intermediate objects
        // for a certain interaction category
        for ( var interaction of this._interactionsToLoadArray ) {

            // check the interactionType of the intermediate object and then put it in the
            // interactions of a matching category
            switch ( interaction.interactionType ) {
                case "swipe-up":                // for interaction category, "swipe"
                case "swipe-left":                // for interaction category, "swipe"
                case "swipe-right":                // for interaction category, "swipe"
                case "swipe-down":                // for interaction category, "swipe"

                    // check if the category for the respective categorizedInteractions is present in 
                    // the categorized interactions array and get it's categoryIndex if present
                    var categoryIndex = this._categorizedInteractionsToLoadArray.findIndex(
                        function( categorizedInteraction ) {
                            if ( categorizedInteraction.element == interaction.element && 
                                categorizedInteraction.category == 'swipe' ) {
                                    return true;
                            } else {
                                return false;
                            }
                        }
                    )

                    // if categoryIndex isn't found( that is, categoryIndex == -1 ), create a new interaction 
                    // category with the current interaction immediately added into the category
                    // else,
                    // add the current interaction into the interaction category as found
                    if ( categoryIndex == -1 ) {
                        this._categorizedInteractionsToLoadArray.push(
                            {
                                element: interaction.element,
                                category: 'swipe',
                                interactions: [
                                    interaction
                                ]
                            }
                        )
                    } else {
                        this._categorizedInteractionsToLoadArray[ categoryIndex ].
                        interactions.push( interaction );
                    }
                break;
                
                
                case "numbered-clicks":             // for interaction category, "numbered-clicks"

                    // check if the category for the respective categorizedInteractions is present in 
                    // the categorized interactions array and get it's categoryIndex if present
                    var categoryIndex = this._categorizedInteractionsToLoadArray.findIndex(
                        function( categorizedInteraction ) {
                            if ( categorizedInteraction.element == interaction.element && 
                                categorizedInteraction.category == 'click' ) {
                                    return true;
                            } else {
                                return false;
                            }
                        }
                    )

                    // if categoryIndex isn't found( that is, categoryIndex == -1 ), create a new interaction 
                    // category with the current interaction immediately added into the category
                    // else,
                    // add the current interaction into the interaction category as found
                    if ( categoryIndex == -1 ) {
                        this._categorizedInteractionsToLoadArray.push(
                            {
                                element: interaction.element,
                                category: 'click',
                                interactions: [
                                    interaction
                                ]
                            }
                        )
                    } else {
                        this._categorizedInteractionsToLoadArray[ categoryIndex ].
                        interactions.push( interaction );
                    }
                break;
                
                case "keystroke":             // for interaction category, "keystroke"

                    // check if the category for the respective categorizedInteractions is present in 
                    // the categorized interactions array and get it's categoryIndex if present
                    var categoryIndex = this._categorizedInteractionsToLoadArray.findIndex(
                        function( categorizedInteraction ) {
                            if ( categorizedInteraction.element == interaction.element && 
                                categorizedInteraction.category == 'keystroke' ) {
                                    return true;
                            } else {
                                return false;
                            }
                        }
                    )

                    // if categoryIndex isn't found( that is, categoryIndex == -1 ), create a new interaction 
                    // category with the current interaction immediately added into the category
                    // else,
                    // add the current interaction into the interaction category as found
                    if ( categoryIndex == -1 ) {
                        this._categorizedInteractionsToLoadArray.push(
                            {
                                element: interaction.element,
                                category: 'keystroke',
                                interactions: [
                                    interaction
                                ]
                            }
                        )
                    } else {
                        this._categorizedInteractionsToLoadArray[ categoryIndex ].
                        interactions.push( interaction );
                    }
                break;
            }
        }
         
    }

    // the loadRegisteredInteractions() method used to load all the registered interaction category and 
    // place appropriate js event listeners and handlers based on the respective category.. like placing a 
    // click handler on an element that has numbered-clicks interactions on it.
    loadRegisteredInteractions () {
        // make a call to firstly group all the registered interactions to load into categories
        this._categorizeInteractionsToLoad();

        // get a duplicate local variable value for the categorized interaction for easy access within this method
        var categorizedInteractionsToLoadDuplicate = this._categorizedInteractionsToLoadArray;

        // declare and initialize working variables that will be used in the calculations in the event handlers on
        // attachment to the element
        var startX, startY, deltaX, deltaY, selectedInteraction = null, selectedCategory, clickCount = 0, clickActionDone = false,
        timeoutIds = [], keysInPress = [], allkeysMatch = true;

        // loop through all the categories in the categorizedInteractionsToLoadDuplicate and attach specific event 
        // listeners and handler based on the interaction's category
        for ( var categorizedInteractions of categorizedInteractionsToLoadDuplicate ) {

            switch ( categorizedInteractions.category ) {
                case "swipe":                   // for swipe interactions

                    // add a 'touchstart' event listener to the element in order to detect a swipe start and initialize
                    // the swipe calculation values
                    categorizedInteractions.element.addEventListener( 'touchstart', function( event ) {
                        startY = event.touches[0].clientY;
                        startX = event.touches[0].clientX;
                    });
                    
                    // add a 'touchmove' event listener in order to calculate the swipe distance and run the specifed 
                    // startActions of the interaction in the category if the distance exceeds the touchOffset
                    categorizedInteractions.element.addEventListener( 'touchmove', function( event ) {
                        deltaY = event.touches[0].clientY - startY;         // calculate the vertical swipe distance
                        deltaX = event.touches[0].clientX - startX;         // calculate the horizontal swipe distance


                        // for swipe-down ( that is, vertical swipe distance is greater than touchOffset in a positive way )
                        if ( deltaY > touchOffset ) {
                            // find the category( selectedCategory ) from categorizedInteractionsToLoadDuplicate that matches 
                            // the given element and category
                            selectedCategory = categorizedInteractionsToLoadDuplicate.find(
                                function( categorizedInteractions ) {
                                    return categorizedInteractions.category == 'swipe' && 
                                    categorizedInteractions.element == event.target;
                                }
                            )

                            // run all the start actions of swipe-down interactions for this selectedCategory
                            for ( var interaction of selectedCategory.interactions ) {
                                if ( interaction.interactionType == 'swipe-down' ) {
                                    selectedInteraction = interaction;

                                    for ( var action of interaction.startActions ) {
                                        action( event.target );
                                    }
                                }
                            }
                        }

                        // for swipe-up ( that is, vertical swipe distance is greater than touchOffset in a negative way )
                        if ( deltaY < ( -1 * touchOffset ) ) {
                            // find the category( selectedCategory ) from categorizedInteractionsToLoadDuplicate that matches 
                            // the given element and category
                            selectedCategory = categorizedInteractionsToLoadDuplicate.find(
                                function( categorizedInteractions ) {
                                    return categorizedInteractions.category == 'swipe' && 
                                    categorizedInteractions.element == event.target;
                                }
                            )

                            // run all the start actions of swipe-up interactions for this selectedCategory
                            for ( var interaction of selectedCategory.interactions ) {
                                if ( interaction.interactionType == 'swipe-up' ) {
                                    selectedInteraction = interaction;

                                    for ( var action of interaction.startActions ) {
                                        action( event.target );
                                    }
                                }
                            }
                        }

                        // for swipe-left ( that is, horizontal swipe distance is greater than touchOffset in a 
                        // negative way )
                        if ( deltaX < ( -1 * touchOffset ) ) {
                            // find the category( selectedCategory ) from categorizedInteractionsToLoadDuplicate that matches 
                            // the given element and category
                            selectedCategory = categorizedInteractionsToLoadDuplicate.find(
                                function( categorizedInteractions ) {
                                    return categorizedInteractions.category == 'swipe' && 
                                    categorizedInteractions.element == event.target;
                                }
                            )

                            // run all the start actions of swipe-left interactions for this selectedCategory
                            for ( var interaction of selectedCategory.interactions ) {
                                if ( interaction.interactionType == 'swipe-left' ) {
                                    selectedInteraction = interaction;

                                    for ( var action of interaction.startActions ) {
                                        action( event.target );
                                    }
                                }
                            }
                        }

                        // for swipe-right ( that is, horizontal swipe distance is greater than touchOffset in a positive way )
                        if ( deltaX > touchOffset ) {
                            // find the category( selectedCategory ) from categorizedInteractionsToLoadDuplicate that matches 
                            // the given element and category
                            selectedCategory = categorizedInteractionsToLoadDuplicate.find(
                                function( categorizedInteractions ) {
                                    return categorizedInteractions.category == 'swipe' && 
                                    categorizedInteractions.element == event.target;
                                }
                            )

                            // run all the start actions of swipe-right interactions for this selectedCategory
                            for ( var interaction of selectedCategory.interactions ) {
                                if ( interaction.interactionType == 'swipe-right' ) {
                                    selectedInteraction = interaction;

                                    for ( var action of interaction.startActions ) {
                                        action( event.target );
                                    }
                                }
                            }
                        }
                    });
                    
                    // add a 'touchend' event listener in order to execute all the end actions of the selected interaction
                    // ( if not undefined or null ) from the 'touchmove' listener marking the end of the swipe
                    categorizedInteractions.element.addEventListener( 'touchend', function( event ) {
                        if ( selectedInteraction != undefined ) {
                            for ( var action of selectedInteraction.endActions ) {
                                action( event.target );
                            }
                        }
                    });
                break;


                case "click":                   // for numbered-clicks interactions

                    // Check if the device supports touch events( i.e. is a mobile device )
                    // so the right event listener is attached to the element ensuring proper code compatiblity with
                    // the user's device
                    var isTouchDevice = 'ontouchstart' in window;


                    // if device supports touch events, attach a 'touchstart' event listener to calculate and keep track of the 
                    // number of clicks and also execute the associated click actions for the interactions
                    // else,
                    // attach a 'click' listener to do the same thing as the touchstart instead
                    if ( isTouchDevice ) {
                        categorizedInteractions.element.addEventListener( 'touchstart', function( event ) {
                            // prevent the default behaviour in order to avoid touch behavioural glitches 
                            // like highlighting on multiple concurrent clicks
                            event.preventDefault();

                            // increase the click( tap ) count each time the user taps on/touches the screen
                            clickCount++;

                            // clear the timeouts created in order to run the click actions of the interactions
                            // in order to avoid execution errors as uncleared timeouts are created for each tap/touch
                            for ( var id of timeoutIds ) {
                                clearTimeout( id );
                            }
    
                            // find the category( selectedCategory ) from categorizedInteractionsToLoadDuplicate that matches 
                            // the given element and category
                            selectedCategory = categorizedInteractionsToLoadDuplicate.find(
                                function( categorizedInteractions ) {
                                    return categorizedInteractions.category == 'click' && 
                                    categorizedInteractions.element == event.target;
                                }
                            )
    
                            // loop through the interaction of the selectedCategory and create a timeout to run the 
                            // click actions respective to the click( tap ) count after the user has stopped clicking 
                            // the screen repeatedly( this is a debouncing technique as the code allows the user 
                            // to make any number of clicks( taps ) they want to make before it responds to the interaction )
                            // and,
                            // add the timeout id to the list of ids in order to be able to clear them if user still repeatedly tap/
                            // touches the screen ensuring proper execution
                            // and,
                            // if any click action is run, reset the click( tap ) count and set the clickActionDone flag as true in order to 
                            // reset it back to it's default value and allow another numbered-clicks interaction take place
                            for ( var interaction of selectedCategory.interactions ) {

                                // create timeout and get it's id  
                                var timeoutId = setTimeout( function() {

                                    // loop through the click actions of the interaction and check if there's any that matches the 
                                    // current click( tap ) count if true, execute the click action, reset the click( tap ) count and set the 
                                    // clickActionDone flag as true
                                    for ( var clickAction of interaction.clickActions ) {
                                        if ( clickAction.number == clickCount ) {
                                            clickAction.action( event.target );

                                            clickActionDone = true;
    
                                            clickCount = 0;
                                        }
                                    }


                                    // check if any click actions were done, if true, reset the value of the clickActionDone flag to false
                                    // else,
                                    // reset the click( tap ) count to avoid incorrect clicks( tap ) counting with overflow from the previous
                                    // repeated clicks( taps )
                                    if ( !clickActionDone ) {
                                        clickCount = 0;
                                    } else {
                                        clickActionDone = false;
                                    }
                                }, interaction.timing );
    

                                // add the timeout id to the list of timeout ids
                                timeoutIds.push( timeoutId );
                            }
                        });
                    } else {
                        categorizedInteractions.element.addEventListener( 'click', function( event ) {
                            // prevent the default behaviour in order to avoid touch behavioural glitches 
                            // like highlighting on multiple concurrent clicks
                            event.preventDefault();

                            // increase the click( tap ) count each time the user taps on/touches the screen
                            clickCount++;
    
                            // clear the timeouts created in order to run the click actions of the interactions
                            // in order to avoid execution errors as uncleared timeouts are created for each tap/touch
                            for ( var id of timeoutIds ) {
                                clearTimeout( id );
                            }
    
                            // find the category( selectedCategory ) from categorizedInteractionsToLoadDuplicate that matches 
                            // the given element and category
                            selectedCategory = categorizedInteractionsToLoadDuplicate.find(
                                function( categorizedInteractions ) {
                                    return categorizedInteractions.category == 'click' && 
                                    categorizedInteractions.element == event.target;
                                }
                            )
    
                            // loop through the interaction of the selectedCategory and create a timeout to run the 
                            // click actions respective to the click( tap ) count after the user has stopped clicking 
                            // the screen repeatedly( this is a debouncing technique as the code allows the user 
                            // to make any number of clicks( taps ) they want to make before it responds to the interaction )
                            // and,
                            // add the timeout id to the list of ids in order to be able to clear them if user still repeatedly tap/
                            // touches the screen ensuring proper execution
                            // and,
                            // if any click action is run, reset the click( tap ) count and set the clickActionDone flag as true in order to 
                            // reset it back to it's default value and allow another numbered-clicks interaction take place
                            for ( var interaction of selectedCategory.interactions ) {

                                // create timeout and get it's id  
                                var timeoutId = setTimeout( function() {

                                    // loop through the click actions of the interaction and check if there's any that matches the 
                                    // current click( tap ) count if true, execute the click action, reset the click( tap ) count and set the 
                                    // clickActionDone flag as true
                                    for ( var clickAction of interaction.clickActions ) {
                                        if ( clickAction.number == clickCount ) {
                                            clickAction.action( event.target );
    
                                            clickCount = 0;
                                        }
                                    }


                                    // check if any click actions were done, if true, reset the value of the clickActionDone flag to false
                                    // else,
                                    // reset the click( tap ) count to avoid incorrect clicks( tap ) counting with overflow from the previous
                                    // repeated clicks( taps )
                                    if ( !clickActionDone ) {
                                        clickCount = 0;
                                    } else {
                                        clickActionDone = false;
                                    }
                                }, interaction.timing );
    

                                // add the timeout id to the list of timeout ids
                                timeoutIds.push( timeoutId );
                            }
                        });
                    }
                break;


                case 'keystroke':                   // for keystroke interactions

                    // add a 'keydown' listener to get and keep a list( keyInPress ) of the keys in the keystrokes and also
                    // run the key actions of interactions that match the keys in the list in the right order
                    categorizedInteractions.element.addEventListener( 'keydown', function( event ) {
                        
                        // find the category( selectedCategory ) from categorizedInteractionsToLoadDuplicate that matches 
                        // the given element and category
                        selectedCategory = categorizedInteractionsToLoadDuplicate.find(
                            function( categorizedInteractions ) {
                                return categorizedInteractions.category == 'keystroke' && 
                                categorizedInteractions.element == event.target;
                            }
                        );


                        // check the key name of the key that was pressed and convert to appropriate format if needed before adding 
                        // to the keyInPress list
                        switch ( event.key ) {
                            case 'Control':
                                if ( !keysInPress.includes('ctrl') ) {
                                    keysInPress.push('ctrl');
                                }
                            break;
                            
                            case 'Meta':
                                if ( !keysInPress.includes('meta') ) {
                                    keysInPress.push('meta');
                                }
                            break;
                            
                            case 'Alt':
                                if ( !keysInPress.includes('alt') ) {
                                    keysInPress.push('alt');
                                }
                            break;
                            
                            case 'Shift':
                                if ( !keysInPress.includes('shift') ) {
                                    keysInPress.push('shift');
                                }
                            break;
                            
                            case 'Tab':
                                if ( !keysInPress.includes('tab') ) {
                                    keysInPress.push('tab');
                                }
                            break;
                            
                            case 'ArrowUp':
                                if ( !keysInPress.includes('up') ) {
                                    keysInPress.push('up');
                                }
                            break;

                            case 'ArrowDown':
                                if ( !keysInPress.includes('down') ) {
                                    keysInPress.push('down');
                                }
                            break;

                            case 'ArrowLeft':
                                if ( !keysInPress.includes('left') ) {
                                    keysInPress.push('left');
                                }
                            break;

                            case 'ArrowRight':
                                if ( !keysInPress.includes('right') ) {
                                    keysInPress.push('right');
                                }
                            break;
                        
                            default:
                                if ( !keysInPress.includes( event.key.toLowerCase() ) ) {
                                    keysInPress.push( event.key.toLowerCase() );
                                }
                            break;
                        }


                        // loop through the interactions of the selectedCategory and find an interaction with keys matching 
                        // those as listed in keyInPress, if found, execute it's action
                        for ( var interaction of selectedCategory.interactions ) {

                            // loop through the keys action of the keys and action of the current interaction to find if the
                            // keys match
                            for ( var keysAndAction of interaction.keysAndActions ) {
                                if ( keysAndAction.keys.length == keysInPress.length ) {
                                    for ( var keyIndex = 0; keyIndex < keysInPress.length; keyIndex++ ) {
                                        if ( keysInPress[keyIndex] != keysAndAction.keys[keyIndex] ) {
                                            allkeysMatch = false;

                                            break;
                                        }
                                    }
                                    
                                    
                                    // if all the keys match, execute the action of the keys action
                                    // else, reset the value of the allkeysMatch flag to true
                                    if ( allkeysMatch ) {
                                        keysAndAction.action( event.target );
                                    } else {
                                        allkeysMatch = true;
                                    }
                                }
                            }
                        }
                    });

                    // add a 'keyup' listener in order to reset the values of the working variables back to their defaults to 
                    // allow another keystroke interaction to occur without errors
                    categorizedInteractions.element.addEventListener( 'keyup', function() {
                        keysInPress = [];

                        allkeysMatch = true;
                    });
                break;
            }
        }
    }
}


// exporting the interaction controller to allow imports from other program
export { InteractionsController };