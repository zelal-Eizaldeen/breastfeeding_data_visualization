const canvas = d3.select(".canva");

// add an svg element
const svg = canvas.append("svg")
            .attr("width", 1000)
            .attr("height", 750);

            const margin = {top:20, right:20, bottom:70, left:70};
            const graphWidth = 600 - margin.left - margin.right;
            const graphHeight = 600 - margin.top - margin.bottom;

//Main Canvas
const mainCanvas = svg.append("g")
.attr("width", graphWidth / 2)
.attr("height", graphHeight / 2)
.attr("transform", `translate(${margin.left}, ${margin.right  + 160})`);

var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
var mouseover = function(d,i,n){
    console.log(d3.select(n[i]))
    d3.select(n[i])
    .transition()
    .duration(100)
    .style("opacity", 0.7);
  tooltip.transition()
       .duration(200)
       .style("opacity", 0.9)
}

var mousemove = function(d,i,n){
    // var type_fed=(d3.select(n[i]).attr("class"))

  tooltip.html(
    `<p> 
    <b>Type: </b>
  
    </br>
    </br>
    <b>Percentages: </b>
    ${d}%
    </p>
    
    `)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY)  +"px")
}
var mouseout = function(d,i,n) {
    tooltip
    d3.select(n[i])
    .transition()
    .duration(200)
    .style("opacity", 1);
    tooltip.transition()
    .duration(500)
    .style("opacity", 0)
    }

//Color
const mColors = d3.scaleOrdinal(d3['schemeSet2']);
//Annotations
const annotations = [
    {note: {
        label: "About 50% were exclusive breastfed throughout the period.",
        title: "Exclusive Breastfeeding",
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
      
      x: graphWidth,
      y: graphHeight/2.25,
      dy: 60,
      dx: graphWidth/5
    }
  ]
  // Add annotation to the baby chart
const makeAnnotations = d3.annotation()
.annotations(annotations);


 // Add x axis
 var x = d3.scaleLinear()
 .domain([0, 18])
 .range([0, graphWidth]);
mainCanvas.append("g")
.attr("transform", "translate(0," + graphHeight + ")")
.call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
     .domain([0, 100])
     .range([ graphHeight, 0]);
mainCanvas.append("g")
         .call(d3.axisLeft(y));
//Load data
         async function init() {
            const data = await d3.csv('age_breastfeeding.csv');

    var parseAge=d3.scaleLinear()
              .domain([0,400]).range([0,12])

            var nodes = d3.range(data.length)
            .map(function (d) {
  
                 d = {

                    Age: data[d].Child_Age,
                    Breastfeeding: data[d].Breastfeeding,
                    Exclusive_Breastfeeding:data[d].Exclusive_Breastfeeding
                   
                 };
                return d;
                
            }) //end nodes


//Add Percentages into Arrays
breastfed = []
exclusive = []
ages=[]
for (let i =0; i < nodes.length; i++ ){
   breastfed.push(nodes[i].Breastfeeding);
   exclusive.push(nodes[i].Exclusive_Breastfeeding)
   ages.push(nodes[i].Age)

}
//Add Circles on the exclusive dots 
var exclusive_circles = mainCanvas.selectAll("circle");
exclusive_circles.data(exclusive)
        .enter()
        .append("circle")
        .attr("class", "Exclusive")
.attr("cx", (d,i)=> x(parseAge(ages[i])))
.attr("cy", (d)=>y(d))
.attr("r", 5)
.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)
// //Add Circles on the ever line 
var ever_circles=mainCanvas.selectAll("circle");
ever_circles.data(breastfed)
.enter()
.append("circle")
.attr("class", "Ever")
.attr("cx", (d,i)=> x(parseAge(ages[i])))
.attr("cy", (d)=>y(d))
.attr("r", 5)
.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)

//Add any breastfeeding Line path
// var breastfedLine = d3.line()
// .x(function(d,i){ return x(parseAge(ages[i]))})
// .y(function(d,i){ return y(d)})
// path_any_breast= mainCanvas.append("path")
// .data([breastfed])
// .attr("class", "line everLine")
// .attr("d", breastfedLine)


//Add exclusive breastfeeding Line path
// var exclusiveLine = d3.line()
// .x(function(d,i){ return x(parseAge(ages[i]))})
// .y(function(d,i){ return y(d)})
// path_exclusive_breast= mainCanvas.append("path")
// .data([exclusive])
// .attr("class", "line exclusiveLine")
// .attr("d", exclusiveLine)
//var length = path_exclusive_breast.node().getTotalLength();





//This function will animate the path over and over again
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

// //repeat(path_any_breast)
//repeat(path_exclusive_breast)

const legendGroup = mainCanvas.append("g");
legendGroup.append("circle")
           .attr("cx",graphHeight+margin.left+100)
           .attr("cy",130).attr("r", 6)
           .style("fill", "#798BBC")
legendGroup.append("circle")
        .attr("cx",graphHeight+margin.left+100)
        .attr("cy",160).attr("r", 6)
        .style("fill", "#97D443")
 legendGroup.append("text")
        .attr("x", graphHeight+margin.left+120)
        .attr("y", 130)
        .text("Ever Breastfeeding")
        .style("font-size", "18px")
        .attr("alignment-baseline","middle")
legendGroup.append("text").attr("x", graphHeight+margin.left+120).attr("y", 160).text("Exclusive Breastfeeding").style("font-size", "18px").attr("alignment-baseline","middle")     






}




         init()

      
           
