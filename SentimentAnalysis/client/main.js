import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session} from 'meteor/session';

import './main.html';

colors = ["#287D7D", "#5C832F","#DB9E36","#B9121B","#FF8598"];


Meteor.startup(function() {
     Session.set('candidateData', false); 
     Session.set("viewOption",1 );
     Session.set("hideElement", "none");
     Session.set("showElement", "none");
  }); 


Meteor.subscribe('candidateData', function(){
     //Set the reactive session as true to indicate that the data have been loaded
     Session.set('candidateData', true); 
  });

//On windowLoad
Template.VisUI.onCreated( function(){
	//have Candidates be the default view
	Session.set("viewOption", 1);

	//run a tracker function, to update view on change
	this.autorun(function(){
		if(Session.equals("viewOption", 0)){
			$(".content").html("");
			return Blaze.render(Template.candidateView, $(".content").get(0));
		}
		if (Session.equals("viewOption", 1)){
			$(".content").html("");
			return Blaze.render(Template.networkView, $(".content").get(0));
		}
	});
});

Template.networkAxis.helpers({
	Candidates: function(){
		return candidateCollection.find({},{
			sort: {colorNumber: 1}
		});
	}
});

Template.candidateAxis.helpers({
	Networks: function(){
		return networkCollection.find({},{
			sort: {colorNumber: 1}
		});
	}
});

//Toggle Event Handlers
Template.toggle.events({
	//If candidate button is clicked
	'click #candidateToggle': function(e,t){
		//toggle CSS Styles
		$('.active').toggleClass("active");
		$('#candidateToggle').addClass("active");
		
		//Set View Option to 0 -> Candidates
		Session.set("viewOption", 1);

	},
	//If network button is clicked
	'click #networkToggle': function(e,t){
		//toggle CSS Styles
		$('.active').toggleClass("active");
		$('#networkToggle').addClass("active");
		
		//Set View Option to 1 -> Networks
		Session.set("viewOption", 0);
	},
});

Template.candidateLegend.helpers({
	//return all candidates
	Candidate: function(){
		return candidateCollection.find({},{
			sort: {colorNumber: 1}
		});
	},
	color: function(){
		return colors[this.colorNumber];
	}
});

Template.networkLegend.helpers({
	//return all networks
	Network: function(){
		return networkCollection.find().fetch();
	},
	color: function(){
		return colors[this.colorNumber];

	}
});

var hiddenElements = [];

Template.networkLegend.events({
	'click .circle': function(e,t){
		var thisNetwork = this._id;
		$(this).toggleClass("active");

		if(!Session.equals(thisNetwork, true)){
			Session.set(thisNetwork, true);
			Session.set("hideElement", thisNetwork);
		}
		else{
			Session.set("showElement", thisNetwork);
			Session.set(thisNetwork, false);
		}
	}		
});

Template.candidateLegend.events({
	'click .circle': function(e,t){
		var thisCandidate = this._id;
		$(this).toggleClass("active");

		if(!Session.equals(thisCandidate, true)){
			Session.set(thisCandidate, true);
			Session.set("hideElement", thisCandidate);
		}
		else{
			Session.set("showElement", thisCandidate);
			Session.set(thisCandidate, false);
		}
	}
});


Template.d3Rendering.helpers({
	hideElement: function(e,t){
		var thisElement =  Session.get("hideElement");
		$('.'+ thisElement).fadeOut(200);
	},

	showElement: function(e,t){
		var thisElement =  Session.get("showElement");
		$('.' + thisElement).fadeIn(200);

	}
})

