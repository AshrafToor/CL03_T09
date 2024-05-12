function init() {
    d3.csv("Project-Data.csv").then(function(data) {
        var countryData = processData(data); // Process the data for the bar chart
        barChart(countryData); // Call the barChart function with the processed data
    });

    function processData(data) {
        var countryData = {}; // Object to store data by country
        data.forEach(function(d) {
            var year = +d.Year;
            var country = d.Country;
            var percentage = +d.Percentage;
            if (!countryData[year]) {
                countryData[year] = {};
            }
            countryData[year][country] = percentage;
        });
        return countryData;
    }

    function barChart(data) {
        var w = 1200; // Width of the SVG
        var h = 700; // Height of the SVG
        var padding = 40; // Padding
        var barWidth = (w - 2 * padding) / (12 * Object.keys(data).length); // Width of each bar with separation
		var color = d3.scaleOrdinal(d3.schemeCategory10);
		
        var svg = d3.select("#chart")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

        var yScale = d3.scaleLinear()
                       .domain([0, d3.max(Object.values(data).map(d => d3.max(Object.values(d))))]) // Domain based on max percentage
                       .range([h - padding, padding]);

        var xScale = d3.scaleBand()
                       .domain(d3.range(2012, 2023)) // Years
                       .range([padding, w - padding]);

        svg.selectAll(".bar")
           .data(Object.entries(data))
           .enter()
           .append("g")
           .attr("transform", function(d) { return "translate(" + xScale(+d[0]) + ",0)"; })
           .selectAll("rect")
           .data(function(d) { return Object.entries(d[1]); })
           .enter()
           .append("rect")
           .attr("x", function(d, i) { return xScale.bandwidth() / 12 * i + padding; })
           .attr("y", function(d) { return yScale(d[1]); })
           .attr("width", barWidth)
           .attr("height", function(d) { return h - padding - yScale(d[1]); })
          .attr("fill", function(d) { return color(d[0]); })
           .on("mouseover", function(event, d) { //A mouseover EventListener is attached to the rect element
				d3.select("#tooltip").remove();
				var xPosition = parseFloat(d3.select(this).attr("x")) +9; // Gets the current x-coordinate and converts it to float
				var yPosition = parseFloat(d3.select(this).attr("y")) -5; ; // Gets the current y-coordinate and converts it to float
				d3.select(this) //Selects current rect element
					.transition() //Applies a transition
					.duration(200) // Sets duration of transition to 200ms
					.attr("fill", "black"); // Fill the color to orange
				svg.append("text") // Appends a text element
				   .attr("id", "tooltip") // Sets id attr to tooltip
				   .attr("x", xPosition) //Tooltip the x-coordinate to xPosition
				   .attr("y", yPosition) //Tooltip the y-coordinate to yPosition
					.text( d[0] + ": " + d[1] + "%"); //Tooltip the text content of data
			})
			.on("mouseout", function() { // A mouseout EventListener is attached to the selected element
				d3.select(this) //Selects the current element
				  .transition() // Applies a transition
				  .duration(200) //Sets the duration of transition to 200ms
				  .attr("fill", function(d) { return color(d[0]); }); //Fills the color back to slategrey
				  d3.select("#tooltip").remove(); //Selects and removes the tooltip element
			});

        // Add X axis
        svg.append("g")
           .attr("transform", "translate(0," + (h - padding) + ")")
           .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        // Add Y axis
        svg.append("g")
           .attr("transform", "translate(" + padding + ",0)")
           .call(d3.axisLeft(yScale));
    }
}

window.onload = init;
