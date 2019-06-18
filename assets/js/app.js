// @TODO: YOUR CODE HERE!

var svgWidth = 900;
var svgHeight = 700;

var margin = {
  top: 30,
  right: 30,
  bottom: 65,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
//# class . id
  .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("font-family","sans-serif")
  .attr("font-size",15)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// for function to adjust the size of the circle.  530 circle radius 5 or 10
// active text - > a text active/inactive x
//https://observablehq.com/@d3/scatterplot



// Import Data
d3.csv("assets/data/data.csv")
  .then(function(data) {

    // columns
    //id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh  

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.age = +d.age;
      d.income = +d.income;
      d.healthcare = +d.healthcare;
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
    });
    console.log(data);
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty)-3, d3.max(data, d => d.poverty)+3])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.healthcare)-3, d3.max(data, d => d.healthcare)+3])
      .range([height, 0]);
      

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", "0.5");

    var circlesLabel = chartGroup.append("text")
    .selectAll("tspan").data(data)
    .enter()
    .append("tspan").classed("stateText", true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare-0.25))
    .text(function(d) {
        return d.abbr}
        );

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([30, -90])
      .style("width",'150px')
      .style("height",'auto')
      .style("color",'white')
      .style("text-align",'center')
      .style("background", 'black')
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
      // onmouseout event
      .on("mouseout", function(d, index) {
        toolTip.hide(d);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  });
