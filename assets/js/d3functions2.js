function render(data) {

    if(data !== undefined && data != null && data.length > 0){

        var width = 500;
        var height = 650;
        var margin = 100;
        var labelXX = width - data.length/3 - margin/3;
        var labelXY = 700;
        var labelYX = margin/3;
        var labelYY = -(height + margin)/2;

        var svg = d3.select(".svg-container").append("svg")
        .attr("width", 800)
        .attr("height", 800);

        // X
        const xScale = d3.scaleTime().domain(d3.extent(data, d => {
            //if(d.date != "2019-12-31"){
            return d3.timeParse("%Y-%m-%d")(d.date)
            //}
        }))

        var xAxis = xScale
        .range([0, width + data.length ]);    
        
        svg.append("g")
        .attr("transform", "translate("+margin+"," + height + ")")
        .call(d3.axisBottom(xAxis));

        var x = xScale
        .range([margin, width + data.length ]);

        // Y
        var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            var cases = parseInt(d.new_deaths);
            var cases = cases < 0 ? 0: cases;
            return cases;
        })])
        .range([ height, margin ]);
        svg.append("g")
        .attr("transform", "translate("+margin+",0)")
        .call(d3.axisLeft(y));

        // X Axis Label
        svg.append("text")
        .attr("x", labelXX )
        .attr("y",  labelXY)
        .style("text-anchor", "middle")
        .text("Date");

        // Y Axis Label
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", labelYX)
        .attr("x", labelYY)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("New Covid-19 Death Cases from Dec. 2019 to Jul. 2020");


        var line = d3.line()
            .x(function(d) { 
                var ddate = "";
                //if(d.date != "2019-12-31"){
                ddate = d3.timeParse("%Y-%m-%d")(d.date)
                //}                   
                return x(ddate);
            })
            .y(function(d) {
                var cases = parseInt(d.new_deaths);
                var cases = cases < 0 ? 0: cases;
                return y(cases) 
            });

        // line
        var pth = svg
        .append("path")            
        .datum(data)
        .attr("d", line)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke-width", 2);

        var lineLength = d3.select(".line").node().getTotalLength();
        d3.selectAll(".line")
        .attr("stroke-dasharray", lineLength + " " + lineLength)
        .attr("stroke-dashoffset", lineLength)
        .transition()
        .duration(2500)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);


        // Tooltip        
        var div = d3.select("body").append("div")	
        .attr("class", "tooltip tooltip-default")				
        .style("opacity", 0);

        var dots = svg.selectAll("dot")	
        .data(data)
        .enter().append("circle")        
        .attr("class", "dots")
        .attr("r", 3)		
        .attr("cx", function(d) { return x(d3.timeParse("%Y-%m-%d")(d.date)); })		 
        .attr("cy", function(d) { return y(d.new_deaths); })
        .on("mouseover", function(d) {        	
            div.transition()		
            .duration(200)		
            .style("opacity", .9);
            var htmlContent = "<div>Country: <span>" + d.location + "</span><br/></div>";
            htmlContent += "<div>Date: <span>" + d3.timeFormat("%m-%d-%Y")(d3.timeParse("%Y-%m-%d")(d.date)) + "</span><br/></div>";
            htmlContent += "<div>Number of New Death: <span>"  + formatNumber(d.new_deaths) + "</span><br/></div>";
            htmlContent += "<div>Covid-19 Death Rate: <span>" + formatNumber(d.cvd_death_rate) + "</span><br/></div>";
            htmlContent += "<div>Handwashing Facilities: <span>" + formatNumber(d.handwashing_facilities) + "</span><br/></div>";
            htmlContent += "<div>Hospital Beds per Thousand: <span>" + formatNumber(d.hospital_beds_per_thousand) + "</span></div>";
            div.html(htmlContent)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
        })
        .on("mouseout", function(d) {		
            div.transition()		
            .duration(500)
            .style("opacity", 0);	
        });

        dots.attr("opacity", 0)
        .transition()
        .duration(2500)
        .ease(d3.easeLinear)
        .attr("opacity", 1)
        .attr("stroke-dashoffset", lineLength)

    }
}