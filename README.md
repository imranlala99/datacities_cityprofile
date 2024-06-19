
# City Profile Visualization

This project visualizes various aspects of the cities of Fort Portal and Jinja, including buildings, hospitals, schools, and tourism, using Leaflet.js for interactive maps and Plotly for charts. The data is dynamically loaded from GeoJSON files and displayed on a webpage with maps and tables.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [File Structure](#file-structure)
- [Data Format](#data-format)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

1. **Clone the repository**:

   \`\`\`bash
   git clone https://github.com/imranlala99/datacities_cityprofile.git
   cd datacities_cityprofile
   \`\`\`

2. **Ensure you have a local server to serve the files** (optional but recommended for development purposes):

   You can use \`live-server\`, \`http-server\`, or any other local server. For example, using \`http-server\`:

   \`\`\`bash
   npm install -g http-server
   http-server
   \`\`\`

3. **Open the \`index.html\` file in your browser**:

   If you are using a local server, navigate to \`http://localhost:8080\` or the port provided by your server.

## Usage

1. **Select a city from the dropdown** to load the data for that city.
2. **Navigate through different sections** (Buildings, Hospitals, Schools, Tourism) to see the corresponding maps, tables, and pie charts.
3. **Hover over the table rows** to highlight the corresponding locations on the maps.

## Features

- **Interactive Maps**: Displays interactive maps using Leaflet.js for hospitals, schools, and tourism.
- **Dynamic Data Loading**: Loads GeoJSON data for the selected city and updates the maps and tables accordingly.
- **Pie Charts**: Uses Plotly to create pie charts showing the distribution of \`amenity\` and \`fclass\` properties for hospitals, schools, and tourism.
- **Data Tables**: Displays data in interactive tables using DataTables.js.

## File Structure

\`\`\`
city-profile-visualization/
├── data/
│   ├── jinja_health_data.geojson
│   ├── jinja_schools_data.geojson
│   ├── jinja_tourism_data.geojson
│   ├── fort_health_data.geojson
│   ├── fort_school_data.geojson
│   ├── fort_tourism_data.geojson
│   └── samplehospitals.js
├── images/
│   ├── JinjaBuildingsPNGs/
│   │   ├── 2016.png
│   │   ├── 2017.png
│   │   └── ...
│   ├── FortBuildingsPNGs/
│   │   ├── 2016.png
│   │   ├── 2017.png
│   │   └── ...
├── index.html
├── script.js
└── README.md
\`\`\`

## Data Format

### GeoJSON

The GeoJSON files should contain features with properties relevant to hospitals, schools, and tourism. Example structure:

\`\`\`json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [33.2, 0.44]
            },
            "properties": {
                "name": "Hospital A",
                "amenity": "hospital",
                "admin4Name_en": "Jinja"
            }
        },
        ...
    ]
}
\`\`\`

### Images

Images should be organized by city and year in respective folders.

## Dependencies

- [Leaflet.js](https://leafletjs.com/) - Interactive maps
- [DataTables.js](https://datatables.net/) - Interactive tables
- [Plotly.js](https://plotly.com/javascript/) - Graphs and Pie Charts

Include the following scripts in your \`index.html\`:

\`\`\`html
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
\`\`\`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
