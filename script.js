// import the library code needed in this progrem such as the: stateful element 
// and interaction controller
import { StatefulElement } from "./lib/one.js";
import { InteractionsController } from "./lib/interactions.js";


// import the DOM element objects from the document that are to be interacted with
var riddleTitleText = document.getElementById("title"),
    riddleText = document.getElementById("riddle"),
    downloadLink = document.getElementById("download-link"),
    nextBtn = document.getElementById("next-btn"),
    previousBtn = document.getElementById("previous-btn"),
    showAnswerBtn = document.getElementById("show-btn"),
    riddleAnswerText = document.getElementById("answer-ctn"),
    retryBtn = document.getElementById("retry-btn");


// create some variables to be used as debouncers in the subsequent swipe-left and
// swipe-right interaction on the page
var swipeRightDebouncer, swipeLeftDebouncer;


// create and initialize the variables used for the page for example, to store the list of 
// loaded riddles
var loadedRiddles = [], currentRiddleIndex = 0, currentRiddleData, firstRiddleFetch = true;


// create a stateful representation of the riddlesCtn
var riddlesCtn = document.getElementById("riddles-ctn"),
    riddlesCtnStatefulElement = new StatefulElement( riddlesCtn, 
        {
            state: "loading",
        },
        function( internalState, element ) {
            switch ( internalState.state ) {
                case "loading":
                    element.classList.remove( "loading", "data", "error" );
                    element.classList.add( "loading" );
                break;
                
                case "error":
                    element.classList.remove( "loading", "data", "error" );
                    element.classList.add( "error" );
                break;
                
                case "data":
                    element.classList.remove( "loading", "data", "error" );
                    element.classList.add( "data" );

                    riddleTitleText.innerHTML = `${ internalState.data.title }`;
                    riddleText.innerHTML = `${ internalState.data.question }`;
                    riddleAnswerText.innerHTML = `${ internalState.data.answer }`;
                break;
            }
        }
    );


// create a stateful representation of the answerCtn
var answerCtn = document.getElementById("answer"),
    answerCtnStatefulElement = new StatefulElement( answerCtn,
        {
            state: "not-show"
        },
        function( internalState, element ) {
            switch ( internalState.state ) {
                case "show":
                    element.classList.remove( "show", "not-show" );
                    element.classList.add( "show" );
                break;
                
                case "not-show":
                    element.classList.remove( "show", "not-show" );
                    element.classList.add( "not-show" );
                break;
            }
        }
    );



// create an interaction controller for the page
// the interaction controller allows the creation of complex interactions
// on a page such as: swipe-up, swipe-down
var appInteractionsController = new InteractionsController();



// swipe interactions

// swipe-right interaction on the riddles question to change riddles
appInteractionsController.register(
    {
        element: riddleText,
        interactionType: "swipe-right",
        startAction: function() {
            clearTimeout( swipeRightDebouncer );

            swipeRightDebouncer = setTimeout( function() {
                console.log("swipe right on riddles ctn");

                displayPreviousRiddle();
            }, 500 );
        },
        endAction: function() {
            null;
        }
    }
);

// swipe-left interaction on the riddles question to change riddles
appInteractionsController.register(
    {
        element: riddleText,
        interactionType: "swipe-left",
        startAction: function() {
            clearTimeout( swipeLeftDebouncer );

            swipeLeftDebouncer = setTimeout( function() {
                console.log("swipe left on riddles ctn");

                displayNextRiddle();
            }, 500 );
        },
        endAction: function() {
            null;
        }
    }
);


// numbered-clicks interactions

// single click interaction on the nextBtn to change riddles
appInteractionsController.register(
    {
        element: nextBtn,
        interactionType: "numbered-clicks",
        number: 1,
        clickAction: function() {
            console.log("next button clicked");

            displayNextRiddle();
        }
    }
);

// single click interaction on the previousBtn to change riddles
appInteractionsController.register(
    {
        element: previousBtn,
        interactionType: "numbered-clicks",
        number: 1,
        clickAction: function() {
            console.log("previous button clicked");

            displayPreviousRiddle();
        }
    }
);

// single click interaction on the showAnswerBtn to display a riddle's 
// solution
appInteractionsController.register(
    {
        element: showAnswerBtn,
        interactionType: "numbered-clicks",
        number: 1,
        clickAction: function() {
            if ( answerCtnStatefulElement.internalState.state == "not-show" ) {
                answerCtnStatefulElement.internalState = { state: "show" };
            } else {
                answerCtnStatefulElement.internalState = { state: "not-show" };
            }
        }
    }
);

// single click interaction on the retryBtn to reload riddles in case
// of a loading error at first
appInteractionsController.register(
    {
        element: retryBtn,
        interactionType: "numbered-clicks",
        number: 1,
        clickAction: function() {
            displayNextRiddle();
        }
    }
);



// keystroke interactions

// "left" arrow keystroke interaction to change riddles
appInteractionsController.register(
    {
        element: document.body,
        interactionType: "keystroke",
        keys: [ "left" ],
        keysAction: function() {
            alert("previous riddle keystroke");
        }
    }
);

// "right" arrow keystroke interaction to change riddles
appInteractionsController.register(
    {
        element: document.body,
        interactionType: "keystroke",
        keys: [ "right" ],
        keysAction: function() {
            alert("next riddle keystroke");
        }
    }
);

// "d" key keystroke interaction to download riddle in a file
appInteractionsController.register(
    {
        element: document.body,
        interactionType: "keystroke",
        keys: [ "d" ],
        keysAction: function() {
            alert("download riddle keystroke");
        }
    }
);

// "enter" arrow keystroke interaction to display riddle's solution
appInteractionsController.register(
    {
        element: document.body,
        interactionType: "keystroke",
        keys: [ "enter" ],
        keysAction: function() {
            if ( answerCtnStatefulElement.internalState.state == "not-show" ) {
                answerCtnStatefulElement.internalState = { state: "show" };
            } else {
                answerCtnStatefulElement.internalState = { state: "not-show" };
            }
        }
    }
);


// load the registered interactions on the page and their respective elements
appInteractionsController.loadRegisteredInteractions();



// the fetchRandomRiddle() function
// to randomly fetch riddles from the riddles API and return a promise resolving with
// that riddle data
async function fetchRandomRiddle() {
    // create a fetch request to the riddle API and convert to json on fetch
    var jsonData = await ( await fetch( "https://api.api-ninjas.com/v1/riddles", 
        {
            headers: {
                ['X-Api-Key']: 'LVZihaNmpUp6cWJJF60DpQ==9QcH2Nq1n88ozZf6'
            },
            signal: AbortSignal.timeout( 6000 )
        }
    ) ).json();

    // return the fetched data in json format
    return jsonData;
}


// the displayNextRiddle() function
// to initiate a riddle fetch from the API and to update the page's DOM with the data
// and to also display the next riddle in list of loaded riddle data if user
// already switched to a previous riddle
function displayNextRiddle() {

    // check if the user switched to a previous riddle( currentRiddleIndex < ( loadedRiddles.length - 1 ) )
    // will be true, 
    // if so, 
    // increment the currentRiddleIndex and display the riddle data according to the new index
    // else,
    // fetch a random riddle from the API, add it to the loaded list of riddles and display the riddle data
    if ( currentRiddleIndex < ( loadedRiddles.length - 1 ) ) {
        riddlesCtnStatefulElement.internalState = { state: "loading" };

        currentRiddleIndex++;

        currentRiddleData = loadedRiddles[ currentRiddleIndex ];

        riddlesCtnStatefulElement.internalState = { state: "data", data: currentRiddleData };

        createDownloadLink();

    } else {
        riddlesCtnStatefulElement.internalState = { state: "loading" };

        fetchRandomRiddle()
        .then( 
            function( json ) {
                if ( !( "error" in json ) ) {
                    var data = json[0];

                    riddlesCtnStatefulElement.internalState = { state: "data", data: data };

                    currentRiddleData = data;
                    loadedRiddles.push( data );
                    currentRiddleIndex = loadedRiddles.length - 1;

                    createDownloadLink();                    

                    if ( firstRiddleFetch ) {
                        firstRiddleFetch = false;
                    } else {
                        previousBtn.classList.remove("invalid");
                    }
                } else {
                    riddlesCtnStatefulElement.internalState = { state: "error" };
                }
            }
        )
        .catch(
            function( error ) {
                riddlesCtnStatefulElement.internalState = { state: "error" };
                console.log("an error occured", error );
            }
        )
    }
}


// the displayPreviousRiddle() function
// to display the previous riddle relative to the currentRiddleIndex
function displayPreviousRiddle() {
    // check if currentRiddleIndex is greater than zero, add update page with
    // riddle data relative to the riddle index
    if ( currentRiddleIndex > 0 ) {
        riddlesCtnStatefulElement.internalState = { state: "loading" };

        currentRiddleIndex--;

        currentRiddleData = loadedRiddles[ currentRiddleIndex ];

        riddlesCtnStatefulElement.internalState = { state: "data", data: currentRiddleData };

        createDownloadLink();

        if ( currentRiddleIndex == 0 ) {
            previousBtn.classList.add("invalid");
        }
    }
}



// the createDownloadLink() function
// to update the download link( or icon ) with the approprite file name and data
function createDownloadLink() {
    // create a random number between 0 and 9999 in order to append to the download
    // filename and prevent download "same-file" prompts by the browser
    var randNum = Math.random() * 10000;

    // create a binary representation( blob ) of the currentRiddleData in order for the data
    // to be storable in a file
    var downloadData = new Blob( 
        [ `title: ${ currentRiddleData.title } \nriddle: ${ currentRiddleData.question } \nanswer: ${ currentRiddleData.answer }` ],
        {
            type: "text/plain"
        }
    );


    // updating the download link with the filename with random number id and the 
    // url as the binary representation( blob ) of the riddle's data
    downloadLink.href = URL.createObjectURL( downloadData );
    downloadLink.download = `riddle-${ randNum }.txt`;
}


// kickstart the application by performing the first random fetch and page update 
displayNextRiddle();