// Select html elements where data inputs are needed.
var selectID = d3.select("#selDataset");
var demo = d3.select("#sample-metadata");
var barChart = d3.select("#bar");
var bubbleChart = d3.select("#bubble");

// Init function to define page when initally loaded.
function init() {

  //Reset previous data
  resetData();

  //Read samples.json using D3 library.
  d3.json("data/samples.json").then((data) => {
    //console.log(data);
    
    //Populate dropdown with ID options.
    data.names.forEach((name => {
      var option =selectID.append("option");
      option.text(name);
    }));

    //Get the first sample data to create the default plot.
    var firstSample = data.names[0];

    // Build the default plots and demographics table data.
    demographicData(firstSample);
    buildPlots(firstSample);
    
  });
}

// Create function to clear all previous data.
function resetData() {
  console.log("I am in resetData");
  demo.html("");
  barChart.html("");
  bubbleChart.html("");

};

// Create Demographic Data for selected sample id..
function demographicData(sample){
  d3.json("data/samples.json").then((data) => {

    // Get the metadata and filter for the selected sample id.
    var metadata = data.metadata;
    var selectMetadata = metadata.filter(object => object.id == sample)[0];

    // Populate the demographics table with each key value pair for the selected sample id. 
    Object.entries(selectMetadata).forEach(([key, value]) => {
      demo.append("h6").text(`${key}: ${value}`);
    });
    
  });

}

// Create Plots for selected sample id.
function buildPlots(sample){
  d3.json("data/samples.json").then((data) => {

    // Get sample data from json data
    var samples = data.samples;
    // Filter data for selected Id
    var selectData = samples.filter(object => object.id == sample)[0];

    // Store sample_values, otu_Ids, and otu_labels data into variables.
    var sampleValues = selectData.sample_values;
    var otuIds = selectData.otu_ids;
    var otuLabels = selectData.otu_labels;

  //*********************** */
  // Plot Bubble cart
  // ******************** */ 
    
    // Get the Data for building Bubble Chart.
    var traceBubble = {
      type: "scatter",
      mode: "markers",
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Jet'
      }
    };
     
    var dataBubble = [traceBubble];
    
    // Define layout for bubble chart.
    var layoutBubble = {
      title: "Bubble Chart for ID " + `${sample}`,
      height: 500,
      width: 1200,
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "VALUES"
      }
    };

    // Create a new bubble plot in the corresponding div element with data and layout defined above. 
    Plotly.newPlot("bubble", dataBubble, layoutBubble);



  //*********************** */
  // Plot Bar cart
  // ******************** */ 

    // Get the top 10 data for the sample and reverse it for horizontal bar plot.
    topOtuIds = otuIds.slice(0,10).reverse();
    topsampleValues = sampleValues.slice(0,10).reverse();
    topOtuLabels = otuLabels.slice(0,10).reverse();

    // Create trace for horizontal bar Plot
    var traceBar = {
      x: topsampleValues,
      y: topOtuIds.map(otuId => "OTU " + otuId),
      text: topOtuLabels,
      type: "bar",
      orientation: "h"
    };
    // Define data for horizontal bar plot
    var dataBar = [traceBar];

    // Apply the group bar mode to the layout
    var layoutBar = {
      title: "Bar Plot for ID " + `${sample}`,
      autosize: true,
      width: 600,
      height: 500,
      margin: {t:30, l:150},
      xaxis: {
        title: "VALUES"
      },
      yaxis: {
        title: "OTU ID"
      }
    }

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", dataBar, layoutBar);

  });

}

// Define function to create new plots and demographic table everytime a new sample is selected.
function optionChanged(newSample) {
  resetData();
  demographicData(newSample);
  buildPlots(newSample);
  
}

init();