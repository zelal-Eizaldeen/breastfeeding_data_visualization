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

mainCanvas.append("path")
.data([formula_arr])
.attr("class", "line formulaLine")
.on("click", function() { window.open("formula.html"); }) // when clicked, opens window.

.attr("d", formulaLine)  
    


//Add the Exclusive Line path
var exclusiveLine = d3.line()
.x(function(d,i){return x(parseYears(years[i]))})
.y(function(d,i){ return y(d)})
mainCanvas.append("path")
.data([exclusive_arr])
.attr("class", "line exclusiveLine")
.attr("d", exclusiveLine)  
.on("click", function() { window.open("exclusive.html"); }); // when clicked, opens window.
exclusiveLine.transition()
//Add the Ever Line path
    var everLine = d3.line()
                .x(function(d,i){return x(parseYears(years[i]))})
                .y(function(d,i){ return y(d)})
    mainCanvas.append("path")
         .data([ever_arr])
         .attr("class", "line everLine")
         .attr("d", everLine) 
         .on("click", function() { window.open("https://publications.aap.org/view-large/10993082?autologincheck=redirected"); }); // when clicked, opens window with google.com.

//Add the Six Months Line path
 var sixLine = d3.line()
         .x(function(d,i){return x(parseYears(years[i]))})
         .y(function(d,i){ return y(d)})
mainCanvas.append("path")
  .data([six_months_arr])
  .attr("class", "line sixLine")
  .attr("d", sixLine)  
  .on("click", function() { window.open("https://publications.aap.org/view-large/10993082?autologincheck=redirected"); }); // when clicked, opens window with google.com.

//Add the Twelve Months Line path
var twelveLine = d3.line()
.x(function(d,i){return x(parseYears(years[i]))})
.y(function(d,i){ return y(d)})
mainCanvas.append("path")
.data([twelve_months_arr])
.attr("class", "line twelveLine")
.attr("d", twelveLine) 
.on("click", function() { window.open("https://publications.aap.org/view-large/10993082?autologincheck=redirected"); }); // when clicked, opens window with google.com.


//Add Title of the Ever Graph
mainCanvas.append("text")
.attr("x", margin.right).attr("y", margin.top -50)
.text("Babies Feeding Types From 2012 to 2019")
.style("font-size", "20px").attr("alignment-baseline","right")

         
//Add Color Legends
mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",130).attr("r", 6).style("fill", "#31a354")
mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",160).attr("r", 6).style("fill", "#a1d99b")
mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",190).attr("r", 6).style("fill", "#e0f1de")
mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",220).attr("r", 6).style("fill", "#f03b20")
mainCanvas.append("circle").attr("cx",graphHeight+margin.left).attr("cy",250).attr("r", 6).style("fill", "#2c7fb8")

mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 130).text("Ever Breastfeeding").style("font-size", "15px").attr("alignment-baseline","middle")
mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 160).text("For 6 months").style("font-size", "15px").attr("alignment-baseline","middle")     
mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 190).text("For 12 months").style("font-size", "15px").attr("alignment-baseline","middle")   
mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 220).text("Exclusive Breastfeeding").style("font-size", "15px").attr("alignment-baseline","middle")     
mainCanvas.append("text").attr("x", graphHeight+margin.left+20).attr("y", 250).text("Formula").style("font-size", "15px").attr("alignment-baseline","middle")     

 //Add Circles on the formula line 
mainCanvas.selectAll("circles")
.data(formula_arr)
.enter()
.append("circle")
.attr("class", "formulaCircle")
.attr("cx", (d,i)=>x(parseYears(years[i])))

.attr("cy", (d)=>y(d))
.attr("r", 5)


//Add Circles on the exclusive line 
mainCanvas.selectAll("circles")
        .data(exclusive_arr)
        .enter()
        .append("circle")
        .attr("class", "exclusiveCircle")
        .attr("cx", (d,i)=>x(parseYears(years[i])))
        .attr("cy", (d)=>y(d))
        .attr("r", 5)
        
//Add Circles on the ever line
mainCanvas.selectAll("circles")
        .data(ever_arr)
        .enter()
        .append("circle")
        .attr("class", "everCircle")
        .attr("cx", (d,i)=>x(parseYears(years[i])))
        .attr("cy", (d)=>y(d))
        .attr("r", 5)

//Add Circles on the six months line 
mainCanvas.selectAll("circles")
        .data(six_months_arr)
        .enter()
        .append("circle")
        .attr("class", "sixCircle")
        .attr("cx", (d,i)=>x(parseYears(years[i])))
        .attr("cy", (d)=>y(d))
        .attr("r", 5)
//Add Circles on the six months line 
mainCanvas.selectAll("circles")
        .data(twelve_months_arr)
        .enter()
        .append("circle")
        .attr("class", "twelveCircle")
        .attr("cx", (d,i)=>x(parseYears(years[i])))
        .attr("cy", (d)=>y(d))
        .attr("r", 5)
        }
init();