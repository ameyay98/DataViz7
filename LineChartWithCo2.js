// Reference - https://observablehq.com/@d3/line-chart
var margin = {top: 100, right: 50, bottom: 10, left: 50},
    width = 1200- margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;
var xscale;
var yscale;

const svg = d3.select("body")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv("emissions.csv")
    .then((data) => {
        data = data.filter(function(d){ return d["Country"] == "India";});
        console.log(data);


        xscale = d3.scaleBand()
            .domain(data.map((data) => data.Year))
            .range([margin.left, width - margin.right]);

        yscale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Number(d["Emissions.Type.CO2"]))]).nice()
            .range([height - margin.bottom - 30, margin.top]);

        // x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom - 30})`)
            .call(d3.axisBottom(xscale).ticks(width / 13).tickSizeOuter(0));

        // y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yscale))
            // .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data["Emissions.Type.CO2"]));

        var line = d3.line()
            .defined(d => !isNaN(d["Emissions.Type.CO2"]))
            .x(d => xscale(d["Year"]) + 11)
            .y(d => yscale(d["Emissions.Type.CO2"]));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        svg.append('text')
            .attr('x', margin.left + 300)
            .attr('y', margin.top - 30)
            .text("Line Chart For Emission of CO2  in India");

    })
    .catch((error) => {
       console.error(error);
    });


