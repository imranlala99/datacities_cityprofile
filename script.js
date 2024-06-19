
document.addEventListener("DOMContentLoaded", function() {
    const citySelect = document.getElementById("city-select");
    const cityProfileContent = document.getElementById("city-profile-content");
    const dataSourceLink = document.getElementById("data-source-link");
    const hospitalMap = L.map('hospitalMap').setView([0.49649,33.19050], 13); // Initial view, can be updated dynamically
    const schoolMap = L.map('schoolMap').setView([0.49649,33.19050], 13); // Initial view, can be updated dynamically
    const tourismMap = L.map('tourismMap').setView([0.49649,33.19050], 13); // Initial view, can be updated dynamically

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(hospitalMap);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(schoolMap);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(tourismMap);

    const cityData = {
        city1: {
            name: "Jinja",
            location: [0.49649,33.19050],
            graphData: {
                datasets: [{
                    label: 'Jinja Buildings',
                    data: jinja_buildings_data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            image_paths: jinja_image_paths,
            healthData: 'data/jinja_health_data.geojson',
            schoolData: 'data/jinja_schools_data.geojson',
            tourismData: 'data/jinja_tourism_data.geojson',
            dataSource: "https://example.com/city1-data"
        },
        city2: {
            name: "Fort Portal",
            location: [0.65460, 30.25485],
            graphData: {
                label: 'Fort Portal Buildings',
                datasets: [{
                    label: 'City 2 Dataset',
                    data: fort_buildings_data,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            image_paths: fort_image_paths,
            healthData: 'data/fort_health_data.geojson',
            schoolData: 'data/fort_school_data.geojson',
            tourismData: 'data/fort_tourism_data.geojson',

            dataSource: "https://example.com/city2-data"
        }
    };

    let slideIndex = 0;
    let slideInterval;
    const fileNames = ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
    
    function loadimages(paths) {
        // for each div in the slider class, edit the src to be the corresponding image indexed in the path array
        let slider = document.getElementsByClassName("slides");
        if (!slider) {
            console.error("No slider elements found");
            return;
        }
        for (let i = 0; i < paths.length; i++) {
            if (!paths[i] || !slider[i]) {
                console.error(`Invalid path or slider element at index ${i}`);
                continue;
            }

            // reassign the src property of the image element
            slider[i].querySelector("img").src = paths[i];
        }
    }
    function showSlides() {
        let slides = document.getElementsByClassName("slides");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}    
        slides[slideIndex-1].style.display = "block";  
        document.getElementById("file-name").innerText = fileNames[slideIndex-1];
        document.getElementById("slideRange").value = slideIndex;
    }

    function startSlides() {
        stopSlides();
        slideInterval = setInterval(showSlides, 1000); // Change image every 1 second
    }

    function stopSlides() {
        clearInterval(slideInterval);
    }

    function currentSlide(n) {
        slideIndex = n - 1;
        showSlides();
    }

    
    function loadCityData(city) {
        const cityobject = cityData[city];
        const data = cityobject.graphData.datasets[0].data;
        
        // initialize images
        loadimages(cityobject.image_paths);

        // Plotly graph
        const ctx = document.getElementById('cityGraph');
        const trace1 = {
            x: data.map(d => d.year),
            y: data.map(d => d.total_buildings_area_sqkm),
            mode: 'lines+markers',
            name: 'Total Buildings Area (sq km)',
            marker: { color: 'red' }
        };
        const trace2 = {
            x: data.map(d => d.year),
            y: data.map(d => d.building_count),
            mode: 'lines+markers',
            name: 'Building Count',
            marker: { color: 'blue' },
            yaxis: 'y2'
        };
        const charttitle = cityobject.name + ' Buildings: Area and Count Trends (2016-2023)';
        const layout = {
            title: charttitle,
            xaxis: { title: 'Year' },
            yaxis: { title: 'Total Buildings Area (sq km)', rangemode: 'normal' },
            yaxis2: {
                title: 'Building Count',
                overlaying: 'y',
                side: 'right',
                rangemode: 'normal'
            },
            legend: {
                orientation: 'v',  // Change to vertical orientation
                x: 0.06,  // Positioning legend within the plot area
                y: 0.9,
                xanchor: 'left',
                yanchor: 'top',
                font: {
                    size: 10  // Reduce font size
                }
            },
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 50
            }

        };
        Plotly.react(ctx, [trace1, trace2], layout);

        // Update buildings table
        const dataArray = data.map(d => [d.year, d.total_buildings_area_sqkm, d.building_count, d.area_growth_rate, d.building_count_growth_rate]);
        const table = $('#cityTable').DataTable();
        table.clear().rows.add(dataArray).draw();

        // Update data source link
        dataSourceLink.href = cityobject.dataSource;

        // Update the hospital div
        hospitalMap.setView([cityobject.location[0], cityobject.location[1]], 11);
        fetch(cityobject.healthData)
        .then(response => response.json())
        .then(data => {
            // Add GeoJSON layer to the map
            L.geoJSON(data).addTo(hospitalMap)
            
            // Populate DataTable
            const tableData = data.features.map(feature =>
                    [feature.properties.name,
                    feature.properties.amenity,
                    feature.properties.admin4Name_en]);
            const dataTable = $('#hospitalTable').DataTable();
            dataTable.clear().rows.add(tableData).draw();
            
            // Create hospital pie chart
            const amenityCounts = data.features.reduce((acc, feature) => {
                const amenity = feature.properties.amenity;
                acc[amenity] = (acc[amenity] || 0) + 1;
                return acc;
            }, {});
            const pieData = [{
                values: Object.values(amenityCounts),
                labels: Object.keys(amenityCounts),
                type: 'pie'
            }];
            const ctx = document.getElementById('hospitalPieChart');
            Plotly.react(ctx, pieData);
        });



        // Update the school div
        schoolMap.setView([cityobject.location[0], cityobject.location[1]], 11);
        fetch(cityobject.schoolData)
        .then(response => response.json())
        .then(data => {
            // Add GeoJSON layer to the map
            L.geoJSON(data).addTo(schoolMap)

            // Populate DataTable
            const tableData = data.features.map(feature =>
                    [feature.properties.name,
                    feature.properties.amenity,
                    feature.properties["addr:city"]]);
            const dataTable = $('#schoolTable').DataTable();
            dataTable.clear().rows.add(tableData).draw();

            // Create hospital pie chart
            const amenityCounts = data.features.reduce((acc, feature) => {
                const amenity = feature.properties.amenity;
                acc[amenity] = (acc[amenity] || 0) + 1;
                return acc;
            }, {});
            const pieData = [{
                values: Object.values(amenityCounts),
                labels: Object.keys(amenityCounts),
                type: 'pie'
            }];
            const ctx = document.getElementById('schoolPieChart');
            Plotly.react(ctx, pieData);
        });
        
        // Update the tourism div
        tourismMap.setView([cityobject.location[0], cityobject.location[1]], 11);
        fetch(cityobject.tourismData)
        .then(response => response.json())
        .then(data => {
            // Add GeoJSON layer to the map
            L.geoJSON(data).addTo(tourismMap)

            // Populate DataTable
            const tableData = data.features.map(feature =>
                    [feature.properties.name,
                    feature.properties.fclass]);
            const dataTable = $('#tourismTable').DataTable();
            dataTable.clear().rows.add(tableData).draw()

            // Create school pie chart
            const fclassCounts = data.features.reduce((acc, feature) => {
                const fclass = feature.properties.fclass;
                acc[fclass] = (acc[fclass] || 0) + 1;
                return acc;
            }, {});
            const pieData = [{
                values: Object.values(fclassCounts),
                labels: Object.keys(fclassCounts),
                type: 'pie'
            }];
            const ctx = document.getElementById('tourismPieChart');
            Plotly.react(ctx, pieData);
        });

    }

    citySelect.addEventListener("change", function() {
        loadCityData(citySelect.value);
    });

    // Initialize table
    $('#cityTable').DataTable();

    // Load default city data on initial load
    loadCityData(citySelect.value);

    // Initialize the first slide
    currentSlide(1);
    // Make functions globally accessible
    window.startSlides = startSlides;
    window.stopSlides = stopSlides;
    window.currentSlide = currentSlide;


});


/**
            // Add hover interaction
            $('#hospitalTable tbody').on('mouseenter', 'tr', function() {
                const rowData = dataTable.row(this).data();
                highlightFeature(rowData, true);
            });

            $('#hospitalTable tbody').on('mouseleave', 'tr', function() {
                const rowData = dataTable.row(this).data();
                highlightFeature(rowData, false);
            });

            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: function() {
                        highlightFeature(feature.properties, true);
                        highlightTableRow(feature.properties.name, true);
                    },
                    mouseout: function() {
                        highlightFeature(feature.properties, false);
                        highlightTableRow(feature.properties.name, false);
                    }
                });
            }

            function highlightFeature(props, highlight) {
                geojsonLayer.eachLayer(layer => {
                    if (layer.feature.properties.name === props.name) {
                        if (highlight) {
                            layer.setStyle({
                                color: 'yellow',
                                weight: 5
                            });
                        } else {
                            geojsonLayer.resetStyle(layer);
                        }
                    }
                });
            }

            function highlightTableRow(name, highlight) {
                $('#hospitalTable tbody tr').each(function() {
                    const rowData = dataTable.row(this).data();
                    if (rowData.name === name) {
                        if (highlight) {
                            $(this).addClass('highlight');
                        } else {
                            $(this).removeClass('highlight');
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching the GeoJSON data:', error)); */
        