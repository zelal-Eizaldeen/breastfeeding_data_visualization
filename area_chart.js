
var type="Exclusive";
const stateEverCheckbox = document.querySelector("#Ever");
const stateExCheckbox = document.querySelector("#Exclusive");
var ascBtn = document.querySelector("#ascBtn");
var desBtn = document.querySelector("#desBtn");
desBtn.disabled=true;

// set the dimensions and margins of the graph
var margin = {top: 80, right: 30, bottom: 40, left: 150},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    // var margin = {top:20, right:20, bottom:70, left:70};
    // var width = 600 - margin.left - margin.right;
    // var height = 600 - margin.top - margin.bottom;


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
   if(type=="Exclusive"){
    d3.select("svg").remove();
    sort_exclusive(this.value)
   }
   if(type=="Ever"){
    d3.select("svg").remove();
    sort_ever(this.value);
   }
   
   

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
        .duration(100)
       
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

       //////Exclusive Init /////   

async function init_ex(type) {
   const data = await d3.csv(
           'Breastfeeding_Outcomes.csv');
    // append the svg object to the body of the page
 const svg = d3.select("#canva")
 .append("svg")
   .attr("width", 1000)
   .attr("height", 2000)
 .append("g")
   .attr("transform",
         "translate(" + margin.left + "," + margin.top + ")");

        var nodes = d3.range(data.length)
        .map(function (d) {
                          d={
                            Country:data[d].Country,
                            Exclusive: data[d].Exclusive,
                            
                          }
                     return d;
                      });
   
// Add X axis
var x = d3.scaleLinear()
.domain([0,d3.max(data, d=>+d[type])])
  .range([ 0, width]);
svg.append("g")
  .attr("transform", "translate(0," + height*2 + ")")
  .transition().duration(1000)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
     // Y axis
  var y = d3.scaleBand()
  .range([ 0, height*2 ])
  .domain(data.map(d =>d.Country))
  .padding(.3);
svg.append("g")
.transition().duration(1000)
  .call(d3.axisLeft(y)) 
 
        
        // moves the text to the left by 20
// Add X axis label:
svg.append("text")
.attr("text-anchor", "end")
.attr("x", width+200)
.attr("y", height*2 )
.text("Percentage% of Infants");

 // Add Y axis label:
 svg.append("text")
 .attr("text-anchor", "end")
 .attr("x", -40)
 .attr("y", -20)
 
 .text("State")
 .attr("text-anchor", "start")   
 
//Annotation
const annotations = [
    {
    note: {
    label: "The highest percentage, about 36.5% in 2019. Why?",
    title: "Minnesota has",
    align: "left",
    wrap: 100,
    
    },
    connector: {
    end: "dot",        // Can be none, or arrow or dot
    type: "line",      // ?? don't know what it does
    lineType : "vertical",    // ?? don't know what it does
    endScale: 3    // dot size
    },
    color: ["#000000"],
    
    x: width/1.5,
    y: height/60,
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
.on("mouseover", mouseover)
.on("mouseout", mouseout)
.transition()
.duration(500)



.attr("x", x(0) )
.attr("y", function(d) { return y(d.Country); })
.attr("width", function(d) { return x(d[type]); })  //Desc
 .attr("height", y.bandwidth)
.attr("fill",function(d,i,n) { return fill_bars(d,i,n); })



//Annotations
svg.append("g")
.attr("class", "annotation-group")
.call(makeAnnotations)
.transition().duration(5000)
                      .style("opacity", 1)
                      .transition()
                      .style("opacity", 0)
  
  
    ///Title to the exclusive init chart
   svg.append("text")
   .text("Exclusive Breastfeeding Rates Among Infants Born in 2019 According To The State")
   .attr("x", margin.right - 30)
   .attr("y",  margin.top - 140)
   .attr("font-size", 20)
   .style("opacity", 0.0)
                .transition()
                               .duration(2000)
                               .style("opacity", (d, i) => i+0.7)

}


async function init_ever(type) {
     data = await d3.csv(
        'Breastfeeding_OutcomesEverDes.csv');

// append the svg object to the body of the page
const svg = d3.select("#canva")
.append("svg")
  .attr("width", 1000)
  .attr("height",2000)
  //height + margin.top + margin.bottom
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        var nodes = d3.range(data.length)
        .map(function (d) {
                          d={
                            Country:data[d].Country,
                            Ever: data[d].Ever,
      
                          }
                     return d;
                      });
   
// Add X axis
var x = d3.scaleLinear()
.domain([0,d3.max(data, d=>+d[type])])
  .range([ 0, width]);
svg.append("g")
  .attr("transform", "translate(0," + height*2 + ")")
  .transition().duration(1000)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add X axis label:
svg.append("text")
.attr("text-anchor", "end")
.attr("x", width+200)
.attr("y", height*2 )
.text("Percentage% of Infants");

 // Add Y axis label:
 svg.append("text")
 .attr("text-anchor", "end")
 .attr("x", -40)
 .attr("y", -20)
 .text("State")
 .attr("text-anchor", "start")   
     // Y axis
  var y = d3.scaleBand()
  .range([ 0, height*2 ])
  .domain(data.map(d =>d.Country))

  .padding(.3);
svg.append("g")
.transition().duration(1000)
  .call(d3.axisLeft(y)) 
  
      
//Annotation
 const annotations = [
  {
    note: {
      label: "The vast majority of mothers had any amount of breastfeeding",
      title: "Colorado",
      align: "left",
      wrap: 100,
      
    },
    connector: {
      end: "dot",        // Can be none, or arrow or dot
      type: "line",      // ?? don't know what it does
      lineType : "vertical",    // ?? don't know what it does
      endScale: 3     // dot size
    },
    color: ["#000000"],
    
    x: width,
    y: height/60,
    dy: 60,
    dx: 140
  }
]
   // Add annotation 
   const makeAnnotations = d3.annotation()
   .annotations(annotations);
   var title_ever =svg.append("g")
///Title to the ever init chart
   title_ever.append("text")
   .text("Ever Breastfeeding Rates Among Infants Born in 2019 According To The State")
   .attr("x", margin.right - 30)
   .attr("y",  margin.top - 140)
   .attr("font-size", 20)
   .style("opacity", 0.0)
                .transition()
                               .duration(2000)
                               .style("opacity", (d, i) => i+0.7)

     // variable u: map data to existing bars
   var ever_rects = svg.selectAll("rect")
   .data(nodes)

 // update bars
 ever_rects
   .enter()
   .append("rect")
   .merge(ever_rects)
   .on("mouseover", mouseover)
.on("mouseout", mouseout)
   .transition()
   .duration(500)
   .attr("x", x(0) )
   .attr("y", function(d) { return y(d.Country); })
.attr("width", function(d) { return x(d[type]); })  //Desc
   .attr("height", y.bandwidth() )
   .attr("fill",function(d,i,n) { return fill_bars(d,i,n); })


 //Annotations
 svg.append("g")
 .attr("class", "annotation-group")
 .call(makeAnnotations)
 .transition().duration(5000)
                      .style("opacity", 1)
                      .transition()
                      .style("opacity", 0);
}
            
async function sort_exclusive(order) {
    
    const data = await d3.csv(
            'Breastfeeding_Outcomes.csv');
     // append the svg object to the body of the page
  const svg = d3.select("#canva")
  .append("svg")
    // .attr("width", width + margin.left + margin.right)
    .attr("width", 1000)
    .attr("height", 2000)
    // .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
////Sort Exclusive Ascending ///////
if(order==="asc"){
            sortedData_asc = data.slice()
            .sort((a, b) => d3.ascending(a.Exclusive, b.Exclusive))
            
         var nodes = d3.range(sortedData_asc.length)
         .map(function (d) {
                           let i = + sortedData_asc[d].category_code_Mum;
                           d={
                             Country:sortedData_asc[d].Country,
                             Exclusive: sortedData_asc[d].Exclusive,
                             
                           }
                      return d;
                       });
    
 // Add X axis
 var x = d3.scaleLinear()
 .domain([0,d3.max(sortedData_asc, d=>+d[type])])
   .range([ 0, width]);
 svg.append("g")
   .attr("transform", "translate(0," + height*2 + ")")
   .transition().duration(1000)
   .call(d3.axisBottom(x))
   .selectAll("text")
     .attr("transform", "translate(-10,0)rotate(-45)")
     .style("text-anchor", "end");
 
   
      // Y axis
   var y = d3.scaleBand()
   .range([ 0, height*2 ])
   .domain(sortedData_asc.map(d =>d.Country))
 
   .padding(.3);
 svg.append("g")
 .transition().duration(1000)
   .call(d3.axisLeft(y)) 
   
 // Add X axis label:
svg.append("text")
.attr("text-anchor", "end")
.attr("x", width+200)
.attr("y", height*2 )
.text("Percentage% of Infants");

 // Add Y axis label:
 svg.append("text")
 .attr("text-anchor", "end")
 .attr("x", -40)
 .attr("y", -20)
 .text("State")
 .attr("text-anchor", "start")   
 //Annotation
  const annotations = [
   {
     note: {
       label: "The Lowest percentage, about 13.8% in 2019",
       title: "West Virginia has",
       align: "left",
       wrap: 100,
       
     },
     connector: {
       end: "dot",        // Can be none, or arrow or dot
       type: "line",      // ?? don't know what it does
       lineType : "vertical",    // ?? don't know what it does
       endScale: 3     // dot size
     },
     color: ["#000000"],
     
     x: width/2.5,
     y: height/70,
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
 .on("mouseover", mouseover)
.on("mouseout", mouseout)
 .transition()
 .duration(500)
 .attr("x", x(0) )
 .attr("y", function(d) { return y(d.Country); })
 .attr("width", function(d) { return x(d[type]); })  //Desc
  .attr("height", y.bandwidth() )
 .attr("fill",function(d,i,n) { return fill_bars(d,i,n); })
 //Annotations
 svg.append("g")
 .attr("class", "annotation-group")
 .call(makeAnnotations)
 .transition().duration(5000)
                      .style("opacity", 1)
                      .transition()
                      .style("opacity", 0);
 
   ///Title to the exclusive init chart
   svg.append("text")
   .text("Exclusive Breastfeeding Rates Among Infants Born in 2019 According From The Lowest")
   .attr("x", margin.right - 30)
   .attr("y",  margin.top - 140)
   .attr("font-size", 20)  
   .style("opacity", 0.0)
                .transition()
                               .duration(2000)
                               .style("opacity", (d, i) => i+0.7)
}
 
     
///////Sort Exclusive Descending
if(order==="des"){
    sortedData_des = data.slice()
    .sort((a, b) => d3.descending(a.Exclusive, b.Exclusive))
    
 var nodes = d3.range(sortedData_des.length)
 .map(function (d) {
                   d={
                     Country:sortedData_des[d].Country,
                     Exclusive: sortedData_des[d].Exclusive,
                     
                   }
              return d;
               });

// Add X axis
var x = d3.scaleLinear()
.domain([0,d3.max(sortedData_des, d=>+d[type])])
.range([ 0, width]);
svg.append("g")
.attr("transform", "translate(0," + height*2 + ")")
.transition().duration(1000)
.call(d3.axisBottom(x))
.selectAll("text")
.attr("transform", "translate(-10,0)rotate(-45)")
.style("text-anchor", "end");


// Y axis
var y = d3.scaleBand()
.range([ 0, height*2 ])
.domain(sortedData_des.map(d =>d.Country))

.padding(.3);
svg.append("g")
.transition().duration(1000)
.call(d3.axisLeft(y)) 

// Add X axis label:
svg.append("text")
.attr("text-anchor", "end")
.attr("x", width+200)
.attr("y", height*2 )
.text("Percentage% of Infants");

 // Add Y axis label:
 svg.append("text")
 .attr("text-anchor", "end")
 .attr("x", -40)
 .attr("y", -20)
 .text("State")
 .attr("text-anchor", "start")   

//Annotation
const annotations = [
{
note: {
label: "The highest percentage, about 36.5% in 2019. Why?",
title: "Minnesota has",
align: "left",
wrap: 100,

},
connector: {
end: "dot",        // Can be none, or arrow or dot
type: "line",      // ?? don't know what it does
lineType : "vertical",    // ?? don't know what it does
endScale: 3     // dot size
},
color: ["#000000"],

x: width/1.2,
y: height/70,
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
.on("mouseover", mouseover)
.on("mouseout", mouseout)
.transition()
.duration(500)
.attr("x", x(0) )
.attr("y", function(d) { return y(d.Country); })
.attr("width", function(d) { return x(d[type]); })  
.attr("height", y.bandwidth() )
.attr("fill",function(d,i,n) { return fill_bars(d,i,n); })
//Annotations
svg.append("g")
.attr("class", "annotation-group")
.call(makeAnnotations)
.transition().duration(5000)
                      .style("opacity", 1)
                      .transition()
                      .style("opacity", 0);

                 ///Title to the exclusive init chart
   svg.append("text")
   .text("Exclusive Breastfeeding Rates Among Infants Born in 2019 From The Highest")
   .attr("x", margin.right - 30)
   .attr("y",  margin.top - 140)
   .attr("font-size", 20)
   .style("opacity", 0.0)
                .transition()
                               .duration(2000)
                               .style("opacity", (d, i) => i+0.7)

}
}
////////Sort Ever///
async function sort_ever(order) {
    
    const data = await d3.csv(
            'Breastfeeding_OutcomesEverDes.csv');
     // append the svg object to the body of the page
  const svg = d3.select("#canva")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 2000)

    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
////Sort Ever Ascending ///////
if(order==="asc"){
            sortedData_asc = data.slice()
            .sort((a, b) => d3.ascending(a.Ever, b.Ever))
            
         var nodes = d3.range(sortedData_asc.length)
         .map(function (d) {
                           d={
                             Country:sortedData_asc[d].Country,
                             Ever: sortedData_asc[d].Ever,
                             
                           }
                      return d;
                       });
    
 // Add X axis
 var x = d3.scaleLinear()
 .domain([0,d3.max(sortedData_asc, d=>+d[type])])
   .range([ 0, width]);
 svg.append("g")
   .attr("transform", "translate(0," + height*2 + ")")
   .transition().duration(1000)
   .call(d3.axisBottom(x))
   .selectAll("text")
     .attr("transform", "translate(-10,0)rotate(-45)")
     .style("text-anchor", "end");
 
   
      // Y axis
   var y = d3.scaleBand()
   .range([ 0, height*2 ])
   .domain(sortedData_asc.map(d =>d.Country))
 
   .padding(.3);
 svg.append("g")
 .transition().duration(1000)
   .call(d3.axisLeft(y)) 
   
 // Add X axis label:
svg.append("text")
.attr("text-anchor", "end")
.attr("x", width+200)
.attr("y", height*2 )
.text("Percentage% of Infants");

 // Add Y axis label:
 svg.append("text")
 .attr("text-anchor", "end")
 .attr("x", -40)
 .attr("y", -20)
 .text("State")
 .attr("text-anchor", "start")   
 //Annotation
  const annotations = [
   {
     note: {
       label: "The Lowest percentage, about 60%(breastfeeding and Formula) in 2019",
       title: "West Virginia has",
       align: "left",
       wrap: 100,
       
     },
     connector: {
       end: "dot",        // Can be none, or arrow or dot
       type: "line",      // ?? don't know what it does
       lineType : "vertical",    // ?? don't know what it does
       endScale: 3     // dot size
     },
     color: ["#000000"],
     
     x: width/1.5,
     y: height/70,
     dy: 60,
     dx: 140
   }
 ]
    // Add annotation to the baby chart
    const makeAnnotations = d3.annotation()
    .annotations(annotations);

     // variable u: map data to existing bars
 var ever_rects = svg.selectAll("rect")
 .data(nodes)
 
 // update bars
 ever_rects
 .enter()
 .append("rect")
 .merge(ever_rects)
 .on("mouseover", mouseover)
.on("mouseout", mouseout)
 .transition()
 .duration(500)
 .attr("x", x(0) )
 .attr("y", function(d) { return y(d.Country); })
 .attr("width", function(d) { return x(d[type]); })  //Desc
  .attr("height", y.bandwidth() )
 .attr("fill",function(d,i,n) { return fill_bars(d,i,n); })
 //Annotations
 svg.append("g")
 .attr("class", "annotation-group")
 .call(makeAnnotations)
 .transition().duration(5000)
                      .style("opacity", 1)
                      .transition()
                      .style("opacity", 0)
 
 
                         ///Title to the ever sort chart
   svg.append("text")
   .text("Ever Breastfeeding Rates Among Infants Born in 2019 From The Lowest")
   .attr("x", margin.right - 30)
   .attr("y",  margin.top - 140)
   .attr("font-size", 20)
   .style("opacity", 0.0)
                .transition()
                               .duration(2000)
                               .style("opacity", (d, i) => i+0.7)

}
 
     
///////Sort Ever Descending
if(order==="des"){
    sortedData_des = data.slice()
    .sort((a, b) => d3.descending(a.Ever, b.Ever))
    
 var nodes = d3.range(sortedData_des.length)
 .map(function (d) {
                   d={
                     Country:sortedData_des[d].Country,
                     Ever: sortedData_des[d].Ever,
                     
                   }
              return d;
               });

// Add X axis
var x = d3.scaleLinear()
.domain([0,d3.max(sortedData_des, d=>+d[type])])
.range([ 0, width]);
svg.append("g")
.attr("transform", "translate(0," + height*2 + ")")
.transition().duration(500)
.call(d3.axisBottom(x))
.selectAll("text")
.attr("transform", "translate(-10,0)rotate(-45)")
.style("text-anchor", "end");


// Y axis
var y = d3.scaleBand()
.range([ 0, height*2 ])
.domain(sortedData_des.map(d =>d.Country))

.padding(.3);
svg.append("g")
.transition().duration(1000)
.call(d3.axisLeft(y)) 

// Add X axis label:
svg.append("text")
.attr("text-anchor", "end")
.attr("x", width+150)
.attr("y", height*2 )
.text("Percentage% of Infants");

 // Add Y axis label:
 svg.append("text")
 .attr("text-anchor", "end")
 .attr("x", -40)
 .attr("y", -20)
 .text("State")
 .attr("text-anchor", "start")   
//Annotation
const annotations = [
    {
      note: {
        label: "The vast majority of mothers had any amount of breastfeeding",
        title: "Colorado",
        align: "left",
        wrap: 100,
        
      },
      connector: {
        end: "dot",        // Can be none, or arrow or dot
        type: "line",      // ?? don't know what it does
        lineType : "vertical",    // ?? don't know what it does
        endScale: 3     // dot size
      },
      color: ["#000000"],
      
      x: width,
      y: height/60,
      dy: 60,
      dx: 140
    }
  ]
// Add annotation to the baby chart
const makeAnnotations = d3.annotation()
.annotations(annotations);

// variable u: map data to existing bars
var ever_rects = svg.selectAll("rect")
.data(nodes)

// update bars
ever_rects
.enter()
.append("rect")
.merge(ever_rects)
.on("mouseover", mouseover)
.on("mouseout", mouseout)
.transition()
.duration(500)
.attr("x", x(0) )
.attr("y", function(d) { return y(d.Country); })
.attr("width", function(d) { return x(d[type]); })  
.attr("height", y.bandwidth() )
.attr("fill",function(d,i,n) { return fill_bars(d,i,n); })
//Annotations
svg.append("g")
.attr("class", "annotation-group")
.call(makeAnnotations)
.transition().duration(2000).delay(500)
               .style("opacity", 1);


                 ///Title to the Ever sort chart
   svg.append("text")
   .text("Ever Breastfeeding Rates Among Infants Born in 2019 From The Highest")
   .attr("x", margin.right - 30)
   .attr("y",  margin.top - 140)
   .attr("font-size", 20)
   .style("opacity", 0.0)
                .transition()
                               .duration(2000)
                               .style("opacity", (d, i) => i+0.7)

}



}

init_ex(type)
