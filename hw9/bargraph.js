/* Bar Graph stuff */   
var marginBar = {top: 20, right: 20, bottom: 20, left: 55};
var widthBar = 500 - marginBar.left - marginBar.right;
var heightBar = 500 - marginBar.top - marginBar.bottom;

/* Setting the range for X */
var xBar = d3.scale.linear()
.range([0, widthBar]);

/* Setting the range for Y */
var yBar = d3.scale.ordinal()
.rangeRoundBands([heightBar, 0], .1);

/* Creating the X Axis */
var xAxisBar = d3.svg.axis()
.scale(xBar)
.orient("bottom");

/* Creating the Y Axis */
var yAxisBar = d3.svg.axis()
.scale(yBar)
.orient("left");

/* Creating an SVG canvas */
var svgBar = d3.select(".bargraph").append("svg")
.attr("width", widthBar + marginBar.left + marginBar.right)
.attr("height", heightBar + marginBar.top + marginBar.bottom)
.append("g")
.attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

// add the tooltip area to the webpage
var tooltipBar = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


//load data
d3.csv("cereal.csv", function(error, data){

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Calories = +d.Calories;
    // console.log(d.Calories);
  });

  //getting mean values for each manufacturer
  window.meanData = d3.nest()
  	.key(function(d){return d.Manufacturer;})
  	.rollup(function(v){return d3.mean(v, function(d){ if(d.Calories>=0) {return d.Calories;} }); })
  	.entries(data);

  meanData.forEach(function(d){
  	d.Manufacturer = d.key;
  	d.Calories = d.values;
  	console.log(d.Manufacturer + " " + d.Calories);
  });


  //mapping each axis
  xBar.domain([0, d3.max(meanData, function(d){ return d.Calories; })]);
  yBar.domain(meanData.map(function(d){ return d.Manufacturer; }));

  // x-axis
  svgBar.append("g")
  	.attr("class", "x axis")
  	.attr("fill", "white")
   	.attr("transform", "translate(0," + heightBar + ")")
  	.call(xAxisBar)
  	.append("text")
      .attr("class", "label")
      .attr("x", widthBar)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Avg Cals");

  // y-axis
  svgBar.append("g")
      .attr("class", "y axis")
      .attr("fill", "white")
      .call(yAxisBar);

  //draw bars
  svgBar.selectAll(".bar")
  .data(meanData)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", 2)
  .attr("width", function(d) { return xBar(d.Calories); })
  .attr("y", function(d) { return yBar(d.Manufacturer); })
  .attr("height", yBar.rangeBand())
  .attr("fill", function(d){ return color(cValue(d));})
  .on("click", function(d){
  	d3.selectAll(".dot")
  	.data(data)
  	.transition()
  	.duration(500)
  	.delay(5)
  	.style("opacity", function(e){
  		if(e.Manufacturer != d.Manufacturer){
  			return 0.25
  		}
  		else{ return 1; }

  	});
  });

});