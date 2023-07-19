const canvas = d3.select(".canva");

// add an svg element
const svg = canvas.append("svg")
            .attr("width", 1000)
            .attr("height", 1000);

const margin = {top:20, right:20, bottom:70, left:70};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

//Main Canvas
const mainCanvas = svg.append("g")
                      .attr("width", graphWidth / 2)
                      .attr("height", graphHeight / 2)
                      .attr("transform", `translate(${margin.left}, ${margin.right  + 160})`);


//Load csv file
async function init() {
    const data = await d3.csv('types_breastfeeding.csv');
    //Parse data
    const years = Object.keys(data[0]);
    // const years=["2012","2013","2014","2015","2016","2017","2018","2019"]
    var parseYears =  d3.timeParse("%Y");
    var nodes = d3.range(data.length)
                    .map(function(d){
                    d={
                        type: data[d].type,
                        percentages:[
                            data[d]['2012'],data[d]['2013'],data[d]['2014'], data[d]['2015']
                            ,data[d]['2016'],data[d]['2017'], data[d]['2018'], data[d]['2019']
                            ],
                    };

                    return d;
          });//end nodes

 //Set the ranges and domains
 var x = d3.scaleTime()
 .domain(d3.extent(years, (d,i) => parseYears(d)))
 .range([ 0, graphWidth ]);  

var y = d3.scaleLinear()
 .domain([0,100])
 .range([graphHeight,0])

 // //Add Axes
 var xAxis = d3.axisBottom(x)
 .tickFormat(d3.timeFormat("%Y"));
var yAxis = d3.axisLeft(y);
mainCanvas.append("g")
.attr("transform", `translate(0, ${graphHeight})`)
.call(xAxis)

mainCanvas.append("g")
.call(yAxis);

//Add Percentages into Arrays
var exclusive_three_arr= nodes[3].percentages;
var exclusive_six_arr= nodes[4].percentages;
//Add the Exclusive 3months Line path
var exclusiveThreeLine = d3.line()
.x(function(d,i){return x(parseYears(years[i]))})
.y(function(d,i){ return y(d)})
mainCanvas.append("path")
.data([exclusive_three_arr])
.attr("class", "line exclusiveThreeLine")
.attr("d", exclusiveThreeLine)  
.on("click", function() { window.open("https://www.cdc.gov/breastfeeding/data/nis_data/results.html"); }); // when clicked, opens window 


//Add the Exclusive 6months Line path
var exclusiveSixLine = d3.line()
.x(function(d,i){return x(parseYears(years[i]))})
.y(function(d,i){ return y(d)})
mainCanvas.append("path")
.data([exclusive_six_arr])
.attr("class", "line exclusiveLine")
.attr("d", exclusiveSixLine)  
.on("click", function() { window.open("https://www.cdc.gov/breastfeeding/data/nis_data/results.html"); }); // when clicked, opens window 

//Add Title of the Ever Graph
mainCanvas.append("text")
.attr("x", margin.right).attr("y", margin.top -50)
.text("Babies Exclusive Breastfed From 2012 to 2019")
.style("font-size", "20px").attr("alignment-baseline","middle")

//Add Color Legends
mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",130).attr("r", 6).style("fill", "#31a354")
mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",160).attr("r", 6).style("fill", "#f03b20")

mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 130).text("For 3months").style("font-size", "15px").attr("alignment-baseline","middle")
mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 160).text("For 6months").style("font-size", "15px").attr("alignment-baseline","middle")     



//Add Circles on the formula line at 2 days 
mainCanvas.selectAll("circles")
.data(exclusive_three_arr)
.enter()
.append("circle")
.attr("class", "exclusiveThreeCircle")
.attr("cx", (d,i)=>x(parseYears(years[i])))
.attr("cy", (d)=>y(d))
.attr("r", 5)
//Add Circles on the formula line at 3months

mainCanvas.selectAll("circles")
.data(exclusive_six_arr)
.enter()
.append("circle")
.attr("class", "exclusiveCircle")
.attr("cx", (d,i)=>x(parseYears(years[i])))
.attr("cy", (d)=>y(d))
.attr("r", 5)
}
 init();
        