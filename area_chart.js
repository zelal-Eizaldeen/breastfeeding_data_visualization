
var type="Exclusive";

//Array of colors
var legendColorsArray = ["#8da0cb", "#66c2a5"]
//Color
const mColors = d3.scaleOrdinal(d3['schemeSet2']);
const stateEverCheckbox = document.querySelector("#Ever");
const stateExCheckbox = document.querySelector("#Exclusive");
var ascBtn = document.querySelector("#ascBtn");
var desBtn = document.querySelector("#desBtn");
desBtn.disabled=true;

// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

 

///////////Click ///////////
d3.selectAll(".front").on("click", function () {
   if (this.value=="asc"){
    desBtn.disabled=false;
    ascBtn.disabled=true;

   }
   if(this.value=="des"){
    ascBtn.disabled=false;
    desBtn.disabled=true;

   }
    d3.select("svg").remove();
    sort_exclusive(this.value)
   

});

d3.selectAll(".region_cb").on("change", function ()
 {
     
   type = this.value;

  if (this.checked && type=="Exclusive") { // adding data points
    stateEverCheckbox.checked=false;
   
    d3.select("svg").remove();
    init_ex(type)
  }
  if (!this.checked && type=="Exclusive"){
    
    d3.select("svg").remove();

  }
  if (!this.checked && type=="Ever"){
    d3.select("svg").remove();

  }
  if (this.checked && type=="Ever") { // adding data points
 
   console.log(type)
    stateExCheckbox.checked=false;
    d3.select("svg").remove();
    init_ever(type)
   }
 });
 
 //Define the Tooltip
var div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);
var fill_bars = function(d,i,n){
    if (type=="Exclusive"){
        d3.select(n[i]).style("fill", "#57B795")
    }
    if(type=="Ever"){
        d3.select(n[i]).style("fill", "#798BBC")
    }
}

   



  var mouseover = function(d,i,n){
    d3.select(n[i])
    .transition()
    .duration(100)
    .style("opacity", 0.5)
    .style("stroke-width", "1px")
  .style("stroke","black") ;
  div.transition()
        .duration(200)
        .style("opacity", 0.9)
 if(stateEverCheckbox.checked && stateEverCheckbox.value=="Ever") {
      div.html(`
            <p> 
            <b>Country: </b>
            ${d.Country}
            <br>
            <b>Ever Breastfeeding: </b>
            ${d.Ever}%
           
            </p>
            `
 
            )
                .style("left", (d3.event.pageX+40) + "px")
                .style("top", (d3.event.pageY-140) + "px")
 }
 if(stateExCheckbox.checked && stateExCheckbox.value=="Exclusive") {

 div.html(
  `<p> 
  <b>Country: </b>
  ${d.Country}
  <br>
  <b>Exclusive Breastfeeding: </b>
  ${d.Exclusive}%
 
  </p>

  `)

.style("left", (d3.event.pageX+40) + "px")
  .style("top", (d3.event.pageY-140) + "px")

 }
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

          

async function init_ex(type) {
   const data = await d3.csv(
           'Breastfeeding_Outcomes.csv');
    // append the svg object to the body of the page
 const svg = d3.select("#canva")
 .append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)
 .append("g")
   .attr("transform",
         "translate(" + margin.left + "," + margin.top + ")");

        var nodes = d3.range(data.length)
        .map(function (d) {
                          let i = + data[d].category_code_Mum;
                          d={
                            cluster: i,
                            Outcomes_Mum: data[d].Outcomes_Mum,
                            Lower_Risk_Mum: data[d].Lower_Risk_Mum,
                            Breastfeeding_Period_Mum:data[d].Breastfeeding_Period_Mum,
                            Country:data[d].Country,
                            Ever: data[d].Ever,
                            Exclusive: data[d].Exclusive,
                            
                          }
                     return d;
                      });
   
// Add X axis
var x = d3.scaleLinear()
.domain([0,d3.max(data, d=>+d[type])])
  .range([ 0, width]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .transition().duration(1000)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  
     // Y axis
  var y = d3.scaleBand()
  .range([ 0, height ])
  .domain(data.map(d =>d.Country))

  .padding(.1);
svg.append("g")
.transition().duration(1000)
  .call(d3.axisLeft(y)) 
  

//Annotation
 const annotations = [
  {
    note: {
      label: "Gestational Diabetes Mellitus reduced to 78%",
      title: "GDM:",
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
    
    x: width/3,
    y: height/2.7,
    dy: 60,
    dx: 140
  }
]
   // Add annotation to the baby chart
   const makeAnnotations = d3.annotation()
   .annotations(annotations);



  // variable u: map data to existing bars
var exclusive_rects = svg.selectAll("rect")
.data(nodes)

// update bars
exclusive_rects
.enter()
.append("rect")
.merge(exclusive_rects)
.transition()
.duration(1000)
.attr("x", x(0) )
.attr("y", function(d) { return y(d.Country); })
.attr("width", function(d) { return x(d[type]);; })  //Desc
// .attr("width",  function(d,i) { return x(exclusive_arr_asc[i]); })  //Asc


 .attr("height", y.bandwidth() )
.attr("fill",function(d,i,n) { return fill_bars(d,i,n); })
//Annotations
svg.append("g")
.attr("class", "annotation-group")
.call(makeAnnotations)
.transition().duration(2000).delay(500)
                      .style("opacity", 1);

}

async function init_ever(type) {
     data = await d3.csv(
        'Breastfeeding_Outcomes.csv');

// append the svg object to the body of the page
const svg = d3.select("#canva")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        var nodes = d3.range(data.length)
        .map(function (d) {
                          let i = + data[d].category_code_Mum;
                          d={
                            cluster: i,
                            Outcomes_Mum: data[d].Outcomes_Mum,
                            Lower_Risk_Mum: data[d].Lower_Risk_Mum,
                            Breastfeeding_Period_Mum:data[d].Breastfeeding_Period_Mum,
                            Country:data[d].Country,
                            Ever: data[d].Ever,
                            Exclusive: data[d].Exclusive,
                            
                          }
                     return d;
                      });
   
// Add X axis
var x = d3.scaleLinear()
.domain([0,d3.max(data, d=>+d[type])])
  .range([ 0, width]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .transition().duration(1000)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  
     // Y axis
  var y = d3.scaleBand()
  .range([ 0, height ])
  .domain(data.map(d =>d.Country))

  .padding(.1);
svg.append("g")
.transition().duration(1000)
  .call(d3.axisLeft(y)) 
  

//Annotation
 const annotations = [
  {
    note: {
      label: "Gestational Diabetes Mellitus reduced to 78%",
      title: "GDM:",
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
    
    x: width/3,
    y: height/2.7,
    dy: 60,
    dx: 140
  }
]
   // Add annotation to the baby chart
   const makeAnnotations = d3.annotation()
   .annotations(annotations);


////// Sorting ///////

ever_arr_asc=[]
if (ascBtn.value=="asc"){
    for(let i=0; i < nodes.length; i ++) {
       ever_arr_asc.push(nodes[i].Ever)
       ever_arr_asc.sort(d3.descending)
    }
     // variable u: map data to existing bars
   var ever_rects = svg.selectAll("rect")
   .data(nodes)

 // update bars
 ever_rects
   .enter()
   .append("rect")
   .merge(ever_rects)
   .transition()
   .duration(1000)
  

   .attr("x", x(0) )
   .attr("y", function(d) { return y(d.Country); })
//    .attr("width", function(d) { return x(d[type]);; })  //Desc
     .attr("width",  function(d,i) { return x(ever_arr_asc[i]); })  //Asc
   .attr("height", y.bandwidth() )
   .attr("fill",function(d,i,n) { return fill_bars(d,i,n); })
}

 //Annotations
 svg.append("g")
 .attr("class", "annotation-group")
 .call(makeAnnotations)
 .transition().duration(2000).delay(500)
                       .style("opacity", 1);

}
            
async function sort_exclusive(order) {
    const data = await d3.csv(
            'Breastfeeding_Outcomes.csv');
     // append the svg object to the body of the page
  const svg = d3.select("#canva")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
 
         var nodes = d3.range(data.length)
         .map(function (d) {
                           let i = + data[d].category_code_Mum;
                           d={
                             cluster: i,
                             Outcomes_Mum: data[d].Outcomes_Mum,
                             Lower_Risk_Mum: data[d].Lower_Risk_Mum,
                             Breastfeeding_Period_Mum:data[d].Breastfeeding_Period_Mum,
                             Country:data[d].Country,
                             Ever: data[d].Ever,
                             Exclusive: data[d].Exclusive,
                             
                           }
                      return d;
                       });
    
 // Add X axis
 var x = d3.scaleLinear()
 .domain([0,d3.max(data, d=>+d[type])])
   .range([ 0, width]);
 svg.append("g")
   .attr("transform", "translate(0," + height + ")")
   .transition().duration(1000)
   .call(d3.axisBottom(x))
   .selectAll("text")
     .attr("transform", "translate(-10,0)rotate(-45)")
     .style("text-anchor", "end");
 
   
      // Y axis
   var y = d3.scaleBand()
   .range([ 0, height ])
   .domain(data.map(d =>d.Country))
 
   .padding(.1);
 svg.append("g")
 .transition().duration(1000)
   .call(d3.axisLeft(y)) 
   
 
 //Annotation
  const annotations = [
   {
     note: {
       label: "Gestational Diabetes Mellitus reduced to 78%",
       title: "GDM:",
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
     
     x: width/3,
     y: height/2.7,
     dy: 60,
     dx: 140
   }
 ]
    // Add annotation to the baby chart
    const makeAnnotations = d3.annotation()
    .annotations(annotations);
 
 
  exclusive_arr_asc=[]
       if(order==="asc"){
    for(let i=0; i < nodes.length; i ++) {
     exclusive_arr_asc.push(nodes[i].Exclusive)
     exclusive_arr_asc.sort(d3.ascending)
  }
}

if(order==="des"){
    for(let i=0; i < nodes.length; i ++) {
     exclusive_arr_asc.push(nodes[i].Exclusive)
     exclusive_arr_asc.sort(d3.descending)
  }
}

 
   // variable u: map data to existing bars
 var exclusive_rects = svg.selectAll("rect")
 .data(nodes)
 
 // update bars
 exclusive_rects
 .enter()
 .append("rect")
 .merge(exclusive_rects)
 .transition()
 .duration(1000)
 .attr("x", x(0) )
 .attr("y", function(d) { return y(d.Country); })
//  .attr("width", function(d) { return x(d[type]);; })  //Desc
 .attr("width",  function(d,i) { return x(exclusive_arr_asc[i]); })  //Asc
 
 
  .attr("height", y.bandwidth() )
 .attr("fill",function(d,i,n) { return fill_bars(d,i,n); })
 //Annotations
 svg.append("g")
 .attr("class", "annotation-group")
 .call(makeAnnotations)
 .transition().duration(2000).delay(500)
                       .style("opacity", 1);
 
 }



////// Sorting ///////


   




init_ex(type)
