
function drawPointChar(data, tagName, title = "", xLabel = "", yLabel = "", xSize = 1000, ySize = 600) {

    const margin = 50;
    
    const width  = xSize - 2 * margin;
    const height = ySize - 2 * margin;

    xMin = d3.min(data, d => d[1])
    xMax = d3.max(data, d => d[1])
    yMin = d3.min(data, d => d[2])
    yMax = d3.max(data, d => d[2])

    const svg = d3
        .select(tagName)
        .append('svg')
        .style("width", xSize + 'px')
        .style("height", ySize + 'px')

    const chart = svg
        .append('g')
        .attr('transform', `translate(${margin}, ${margin})`)
        .attr('width', width)
        .attr('height', height)

    const yScale = d3
        .scaleLinear()
        .domain([yMax, 0])
        .range([0, height])

    const xScale = d3
        .scaleLinear()
        .domain([0, xMax])
        .range([0, width])

    // Y-Axis
    chart.append('g')
        .call(d3
            .axisLeft(yScale));
    
    // X-Axis
    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3
            .axisBottom(xScale))

    // Add the Neighbour tooltip (hidden)
    var div = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Dot colors
    var colors = d3
        .scaleSequential(d3.interpolateTurbo)
        .domain([xMin,xMax])

    // Scatter
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => (margin + xScale(d[1])) )
        .attr("cy", d => (margin + yScale(d[2])) )
        .attr("r", 3)
        .style("fill", d => colors(d[1]))
        .style("stroke", "#000000")
        .style("stroke-width","1")
        .on('mouseover', function (d, i) {
            // Change color and size
            d3.select(this).transition()
                .duration('100')
                .attr("r", 5)
                .style("fill", "#FFFFFF")
                .style("stroke", "#000000")
                .style("stroke-width", "2")

            // Makes div-tooltip appear
            div.transition()
                .duration(100)
                .style("opacity", 1);

            // Put it on the current position
            div.html(d[0])
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 15) + "px");
        })
        .on('mouseout', function (d, i) {
            // Change again color and size to original one
            d3.select(this).transition()
                .duration('200')
                .attr("r", 3)
                .style("stroke-width", "1")
                .style("stroke","#000000")
                .style("fill", colors(d[1]));

            // Makes div-tooltip disappear
            div.transition()
                .duration('200')
                .style("opacity", 0);
        });


    // Title
    svg.append('text')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yLabel)

    // Axis - Labels
    svg.append('text')
        .attr('x', width/2 + margin)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .text(title)
    svg.append('text')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin + 40)
        .attr('text-anchor', 'middle')
        .text(xLabel)


    // Linear regression
    linearRegression = ss.linearRegression(data.map(d => [d[1], d[2]]))
    linearRegressionLine = ss.linearRegressionLine(linearRegression)

    svg.append("line")
    	.attr("class","regLine")
    	.attr("x1",margin + xScale(xMin))
    	.attr("x2",margin + xScale(xMax))
    	.attr("y1",margin + yScale(linearRegressionLine(xMin)))
    	.attr("y2",margin + yScale(linearRegressionLine(xMax)))

}