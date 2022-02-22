import { create } from "ipfs-http-client";

const filterNumericKeys = (obj) => {
    return _.pickBy(obj, (_val, key) => isNaN(key));
};

const getLandSpecifications = async (hash) => {
    const IPFS_BASE_URL = "https://ipfs.infura.io/ipfs/";
    const response = await fetch(`${IPFS_BASE_URL}${hash}`);
    const { center, area, paths } = await response.json();
    return { center, area, paths };
};

export const getLands = async (contract) => {
    const landsCount = await contract.methods.landCount().call();
    const lands = [];
    for (let i = 1; i <= landsCount; i++) {
        const land = await contract.methods.lands(i).call();
        const { center, area, paths } = await getLandSpecifications(
            land.landCoordinatorHash
        );
        const optimizedLand = filterNumericKeys(land);
        lands.push({ ...optimizedLand, center, area, paths });
    }
    return lands;
};

export const getLand = async (contract, id) => {
    const land = await contract.methods.lands(id).call();
    const { center, area, paths } = await getLandSpecifications(
        land.landCoordinatorHash
    );
    const optimizedLand = filterNumericKeys(land);
    return { ...optimizedLand, center, area, paths };
};

export const getLandTransactions = async (contract, landId) => {
    const transactions = await contract.methods
        .getLandTransaction(landId)
        .call();
    return transactions.map((transaction) => filterNumericKeys(transaction));
};

export const postLand = async (contract, owner, description, hash, sender) => {
    const uploadResult = await contract.methods
        .publishLand(owner, description, hash)
        .send({ from: sender });
    const newLand = uploadResult.events.LandPublished.returnValues;
    const { center, area, paths } = await getLandSpecifications(
        newLand.landCoordinatorHash
    );
    const optimizedLand = filterNumericKeys(newLand);
    return { ...optimizedLand, center, area, paths };
};

export const postIpfs = async (file) => {
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
    return result;
};

export const postCitizen = async (
    contract,
    idNumber,
    fullName,
    dob,
    sender
) => {
    return contract.methods
        .publishCitizen(idNumber, fullName, dob)
        .send({ from: sender });
};

export const getCitizens = async (contract) => {
    const citizensCount = await contract.methods.citizenCount().call();
    const citizens = [];
    for (let i = 1; i <= citizensCount; i++) {
        const citizen = await contract.methods.citizens(i).call();
        citizens.push(filterNumericKeys(citizen));
    }
    return citizens;
};

export const getCitizen = async (contract, id) => {
    const citizen = await contract.methods.citizens(id).call();
    return filterNumericKeys(citizen);
};
