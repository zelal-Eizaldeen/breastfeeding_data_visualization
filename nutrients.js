const canvas = d3.select(".canva");

//add an svg element
const svg = canvas.append("svg")
            .attr("width", 1000 )
            .attr("height", 750);

const margin = {top: 60, right: 20, bottom: 70, left: 70};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;
// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(graphWidth, graphHeight) / 2 - margin.bottom
const mainCanvas = svg.append("g")
                .attr("width", graphWidth / 2)
                .attr("height",  graphHeight / 2)
                .attr("transform", `translate(${margin.left + 220},
                    ${margin.top + 220})`);
 // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  var highlight = function(d,i,n){
   
    console.log(d)
        // reduce opacity of all groups
        d3.selectAll(".bubbles").style("opacity", .05)
        // expect the one that is hovered
        d3.selectAll("."+d).style("opacity", 1)
      }
    
      // And when it is not hovered anymore
      var noHighlight = function(d){
        d3.selectAll(".bubbles").style("opacity", 1)
      }     
//Define ordinal scale  
const mColors = d3.scaleOrdinal(d3['schemeSet2']);

var formatComma = d3.format(",");

 //Define the Tooltip
 var div = d3.select("body").append("div")
 .attr("class", "tooltip")
 .style("opacity", 0);
             
   var mouseover = function(d,i,n){
    console.log(d)
     d3.select(n[i])
     .transition()
     .duration(100)
     .style("opacity", 0.5)
     .style("stroke-width", "1px")
   .style("stroke","black") ;
   div.transition()
         .duration(200)
         .style("opacity", 0.9)
         div.html(`
         <p> 
         <b>Component: </b>
         
         ${d.data["components"]}
         <br>
         <b>Percentage: </b>
         ${d.data["amount"]}%
         </p>
         `

         )
             .style("left", (d3.event.pageX+40) + "px")
             .style("top", (d3.event.pageY-140) + "px")
}

var mouseout = function(d,i,n) {
    d3.select(n[i])
    .transition()
    .duration(100)
    .style("opacity", 1)
    .style("stroke", "none"); 
 div.transition()
 .duration(500)
 .style("opacity", 0)

 
    }

    const annotations = [
        {
          note: {
            label: "provides around 40% of your baby's energy needs and helps them absorb calcium and iron",
            title: "37% Lactose",
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
          
          x: graphWidth/3,
          y: graphHeight/6,
          dy: 60,
          dx: 100
        }
      ]
         // Add annotation to the baby chart
         const makeAnnotations = d3.annotation()
         .annotations(annotations);
      
//outer-radius
const arcPath = d3.arc()
.outerRadius(190)
.innerRadius(100);

// shape helper to build arcs:
var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)
//Inspired by: https://stackoverflow.com/questions/50572762/how-do-i-read-a-csv-file-into-an-array-using-d3js-v5
function getCSVData() {
    d3.csv('Breastfeeding_Outcomes.csv', function(d){ 
        return d;

    }).then(drawPieChart);
}

getCSVData(); //call the asyn containing function
function drawPieChart(data){
    console.log(data)

    //Array of colors
var legendColorsArray = ["#66c2a5", "#fc8d62", "#8da0cb","#e78ac3","#a6d854"]
mColors.domain(data.map(d=>d.amount))
        .range(legendColorsArray)
// Compute the position of each group on the pie:
const pie = d3.pie()
   .sort(null) //no need to order each value 
   .value( data=>data.amount)
var data_ready = pie(d3.entries(data))
console.log(data_ready)
const angles = pie(data);//creating the actual angles.  Must



//Creating the actual paths and pie
const paths = mainCanvas.selectAll('path')
               .data(pie(data));

               mainCanvas.append("text")
               .text("Components Of Breast Milk")
               .attr("x", -100)
               .attr("y", -220 )
               .attr("font-size", 20)  
               .style("opacity", 0.0)
                .transition()
                               .duration(1000)
                               .style("opacity", (d, i) => i+0.7)
//Add DACA Title
// mainCanvas.append("text")
//             .attr("class", "pie-title")
//             // .attr("dy", "1%")
//             // .attr("dx", "10%")
//             .attr("x", 0 )
//             .attr("y", -margin.bottom -140)
//         .attr("font-size", 20)
//             .style("opacity", 0.0)
//             .transition()
//                 .duration(1000)
//                 .style("opacity", (d, i) => i+0.7)
//             .attr("text-anchor", "right")
//             .attr("fill", "#000000")
//             //DACA_Receipts_Since_Injunction_August_31_2018
//             .text("Components Of Breast Milk")
//Add DACA text
// mainCanvas.append("text")
//             .attr("class", "daca-text")
//             .attr("dy", ".85em")
//             .style("opacity", 0.0)
//             .transition()
//                 .duration(1000)
//                 .style("opacity", (d, i) => i+0.7)
//             .attr("text-anchor", "middle")
//             .attr("fill", "white")
//             .text("DACA")
//  mainCanvas
// .selectAll('mySlices')
// .data(data)
// .enter()
// .append('text')
// .text(function(d){ return d.components})
// .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
// .style("text-anchor", "middle")
// .style("font-size", 17)



paths.enter()
   .append("path")
   .attr("class", "arc")
   .attr("d", arcPath)
   .attr("class", function(d) 
    { return "bubbles " + d.data["components"] })
    
   .attr("fill", d => mColors(d.data.amount))//make a color range!
   .attr("stroke", "#cde")
   .on("mouseover", mouseover)
   .on("mouseout", mouseout)


   .attr("stroke-width", 3)
   .transition()
   .duration(800)
   .attrTween("d", arcAnimation)
   
  
   
// Add one dot in the legend for each name.
const legendGroup = svg.append("g")
var size = 20
var allgroups = ["Lactose", "Fat", "Protein", "Minerals"]
legendGroup.selectAll("myrect")
  .data(allgroups)
  .enter()
  .append("circle")
    .attr("cx", graphHeight+margin.left+100)
    .attr("cy", function(d,i){ return 150 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d){  return mColors(d)})
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

// Add labels beside legend dots
legendGroup.selectAll("mylabels")
.data(allgroups)
.enter()
.append("text")
  .attr("x", graphHeight+margin.left+120)
  .attr("y", function(d,i){ return 150 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
  .style("fill", function(d){ return mColors(d)})
  .text(function(d){ return d})
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")
  .on("mouseover", highlight)
  .on("mouseleave", noHighlight)



  //Annotations
mainCanvas.append("g")
.attr("class", "annotation-group")
.call(makeAnnotations)
.transition().duration(2000).delay(500)
                      .style("opacity", 1);



}


//Creating an animation for our angles and arcs
const arcAnimation = (d) => {
    //This is for the enterAnimation or Tweening
    var i = d3.interpolate(d.endAngle, d.startAngle);

    return function(t){ //pass our ticker t (0-1)
        d.startAngle = i(t); //at t=0 start angle is 0 - nothing is being shown
        return arcPath(d);
    }
}