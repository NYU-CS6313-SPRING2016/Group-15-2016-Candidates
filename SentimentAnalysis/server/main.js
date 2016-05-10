import { Meteor } from 'meteor/meteor';

//On Meteor Start
Meteor.startup(function(){
//Check to see if Database already exists to prevent duplication
  if(!migration.findOne({name:"Candidates Loaded"})){
  //initialize all 5 candidates
	  candidateCollection.insert({
	  	firstName:"Hillary",
	  	lastName:"Clinton",
	  	image:"/img/Clinton.jpg",
	  	_id:"hClinton",
	  	colorNumber: 0,
	  	tweets:[]
	  });
	  candidateCollection.insert({
	  	firstName:"Bernie",
	  	lastName:"Sanders",
	  	image:"/img/Sanders.jpg",
	  	_id:"bSanders",
	  	colorNumber: 1,
	  	tweets:[]
	  });
	   candidateCollection.insert({
	  	firstName:"Donald",
	  	lastName:"Trump",
	  	image:"/img/Trump.jpg",
	  	_id:"dTrump",
	  	colorNumber: 2,
	  	tweets:[]
	  });
	      candidateCollection.insert({
	  	firstName:"Ted",
	  	lastName:"Cruz",
	  	image:"/img/Cruz.jpg",
	  	_id:"tCruz",
	  	colorNumber: 3,
	  	tweets:[]
	  });
	  candidateCollection.insert({
	  	firstName:"John",
	  	lastName:"Kasich",
	  	image:"/img/Kasich.jpg",
	  	_id:"jKasich",
	  	colorNumber: 4,
	  	tweets:[]
	  });
	  //Let Meteor know data is loaded
	  migration.insert({ name: "Candidates Loaded"});
	  console.log("Candidates Loaded");
  }

  	//repeat process for networks
    if(!migration.findOne({name:"Networks Loaded"})){
	  networkCollection.insert({
		name:"ABC",
	  	image:"/img/networks/abc.png",
	  	_id:"ABCPolitics",
	  	colorNumber: 0,
	  });
	  networkCollection.insert({
		name:"BBC",
	  	image:"/img/networks/bbc.png",
	  	_id:"BBCNewsUS",
	  	colorNumber: 1,
	  });
	  networkCollection.insert({
		name:"CNN",
	  	image:"/img/networks/cnn.png",
	  	_id:"CNNPolitics",
	  	colorNumber: 2,
	  });
	  networkCollection.insert({
		name:"Fox News",
	  	image:"/img/networks/fox.png",
	  	_id:"foxnewspolitics",
	  	colorNumber: 3,
	  });
	  networkCollection.insert({
		name:"NBC",
	  	image:"/img/networks/msnbc.png",
	  	_id:"NBCPolitics",
	  	colorNumber: 4,
	  });
 
  //Let Meteor know data is loaded
  migration.insert({ name: "Networks Loaded"});
  console.log("Networks Loaded");
  }

  //Parse in the JSON Stuff
  if(!migration.findOne({name:"Tweets Loaded"})){
  	JSON.parse(Assets.getText('Clinton.json')).forEach(function(it){
  		candidateCollection.update(
  			{_id:"hClinton"}, 
  			{$push: {tweets: it}}

  		);
  	});
  	JSON.parse(Assets.getText('Sanders.json')).forEach(function(it){
  		candidateCollection.update(
  			{_id:"bSanders"}, 
  			{$push: {tweets: it}}

  		);
  	});
  	JSON.parse(Assets.getText('Trump.json')).forEach(function(it){
  		candidateCollection.update(
  			{_id:"dTrump"}, 
  			{$push: {tweets: it}}

  		);
  	});
  	JSON.parse(Assets.getText('Cruz.json')).forEach(function(it){
  		candidateCollection.update(
  			{_id:"tCruz"}, 
  			{$push: {tweets: it}}

  		);
  	});
  	JSON.parse(Assets.getText('Kasich.json')).forEach(function(it){
  		candidateCollection.update(
  			{_id:"jKasich"}, 
  			{$push: {tweets: it}}

  		);
  	});

  	migration.insert({ name: "Tweets Loaded"});
  	console.log("Tweets Loaded");
  }
});

    Meteor.publish('candidateData', function(){
        return candidateCollection.find();

    });




