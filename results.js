const canvas = d3.select(".canva");

// add an svg element
const svg = canvas.append("svg")
            .attr("width", 600)
            .attr("height", 700);
const svg_Mum = canvas.append("svg")
                    .attr("width", 600)
                    .attr("height", 700);

// const margin = {top:50, right:50, bottom:50, left:50};
const margin = 50;
// const graphWidth = 600 - margin.left - margin.right;
const graphWidth = 500;

const graphHeight = 500;
const type = d3.annotationLabel;

// const graphHeight = 600 - margin.top - margin.bottom;



//Main Canvas
// const mainCanvas = svg.append("g")
//                       .attr("width", graphWidth/2 )
//                       .attr("height", graphHeight/2 )
//                       .attr("transform", `translate(${margin.left}, ${margin.right  + 160})`);

//Y Text Axis
const textYAxisGroup = svg.append("g")
                            .attr("transform", `translate(${margin - 10}, 30)`)


// const yText = svg.append("text")
//                             .text("% Lower Risk")
//                             .attr("y", 0)
//                             .attr("x", graphHeight/3)
//                             .attr("font-size", 20)
//                             .attr("transform", "rotate(90)")
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
                   
    .attr("class", "xAxes")
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");
    var yAxis = svg.append("g").attr("transform", "translate("+margin+","+margin+")").call(d3.axisLeft(y));
    //var xAxis = svg.append("g").attr("transform", "translate("+margin.bottom+","+(graphHeight+margin.top)+")").call(d3.axisBottom(x));
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

    // Features of the annotation
const annotations = [
    {
      note: {
        label: "Sudden Infant Death Syndrome reduced to 64%",
        title: "SIDS",
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
  
  // Add annotation to the chart
  const makeAnnotations = d3.annotation()
    .annotations(annotations);
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
            //div.html("<p> <b>Breastfeeding Duration: </b>"+ d.Breastfeeding_Period+"</p>")
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
            div.html("<p> <b>Breastfeeding Duration: </b>"+ d.Breastfeeding_Period_Mum+"</p>")
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
       

    } 
    init(); 