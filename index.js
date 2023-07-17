const canvas = d3.select(".canva");
const canvas_Mum = d3.select(".canva_Mum");


// add an svg element
const svg = canvas.append("svg")
            .attr("width", 600)
            .attr("height", 700);
const svg_Mum = canvas_Mum.append("svg")
                    .attr("width", 600)
                    .attr("height", 700)
                    // .attr("class", "hide");


const margin = 50;
const graphWidth = 500;
const graphHeight = 500;
const type = d3.annotationLabel;
const babyCheckbox = document.querySelector("#baby");
const motherCheckbox = document.querySelector("#mother");

// function update() {
//     console.log("Hiii") 
      
// }
// update(motherCheckbox);
  babyCheckbox.addEventListener("change", () => {
    if (babyCheckbox.checked) {
        svg.attr("class", "visible")
        location.reload();
    } else {
        babyCheckbox.checked=false;
        svg.attr("class", "hide");
    }
  });
  motherCheckbox.addEventListener("change", () => {
    if (motherCheckbox.checked) {
        svg_Mum.attr("class", "visible")
       

        .selectAll(".canva_Mum").transition()
        .duration(3000)
        
        // .attr("y", (d,i)=> y(d.Lower_Risk))
        .delay((d,i) => i * 100 )
        .ease(d3.easeBounceIn)  
        
    } else {
        motherCheckbox.checked=false;
        svg_Mum.attr("class", "hide");
       
    }
  });
//Y Text Axis
// const textYAxisGroup = svg.append("g")
//                             .attr("transform", `translate(${margin - 10}, 30)`)


                            //Define the Tooltip
var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


async function init() {
  const data = await d3.csv(
        'Breastfeeding_Outcomes.csv'
    );
   var x = d3.scaleBand() 
              .domain(data.map(item =>item.Outcomes))
              .range([0,graphWidth])
              .paddingInner(0.3)
            //   .paddingOuter(0.6);
    var y = d3.scaleLinear().domain([0,d3.max(data, d=>d.Lower_Risk)]).range([graphHeight,0]);
    var xAxis = svg.append("g")
                   .attr("transform", "translate("+(margin)+","+(graphHeight+margin)+")")
                   .call(d3.axisBottom(x))
                //    .tickFormat((d,i)=>["Colitis","SIDS","Diabetes1","Neonatal Mortality"][i]))
                   
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");
    var yAxis = svg.append("g").attr("transform", "translate("+margin+","+margin+")").call(d3.axisLeft(y));
    var x_Mum = d3.scaleBand() 
    .domain(data.map(item =>item.Outcomes_Mum))
    .range([0,graphWidth])
    .paddingInner(0.3)

    var y_Mum = d3.scaleLinear().domain([0,d3.max(data, d=>d.Lower_Risk)]).range([graphHeight,0]);
    var xAxis=svg_Mum.append("g")
    .attr("transform", "translate("+(margin)+","+(graphHeight+margin)+")")
    .call(d3.axisBottom(x_Mum))
    .attr("class", "xAxes")
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");
    var yAxis=svg_Mum.append("g").attr("transform","translate("+margin+","+margin+")").call(d3.axisLeft(y_Mum).tickValues([10, 20,30,40,50,60,70]).ticks(20, "~s"));
    
   
    // Features of the annotation for babies
const annotations = [
    {
      note: {
        label: "Sudden Infant Death Syndrome reduced to 64%",
        title: "SIDS:",
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
      
      x: graphWidth/2/2,
      y: graphHeight/2,
      dy: 100,
      dx: 40
    }
  ]
  
    // Features of the annotation for mumies
const annotations_mums = [
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
      
      x: graphWidth/2/2/1.7,
      y: graphHeight/2,
      dy: 100,
      dx: 40
    }
  ]
  
  // Add annotation to the baby chart
  const makeAnnotations = d3.annotation()
    .annotations(annotations);
// Add annotation to the baby chart
const makeAnnotations_mums = d3.annotation()
.annotations(annotations_mums);
    svg.append("text")
        .text("Benefits For Babies")
        .attr("x", margin)
        .attr("y", margin - 4 )
        .attr("font-size", 20)
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append("g").attr("transform", "translate("+margin+","+margin+")")
        .append('rect')
        .attr("class","rect")
        .on("click", function() { window.open("https://publications.aap.org/view-large/10993082"); }) // when clicked, opens window 
        .on("mouseover", function(d,i,n){
            d3.select(n[i])
              .transition()
              .duration(100)
              .style("opacity", 0.7);
            div.transition()
                 .duration(200)
                 .style("opacity", 0.9);
            //Tooltip
            //"d.lower.split(",")[1]
            div.html(
                `<p> 
                <b>Disease: </b>
                ${d.Outcomes}
                </br>
                <b>Lower of: </b>
                ${d.Lower_Risk}%
                </br>
                <b>Breastfeeding Duration: </b>
                ${d.Breastfeeding_Period}</p>`)

            .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
        })
        .on("mouseout", function(d,i,n){
             d3.select(n[i])
               .transition()
               .duration(100)
               .style("opacity", 1);
            div.transition()
            .duration(500)
            .style("opacity", 0)
            })

        .transition()
           .attr("y", (d,i)=> y(d.Lower_Risk))
           .delay((d,i) => i * 100 )
           .ease(d3.easeBounceIn)  


        .attr("x", (d,i)=> x(d.Outcomes))
        .attr("y", (d,i)=>y(d.Lower_Risk))
        .attr("width", x.bandwidth)
        .attr("height", (d,i)=> graphHeight -y(d.Lower_Risk))
        .attr("fill",(d,i,n)=>d3.select(n[0]).style("fill", "#31a354"))
        .attr("fill", "#e5f5e0")
        svg.append("g")
           .attr("class", "annotation-group").call(makeAnnotations);

        
///Mummies Bar Chart
        svg_Mum.append("text")
        .text("Benefits For Mothers")
        .attr("x", margin)
        .attr("y", margin - 4 )
        .attr("font-size", 20)
        svg_Mum.selectAll('rect')
        .data(data)
        .enter()
        .append("g").attr("transform", "translate("+(margin)+","+margin+")")
        .append('rect')
        .attr("class","rect")
        .on("click", function() { window.open("https://publications.aap.org/view-large/10993089"); }) // when clicked, opens window 
        .on("mouseover", function(d,i,n){
            d3.select(n[i])
              .transition()
              .duration(100)
              .style("opacity", 0.7);
            div.transition()
                 .duration(200)
                 .style("opacity", 0.9);
            //Tooltip
            //"d.lower.split(",")[1]
            // div.html("<p> <b>Breastfeeding Duration: </b>"+ d.Breastfeeding_Period_Mum+"</p>")
            div.html(`
            <p> 
            <b>Disease: </b>
            ${d.Outcomes_Mum}
            </br>
            <b>Lower of: </b>
            ${d.Lower_Risk_Mum}%
            </br>
            <b>Breastfeeding Duration: </b>
            ${d.Breastfeeding_Period_Mum}</p>`)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
        })
        .on("mouseout", (d,i,n)=>
             d3.select(n[i])
               .transition()
               .duration(100)
               .style("opacity", 1))

        .transition()
           .attr("y", (d,i)=> y_Mum(d.Lower_Risk_Mum))
           .delay((d,i) => i * 100 )
           .ease(d3.easeBounceIn)  

        .attr("x", (d,i)=> x_Mum(d.Outcomes_Mum))
        .attr("y", (d,i)=>y_Mum(d.Lower_Risk_Mum))
        .attr("width", x_Mum.bandwidth)
        .attr("height", (d,i)=> graphHeight - y_Mum(d.Lower_Risk_Mum))
        .attr("fill",(d,i,n)=>d3.select(n[0]).style("fill", "#31a354"))
        .attr("fill", "#e5f5e0")

        svg_Mum.append("g")
        .attr("class", "annotation-group").call(makeAnnotations_mums);
       
/////Bubble Graph
// set the dimensions and margins of the graph
// var bubble_margin = {top: 40, right: 150, bottom: 60, left: 30},
//     bubble_width = 500 - bubble_margin.left - bubble_margin.right,
//     bubble_height = 720 - bubble_margin.top - bubble_margin.bottom;

// // append the svg object to the body of the page
// var bubble_svg = d3.select("#bubble_dataviz")
//   .append("svg")
//     .attr("width", bubble_width + bubble_margin.left + bubble_margin.right)
//     .attr("height", bubble_height + bubble_margin.top + bubble_margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + bubble_margin.left + "," + bubble_margin.top + ")");
    
//     // ---------------------------//
//   //       AXIS  AND SCALE      //
//   // ---------------------------//

//   // Add X axis
//   var bubble_x = d3.scaleBand()
//   .domain(data.map(item =>item.Ingredients))
//   .range([ 0, bubble_width ]);
//   bubble_svg.append("g")
//   .attr("transform", "translate(0," + bubble_height + ")")
//   .call(d3.axisBottom(bubble_x).ticks(3))
//   .attr("class", "xAxes")
//     .selectAll("text")
//     .attr("y", 0)
//     .attr("x", 9)
//     .attr("dy", ".35em")
//     .attr("transform", "rotate(90)")
//     .style("text-anchor", "start");;

//   // Add X axis label:
//   bubble_svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", bubble_width)
//       .attr("y", bubble_height+70 )
//       .text("Nutrients In Breastmilk")
//       .attr("font-size", 20)

//     // Add Y axis
//   var bubble_y = d3.scaleLinear()
//   .domain([30, 80])
//   .range([ bubble_height, 0]);
// bubble_svg.append("g")
//   .call(d3.axisLeft(bubble_y));

//    // Add Y axis label:
//    bubble_svg.append("text")
//    .attr("text-anchor", "end")
//    .attr("x", 0)
//    .attr("y", -20 )
//    .text("Median (IQR) mmol/L")
//    .attr("text-anchor", "start")
//    .attr("font-size", 20)

//    // Add a scale for bubble size
//   var z = d3.scaleSqrt()
//   .domain([0, 100])
//   .range([ 2, 60]);

// // Add a scale for bubble color
// var myColor = d3.scaleOrdinal()
//   .domain(["Linoleic acid", "Diglycerides", "Monoglycerides", 
//   "DHA", "Omega 3"])
//   .range(d3.schemeSet1);


//    // ---------------------------//
//   //      TOOLTIP               //
//   // ---------------------------//

//   // -1- Create a tooltip div that is hidden by default:
//   var bubble_tooltip = d3.select("#bubble_dataviz")
//     .append("div")
//       .style("opacity", 0)
//       .attr("class", "tooltip")
//       .style("background-color", "black")
//       .style("border-radius", "5px")
//       .style("padding", "10px")
//       .style("color", "white")
//  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
//  var showTooltip = function(d) {
//     bubble_tooltip
//       .transition()
//       .duration(200)
//       bubble_tooltip
//       .style("opacity", 1)
//       .html("nutrient: " + d.Ingredients)
//       .style("left", (d3.mouse(this)[0]+30) + "px")
//       .style("top", (d3.mouse(this)[1]+30) + "px")
//   }
//   var moveTooltip = function(d) {
//     bubble_tooltip
//       .style("left", (d3.mouse(this)[0]+30) + "px")
//       .style("top", (d3.mouse(this)[1]+30) + "px")
//   }

//   var hideTooltip = function(d) {
//     bubble_tooltip
//       .transition()
//       .duration(200)
//       .style("opacity", 0)
//   }

//   // ---------------------------//
//   //       CIRCLES              //
//   // ---------------------------//

// //   // Add dots
// //   bubble_svg.append('g')
// //     .selectAll("dot")
// //     .data(data)
// //     .enter()
// //     .append("circle")
// //       .attr("class", function(d) { return "bubbles " + d.Ingredients })
// //       .attr("cx", function (d) { return x(+(d.Ingredients)); } )
// //       .attr("cy", function (d) { return y(+(d.Percentage)); } )
// //       .attr("r", function (d) { return z(d.Percentage); } )
// //       .style("fill", function (d) { return myColor(d.Ingredients); } )
// //     // -3- Trigger the functions for hover

// //     .on("mouseover", showTooltip )
// //     .on("mousemove", moveTooltip )
// //     .on("mouseleave", hideTooltip )

        } 
    init(); 