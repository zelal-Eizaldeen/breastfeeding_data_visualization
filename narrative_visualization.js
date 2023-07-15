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
    const data = await d3.csv(
        'netflix_titles.csv'
    );
    let country_produced=[];
    var nodes = d3.range(data.length)
                .map(function (d){
                    // let i = + data[d].
                    const show_id = data[d].show_id;
                    const type  =  data[d].type;
                    const title = data[d].title;
                    const director = data[d].director;
                    country = data[d].country.split(",");
                    console.log(country);

                    d = {
                        // cluster: i,
                        // radius: r,

                        show_id,
                        type,
                        title,
                        director,
                        x: Math.cos(d / data.length * 2 * Math.PI) * 200 + graphWidth / 2 + Math.random(),
                        y: Math.sin(d / data.length * 2 * Math.PI) * 200 + graphWidth / 2 + Math.random(),




                    };
                    // if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                    
                })
                

 }

 init();


