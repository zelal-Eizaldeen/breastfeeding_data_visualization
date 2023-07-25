// const canvas = d3.select(".canva");
const canvas = d3.select("#canva");
const margin = 150;
const graphWidth = 500;
const graphHeight = 500;
const type = d3.annotationLabel;
const pdf = document.querySelector("#download_pdf");
// pdf.style.visibility = 'hidden'; 
//Array of colors
var legendColorsArray = ["#8da0cb", "#66c2a5"]
//Color
const mColors = d3.scaleOrdinal(d3['schemeSet2']);
const babyCheckbox = document.querySelector("#baby");
const motherCheckbox = document.querySelector("#mother");

d3.selectAll(".region_cb").on("change", function ()
 {
  var type = this.value;
  if (this.checked && type=="baby") { // adding data points
    motherCheckbox.checked=false;
    pdf.style.visibility = 'visible';     // Show
    d3.select("svg").remove();

    init()
  }
  if (!this.checked && type=="baby"){
    
    d3.select("svg").remove();

  }
  if (!this.checked && type=="mother"){
    d3.select("svg").remove();

  }
  if (this.checked && type=="mother") { // adding data points
    d3.select("svg").remove();
    babyCheckbox.checked=false;
    pdf.style.visibility = 'visible';     // Show

    init_mum()
   }
 });
 var click_links = function(d,i,n){
 
  if (motherCheckbox.checked && motherCheckbox.value=="mother") { 
    if(i == 0)

    {
      window.open("https://www.cdc.gov/diabetes/basics/gestational.html#:~:text=Gestational%20diabetes%20is%20a%20type,pregnancy%20and%20a%20healthy%20baby.")
      
    }
    if(i === 1)
    {
     
 window.open("https://www.cdc.gov/reproductivehealth/maternalinfanthealth/diabetes-during-pregnancy.htm#:~:text=Diabetes%20during%20pregnancy%E2%80%94including%20type,%2C%20stillbirth%2C%20and%20preterm%20birth.")
      

    }
    if(i === 2)
    {
     window.open("https://www.nhs.uk/conditions/ovarian-cancer/")

    }
    if(i === 3)
    {
       
      window.open("https://www.mayoclinic.org/diseases-conditions/breast-cancer/symptoms-causes/syc-20352470")

    }
    if(i === 4)
    {
    
      window.open("https://www.icr.ac.uk/blogs/science-talk/page-details/premenopausal-breast-cancer-how-the-icr-is-helping-get-to-grips-with-the-data")


    }
    if(i === 5)
    {
      window.open("https://www.who.int/news-room/fact-sheets/detail/hypertension#:~:text=Hypertension%20(high%20blood%20pressure)%20is,get%20your%20blood%20pressure%20checked.")

    }
    if(i===6){
      window.open("https://www.cancer.gov/types/uterine/patient/endometrial-treatment-pdq#:~:text=and%20treatment%20options.-,Endometrial%20cancer%20is%20a%20disease%20in%20which%20malignant%20(cancer)%20cells,is%20about%203%20inches%20long.")
    }
    if(i===7){
      window.open("https://www.cancer.gov/types/thyroid/patient/thyroid-treatment-pdq#:~:text=and%20treatment%20options.-,Thyroid%20cancer%20is%20a%20disease%20in%20which%20malignant%20(cancer)%20cells,tissue%2C%20connects%20the%20two%20lobes.")
    }
  }

  ///////babies disease/////
  if (babyCheckbox.checked && babyCheckbox.value=="baby") { 
    if(i == 0)

    {
      window.open("https://www.chop.edu/conditions-diseases/ulcerative-colitis")
    }
    if(i === 1)
    {
     
 window.open("https://www.childrenshospital.org/conditions/sudden-infant-death-syndrome-sids#:~:text=What%20is%20SIDS%3F,review%20of%20the%20clinical%20history.")
      

    }
    if(i === 2)
    {
     window.open("https://www.mayoclinic.org/diseases-conditions/type-1-diabetes-in-children/symptoms-causes/syc-20355306")

    }
    if(i === 3)
    {
       
      window.open("https://www.who.int/news-room/fact-sheets/detail/levels-and-trends-in-child-mortality-report-2021")

    }
    if(i === 4)
    {
    
      window.open("https://www.icr.ac.uk/blogs/science-talk/page-details/premenopausal-breast-cancer-how-the-icr-is-helping-get-to-grips-with-the-data")


    }
    if(i === 5)
    {
      window.open("https://www.mayoclinic.org/diseases-conditions/type-2-diabetes-in-children/symptoms-causes/syc-20355318#:~:text=Type%202%20diabetes%20in%20children%20is%20a%20chronic%20disease%20that,occurs%20more%20commonly%20in%20adults.")

    }
    if(i===6){
      window.open("https://www.cedars-sinai.org/health-library/diseases-and-conditions---pediatrics/c/crohns-disease-in-children.html")
    }
    if(i===7){
      window.open("https://nationaleczema.org/eczema/children/")
    }
    if(i===8){
      window.open("https://aafa.org/asthma/living-with-asthma/asthma-in-infants/")
    }
    if(i===9){
      window.open("https://www.cedars-sinai.org/health-library/diseases-and-conditions---pediatrics/l/leukemia-in-children.html")
    }

  }
  }
 //Define the Tooltip
var div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);
            
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
 if(motherCheckbox.checked && motherCheckbox.value=="mother") {
      div.html(`
            <p> 
            <b>Disease: </b>
            ${d.Outcomes_Mum}
            <br>
            <b>Lower of: </b>
            ${d.Lower_Risk_Mum}%
            <br>
            <b>Breastfeeding Type: </b>
            ${d.Breastfeeding_Period_Mum}
            </p>
            <span style="color:#31a354; font-size:20px;"><b><u>Click For Details</b></u></span>
            `
 
            )
                .style("left", (d3.event.pageX+40) + "px")
                .style("top", (d3.event.pageY-140) + "px")
 }
 if(babyCheckbox.checked && babyCheckbox.value=="baby") {

 div.html(
  `<p> 
  <b>Disease: </b>
  ${d.Outcomes}
  <br>
  <b>Lower of: </b>
  ${d.Lower_Risk}%
  <br>
  <b>Breastfeeding Type: </b>
  ${d.Breastfeeding_Period}

  </p>
  <span style="color:#31a354; font-size:20px;"><b><u>Click For Details</b></u></span>

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

async function init_mum() {

 const svg = canvas.append("svg")
            .attr("width", 1000)
            .attr("height", 750)
  // Features of the annotation for mumies
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
    
    x: graphWidth/3,
    y: graphHeight/2.7,
    dy: 60,
    dx: 140
  }
]
   // Add annotation to the baby chart
   const makeAnnotations = d3.annotation()
   .annotations(annotations);

  const data = await d3.csv(
                    'Breastfeeding_Outcomes.csv');
    var numberOfBaseTypeScale = d3.scaleOrdinal()
    .domain(data.map(
        d=>d.category_code_Mum
    ))
  
    var distinctTypesScale = numberOfBaseTypeScale
            .domain().length;
  
    var nodes = d3.range(data.length)
                  .map(function (d) {
                                    let i = + data[d].category_code_Mum;
                                    d={
                                      cluster: i,
                                      Outcomes_Mum: data[d].Outcomes_Mum,
                                      Lower_Risk_Mum: data[d].Lower_Risk_Mum,
                                      Breastfeeding_Period_Mum:data[d].Breastfeeding_Period_Mum,
                                    }
                               return d;
                                });
 //Array of colors
  mColors.domain(data.map(d=>d.Breastfeeding_Period))
                         .range(legendColorsArray)
                var x_Mum = d3.scaleBand() 
               .domain(data.map(item =>item.Outcomes_Mum))
                    .range([0,graphWidth])
                    .paddingInner(0.3)
  // Add X axis label:
svg.append("text")
.attr("text-anchor", "end")
.attr("x", graphWidth+250)
.attr("y", graphHeight+200 )
.text("Disease Name");
  var y_Mum = d3.scaleLinear()
  .domain([0,d3.max(data, d=>d.Lower_Risk)])
  .range([graphHeight,0]);
  var xAxis=svg.append("g")
  .attr("transform", "translate("+(margin)+","+(graphHeight+margin)+")")
  .call(d3.axisBottom(x_Mum))
  
  .selectAll("text")
  .attr("y", 0)
  .attr("x", 9)
  .attr("dy", ".35em")
  .attr("transform", "rotate(90)")
  .style("text-anchor", "start");
  var yAxis=svg.append("g").attr("transform","translate("+margin+","+margin+")")
  .call(d3.axisLeft(y_Mum).tickValues([10, 20,30,40,50,60,70]).ticks(20, "~s"));

      // Add Y axis label:
   svg.append("text")
   .attr("text-anchor", "end")
   .attr("x", margin)
   .attr("y", 140 )
   .text("Percentages% of Lower Risk")
   .attr("text-anchor", "start")                 
  ///Mummies Bar Chart
    var title_mum =svg.append("g")

        title_mum.append("text")
        .text("Eight common diseases with their lower risk percentages in case of breastfeeding")
        .attr("x", margin)
        .attr("y", 50 )
        .attr("font-size", 20)

        svg.selectAll('rect')
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", "translate("+(margin)+","+margin+")")
        .append('rect')
        .attr("class","rect")
        
        .on("click", click_links)
        .on("mouseover",mouseover)
        .on("mouseout", mouseout)
        
        
           
        
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

    //Annotations
 svg.append("g")
 .attr("class", "annotation-group")
 .call(makeAnnotations)
 .transition().duration(2000).delay(500)
                       .style("opacity", 1);


    // //Add Color Legends
//Legends
const legendGroup = svg.append("g")
legendGroup.append("text").attr("x", graphHeight+margin+100)
.attr("y", 260).text("Click For Details")
.style("font-size", "20px")
.style("fill", "#31a354")
.attr("alignment-baseline","middle")

legendGroup.append("circle")
.attr("cx",graphHeight+margin+100)
.attr("cy",300).attr("r", 6)
.style("fill", "#798BBC").style("cursor","pointer")
.on("click", function() { window.open("ever.html"); }) // when clicked, opens window with google.com.

legendGroup.append("circle")
.attr("cx",graphHeight+margin+100)
.attr("cy",330).attr("r", 6)
.style("fill", "#66c2a5").style("cursor","pointer")
.on("click", function() { window.open("exclusive.html"); }) // when clicked, opens window with google.com.


legendGroup.append("text")
            .attr("x", graphHeight+margin+120)
            .attr("y", 300)
            .text("Ever Breastfeeding")
            .style("font-size", "18px")
            .attr("alignment-baseline","middle")
            .attr("class", "underline")
            .on("click", function() { window.open("ever.html"); }) 
            .on("mouseover", function() { 
              div.transition()
                    .duration(200)
                    .style("opacity", 0.9)
              div.html(
                        `<p> 
                        <b><u>Ever Breastfeeding Means: </b></u>
                        <br>
                        Mothers who were feeding their babies Breast Milk and Formula
                       </p>
                       <span style="color:#31a354; font-size:20px;"><b><u>Click For Details</b></u></span>
            
                       `)
            
                    .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px")
            
            }) 
            .on("mouseout", mouseout)
  
legendGroup.append("text").attr("x", graphHeight+margin+120)
.attr("y", 330).text("Exclusive Breastfeeding")
.style("font-size", "18px")
.attr("alignment-baseline","middle")
.attr("class", "underline")
.on("click", function() { window.open("exclusive.html")}) 
.on("mouseover", function() { 
  div.transition()
        .duration(200)
        .style("opacity", 0.9)
  div.html(
            `<p> 
            <b><u>Exclusive Breastfeeding Means: </b></u>
            <br>
            Mothers were ONLY feeding their babies Breast Milk
           </p>
           <span style="color:#31a354; font-size:20px;"><b><u>Click For Details</b></u></span>

           `)

        .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")

}) 
.on("mouseout", mouseout)
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
      wrap: 300,
      
    },
    connector: {
      end: "dot",        // Can be none, or arrow or dot
      type: "line",      // ?? don't know what it does
      lineType : "vertical",    // ?? don't know what it does
      endScale: 10     // dot size
    },
    color: ["#000000"],
    
    x: graphWidth/2.2,
    y: graphHeight/1.8,
    dy: -10,
    dx: 40
  }
]
 // Add annotation to the baby chart
 const makeAnnotations = d3.annotation()
 .annotations(annotations);

  const data = await d3.csv(
        'Breastfeeding_Outcomes.csv'
    );
    var numberOfBaseTypeScale = d3.scaleOrdinal()
    .domain(data.map(
      d=>d.category_code_baby
  ))

  var distinctTypesScale = numberOfBaseTypeScale
        .domain().length;

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

     // Add X axis label:
svg.append("text")
.attr("text-anchor", "end")
.attr("x", graphWidth+290)
.attr("y", graphHeight+200 )
.text("Disease Name");
   svg.append("g").attr("transform", "translate("+margin+","+margin+")")
   .call(d3.axisLeft(y));
      
    // Add Y axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", margin)
    .attr("y", 140 )
    .text("Percentages% of Lower Risk")
    .attr("text-anchor", "start") 
    ///////Title for baby chart   
    svg.append("text")
        .text("Ten common diseases in babies with their reduced risks")
        .attr("x", margin)
        .attr("y", 50 )
        .attr("font-size", 20)
    svg.selectAll('rect')
        .data(nodes)
        .enter()
        .append("g").attr("transform", "translate("+margin+","+margin+")")
        .append('rect')
        .attr("class","rect")
       
        .on("click", click_links) // when clicked, opens window 
        // .on("mouseover", function(d,i,n){
        //     d3.select(n[i])
        //       .transition()
        //       .duration(100)
        //       .style("opacity", 0.7);
        //     div.transition()
        //          .duration(200)
        //          .style("opacity", 0.9);
            //Tooltip
           
        //     div.html(
        //         `<p> 
        //         <b>Disease: </b>
        //         ${d.Outcomes}
        //         </br>
        //         <b>Lower of: </b>
        //         ${d.Lower_Risk}%
        //         </br>
        //         <b>Breastfeeding Duration: </b>
        //         ${d.Breastfeeding_Period}</p>`)

        //     .style("left", (d3.event.pageX) + "px")
        //         .style("top", (d3.event.pageY) + "px")
        // })
        .on("mouseover", mouseover)
        // .on("mousemove", mousemove)
        .on("mouseout", mouseout)
       
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
       
//Annotations
svg.append("g")
.attr("class", "annotation-group")
.call(makeAnnotations)
.transition().duration(2000).delay(500)
                      .style("opacity", 1);
 //Add Color Legends
//Legends
const legendGroup = svg.append("g")

legendGroup.append("text").attr("x", graphHeight+margin+100)
.attr("y", 260).text("Breastfeeding Types are..")
.style("font-size", "20px")
.style("fill", "#31a354")
.attr("alignment-baseline","middle")
legendGroup.append("circle")
.attr("cx",graphHeight+margin+100)
.attr("cy",300).attr("r", 6)
.style("fill", "#798BBC").style("cursor","pointer")
.on("click", function() { window.open("ever.html"); }) // when clicked, opens window with google.com.

legendGroup.append("circle")
.attr("cx",graphHeight+margin+100)
.attr("cy",330).attr("r", 6)
.style("fill", "#66c2a5").style("cursor","pointer")
.on("click", function() { window.open("exclusive.html"); }) // when clicked, opens window with google.com.


legendGroup.append("text")
            .attr("x", graphHeight+margin+120)
            .attr("y", 300)
            .text("Ever Breastfeeding")
            .style("font-size", "18px")
            .attr("alignment-baseline","middle")
            .attr("class", "underline")
            .on("click", function() { window.open("ever.html"); }) 
            .on("mouseover", function() { 
              div.transition()
                    .duration(200)
                    .style("opacity", 0.9)
              div.html(
                        `<p> 
                        <b><u>Ever Breastfeeding Means: </b></u>
                        <br>
                        Mothers who were feeding their babies Breast Milk and Formula
                       </p>
                       <span style="color:#31a354; font-size:20px;"><b><u>Click For Details</b></u></span>
            
                       `)
            
                    .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px")
            
            }) 
            .on("mouseout", mouseout)
            
          
legendGroup.append("text").attr("x", graphHeight+margin+120)
.attr("y", 330).text("Exclusive Breastfeeding")
.style("font-size", "18px")
.attr("alignment-baseline","middle")
.attr("class", "underline")
.on("click", function() { window.open("exclusive.html")}) 
.on("mouseover", function() { 
  div.transition()
        .duration(200)
        .style("opacity", 0.9)
  div.html(
            `<p> 
            <b><u>Exclusive Breastfeeding Means: </b></u>
            <br>
            Mothers were ONLY feeding their babies Breast Milk
           </p>
           <span style="color:#31a354; font-size:20px;"><b><u>Click For Details</b></u></span>

           `)

        .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")

}) 
.on("mouseout", mouseout)





          } 

          init()
