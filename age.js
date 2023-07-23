const canvas = d3.select(".canva");
//Color
const mColors = d3.scaleOrdinal(d3['schemeSet2']);
//Array of colors
var legendColorsArray = ["#66c2a5", "#fc8d62", "#8da0cb","#e78ac3","#a6d854"]
//Tooltip
var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
const margin = {top:20, right:20, bottom:70, left:70};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

////Click Functions /////
var click_exclusive = function(d,i,n){
  console.log(d)
//   d3.select(n[i])
//   .transition()
//   .duration(100)
//   .style("opacity", 0.7);
// tooltip.transition()
//       .duration(200)
//       .style("opacity", 0.9)
}

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
///////Check Box////////
const ageCheckbox = document.querySelector("#age");
const typesCheckbox = document.querySelector("#types");
d3.selectAll(".region_cb").on("change", function ()
 {
  var type = this.value;
  if (this.checked && type=="age") { // adding data points
    typesCheckbox.checked=false;
    d3.select("svg").remove();
    init_age()
  }
  if (!this.checked && type=="age"){
    
    d3.select("svg").remove();
    

  }
  if (!this.checked && type=="types"){
    d3.select("svg").remove();

  }
  if (this.checked && type=="types") { // adding data points
    d3.select("svg").remove();
    ageCheckbox.checked=false;
    init_types()
   }
 });

////////Age Chart /////////////
async function init_age() {
  const data = await d3.csv('age_breastfeeding.csv');
  const svg = canvas.append("svg")
              .attr("width", 1000)
              .attr("height", 750)
   
  //Main Canvas
  const mainCanvas = svg.append("g")
  .attr("width", graphWidth / 2)
  .attr("height", graphHeight / 2)
  .attr("transform", `translate(${margin.left}, ${margin.right  + 160})`);


  //Annotations
  const annotations = [
      {note: {
          label: "Approximately 65% stopped breastfeeding when baby's age is 6 months.",
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
        
        x: graphWidth/2/2/2/2,
        y: graphHeight/2.25,
        dy: -30,
        dx: graphWidth/4
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
// Add X axis label:
mainCanvas.append("text")
.attr("text-anchor", "end")
.attr("x", graphWidth)
.attr("y", graphHeight+50 )
.text("Age Of Child (months)");
  // Add Y axis
  var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ graphHeight, 0]);
  mainCanvas.append("g")
            .call(d3.axisLeft(y));
   // Add Y axis label:
   mainCanvas.append("text")
   .attr("text-anchor", "end")
   .attr("x", 0)
   .attr("y", -20 )
   .text("Percentage%")
   .attr("text-anchor", "start")
  //Load data  
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
  //Add title 
  var title_g = mainCanvas.append("g");
  title_g.append("text")
          .attr("x", 0 )
          .attr("y", -margin.bottom -20)
          .text("Rates of Ever and Exclusive Breastfeeding by Age Among Children Born in 2019")
          .style("font-size", "20px").attr("alignment-baseline","right")
  
            //Add any breastfeeding Line path
            var breastfedLine = d3.line()
            .x(function(d,i){ return x(parseAge(ages[i]))})
            .y(function(d,i){ return y(d)})
            path_any_breast= mainCanvas.append("path")
            .data([breastfed])
            .attr("class", "line everLine")
            .attr("d", breastfedLine)
            
            
  //Add exclusive breastfeeding Line path
  var exclusiveLine = d3.line()
  .x(function(d,i){ return x(parseAge(ages[i]))})
  .y(function(d,i){ return y(d)})
  path_exclusive_breast= mainCanvas.append("path")
  .data([exclusive])
  .attr("class", "line exclusiveLine")
  .attr("d", exclusiveLine)
  var length = path_exclusive_breast.node().getTotalLength();
            //This function will animate the path over and over again
  function repeat(path) {
      // Animate the path by setting the initial offset and dasharray and then transition the offset to 0
      path.attr("stroke-dasharray", length + " " + length)
          .attr("stroke-dashoffset", length)
            .transition()
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .duration(1000)   
            
            // .on("end", () => setTimeout(repeat(path), 1000)); // this will repeat the animation after waiting 1 second
  
  }

repeat(path_any_breast)
repeat(path_exclusive_breast)
// //Add Circles on the ever circles 
var ever_g = mainCanvas.append("g");
ever_g.selectAll("circle")
        .data(breastfed)
        .enter()
        .append("circle")
        .attr("class", "Ever")
        .attr("cx", 0)
        .attr("cy", (d)=>y(d))
        .attr("r", 5)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout)
        .transition()
        .duration(1000)  
        // .delay(300) 
        .attr("cx", (d,i)=> x(parseAge(ages[i])))
        .attr("cy", (d)=>y(d))
            
 var exclusive_g = mainCanvas.append("g");
            //Add Circles on the exclusive dots 
            exclusive_g.selectAll("circle")
            .data(exclusive)
                    .enter()
                    .append("circle")
                    .attr("class", "Exclusive")
                    .attr("cx", 0)
                    .attr("cy", (d)=>y(d))
                    .attr("r", 5)
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseout", mouseout)

                    .transition()
                    .duration(1000)  
                    // .delay(100) 
                    .attr("cx", (d,i)=> x(parseAge(ages[i])))
                    .attr("cy", (d)=>y(d))


            const legendGroup = mainCanvas.append("g");
       legendGroup.append("circle")
                       .attr("cx",graphHeight+margin.left+100)
                       .attr("cy",130).attr("r", 6)
                       .style("fill", "#798BBC")
                       .style("cursor", "pointer")
            legendGroup.append("circle")
                    .attr("cx",graphHeight+margin.left+100)
                    .attr("cy",160).attr("r", 6)
                    .style("fill", "#57B795")
                    .style("cursor", "pointer")

            legendGroup.append("text")
                    .attr("x", graphHeight+margin.left+120)
                    .attr("y", 130)
                    .text("Ever Breastfeeding")
                    .style("font-size", "18px")
                    .attr("alignment-baseline","middle")
                    .attr("class", "underline")
                    .on("click", function() { window.open("ever.html"); }); // when clicked, opens window with google.com.
                    
            legendGroup.append("text")
            .attr("x", graphHeight+margin.left+120).attr("y", 160)
            .text("Exclusive Breastfeeding").style("font-size", "18px")
            .attr("alignment-baseline","middle")     
            .attr("class", "underline")
            .on("click", function() { window.open("exclusive.html"); }); // when clicked, opens window with google.com.


      
      //Annotations
            mainCanvas.append("g")
                       .attr("class", "annotation-group")
                       .call(makeAnnotations)
                       .transition().duration(2000).delay(500)
                       .style("opacity", 1);
}

//////////************ *////////////
////////Types Chart/////////////
async function init_types() {

const data = await d3.csv('types_breastfeeding.csv');
  // add an svg element
const svg = canvas.append("svg")
.attr("width", 1000)
.attr("height", 1000);

//Main Canvas
const mainCanvas = svg.append("g")
                      .attr("width", graphWidth / 2)
                      .attr("height", graphHeight / 2)
                      .attr("transform", `translate(${margin.left}, ${margin.right  + 160})`);

  //Annotations
  const annotations = [
      {
          note: {
            label: "The lowest numbers throughout the period.",
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

          
          x: graphWidth/2,
          y: graphHeight/1.24,
          dy: -graphHeight/3,
          dx: graphWidth/5
        }
      ]
      // Add annotation to the baby chart
    const makeAnnotations = d3.annotation()
    .annotations(annotations);

  
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
  // Add X axis label:
  mainCanvas.append("text")
      .attr("text-anchor", "end")
      .attr("x", graphWidth)
      .attr("y", graphHeight+50 )
      .text("Year Of Birth");

 mainCanvas.append("g")
             .call(yAxis);

// Add Y axis label:
mainCanvas.append("text")
.attr("text-anchor", "end")
.attr("x", 0)
.attr("y", -20 )
.text("Percentages%")
.attr("text-anchor", "start")


//Add Percentages into Arrays
 var ever_arr = nodes[0].percentages;
 var six_months_arr = nodes[1].percentages;
 var twelve_months_arr= nodes[2].percentages;
 var exclusive_arr= nodes[6].percentages;
 var formula_arr= nodes[7].percentages;



//Add Circles on the 12 months circles 
// var twelve_g = mainCanvas.append("g");
// twelve_g.selectAll("circle")
// .data(twelve_months_arr)
// .enter()
// .append("circle")
// .attr("class", "Twelve_Months")
// .attr("cx", 0)
// .attr("cy", (d)=>y(d))
// .on("mouseover", mouseover)
// .on("mousemove", mousemove)
// .on("mouseout", mouseout)
//             .transition()
//             .duration(3000)  
//             .delay(300) 
// .attr("cx", (d,i)=>x(parseYears(years[i])))
// .attr("cy", (d)=>y(d))
// .attr("r", 5)


//Add Circles on the exclusive dots 
var exc_g = mainCanvas.append("g");
exc_g.selectAll("circle")
.data(exclusive_arr)
.enter()
.append("circle")
.attr("class", "Exclusive")
.attr("cx", 0)
.attr("cy", (d)=>y(d))
.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)
            .transition()
            .duration(1000)  
            // .delay(300) 

.attr("cx", (d,i)=>x(parseYears(years[i])))
.attr("cy", (d)=>y(d))
.attr("r", 5)

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
      .on("click", function() { window.open("ever.html"); }); // when clicked, opens window with google.com.

//Add the Six Months Line path
var sixLine = d3.line()
      .x(function(d,i){return x(parseYears(years[i]))})
      .y(function(d,i){ return y(d)})
var path_six=mainCanvas.append("path")
.data([six_months_arr])
.attr("class", "line sixLine")
.attr("d", sixLine)  
.on("click", function() { window.open("ever.html"); }); // when clicked, opens window with google.com.


//Add the Twelve Months Line path
// var twelveLine = d3.line()
// .x(function(d,i){return x(parseYears(years[i]))})
// .y(function(d,i){ return y(d)})
// var path_twelve=mainCanvas.append("path")
// .data([twelve_months_arr])
// .attr("class", "line twelveLine")
// .attr("d", twelveLine) 
// .on("click", function() { window.open("https://publications.aap.org/view-large/10993082?autologincheck=redirected"); }); // when clicked, opens window with google.com.

//Add Title of the Ever Graph
mainCanvas.append("text")
.attr("x", 0)
.attr("y", -margin.bottom -20)
.text("Babies Feeding Types From 2012 to 2019")
.style("font-size", "20px")
.attr("alignment-baseline","right")



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
//repeat(path_twelve); 

//Types 
types_arr = []
data.map(item=>types_arr.push(item.type))
console.log(types_arr,"huuuuu")
// ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 1)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 1)


  }
     //Add Color Legends
const legendGroup = mainCanvas.append("g");
legendGroup.append("circle")
        .attr("cx",graphHeight+margin.left+100)
        .attr("cy",130).attr("r", 6)
        .style("fill", "#798BBC")
        .style("cursor", "pointer")
        .on("click", function() { window.open("ever.html"); }) // when clicked, opens window with google.com.

legendGroup.append("circle")
     .attr("cx",graphHeight+margin.left+100)
     .attr("cy",160).attr("r", 6)
     .style("fill", "#a1d99b")
     .style("cursor", "pointer")
     .on("click", function() { window.open("ever.html"); }); // when clicked, opens window.


// legendGroup.append("circle")
// .attr("cx",graphHeight+margin.left+100)
// .attr("cy",190).attr("r", 6).style("fill", "#F97850")
legendGroup.
append("circle")
.attr("cx",graphHeight+margin.left+100)
.attr("cy",220).attr("r", 6)
.style("fill", "#57B795").style("cursor","pointer")
.on("click", function() { window.open("exclusive.html"); }); // when clicked, opens window.

legendGroup.append("circle")
.attr("cx",graphHeight+margin.left+100).style("cursor","pointer")
.attr("cy",250).attr("r", 6).style("fill", "#E072B6")


.on("click", function() { window.open("formula.html"); }) // when clicked, opens window.
  //n.attr("text-decoration","underline"))
// d.style("text-decoration","underline")




legendGroup.append("text")
         .attr("x", graphHeight+margin.left+120)
         .attr("y", 130)
         .text("Ever Breastfeeding")
         .style("font-size", "18px")
         .attr("alignment-baseline","middle")
         .attr("class", "underline")
         .on("click", function() { window.open("ever.html"); }) 

         
legendGroup.append("text")
.attr("x", graphHeight+margin.left+120)
.attr("y", 160).text("For 6 months")
.style("font-size", "18px")
.attr("alignment-baseline","middle")
.attr("class", "underline")
.on("click", function() { window.open("ever.html"); }) 


// legendGroup.append("text")
// .attr("x", graphHeight+margin.left+120)
// .attr("y", 190).text("For 12 months")
// .style("font-size", "18px").attr("alignment-baseline","middle")

legendGroup.append("text")
.attr("x", graphHeight+margin.left+120)
.attr("y", 220).text("Exclusive Breastfeeding")
.style("font-size", "18px")
.attr("alignment-baseline","middle")
.attr("class", "underline")   
.on("click", function() { window.open("exclusive.html"); }) // when clicked, opens window.

legendGroup.append("text")
.attr("x", graphHeight+margin.left+120).attr("y", 250)
.text("Formula").style("font-size", "18px")
.attr("alignment-baseline","middle")     
.attr("class", "underline")
.on("click", function() { window.open("formula.html"); }) 


  
 //Add Circles on the formula circles 
 const formula_g = mainCanvas.append("g");
 formula_g.selectAll("circle")
 .data(formula_arr)
 .enter()
 .append("circle")
 .attr("class", "Formula")
 .attr("cx", 0)
.attr("cy", (d)=>y(d))

.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)
            .transition()
            .duration(1000)  
            // .delay(300) 
 .attr("cx", (d,i)=>x(parseYears(years[i])))
 .attr("cy", (d)=>y(d))
 .attr("r", 5)

 
 //Add Circles on the six months circles 
 var six_g = mainCanvas.append("g");
 six_g.selectAll("circle")
 .data(six_months_arr)
 .enter()
 .append("circle")
 .attr("class", "Six_Months")
 .attr("cx", 0)
.attr("cy", (d)=>y(d))

.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)
            .transition()
            .duration(1000)  
            // .delay(300) 
 .attr("cx", (d,i)=>x(parseYears(years[i])))
 .attr("cy", (d)=>y(d))
 .attr("r", 5)

 
 //Add Circles on the ever circles
 var ever_g = mainCanvas.append("g");
 ever_g.selectAll("circles")
         .data(ever_arr)
         .enter()
         .append("circle")
         .attr("class", "Ever")
         .attr("cx", 0)
         .attr("cy", (d)=>y(d))
         
         .on("mouseover", mouseover)
         .on("mousemove", mousemove)
         .on("mouseout", mouseout)
                     .transition()
                     .duration(1000)  
                    //  .delay(300) 
          .attr("cx", (d,i)=>x(parseYears(years[i])))
          .attr("cy", (d)=>y(d))
          .attr("r", 5)


 //Annotations
 mainCanvas.append("g")
 .attr("class", "annotation-group")
 .call(makeAnnotations)
 .transition().duration(2000).delay(500)
                       .style("opacity", 1);
}


      

      
           
