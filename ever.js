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
          //Annotations
  const annotations = [
    {note: {
        label: "of Infants who were receiving formula(or solids).",
        title: "More than Half",
        align: "left",
        wrap: 100,
        
      },
      connector: {
        end: "dot",        // Can be none, or arrow or dot
        type: "line",      // ?? don't know what it does
        lineType : "vertical",    // ?? don't know what it does
        endScale: 10     // dot size
      },
      color: ["#000000"],
      
      x: graphWidth/1.5,
      y: graphHeight/5.5,
      dy: -30,
      dx: graphWidth/4
    }
  ]
  // Add annotation to the baby chart
const makeAnnotations = d3.annotation()
.annotations(annotations);
 //Set the ranges and domains
 var x = d3.scaleTime()
 .domain(d3.extent(years, (d,i) => parseYears(d)))
 .range([ 0, graphWidth ]);  

var y = d3.scaleLinear()
 .domain([0,70])
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
// Add X axis label:
mainCanvas.append("text")
.attr("text-anchor", "end")
.attr("x", graphWidth)
.attr("y", graphHeight+50 )
.text("Year Of Birth");
// Add Y axis label:
mainCanvas.append("text")
.attr("text-anchor", "end")
.attr("x", 0)
.attr("y", -20 )
.text("Percentage% Of Babies")
.attr("text-anchor", "start")

//Add Percentages into Arrays
var ever_arr= nodes[0].percentages;
var ever_six_arr= nodes[1].percentages;
var ever_three_arr= nodes[2].percentages;

//Add the Exclusive 3months Line path
var everThreeLine = d3.line()
.x(function(d,i){return x(parseYears(years[i]))})
.y(function(d,i){ return y(d)})
mainCanvas.append("path")
.data([ever_three_arr])
.attr("class", "line everLine")
.attr("d", everThreeLine)  


//Add the Exclusive 6months Line path
var everSixLine = d3.line()
.x(function(d,i){return x(parseYears(years[i]))})
.y(function(d,i){ return y(d)})
mainCanvas.append("path")
.data([ever_six_arr])
.attr("class", "line sixLine")
.attr("d", everSixLine)  

//Add Title of the Exclusive Graph
mainCanvas.append("text")
// .attr("x", margin.right)
// .attr("y", margin.top -50)
.attr("x", 0 )
 .attr("y", -margin.bottom -20)
.text("Babies Ever Breastfed From 2012 to 2019")
.style("font-size", "20px").attr("alignment-baseline","middle")
.style("opacity", 0.0)
                .transition()
                               .duration(1000)
                               .style("opacity", (d, i) => i+0.7)

//Add Color Legends
mainCanvas.append("circle")
.attr("cx",graphHeight+margin.left)
.attr("cy",130)
.attr("r", 6).style("fill", "#798BBC")
mainCanvas.append("circle")
.attr("cx",graphHeight+margin.left)
.attr("cy",160).attr("r", 6)
.style("fill", "#a1d99b")

mainCanvas.append("text")
.attr("x", graphHeight+margin.left+20)
.attr("y", 130).text("For 3 months").style("font-size", "15px").attr("alignment-baseline","middle")
mainCanvas.append("text")
.attr("x", graphHeight+margin.left+20)
.attr("y", 160).text("For 6 months").style("font-size", "15px").attr("alignment-baseline","middle")     



//Add Circles on the formula line at 2 days 
mainCanvas.selectAll("circles")
.data(ever_three_arr)
.enter()
.append("circle")
.attr("class", "Ever")
.attr("cx", (d,i)=>x(parseYears(years[i])))
.attr("cy", (d)=>y(d))
.attr("r", 5)
//Add Circles on the 6 months
const six_circles = mainCanvas.append("g");
six_circles.selectAll("circles")
.data(ever_six_arr)
.enter()
.append("circle")
.attr("class", "Six_Months")
.attr("cx", (d,i)=>x(parseYears(years[i])))
.attr("cy", (d)=>y(d))
.attr("r", 5)


 //Annotations
 mainCanvas.append("g")
 .attr("class", "annotation-group")
 .call(makeAnnotations)
 .transition().duration(1000)
 .style("opacity", 1)
 .transition().duration(5000).
 style("opacity", 0)
}
 init();
        