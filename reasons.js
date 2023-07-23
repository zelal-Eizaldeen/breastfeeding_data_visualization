const canvas = d3.select(".canva");

// add an svg element
const svg = canvas.append("svg")
            .attr("width", 1000)
            .attr("height", 750);

            var padding = 1.5,
               clusterPadding = 16,
               maxRadius = 15;

const margin = {top:20, right:20, bottom:70, left:70};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;


//Define Tooltip
 var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

var mouseover = function(d,i,n){
    d3.select(n[i])
      .transition()
      .duration(100)
      .style("opacity", 0.7);
    tooltip.transition()
         .duration(200)
         .style("opacity", 0.9)

    tooltip.html(
        `<p> 
        <b>Factor: </b>
        ${d.base_type}
        </br>
        <b>Reason</b>
        ${d.problem}
        </br>
        <b>Percentages: </b>
        ${d.percentages}%
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
const mColors = d3.scaleOrdinal(d3['schemeSet2'])

//Main Canvas
const mainCanvas = svg.append("g")
                      .attr("width", graphWidth / 2)
                      .attr("height", graphHeight / 2)
                      .attr("transform", `translate(${margin.left}, ${margin.right  + 160})`);
//Annotations
const annotations = [
    {
        note: {
          label: "The most common reasons cited were coming from Cultural norms and lack of family support..",
          title: "Lifestyle Factors",
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
        
        x: graphWidth/2,
        y: graphHeight/2.6,
        dy: 70,
        dx: graphHeight-270

        // x: graphWidth/2/2/2/2,
        // y: graphHeight/2.25,
        // dy: -30,
        // dx: graphWidth/4
      }
    ]
    // Add annotation to the baby chart
 const makeAnnotations = d3.annotation()
 .annotations(annotations);
//Load csv file
async function init() {
    const data = await d3.csv('reasons.csv');

    var numberOfBaseTypeScale = d3.scaleOrdinal().domain(data.map(
        d=>d.category_code
    ))

    var distinctTypesScale = numberOfBaseTypeScale.domain().length;

    var clusters = new Array(distinctTypesScale);

    //Array of colors
    var legendColorsArray = ["#66c2a5", "#fc8d62", "#8da0cb","#e78ac3","#a6d854"]
    mColors.domain(data.map(d=>d.base_type))
            .range(legendColorsArray)
    var radiusScale = d3.scaleLinear()
                        .domain(d3.extent(data, function(d){
                            return +d.percentages;
                        }))
                        .range([10, maxRadius + 20]);
//Add title 
var title_g = mainCanvas.append("g");
title_g.append("text")
        .attr("x", 0 )
        .attr("y", -margin.bottom -20)
        .text("Percentage of Mothers Citing Reasons for Stopping Breastfeeding")
        .style("font-size", "20px").attr("alignment-baseline","right")
     // Add x axis
     var x = d3.scaleLinear()
    .domain([0, maxRadius])
    .range([ 0, graphWidth ]);
    mainCanvas.append("g")
    .attr("transform", "translate(0," + graphHeight + ")")
    .call(d3.axisBottom(x));

    // Add X axis label:
mainCanvas.append("text")
.attr("text-anchor", "end")
.attr("x", graphWidth)
.attr("y", graphHeight+50 )
.text("% of Mothers stopped");
    // Add Y axis
  var y = d3.scaleLinear()
          .domain([35, 100])
          .range([ graphHeight, 0]);

 // Add Y axis label:
 mainCanvas.append("text")
 .attr("text-anchor", "end")
 .attr("x", 0)
 .attr("y", -20 )
 .text("Factors")
 .attr("text-anchor", "start")
   mainCanvas.append("g")
              .call(d3.axisLeft(y));


    var nodes = d3.range(data.length)
                .map(function (d) {
                    let i = + data[d].category_code,
                    r=radiusScale(data[d].percentages);
                    d = {
                        cluster: i,
                        radius: r,
                        base_type: data[d].base_type,
                        problem: data[d].problems,
                        percentages:data[d].percentages,
                        x: Math.cos(d / data.length * 2 * Math.PI) * 200 + graphWidth / 2 + Math.random(),
                        y: Math.sin(d / data.length * 2 * Math.PI) * 200 + graphWidth / 2 + Math.random(),

                    };
                    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                    
                    return d;
                }) //end nodes

                var force = d3.forceSimulation()
                //Keep entire simulation balanced around screen center
                .force("center", d3.forceCenter(graphWidth/2, graphHeight/2))

                //Cluster by section
                .force("cluster", cluster()
                                  .strength(0.7)) 

                //apply collision with padding
                .force("collide", d3.forceCollide(d => d.radius + padding )
                    .strength(0.9))
                    .velocityDecay(0.4)
                .on("tick", layoutTick)
                    .nodes(nodes);       
       
 
        var node = mainCanvas.selectAll("circle")
                                .data(nodes)
                                .enter()
                                .append("circle")
                                .style("fill", function(d){
                                      return mColors(d.cluster / distinctTypesScale)
                                })
                                .on("mouseover", mouseover)
                                
                                .on("mouseout", mouseout)
                                .on("scroll", scroll)
                               
                                    .attr("class", function(d) 
                                    { return "bubbles " + d.base_type })
     

     
     
     // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
//   var highlight = function(d){
//     // reduce opacity of all groups
//     d3.selectAll(".bubbles").style("opacity", .05)
//     // expect the one that is hovered
//     d3.selectAll("."+d).style("opacity", 1)
//   }

//   // And when it is not hovered anymore
//   var noHighlight = function(d){
//     d3.selectAll(".bubbles").style("opacity", 1)
//   }     
        //Function tick
function layoutTick(e) {
    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.radius})
  }

      //Little animation
      node.transition()
      .duration(700)
      .delay(function(d, i) {
          return i * 5;
      })
      .attrTween("r", function(d){
           var i = d3.interpolate(9, d.radius);

           return function(t) { return d.radius = i(t)}
      });

      //Annotations
 mainCanvas.append("g")
 .attr("class", "annotation-group")
 .call(makeAnnotations)
 .transition().duration(2000).delay(500)
                       .style("opacity", 1);
//Add Color Legends
//Legends
const legendGroup = svg.append("g")

legendGroup.append("circle")
.attr("cx",graphHeight+margin.left+100)
.attr("cy",130).attr("r", 6).style("fill", "#F97850")



legendGroup.append("text")
.attr("x", graphHeight+margin.left+120)
.attr("y", 130).text("Lifestyle Factors").style("font-size", "18px").attr("alignment-baseline","middle")


legendGroup.append("text")
.attr("x", graphHeight+margin.left+120)
.attr("y", 160).text("Psychosocial Factors")
.style("font-size", "18px")
.attr("alignment-baseline","middle")


legendGroup.append("circle")
        .attr("cx",graphHeight+margin.left+100)
        .attr("cy",160).attr("r", 6)
        .style("fill", "#798BBC")

        legendGroup.append("circle")
        .attr("cx",graphHeight+margin.left+100)
        .attr("cy",190).attr("r", 6).style("fill", "#E072B6")
        
legendGroup.append("text")
.attr("x", graphHeight+margin.left+120)
.attr("y", 190).text("Nutritional Factors").style("font-size", "18px").attr("alignment-baseline","middle")     
legendGroup.
append("circle")
.attr("cx",graphHeight+margin.left+100)
.attr("cy",220).attr("r", 6)
.style("fill", "#57B795")


legendGroup.append("circle")
.attr("cx",graphHeight+margin.left+100)
.attr("cy",250).attr("r", 6).style("fill", "#97D443")


            
legendGroup.append("text")
.attr("x", graphHeight+margin.left+120)
.attr("y", 220).text("Lactational Factors")
.style("font-size", "18px").attr("alignment-baseline","middle")     

   
legendGroup.append("text")
.attr("x", graphHeight+margin.left+120)
.attr("y", 250).text("Medical Factors")
.style("font-size", "18px").attr("alignment-baseline","middle")     



  // Move d to be adjacent to the cluster node.
  function cluster() {
                
    var nodes,
        strength = 0.1;

    function force (alpha) {

        // scale + curve alpha value
        alpha *= strength * alpha;

        nodes.forEach(function(d) {
                var cluster = clusters[d.cluster];
            if (cluster === d) return;
        
          let x = d.x - cluster.x,
              y = d.y - cluster.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + cluster.radius;

        if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
        }
        });

    }

    force.initialize = function (_) {
        nodes = _;
    }

    force.strength = _ => {
        strength = _ == null ? strength : _;
        return force;
    };

    return force;

    }
    
}

init()