import { combineReducers } from "redux";
import _ from "lodash";

import {
    GET_CONTRACT,
    FETCH_LANDS,
    PUBLISH_LAND,
    SELECT_LAND,
} from "../actions/types";

const landReducer = (lands = { lands: {}, selectedLand: {} }, action) => {
    switch (action.type) {
        case FETCH_LANDS:
            const formattedLands = _.mapKeys(action.payload, "id");
            return { lands: formattedLands, selectedLand: formattedLands[1] };
        case PUBLISH_LAND:
            return lands;
        case SELECT_LAND:
            const newLands = {
                ...lands,
                selectedLand: lands.lands[action.payload],
            };
            console.log(newLands);
            return newLands;
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
