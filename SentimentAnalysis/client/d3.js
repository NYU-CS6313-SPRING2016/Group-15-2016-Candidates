import './main.html';
import './main.js';
import { Mongo} from 'meteor/mongo';

var colors = ["#287D7D", "#5C832F","#DB9E36","#B9121B","#FF8598"];

var yMargin = [50,175, 300, 425, 550];

Template.d3Rendering.onRendered( function(){
	var width = 1000;
	var height = 600;
	var padding = 100;

	var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

	var xScale = d3.time.scale()
		.range([padding/2, width - padding]);

	var yScale = d3.scale.linear()
		.range([padding, height - padding]);

	var sizeScale = d3.scale.linear()
				.range([200, 1000]);


	var arrangeY = d3.scale.linear()
			.domain([-1, 0, 1])
			.range([-30, 0, 30]);

	var svg = d3.select('#theVis')
		.attr("width", width)
		.attr("height", height);

	var shapePosition = 0;


	var myTool = d3.select("body")
                  .append("div")
                  .attr("class", "mytooltip")
                  .style("opacity", "0")
                  .style("display", "none");

	function networkView(candidate, y, color){

		var thisGroup = svg.append('g');

		var data = candidateCollection.findOne({_id: candidate}).tweets;

		data.forEach(function(d) {
        		d.date = parseDate(d.date);
    		});

		xScale.domain(d3.extent(data, function(d) { return d.date; }));
		sizeScale.domain(d3.extent(data, function(d){ return d.impact;}));

		var circles = thisGroup
			.selectAll("circle")
			.data(data)


		var theShape = d3.svg.symbol()
			.type(function(d){
				if(d.sentiment == "positive"){
					return "triangle-up";
				}
				else if(d.sentiment == "neutral"){
					return "circle";
				}
				else if(d.sentiment == "negative"){
					return "triangle-down";
				}
			})
			.size(function(d){
				return sizeScale(d.impact);
				});

		circles
			.enter()
			.append('path')
			.attr("d", theShape)
			.attr("class", function(d){
				return d.network;
			})
			//.attr('r', 25)
			.attr('transform', function(d, i){
					if(d.sentiment == "positive"){
						shapePosition = -1;
					}
					else if(d.sentiment == "neutral"){
						shapePosition = 0;
					}
					else if(d.sentiment == "negative"){
						shapePosition = 1;
					}

					return "translate(" + xScale(d.date) + "," + (y+ arrangeY(shapePosition)) + ")";


			})
			.attr("fill", function(d,i){
				var n = d.network;
				if(n == "ABCPolitics"){
					return colors[0];
				}
				if(n == "NBCPolitics"){
					return colors[1];
				}
				if(n == "CNNPolitics"){
					return colors[2];
				}
				if(n == "foxnewspolitics"){
					return colors[3];
				}
				else if(n == "BBCNewsUS")
					return colors[4];
			})
			.attr("opacity", 0.75)
			.attr("stroke", "#1c1c1e")
			.attr("stroke-opacity", 0.25)
		 	.on("mouseover", function(d){  //Mouse event
              			d3.select(this)
	                    myTool
	                      .transition()  //Opacity transition when the tooltip appears
	                      .duration(500)
	                      .style("opacity", "1")
	                      .style("display", "block")  //The tooltip appears
	                    myTool
	                      .html("" + d.text + "")
	                       .style("left", (d3.event.pageX - 125) + "px")
	                       .style("top", (d3.event.pageY) + "px") })
	               .on("mouseout", function(d){ //Mouse event
	               	d3.select(this)
	               	myTool
	               		.transition() //Opacity transition when the tooltip disappears
	               		.duration(200)
	               		.style("opacity", "0")
	               		.style("display", "none") //The tooltip disappears
	               });

	}

	function candidateView(candidate, color){

		var thisGroup = svg.append('g');

		var data = candidateCollection.findOne({_id: candidate}).tweets;

		data.forEach(function(d) {
        		d.date = parseDate(d.date);
    		});

		xScale.domain(d3.extent(data, function(d) { return d.date; }));
		sizeScale.domain(d3.extent(data, function(d){ return d.impact;}));

		var circles = thisGroup
			.selectAll("circles")
			.data(data)

		var thisY = d3.scale.linear()
			.domain([-1, 0, 1])
			.range([-30, 0, 30]);

		var theShape = d3.svg.symbol()
						.type(function(d){
							if(d.sentiment == "positive"){
								return "triangle-up";
							}
							else if(d.sentiment == "neutral"){
								return "circle";
							}
							else if(d.sentiment == "negative"){
								return "triangle-down";
							}
						})
						.size(function(d){
							return sizeScale(d.impact);
						});


		circles
			.enter()
			.append('path')
			.attr("class", candidate)
			.attr("d", theShape)
			//.attr('r', 25)
			.attr('transform', function(d, i){
					if(d.sentiment == "positive"){
						shapePosition = -1;
					}
					else if(d.sentiment == "neutral"){
						shapePosition = 0;
					}
					else if(d.sentiment == "negative"){
						shapePosition = 1;
					}

					var n = d.network;
					var ySetting;
					if(n == "ABCPolitics"){
						ySetting =  yMargin[0];
					}
					if(n == "NBCPolitics"){
						ySetting =  yMargin[1];
					}
					if(n == "CNNPolitics"){
						ySetting =  yMargin[2];
					}
					if(n == "foxnewspolitics"){
						ySetting =  yMargin[3];
					}
					else if(n == "BBCNewsUS"){
						ySetting =  yMargin[4];
					}

					return "translate(" + xScale(d.date) + "," + (ySetting + thisY(shapePosition)) + ")";

			})
			.attr("fill", colors[color])
			.attr("opacity", 0.75)
			.attr("stroke", "#1c1c1e")
			.attr("stroke-opacity", 0.25)
		 	.on("mouseover", function(d){  //Mouse event
              			d3.select(this)
	                    myTool
	                      .transition()  //Opacity transition when the tooltip appears
	                      .duration(200)
	                      .style("opacity", "1")
	                      .style("pointer-events", "auto")
	                      .style("display", "block")  //The tooltip appears
	                    myTool
	                      .html("" + d.text + "")
	                       .style("left", (d3.event.pageX) + "px")
	                       .style("top", (d3.event.pageY) + "px") })
	               .on("mouseout", function(d){ //Mouse event
	               	d3.select(this)
	               	myTool
	               		.transition() //Opacity transition when the tooltip disappears
	               		.duration(200)
	               		.style("pointer-events", "all")
	               		.style("opacity", "0")
	               		.style("display", "none") //The tooltip disappears
	               });

	}

	this.autorun(function(){
		//when data is loaded, start drawing them circles
	if(Session.equals("viewOption", 1)){
		if(Session.get("candidateData")){
			networkView("hClinton", 50,0);
			networkView("bSanders", 175,1);
			networkView("dTrump", 300,2);
			networkView("tCruz", 425, 3);
			networkView("jKasich", 550, 4);
		}
	}

	if(Session.equals("viewOption", 0)){
		if(Session.get("candidateData")){
			candidateView("hClinton", 0);
			candidateView("bSanders", 1);
			candidateView("dTrump", 2);
			candidateView("tCruz", 3);
			candidateView("jKasich", 4);
		}
		}

	});
});
