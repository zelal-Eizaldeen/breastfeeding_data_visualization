// const canvas = d3.select(".canva");
const canvas = d3.select("#canva");

// add an svg element
// const svg = canvas.append("svg")
//             .attr("width", 600)
//             .attr("height", 700)
           
// const svg_Mum = canvas.append("svg")
//                     .attr("width", 600)
//                     .attr("height", 700)
                   
                    // .attr("class", "hide");


const margin = 50;
const graphWidth = 500;
const graphHeight = 500;
const type = d3.annotationLabel;
//Color
const mColors = d3.scaleOrdinal(d3['schemeSet2']);

const babyCheckbox = document.querySelector("#baby");
const motherCheckbox = document.querySelector("#mother");
d3.selectAll(".region_cb").on("change", function ()
 {
  var type = this.value;
  if (this.checked && type=="baby") { // adding data points
    motherCheckbox.checked=false;
    d3.select("svg").remove();
    init()
  }
  if (!this.checked && type=="baby"){
    
    d3.select("svg").remove();
    console.log("NOOOOOOO!!!")

  }
  if (!this.checked && type=="mother"){
    d3.select("svg").remove();
    console.log("NOOOOOOO MUMMMM!!!")

  }
  if (this.checked && type=="mother") { // adding data points
    d3.select("svg").remove();
    babyCheckbox.checked=false;
    init_mum()
   }
 });

 //Define the Tooltip
var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

async function init_mum() {
 const svg = canvas.append("svg")
            .attr("width", 1000)
            .attr("height", 750)
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
//Add annotation to the Mummy chart
const makeAnnotations_mums = d3.annotation()
.annotations(annotations_mums);
        const data = await d3.csv(
                    'Breastfeeding_Outcomes.csv');
                    var numberOfBaseTypeScale = d3.scaleOrdinal().domain(data.map(
                      d=>d.category_code_baby
                  ))
                
                  var distinctTypesScale = numberOfBaseTypeScale.domain().length;
                
                 var nodes = d3.range(data.length)
                                .map(function (d) {
                                    let i = + data[d].category_code_baby;
                                    d={
                                      cluster: i,
                                      Outcomes_Mum: data[d].Outcomes_Mum,
                                      Lower_Risk_Mum: data[d].Lower_Risk_Mum,
                                      Breastfeeding_Period_Mum:data[d].Breastfeeding_Period_Mum,
                                    }
                               return d;
                                });
                 //Array of colors
                 var legendColorsArray = ["#66c2a5", "#fc8d62", "#8da0cb","#e78ac3","#a6d854"]
                 mColors.domain(data.map(d=>d.Breastfeeding_Period))
                         .range(legendColorsArray)
                    var x_Mum = d3.scaleBand() 
                    .domain(data.map(item =>item.Outcomes_Mum))
                    .range([0,graphWidth])
                    .paddingInner(0.3)
                
                    var y_Mum = d3.scaleLinear()
                    .domain([0,d3.max(data, d=>d.Lower_Risk)])
                    .range([graphHeight,0]);
                    var xAxis=svg.append("g")
                    .attr("transform", "translate("+(margin)+","+(graphHeight+margin)+")")
                    .call(d3.axisBottom(x_Mum))
                    .attr("class", "xAxes")
                    .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(90)")
                    .style("text-anchor", "start");
                    var yAxis=svg.append("g").attr("transform","translate("+margin+","+margin+")")
                    .call(d3.axisLeft(y_Mum).tickValues([10, 20,30,40,50,60,70]).ticks(20, "~s"));
          
                       
                    ///Mummies Bar Chart
        svg.append("text")
        .text("Benefits For Mothers")
        .attr("x", margin)
        .attr("y", margin - 4 )
        .attr("font-size", 20)
        svg.selectAll('rect')
        .data(nodes)
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
        // .attr("fill",(d,i,n)=>d3.select(n[0]).style("fill", "#31a354"))
        // .attr("fill", "#e5f5e0")
        .style("fill", function(d){
          return mColors(d.cluster / distinctTypesScale)
    })
        svg.append("g")
        .attr("class", "annotation-group").call(makeAnnotations_mums);
    //Add Color Legends
//Legends
const legendGroup = svg.append("g")
//.attr("transform", `translate(${graphWidth + 100}, 30)`);
legendGroup.append("circle")
.attr("cx",graphHeight+margin+100)
.attr("cy",130).attr("r", 6)
.style("fill", "#E072B6")
legendGroup.append("circle")
.attr("cx",graphHeight+margin+100)
.attr("cy",160).attr("r", 6)
.style("fill", "#a6d854")
legendGroup.append("circle")
.attr("cx",graphHeight+margin+100)
.attr("cy",190).attr("r", 6)
.style("fill", "#66c2a5")

legendGroup.append("text")
            .attr("x", graphHeight+margin+120)
            .attr("y", 130)
            .text("Exclusive")
            .style("font-size", "18px")
            .attr("alignment-baseline","middle")
            
legendGroup.append("text")
.attr("x", graphHeight+margin+120).attr("y", 160)
.text("For 6 months").style("font-size", "18px")
.attr("alignment-baseline","middle")
  
legendGroup.append("text").attr("x", graphHeight+margin+120)
.attr("y", 190).text("Ever")
.style("font-size", "18px").attr("alignment-baseline","middle")
        }
    

///// Initiate Baby Chart //////////
async function init() {

  const svg = canvas.append("svg")
  .attr("width", 1000)
  .attr("height", 750)

  /////Annotations ////////////
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
 // Add annotation to the baby chart
 const makeAnnotations = d3.annotation()
 .annotations(annotations);

  const data = await d3.csv(
        'Breastfeeding_Outcomes.csv'
    );
    var numberOfBaseTypeScale = d3.scaleOrdinal().domain(data.map(
      d=>d.category_code_baby
  ))

  var distinctTypesScale = numberOfBaseTypeScale.domain().length;

 var nodes = d3.range(data.length)
                .map(function (d) {
                    let i = + data[d].category_code_baby;
                    d={
                      cluster: i,
                      Outcomes: data[d].Outcomes,
                      Lower_Risk: data[d].Lower_Risk,
                      Breastfeeding_Period:data[d].Breastfeeding_Period,
                    }
               return d;
                });
                console.log(nodes)
 //Array of colors
 var legendColorsArray = ["#66c2a5", "#fc8d62", "#8da0cb","#e78ac3","#a6d854"]
 mColors.domain(data.map(d=>d.Breastfeeding_Period))
         .range(legendColorsArray)
   var x = d3.scaleBand() 
              .domain(data.map(item =>item.Outcomes))
              .range([0,graphWidth])
              .paddingInner(0.3)
            //   .paddingOuter(0.6);
    var y = d3.scaleLinear().domain([0,d3.max(data, d=>d.Lower_Risk)]).range([graphHeight,0]);
  svg.append("g")
                   .attr("transform", "translate("+(margin)+","+(graphHeight+margin)+")")
                   .call(d3.axisBottom(x))
                //    .tickFormat((d,i)=>["Colitis","SIDS","Diabetes1","Neonatal Mortality"][i]))
                   
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");
   svg.append("g").attr("transform", "translate("+margin+","+margin+")").call(d3.axisLeft(y));
      
    svg.append("text")
        .text("Benefits For Babies")
        .attr("x", margin)
        .attr("y", margin - 4 )
        .attr("font-size", 20)
    svg.selectAll('rect')
        .data(nodes)
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
        // .attr("fill",(d,i,n)=>d3.select(n[0]).style("fill", "#31a354"))
        // .attr("fill", "#e5f5e0")
        .style("fill", function(d){
          return mColors(d.cluster / distinctTypesScale)
    })
       
        svg.append("g")
           .attr("class", "annotation-group").call(makeAnnotations);

 //Add Color Legends
//Legends
const legendGroup = svg.append("g")
//.attr("transform", `translate(${graphWidth + 100}, 30)`);
legendGroup.append("circle")
.attr("cx",graphHeight+margin+100)
.attr("cy",130).attr("r", 6)
.style("fill", "#E072B6")
legendGroup.append("circle")
.attr("cx",graphHeight+margin+100)
.attr("cy",160).attr("r", 6)
.style("fill", "#a6d854")
legendGroup.append("circle")
.attr("cx",graphHeight+margin+100)
.attr("cy",190).attr("r", 6)
.style("fill", "#66c2a5")

legendGroup.append("text")
            .attr("x", graphHeight+margin+120)
            .attr("y", 130)
            .text("Exclusive")
            .style("font-size", "18px")
            .attr("alignment-baseline","middle")
            
legendGroup.append("text")
.attr("x", graphHeight+margin+120).attr("y", 160)
.text("For 6 months").style("font-size", "18px")
.attr("alignment-baseline","middle")
  
legendGroup.append("text").attr("x", graphHeight+margin+120)
.attr("y", 190).text("Ever")
.style("font-size", "18px").attr("alignment-baseline","middle")


          } 
    // init(); 