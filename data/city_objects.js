const cityData = {
    city1: {
        name: "Jinja",
        location: [0.49649,33.19050],
        dataSource: "pages/jinjadatapage.html",
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
        text: {
            building_visualization_title: "Map Visualization of Jinja's Buildings from 2016-2023",
            buildings_viz_description:"The North Division sub-county of Mafubira saw concentrated growth in two particular areas. More analysis can be done as to why this is the case.",
            buildingsMap_download_text: "",
            buildings_report: "",
            hospitals_description: "",
            hospitalMap_download_text: "",
            schools_description: "",
            schoolsMap_download_text: "",
            tourism_description: "",
        }
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
        dataSource: "pages/fortdatapage.html",
        text: {
            building_visualization_title: "Map Visualization of Fort Portal's Buildings from 2016-2023",
            buildings_viz_description:"Growth appears to be evenly distributed throughout the city in a branching pattern, suggesting organic growth.\n This growth pattern could lead to traffic congestion where many branches converge, highlighting the need for strategic urban planning.",
            buildingsMap_download_text: "",
            buildings_report: "",
            hospitals_description: "",
            hospitalMap_download_text: "",
            schools_description: "",
            schoolsMap_download_text: "",
            tourism_description: "",
        }
    }
};
