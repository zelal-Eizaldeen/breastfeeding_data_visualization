const canvas = d3.select(".canva");

// add an svg element
const svg = canvas.append("svg")
            .attr("width", 1000)
            .attr("height", 1000);

const margin = {top:20, right:20, bottom:70, left:70};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

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
}

var mousemove = function(d,i,n){
    var type_fed=(d3.select(n[i]).attr("class"))

  tooltip.html(
    `<p> 
    <b>Type: </b>
    ${type_fed}
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
    {
        note: {
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

//Main Canvas
const mainCanvas = svg.append("g")
                      .attr("width", graphWidth / 2)
                      .attr("height", graphHeight / 2)
                      .attr("transform", `translate(${margin.left}, ${margin.right  + 160})`);

//Annotations
mainCanvas.append("g")
           .attr("class", "annotation-group").call(makeAnnotations);


//Define Tooltip
var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
           //Load csv file
async function init() {
    const data = await d3.csv('types_breastfeeding.csv');
    
    //Array of colors
    var legendColorsArray = ["#66c2a5", "#fc8d62", "#8da0cb","#e78ac3","#a6d854"]
    mColors.domain(data.map(d=>d.type))
            .range(legendColorsArray)
    //Parse data
    const years = Object.keys(data[0]);
    // const years=["2012","2013","2014","2015","2016","2017","2018","2019"]
    var parseYears =  d3.timeParse("%Y");
    var nodes = d3.range(data.length)
                    .map(function(d){
                         var clusters = new Array(3)
                        let i = +data[d].category_code,
                        r=data[d].total;
                     
                    d={
                        cluster:i,
                        radius: r,
                        type: data[d].type,
                        percentages:[
                            data[d]['2012'],data[d]['2013'],data[d]['2014'], data[d]['2015']
                            ,data[d]['2016'],data[d]['2017'], data[d]['2018'], data[d]['2019']
                            ],
                        x: Math.cos(d / data.length *2*Math.PI) *200 + graphWidth/2 + Math.random(), 
                        y: Math.sin(d / data.length *2*Math.PI) *200 + graphWidth/2 + Math.random(), 
                    
                    };

                    if(!clusters[i] || (r> clusters[i].radius)) clusters[i]=d;
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
    var ever_arr = nodes[0].percentages;
    var six_months_arr = nodes[1].percentages;
    var twelve_months_arr= nodes[2].percentages;
    var exclusive_arr= nodes[6].percentages;
    var formula_arr= nodes[7].percentages;

//Add the Formula Line path
var formulaLine = d3.line()
            .x(function(d,i){return x(parseYears(years[i]))})
            .y(function(d,i){ return y(d)})
            

path_formula=mainCanvas.append("path")
.data([formula_arr])
.attr("class", "line formulaLine")
.on("click", function() { window.open("formula.html"); }) // when clicked, opens window.
.attr("d", formulaLine)  
    


//Add the Exclusive Line path
var exclusiveLine = d3.line()
        .x(function(d,i){return x(parseYears(years[i]))})
        .y(function(d,i){ return y(d)})
var path_exclusive=mainCanvas.append("path")
.data([exclusive_arr])
.attr("class", "line exclusiveLine")
.attr("d", exclusiveLine)  
.on("click", function() { window.open("exclusive.html"); }); // when clicked, opens window.

//Add the Ever Line path
    var everLine = d3.line()
                .x(function(d,i){return x(parseYears(years[i]))})
                .y(function(d,i){ return y(d)})
    var path_ever = mainCanvas.append("path")
         .data([ever_arr])
         .attr("class", "line everLine")
         .attr("d", everLine) 
         .on("click", function() { window.open("https://publications.aap.org/view-large/10993082?autologincheck=redirected"); }); // when clicked, opens window with google.com.

//Add the Six Months Line path
 var sixLine = d3.line()
         .x(function(d,i){return x(parseYears(years[i]))})
         .y(function(d,i){ return y(d)})
var path_six=mainCanvas.append("path")
  .data([six_months_arr])
  .attr("class", "line sixLine")
  .attr("d", sixLine)  
  .on("click", function() { window.open("https://publications.aap.org/view-large/10993082?autologincheck=redirected"); }) // when clicked, opens window with google.com.
 
//Add the Twelve Months Line path
var twelveLine = d3.line()
.x(function(d,i){return x(parseYears(years[i]))})
.y(function(d,i){ return y(d)})
var path_twelve=mainCanvas.append("path")
.data([twelve_months_arr])
.attr("class", "line twelveLine")
.attr("d", twelveLine) 
.on("click", function() { window.open("https://publications.aap.org/view-large/10993082?autologincheck=redirected"); }); // when clicked, opens window with google.com.

//Add Title of the Ever Graph
mainCanvas.append("text")
.attr("x", margin.right).attr("y", margin.top -50)
.text("Babies Feeding Types From 2012 to 2019")
.style("font-size", "20px").attr("alignment-baseline","right")
var length = path_exclusive.node().getTotalLength();

  // This function will animate the path over and over again
function repeat(path) {
   var path=path;
 
    // Animate the path by setting the initial offset and dasharray and then transition the offset to 0
    path.attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
          .transition()
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .duration(3000)
         .on("end", () => setTimeout(repeat(path), 1000)); // this will repeat the animation after waiting 1 second
}
repeat(path_exclusive);
repeat(path_formula);
repeat(path_ever);   
repeat(path_six);
repeat(path_twelve); 
//Add Color Legends
const legendGroup = mainCanvas.append("g");


            //.attr("transform", `translate(${graphWidth + 100}, 30)`);
legendGroup.append("circle")
           .attr("cx",graphHeight+margin.left+100)
           .attr("cy",130).attr("r", 6)
           .style("fill", "#798BBC")
legendGroup.append("circle")
        .attr("cx",graphHeight+margin.left+100)
        .attr("cy",160).attr("r", 6)
        .style("fill", "#57B795")
legendGroup.append("circle")
.attr("cx",graphHeight+margin.left+100)
.attr("cy",190).attr("r", 6).style("fill", "#F97850")
legendGroup.append("circle")
.attr("cx",graphHeight+margin.left+100).attr("cy",220).attr("r", 6).style("fill", "#97D443")
legendGroup.append("circle")
.attr("cx",graphHeight+margin.left+100)
.attr("cy",250).attr("r", 6).style("fill", "#E072B6")


legendGroup.append("text")
            .attr("x", graphHeight+margin.left+120)
            .attr("y", 130)
            .text("Ever Breastfeeding")
            .style("font-size", "18px")
            .attr("alignment-baseline","middle")
            
legendGroup.append("text").attr("x", graphHeight+margin.left+120).attr("y", 160).text("For 6 months").style("font-size", "18px").attr("alignment-baseline","middle")
  
legendGroup.append("text").attr("x", graphHeight+margin.left+120).attr("y", 190).text("For 12 months").style("font-size", "18px").attr("alignment-baseline","middle")
   
legendGroup.append("text").attr("x", graphHeight+margin.left+120).attr("y", 220).text("Exclusive Breastfeeding").style("font-size", "18px").attr("alignment-baseline","middle")     
legendGroup.append("text").attr("x", graphHeight+margin.left+120).attr("y", 250).text("Formula").style("font-size", "18px").attr("alignment-baseline","middle")     




// mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",130)
// .attr("r", 6)

// mainCanvas.append("circle").attr("cx",graphHeight+margin.left)
// .attr("cy",160).attr("r", 6).style("fill", "#a1d99b")
// mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",190).attr("r", 6).style("fill", "#e0f1de")
// mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",220).attr("r", 6).style("fill", "#f03b20")
// mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",250).attr("r", 6).style("fill", "#2c7fb8")

// mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 130).text("Ever Breastfeeding").style("font-size", "15px").attr("alignment-baseline","middle")
// mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 160).text("For 6 months").style("font-size", "15px").attr("alignment-baseline","middle")     
// mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 190).text("For 12 months").style("font-size", "15px").attr("alignment-baseline","middle")   
// mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 220).text("Exclusive Breastfeeding").style("font-size", "15px").attr("alignment-baseline","middle")     
// mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 250).text("Formula").style("font-size", "15px").attr("alignment-baseline","middle")     

 //Add Circles on the formula line 
mainCanvas.selectAll("circles")
.data(formula_arr)
.enter()
.append("circle")
.attr("class", "Formula")
.attr("cx", (d,i)=>x(parseYears(years[i])))

.attr("cy", (d)=>y(d))
.attr("r", 5)
.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)


//Add Circles on the exclusive dots 
mainCanvas.selectAll("circles")
        .data(exclusive_arr)
        .enter()
        .append("circle")
        .attr("class", "Exclusive")
        .attr("cx", (d,i)=>x(parseYears(years[i])))
        .attr("cy", (d)=>y(d))
        .attr("r", 5)
        .on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)

        
//Add Circles on the ever line
mainCanvas.selectAll("circles")
        .data(ever_arr)
        .enter()
        .append("circle")
        .attr("class", "Ever")
        .attr("cx", (d,i)=>x(parseYears(years[i])))
        .attr("cy", (d)=>y(d))
        .attr("r", 5)
        .on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)

//Add Circles on the six months line 
mainCanvas.selectAll("circles")
        .data(six_months_arr)
        .enter()
        .append("circle")
        .attr("class", "Six_Months")
        .attr("cx", (d,i)=>x(parseYears(years[i])))
        .attr("cy", (d)=>y(d))
        .attr("r", 5)
        .on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)
//Add Circles on the six months line 
mainCanvas.selectAll("circles")
        .data(twelve_months_arr)
        .enter()
        .append("circle")
        .attr("class", "Twelve_Months")
        .attr("cx", (d,i)=>x(parseYears(years[i])))
        .attr("cy", (d)=>y(d))
        .attr("r", 5)
        .on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)
        }
init();