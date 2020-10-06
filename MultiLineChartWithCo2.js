// Reference - https://observablehq.com/@d3/line-chart
var margin = {top: 100, right: 50, bottom: 10, left: 50},
    width = 1200- margin.left - margin.right,
    height = 700 - margin.top ;
var xscale;
var yscale;
var color;
const svg = d3.select("body")
    .append("svg")
    .attr("viewBox", [0, -10, width, height + 100]);
var map = {};
d3.csv("emissions.csv")
    .then((data) => {
        var subsetOfCountries = ["Afghanistan", "India", "United States", "Denmark", "Canada", "Singapore", "Saudi Arabia", "Poland", "Russia", "China", "Sri Lanka","New Zealand", "Australia", "Thailand", "Pakistan",
            "Turkey", "United Kingdom","Venezuela","Brazil","Austria"];
        subsetOfCountries.forEach((d)=>{
           map[d] = [];
        });
        data = data.filter(function(d) {
            if(subsetOfCountries.includes(d["Country"]))
            {
                map[d["Country"]].push([d["Year"], Number(d["Emissions.Type.CO2"])]);
                return subsetOfCountries.includes(d["Country"]);
            }
        });
        console.log(map);


        xscale = d3.scaleBand()
            .domain(data.map((data) => data["Year"]))
            .range([margin.left, width- margin.right]);

        yscale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Number(d["Emissions.Type.CO2"]))]).nice()
            .range([height - margin.bottom - 100, margin.top]);

        color = d3.scaleOrdinal()
            .domain(subsetOfCountries)
            .range(d3.schemeSet3);

        // x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom - 100})`)
            .call(d3.axisBottom(xscale).ticks(width / 13).tickSizeOuter(0));

        // y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yscale))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data["Emissions.Type.CO2"]));

         var line = d3.line()
            .x(d => xscale(d[0]) + 12)
            .y(d => yscale(d[1]));

        Object.keys(map).forEach((d, i)=>{
            svg.append("path")
                .datum(map[d])
                .attr("fill", "none")
                .attr("stroke", color(d))
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", d => line(d));
            console.log(i);
            var temp = 0;
            if(i >= 11)
                temp = 50;
            console.log(i +" "+temp);
            svg.append('rect')
                .attr('x', 10+ 100*(i%11))
                .attr('y', function(d, i){ return margin.top - 80 + temp;})
                .attr('width', 10)
                .attr('height', 10)
                .style('fill',color(d));

           svg.append('text')
                .attr('x', 10+ 100*(i%11))
                .attr('y', margin.top - 90 + temp)
                .text(d);

        });

    })
    .catch((error) => {
       console.error(error);
    });


