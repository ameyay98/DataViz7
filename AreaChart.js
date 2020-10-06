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
            .domain(data.map((data) => Number(data.Year)))
            .range([margin.left+20, width - margin.right]);

        yscale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Number(d["Emissions.Sector.Buildings"]))]).nice()
            .range([height - margin.bottom - 30, margin.top]);

        // x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom - 30})`)
            .call(d3.axisBottom(xscale).ticks(width / 13).tickSizeOuter(0));

        // y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left + 20},0)`)
            .call(d3.axisLeft(yscale))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data["Emissions.Sector.Buildings"]));
        var curve = d3.curveLinear;

        var area = d3.area()
            .curve(curve)
            .x(d => xscale(d["Year"]) + 12)
            .y0(yscale(0))
            .y1(d => yscale(Number(d["Emissions.Sector.Buildings"])));

        svg.append("path")
            .datum(data)
            .attr("fill", "steelblue")
            .attr("d", area);


        svg.append('text')
            .attr('x', margin.left + 300)
            .attr('y', margin.top - 30)
            .text("Area Chart For Emission by Building Sector in India");


    })
    .catch((error) => {
        console.error(error);
    });


