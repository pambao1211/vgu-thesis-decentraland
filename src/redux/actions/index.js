import _ from "lodash";

import {
    GET_CONTRACT,
    PUBLISH_LAND,
    FETCH_LANDS,
    SELECT_LAND,
    FETCH_LAND,
} from "./types";
import Decentraland from "../../../abis/Decentraland.json";
import {
    getLand,
    getLands,
    getLandTransactions,
    postLand,
    postIpfs,
} from "../../apis";

export const getContract = () => async (dispatch) => {
    const networkId = await window.web3.eth.net.getId();
    const networkData = Decentraland.networks[networkId];
    if (networkData) {
        const contract = new web3.eth.Contract(
            Decentraland.abi,
            networkData.address
        );
        dispatch({ type: GET_CONTRACT, payload: contract });
    } else {
        window.alert("Decentraland contract not deployed to detected network");
    }
};

export const publishLand =
    (description, file, currentUser) => async (dispatch, getState) => {
        const ipfsResult = await postIpfs(file);
        const contract = getState().contractReducer;
        const newLand = await postLand(
            contract,
            description,
            ipfsResult.path,
            currentUser
        );
        dispatch({
            type: PUBLISH_LAND,
            payload: { ...newLand },
        });
    };

export const fetchLands = () => async (dispatch, getState) => {
    const contract = getState().contractReducer;
    const lands = await getLands(contract);
    dispatch({ type: FETCH_LANDS, payload: lands });
};

export const fetchLand = (id) => async (dispatch, getState) => {
    const contract = getState().contractReducer;
    const land = await getLand(contract, id);
    const transactions = await getLandTransactions(contract, id);
    const orderedTransactions = _.reverse(transactions);
    dispatch({
        type: FETCH_LAND,
        payload: {
            ...land,
            transactions: orderedTransactions,
        },
    });
};

export const selectLand = (id) => {
    return {
        type: SELECT_LAND,
        payload: id,
    };
};
