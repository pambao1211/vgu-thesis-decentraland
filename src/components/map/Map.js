import {
    MapContainer,
    TileLayer,
    Polygon,
    useMap,
    Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Box } from "@chakra-ui/react";
import { createRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import dataSet from "../../../preprep-data/sampleFile.json";
import { fetchLands, selectLand } from "../../redux/actions";
import { PRIMARY_COLOR } from "../../configs";

const Map = () => {
    // const polygons = dataSet; //.slice(500, 700);
    const [map, setMap] = useState(null);
    const dispatch = useDispatch();
    const lands = useSelector((state) =>
        Object.values(state.landReducer.lands)
    );
    const selectedLand = useSelector((state) => state.landReducer.selectedLand);
    useEffect(() => {
        dispatch(fetchLands());
    }, []);
    useEffect(() => {
        if (map && !_.isEmpty(selectedLand)) {
            map.flyTo(selectedLand.center, 17, { duration: 1.5 });
        }
    }, [map, selectedLand]);

    const renderedPolygons = lands.map((land) => {
        const config =
            selectedLand && selectedLand.id === land.id
                ? { color: PRIMARY_COLOR, weight: 2 }
                : { color: "gray", weight: 1 };
        return (
            <Polygon
                key={land.id}
                pathOptions={{ color: config.color, weight: config.weight }}
                positions={land.paths}
            />
        );
    });
    return (
        <Box h="100%" w="100%">
            <MapContainer
                whenCreated={(mapInstance) => {
                    setMap(mapInstance);
                }}
                center={[52.3743401602888, 4.8862385854049]}
                zoom={14}
                scrollWheelZoom={true}
            >
                <TileLayer
                    //mapbox://styles/pambao/ckyreu0hpjypl16n24kbmj8ox
                    // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    url="https://api.mapbox.com/styles/v1/pambao/ckyreu0hpjypl16n24kbmj8ox/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicGFtYmFvIiwiYSI6ImNreXB1MnltYTBkYnoyb283anAxbzloMWwifQ.kx5MzcZxcBOkZv6dcT9i2w"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {renderedPolygons}
            </MapContainer>
        </Box>
    );
};

export default Map;
