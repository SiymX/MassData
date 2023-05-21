document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("fileInput").addEventListener("change", handleFileUpload);
  });
  
  function handleFileUpload(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: 'array' });
      
      var crimeData = parseCrimeData(workbook); 
      
      createBarChart(crimeData); 
      createLineChart(crimeData); 
      createPieChart(crimeData); 
     
    };
    
    reader.readAsArrayBuffer(file);
  }
  
  function parseCrimeData(workbook) {
    var crimeData = [];
    var sheetName = workbook.SheetNames[0];
    
    var worksheet = workbook.Sheets[sheetName];
    var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    
    var locationIndex = 0;
    var stateIndex = 1;
    var dateIndex = 2;
    var yearIndex = 3;
    var summaryIndex = 4;
    var fatalitiesIndex = 5;
    var woundedIndex = 6;
    var totalVictimsIndex = 7;
    
    for (var i = 1; i < jsonData.length; i++) { 
      var crimeEntry = {
        location: jsonData[i][locationIndex],
        state: jsonData[i][stateIndex],
        date: jsonData[i][dateIndex],
        year: jsonData[i][yearIndex],
        summary: jsonData[i][summaryIndex],
        fatalities: jsonData[i][fatalitiesIndex],
        wounded: jsonData[i][woundedIndex],
        totalVictims: jsonData[i][totalVictimsIndex]
      };
      
      crimeData.push(crimeEntry);
    }
    
    return crimeData;
  }
  
  function createBarChart(crimeData) {
    var stateData = {};
  
    crimeData.forEach(function(entry) {
      if (stateData.hasOwnProperty(entry.state)) {
        stateData[entry.state]++;
      } else {
        stateData[entry.state] = 1;
      }
    });
  
    var labels = Object.keys(stateData);
    var data = Object.values(stateData);
  
    var ctx = document.getElementById("barChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Crime Count by State",
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.6)"
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Count"
            }
          },
          x: {
            title: {
              display: true,
              text: "State"
            }
          }
        }
      }
    });
  }
  
  function createLineChart(crimeData) {
    var yearlyData = {};
  
    crimeData.forEach(function(entry) {
      if (yearlyData.hasOwnProperty(entry.year)) {
        yearlyData[entry.year]++;
      } else {
        yearlyData[entry.year] = 1;
      }
    });
  
    var labels = Object.keys(yearlyData);
    var data = Object.values(yearlyData);
  
    var ctx = document.getElementById("lineChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Yearly Crime Count",
          data: data,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.3)"
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Count"
            }
          },
          x: {
            title: {
              display: true,
              text: "Year"
            }
          }
        }
      }
    });
  }
  
  function createPieChart(crimeData) {
    var summaryData = {};
  
    crimeData.forEach(function(entry) {
      if (summaryData.hasOwnProperty(entry.summary)) {
        summaryData[entry.summary]++;
      } else {
        summaryData[entry.summary] = 1;
      }
    });
  
    var labels = Object.keys(summaryData);
    var data = Object.values(summaryData);
  
    var ctx = document.getElementById("pieChart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"]
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Summary of Crimes"
        }
      }
    });
  }
  