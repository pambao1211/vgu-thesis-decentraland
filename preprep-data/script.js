const _ = require("lodash");
var fs = require("fs");
const dataSet = require("./original");

const getPath = (paths) => {
    return paths.map((path) => {
        return [path.lat, path.lng];
    });
};

const getCenter = (polygon) => {
    return polygon.reduce(
        (x, y) => {
            return [x[0] + y[0] / polygon.length, x[1] + y[1] / polygon.length];
        },
        [0, 0]
    );
};

const exportOneFile = () => {
    const obj = dataSet.map((data, index) => {
        const paths = getPath(data.paths);
        const center = getCenter(paths);
        return {
            id: index,
            paths: paths,
            center: center,
        };
    });
    const json = JSON.stringify(obj);
    fs.writeFile("../mock-data/sampleFile.json", json, "utf8", function (err) {
        if (err) throw err;
        console.log("complete");
    });
};

const exportMultipleFile = () => {
    const filteredObj = dataSet.filter((data) => {
        return data.cadastral_size <= 1000;
    });
    const obj = filteredObj.map((data, index) => {
        const paths = getPath(data.paths);
        const center = getCenter(paths);
        const area = data.cadastral_size;
        return {
            id: index,
            area: area,
            paths: paths,
            center: center,
        };
    });
    const objectsToExport = obj.slice(0, 10);
    objectsToExport.forEach((object) => {
        const json = JSON.stringify(object);
        fs.writeFile(
            `../mock-data/${object.id}.json`,
            json,
            "utf8",
            function (err) {
                if (err) throw err;
                console.log("complete");
            }
        );
    });
};

// exportOneFile();
exportMultipleFile();
