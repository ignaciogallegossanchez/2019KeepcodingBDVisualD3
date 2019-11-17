

function drawMapColorByPrice(data, tagName, xSize = 1000, ySize = 600) {

    const geoCenterMadrid = [-3.703521, 40.417007] 
    const scaleF = 130
    const mapStrokeColor = "#FFFFFF"

    const svg = d3
        .select(tagName)
        .append('svg')
        .style("width", xSize + 'px')
        .style("height", ySize + 'px');

    const colormap = svg
        .append('g')
        .attr('class','colormap')

    // GeoGenerator (with projection)
    var projection = d3.geoMercator()
        .scale(xSize * scaleF)
        .center(geoCenterMadrid)
        .translate([xSize/2,ySize/2])
    var geoGenerator = d3.geoPath()
        .projection(projection);
          
    // Get AvgPrice information
    var allAveragePrices =data.features.map(obj => obj.properties.avgprice) 

    // Color Scheme (interpolateBlues)
    var colors = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0,d3.max(allAveragePrices)/2])

    // Generate map
    colormap
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', geoGenerator)
        .style('fill', nei => colors(nei.properties.avgprice))
        .attr('stroke',mapStrokeColor)
        .attr('stroke-width', "1")
        .attr('class', 'barrio')
        .on('mouseover', (d, i) => {
            // Update here barchart information
            drawBarChart(
                avgbedroomsToArrayByCartoID(data, d["properties"]["cartodb_id"]),
                "#barchart",
                d["properties"]["name"],
                "Nº habitaciones",
                "Nº propiedades")
        })

}
