/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	//"instructions/instruct-1.html",
	//"instructions/instruct-2.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	//"instructions/instruct-1.html",
	//"instructions/instruct-2.html",
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/
var StroopExperiment = function() {

	var begin=function(){

		//psiTurk.recordTrialData({'condd':"simple_complex"                         
                       //});

		$('#button1').click(function(){
			document.getElementById("page1").style.display ="none";
			document.getElementById("page2").style.display ="block";
		});

		$('.change1').click(function(event){
			document.getElementById("page2").style.display ="none";			
			console.log(event.target.id.slice(-1));
			var idd1=event.target.id.slice(-1);
			psiTurk.recordTrialData({'phase':"question1",
                         'response1':idd1,
                       });
			document.getElementById("page3").style.display ="block";
		});

		$('#button2').click(function(){
			document.getElementById("page3").style.display ="none";
			document.getElementById("page4").style.display ="block";
		});	

		$('#button3').click(function(){
			document.getElementById("page4").style.display ="none";
			document.getElementById("page5").style.display ="block";
		});	
		$('.change2').click(function(event){
			document.getElementById("page5").style.display ="none";
			console.log(event.target.id.slice(-1));
			var idd2=event.target.id.slice(-1);
			psiTurk.recordTrialData({'phase':"question2",
                         'response2':idd2,
                       });
			currentview = new Questionnaire();
		});	
	};


	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');

	// Start the test
	begin();
};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
    );
});
