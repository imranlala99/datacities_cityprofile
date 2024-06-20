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
        dataSource: "pages/jinjadatapage.html"
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

        dataSource: "pages/fortdatapage.html"
    }
};
