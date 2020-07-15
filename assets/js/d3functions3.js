function render(data, worldData) {

    if(data !== undefined && data != null && data.length > 0 
        && worldData !== undefined && worldData != null && worldData.length > 0){

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
        const xScale = d3.scaleTime().domain(d3.extent(worldData, d => {
            //if(d.date != "2019-12-31"){
            return d3.timeParse("%Y-%m-%d")(d.date)
            //}
        }))

        var xAxis = xScale
        .range([0, width + worldData.length ]);    
        
        svg.append("g")
        .attr("transform", "translate("+margin+"," + height + ")")
        .call(d3.axisBottom(xAxis));

        var x = xScale
        .range([margin, width + worldData.length ]);


        // Y
        var y = d3.scaleLinear()
        .domain([0, d3.max(worldData, function(d) {
            var cases = parseInt(d.new_cases);
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
        .text("New Covid-19 Cases from Dec. 2019 to Jul. 2020");

        //Line
        var line = d3.line()
            .x(function(d) { 
                var ddate = "";
                //if(d.date != "2019-12-31"){
                ddate = d3.timeParse("%Y-%m-%d")(d.date)
                //}                   
                return x(ddate);
            })
            .y(function(d) {
                var cases = parseInt(d.new_cases);
                var cases = cases < 0 ? 0: cases;
                return y(cases) 
            });

        var countryPth = svg
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

        var line2 = d3.line()
        .x(function(d) { 
            var ddate = "";
            //if(d.date != "2019-12-31"){
            ddate = d3.timeParse("%Y-%m-%d")(d.date)
            //}                   
            return x(ddate);
        })
        .y(function(d) {
            var cases = parseInt(d.new_cases);
            var cases = cases < 0 ? 0: cases;
            return y(cases) 
        });

        var worldPth = svg
        .append("path")            
        .datum(worldData)
        .attr("d", line2)
        .attr("class", "line2")
        .attr("fill", "none")
        .attr("stroke-width", 2);

        var lineLength = d3.select(".line2").node().getTotalLength();
        d3.selectAll(".line2")
        .attr("stroke-dasharray", lineLength + " " + lineLength)
        .attr("stroke-dashoffset", lineLength)
        .transition()
        .duration(2500)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);



        // Tooltip        
        var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

        var div2 = d3.select("body").append("div")	
        .attr("class", "tooltip2")				
        .style("opacity", 0);

        worldPth
        .on("mouseover", function(d) {        	
            div.transition()		
            .duration(200)		
            .style("opacity", .9);        		
            var htmlContent = "<div>World's Total Cases: <span>" + formatNumber(d3.sum(worldData, function(d) { return d.new_cases;})) + "</span><br/></div>";
            htmlContent += "<div>World's Population: <span>"  + formatNumber(worldData[0].population) + "</span><br/></div>";
            div.html(htmlContent)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
        })
        .on("mouseout", function(d) {		
            div.transition()		
            .duration(500)
            .style("opacity", 0);	
        });

        countryPth
        .on("mouseover", function(d) {        	
            div2.transition()		
            .duration(200)		
            .style("opacity", .9);        		
            var htmlContent2 = "<div>"+data[0].location+"'s Total Cases: <span>" + formatNumber(d3.sum(data, function(d) { return d.new_cases;})) + "</span><br/></div>";
            htmlContent2 += "<div>"+data[0].location+"'s Population: <span>"  + formatNumber(data[0].population) + "</span><br/></div>";
            div2.html(htmlContent2)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
        })
        .on("mouseout", function(d) {		
            div2.transition()		
            .duration(500)
            .style("opacity", 0);	
        });

    }
}