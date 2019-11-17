
function drawBarChart(data, tagName, title = "", xLabel = "", yLabel = "", xSize = 800, ySize = 500) {
    
    const margin = 50;
    
    const width  = xSize - 2 * margin;
    const height = ySize - 2 * margin;

    xMax = d3.max(data, d => d[0])
    yMax = d3.max(data, d => d[1])

    d3.select(tagName).select("svg").remove();

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
        .scaleBand()
        .domain(data.map(d => d[0]))
        .range([0, width])

    // Y-Axis
    chart.append('g')
        .call(d3
            .axisLeft(yScale));
    
    // X-Axis
    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3
            .axisBottom(xScale)
            .ticks(data.length));

    // Bar-Chart
    chart.selectAll()
        .data(data)
        .enter()
        .append('rect')
        .attr('x', s => margin + xScale(s[0]))
        .attr('y', s => yScale(s[1]))
        .attr('height', (s) => height - yScale(s[1]))
        .attr('width', -(2*margin) + xScale.bandwidth())

    // Grid
    chart.append('g')
        .attr('class', 'grid')
        .call(d3
           .axisLeft()
           .scale(yScale)
           .tickSize(-width, 0 , 0)
           .tickFormat(''))

    // Title
    svg.append('text')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yLabel)

    // Axis-Labels
    svg.append('text')
        .attr('x', width/2 + margin)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .text(title)
    svg.append('text')
        .attr('x', width / 2 + margin)
        .attr('y', margin + 40 + height)
        .attr('text-anchor', 'middle')
        .text(xLabel)
            
}

