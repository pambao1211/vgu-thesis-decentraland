import { combineReducers } from "redux";
import _ from "lodash";

import {
    FETCH_LANDS,
    FETCH_LAND,
    PUBLISH_LAND,
    SELECT_LAND,
} from "../actions/types";

const landReducer = (lands = { lands: {}, selectedLand: {} }, action) => {
    switch (action.type) {
        case FETCH_LANDS:
            const formattedLands = _.mapKeys(action.payload, "id");
            return {
                lands: formattedLands,
                selectedLand: _.isEmpty(lands.selectedLand)
                    ? formattedLands[Object.keys(formattedLands)[0]]
                    : lands.selectedLand,
            };
        case FETCH_LAND:
            return {
                lands: { ...lands.lands, [action.payload.id]: action.payload },
                selectedLand: action.payload,
            };
        case PUBLISH_LAND:
            console.log("Land uploaded successfully");
            return {
                lands: { ...lands.lands, [action.payload.id]: action.payload },
                selectedLand: action.payload,
            };
        case SELECT_LAND:
            return {
                ...lands,
                selectedLand: lands.lands[action.payload],
            };
        default:
            return lands;
    }
};

const contractReducer = (contract = null, action) => {
    if (action.type === "GET_CONTRACT") {
        return action.payload;
    }
    return contract;
};

export default combineReducers({
    landReducer,
    contractReducer,
});
