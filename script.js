document.addEventListener("DOMContentLoaded", function() {
    const citySelect = document.getElementById("city-select");
    const dataSourceLink = document.getElementById("data-source-link");
    const hospitalMap = L.map('hospitalMap').setView([0.49649, 33.19050], 13);
    const schoolMap = L.map('schoolMap').setView([0.49649, 33.19050], 13);
    const tourismMap = L.map('tourismMap').setView([0.49649, 33.19050], 13);
    const shapefileMap = L.map('shapefileMap').setView([0.49649, 33.19050], 13);

    L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(shapefileMap);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(hospitalMap);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(schoolMap);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(tourismMap);

    let slideIndex = 0;
    let slideInterval;
    const fileNames = ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
    
    function loadImages(paths) {
        let slider = document.getElementsByClassName("slides");
        for (let i = 0; i < paths.length; i++) {
            if (!paths[i] || !slider[i]) continue;
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

    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup("Name: " + feature.properties.name + "<br>" +
                            "Type: " + feature.properties.amenity + "<br>" +
                            "Admin 4 Name: " + feature.properties.admin4Name_en);
            layer.on({
                mouseover: function(e) {
                    layer.openPopup();
                },
                mouseout: function(e) {
                    layer.closePopup();
                }
            });
        }
    }

    function clearLayers(map) {
        map.eachLayer(function(layer) {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });
    }
    function getHospitalCategoryIcon(category) {
        let svgIcon;
        switch (category) {
            case 'hospital':
                svgIcon = 'images/icons/hospital_dark.svg';
                break;
            case 'clinic':
                svgIcon = 'images/icons/hospital_light.svg';
                break;
            default:
                svgIcon = 'images/icons/first_aid_light.svg';
                break;
        }
        console.log(svgIcon);
    
        return L.divIcon({
            html: `<img src="${svgIcon}" style="height: 16px; width: 16px;">`,
            className: 'icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var categories = ['hospital', 'clinic', 'pharmacy'];
        var links = [
            'images/icons/hospital_dark.svg',
            'images/icons/hospital_light.svg',
            'images/icons/first_aid_light.svg'
        ];

        categories.forEach(function(category, index) {
            var img = document.createElement('img');
            img.src = links[index];
            img.style.height = '16px';
            img.style.width = '16px';

            var span = document.createElement('span');
            span.style.backgroundColor = 'white';
            span.appendChild(img);

            var label = document.createElement('label');
            label.innerHTML = ' ' + category + '<br>';
            label.insertBefore(span, label.firstChild);

            div.appendChild(label);
        });

        return div;
    };

    legend.addTo(hospitalMap);


    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Subcounty Name</h4>' +  (props ?
            '<b>' + props.admin4Name_en + '</b>'
            : 'Hover over an area');
    };

    info.addTo(shapefileMap);

    var Shapefilegeojson;
    function shapestyle(feature) {
        return {
            fillColor: '#3388ff',
            weight: 2,
            opacity: 1,
            color: 'black',
            dashArray: '5',
            fillOpacity: 0.1
        };
    }

    function highlightFeature(e) {
        var layer = e.target;
    
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
    
        layer.bringToFront();
        info.update(layer.feature.properties);
    }
    

    function resetHighlight(e) {
        Shapefilegeojson.resetStyle();
        info.update();
    }


    
    function onEachShapeFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function(e) {
                shapefileMap.fitBounds(e.target.getBounds());
            }
        });
    }
    
    
    function changetext(city) {
        const textpaths = cityData[city].text
        document.getElementById("citydescription").innerText = textpaths.intro_description;
        document.getElementById("building-viz-title").innerText = textpaths.buildings_viz_title;
        document.getElementById("building-viz-description").innerText = textpaths.buildings_viz_description;
    }

    function loadCityData(city) {
        console.log("Loading data for city:", city);
        const cityobject = cityData[city];
        const data = cityobject.graphData.datasets[0].data;

        // Initialize images
        loadImages(cityobject.image_paths);

        // Change text content
        changetext(city);

        // Update shapefile Map
        shapefileMap.setView([cityobject.location[0], cityobject.location[1]], 11);
        clearLayers(shapefileMap);
        fetch(cityobject.shapefile)
        .then(response => response.json())
        .then(data => {
            Shapefilegeojson = L.geoJSON(data, {
                style: shapestyle,
                onEachFeature: onEachShapeFeature
            }).addTo(shapefileMap);
            console.log("Shapefile loaded for", city);
        });

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
                orientation: 'v',
                x: 0.06,
                y: 0.9,
                xanchor: 'left',
                yanchor: 'top',
                font: {
                    size: 10,
                    family: 'Roboto, sans-serif'
                }
            },
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 50
            },
            font: {
                family: 'Roboto, sans-serif'
            }
        };
        Plotly.react(ctx, [trace1, trace2], layout);

        // Update buildings table
        const dataArray = data.map(d => [d.year, d.total_buildings_area_sqkm, d.building_count, d.area_growth_rate, d.building_count_growth_rate]);
        const table = $('#cityTable').DataTable();
        table.clear().rows.add(dataArray).draw();

        // Update data source link
        dataSourceLink.href = cityobject.dataSource;

        // Update the hospital map
        hospitalMap.setView([cityobject.location[0], cityobject.location[1]], 11);
        clearLayers(hospitalMap);
        fetch(cityobject.healthData)
        .then(response => response.json())
        .then(data => {
            var geojson = L.geoJSON(data, {
                onEachFeature: onEachFeature,
                pointToLayer: (feature, latlng) => {
                    const category = feature.properties.amenity;
                    const icon = getHospitalCategoryIcon(category);
                    return L.marker(latlng, { icon: icon });
                }
                }).addTo(hospitalMap);
                console.log("Hospital data loaded for", city);
            
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
            Plotly.react(ctx, pieData, {
                font: { family: 'Roboto, sans-serif' }
            });
        });

        // Update the school map
        schoolMap.setView([cityobject.location[0], cityobject.location[1]], 11);
        clearLayers(schoolMap);
        fetch(cityobject.schoolData)
        .then(response => response.json())
        .then(data => {
            const geojson = L.geoJSON(data, {
                onEachFeature: onEachFeature
            }).addTo(schoolMap);
            console.log("School data loaded for", city);

            // Populate DataTable
            const tableData = data.features.map(feature =>
                [feature.properties.name,
                feature.properties.amenity,
                feature.properties["addr:city"]]);
            const dataTable = $('#schoolTable').DataTable();
            dataTable.clear().rows.add(tableData).draw();

            // Create school pie chart
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
            Plotly.react(ctx, pieData, {
                font: { family: 'Roboto, sans-serif' }
            });
        });
        
        // Update the tourism map
        tourismMap.setView([cityobject.location[0], cityobject.location[1]], 11);
        clearLayers(tourismMap);
        fetch(cityobject.tourismData)
        .then(response => response.json())
        .then(data => {
            const geojson = L.geoJSON(data, {
                onEachFeature: onEachFeature
            }).addTo(tourismMap);
            console.log("Tourism data loaded for", city);

            // Populate DataTable
            const tableData = data.features.map(feature =>
                [feature.properties.name,
                feature.properties.fclass]);
            const dataTable = $('#tourismTable').DataTable();
            dataTable.clear().rows.add(tableData).draw();

            // Create tourism pie chart
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
            Plotly.react(ctx, pieData, {
                font: { family: 'Roboto, sans-serif' }
            });
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
