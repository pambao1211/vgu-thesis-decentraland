import { create } from "ipfs-http-client";

import { GET_CONTRACT, PUBLISH_LAND, FETCH_LANDS, SELECT_LAND } from "./types";
import Decentraland from "../../abis/Decentraland.json";

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
    (owner, description, file, currentUser) => async (dispatch, getState) => {
        const ipfs = create({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
        });
        let result;
        try {
            result = await ipfs.add(file);
            console.log(result);
        } catch (e) {
            console.error(e);
        }
        const contract = getState().contractReducer;
        const uploadResult = await contract.methods
            .publishLand(owner, description, result.path)
            .send({ from: currentUser });
        console.log(uploadResult);
    };

export const fetchLands = () => async (dispatch, getState) => {
    const contract = getState().contractReducer;
    const landCount = await contract.methods.landCount().call();
    const lands = [];
    for (let i = 1; i <= landCount; i++) {
        const land = await contract.methods.lands(i).call();
        const response = await fetch(
            `https://ipfs.infura.io/ipfs/${land.landCoordinatorHash}`
        );
        const { center, paths } = await response.json();
        lands.push({ ...land, center, paths });
    }
    dispatch({ type: FETCH_LANDS, payload: lands });
};

export const selectLand = (id) => {
    return {
        type: SELECT_LAND,
        payload: id,
    };
};
