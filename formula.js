
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
 //Set the ranges and domains
 var x = d3.scaleTime()
 .domain(d3.extent(years, (d,i) => parseYears(d)))
 .range([ 0, graphWidth ]);  

var y = d3.scaleLinear()
 .domain([0,50])
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
var formula_six_arr= nodes[5].percentages;
var formula_2d_arr= nodes[6].percentages;
var formula_3m_arr= nodes[7].percentages;
//Add the Formula Line path
var formulaSixLine = d3.line()
.x(function(d,i){return x(parseYears(years[i]))})
.y(function(d,i){ return y(d)})
var path_formula_six = mainCanvas.append("path")
.data([formula_six_arr])
.attr("class", "line formulaLine")
.attr("d", formulaSixLine)  
.on("click", function() { window.open("https://www.cdc.gov/breastfeeding/data/nis_data/results.html"); }) // when clicked, opens window 
 // Get the length of the path, which we will use for the intial offset to "hide"
  // the graph
var length = path_formula_six.node().getTotalLength();

// This function will animate the path over and over again
function repeat(path) {
    // Animate the path by setting the initial offset and dasharray and then transition the offset to 0
    path.attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
          .transition()
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .duration(3000)
        //   .on("end", () => setTimeout(repeat, 1000)); // this will repeat the animation after waiting 1 second
}
repeat(path_formula_six)
//Add the Formula Two Line path
var formulaTwoLine = d3.line()
.x(function(d,i){return x(parseYears(years[i]))})
.y(function(d,i){ return y(d)})
var path_formula_two=mainCanvas.append("path")
.data([formula_2d_arr])
.attr("class", "line formulaTwoLine")
.attr("d", formulaTwoLine)  
.on("click", function() { window.open("https://www.cdc.gov/breastfeeding/data/nis_data/results.html"); }); // when clicked, opens window 
// Get the length of the path, which we will use for the intial offset to "hide"
  // the graph
  length = path_formula_two.node().getTotalLength();
  repeat(path_formula_two);
//Add the Formula Two Line path
var formulaThreeLine = d3.line()
.x(function(d,i){return x(parseYears(years[i]))})
.y(function(d,i){ return y(d)})
var path_formula_three=mainCanvas.append("path")
.data([formula_3m_arr])
.attr("class", "line formulaThreeLine")
.attr("d", formulaThreeLine)  
.on("click", function() { window.open("https://www.cdc.gov/breastfeeding/data/nis_data/results.html"); }); // when clicked, opens window 
// Get the length of the path, which we will use for the intial offset to "hide"
  // the graph
  length = path_formula_three.node().getTotalLength();
  repeat(path_formula_three);

//Add Title of the Ever Graph
mainCanvas.append("text")
.attr("x", margin.right).attr("y", margin.top -50)
.text("Babies Supported With Formula From 2012 to 2019")
.style("font-size", "20px").attr("alignment-baseline","middle")

//Add Color Legends
mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",130).attr("r", 6).style("fill", "#75c0f3")
mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",160).attr("r", 6).style("fill", "#5894bb")
mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",190).attr("r", 6).style("fill", "#2c7fb8")

mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 130).text("At 2 Days").style("font-size", "15px").attr("alignment-baseline","middle")
mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 160).text("At 3 months").style("font-size", "15px").attr("alignment-baseline","middle")     
mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 190).text("At 6 months").style("font-size", "15px").attr("alignment-baseline","middle")   

//Add Circles on the formula line 
mainCanvas.selectAll("circles")
.data(formula_six_arr)
.enter()
.append("circle")
.attr("class", "formulaCircle")
.attr("cx", (d,i)=>x(parseYears(years[i])))
.attr("cy", (d)=>y(d))
.transition()
.delay(2000)
.attr("r", 5)

//Add Circles on the formula line at 2 days 
mainCanvas.selectAll("circles")
.data(formula_2d_arr)
.enter()
.append("circle")
.attr("class", "formulaTwoCircle")
.attr("cx", (d,i)=>x(parseYears(years[i])))
.attr("cy", (d)=>y(d))
.transition()
.delay(2000)
.attr("r", 5)
//Add Circles on the formula line at 3months

mainCanvas.selectAll("circles")
.data(formula_3m_arr)
.enter()
.append("circle")
.attr("class", "formulaThreeCircle")
.attr("cx", (d,i)=>x(parseYears(years[i])))
.transition()
.delay(2000)
.attr("cy", (d)=>y(d))
.attr("r", 5)


}
 init();
        