const canvas = d3.select(".canva");

// add an svg element
const svg = canvas.append("svg")
            .attr("width", 1000)
            .attr("height", 1000);

const margin = {top:20, right:20, bottom:70, left:70};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

//Main Canvas
const mainCanvas = svg.append("g")
                      .attr("width", graphWidth / 2)
                      .attr("height", graphHeight / 2)
                      .attr("transform", `translate(${margin.left}, ${margin.right  + 160})`);


//Load csv file
async function init() {
    const data = await d3.csv('Breastfeeding_Rates.csv');
    //Parse data

    
    var states_rates = d3.range(data.length)
                .map(function (d){
                    const state = data[d].State;
                    const any = data[d].Any; 
                    const six_months = data[d].six_months;
                    const twelve_months = data[d].twelve_months;
                    const exclusive_3_months = data[d].Exclusive_3_months;
                    const exclusive_6_months = data[d].Exclusive_6_months;
                    const formula = data[d].formula;
                    // country = data[d].country.split(",");
                    
                 d = {
                    state,
                    any,
                    six_months,
                    twelve_months,
                    exclusive_3_months,
                    exclusive_6_months,
                    formula

                 } 
                
            return d;

           

        });

    //Set the ranges and domains
    var x = d3.scaleLinear().domain([0,12]).range([0, graphWidth]);
    var y = d3.scaleLinear().domain([0,d3.max(states_rates, d=>d.any)]).range([graphHeight,0]);
    //Add Axes
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    mainCanvas.append("g")
                .attr("transform", `translate(0, ${graphHeight})`)
                .call(xAxis)
    mainCanvas.append("g")
                .call(yAxis);
    //Create Line Graph
    var valueLine = d3.line()
                      .x(function(d,i){return x(d[i])})
                      .y(function(d,i){return y(d[i])})
    //Add the valueLine path
    mainCanvas.append("path")
              .datum(data)
    .attr("class", "line")
    .attr("d", d3.line()
        .x(function(d) { return x(d.any) })
        .y(function(d) { return y(d.value) })
        )
}


init();