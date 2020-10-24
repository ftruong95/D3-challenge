var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var Group = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(smokerdata) {
    smokerdata.forEach(function(data) {
            data.age = +data.age
            data.smokes = +data.smokes
            data.state = data.state
            data.abbr = data.abbr
            });

    // Create Scale Function
        var xLinearScale = d3.scaleLinear()
            .domain([30, d3.max(smokerdata, d => d.age)])
            .range([1, width]);
    
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(smokerdata, d => d.smokes)])
            .range([height, 0]);

    // Create Axis Function
        var xaxis = d3.axisBottom(xLinearScale);
        var yaxis = d3.axisLeft(yLinearScale);
        Group.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xaxis);
        Group.append("g")
            .call(yaxis);

    // Create Circles for scatterplot
        var circles = Group.selectAll("circle")
            .data(smokerdata)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.age))
            .attr("cy", d => yLinearScale(d.smokes))
            .attr("r", "20")
            .attr("fill", "lightblue")
            .style("text-anchor", "middle")
            .attr("opacity", ".5");
        
        var circles = Group.selectAll()
            .data(smokerdata)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.age))
            .attr("y", d => yLinearScale(d.smokes))
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .style('fill', 'white')
            .text(d => (d.abbr));

    // Initialize Tooltip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>age  : ${d.age}%<br>smokes: ${d.smokes}%`);
    }); 
    
    // Create Tooltip 
        Group.call(toolTip);

    // Create Event Listeners 
        circles.on("click", function(data) {
            toolTip.show(data, this);
            d3.select(this).transition()
        })

    // On Mouse Event
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
                d3.select(this)
            });

    // Create Labels for Axes 
    Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 1.2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("font-family", "helvetica")
    .attr("font-size", "30px")
    .style('stroke', 'white')
    .text("Percentage of Smokers");
    

Group.append("text")
    .attr("transform", `translate(${width / 2.3}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .attr("font-family", "helvetica")
    .attr("font-size", "30px")
    .style('stroke', 'white')
    .text("Age");

    }).catch(function(error) {
            console.log(error);
    });