module.exports = {
    initLands: async (contract) => {
        await contract.publishLand(
            "Hello World",
            "QmQi3QgPXjqCovd54CJH7fopaNq8h18ZSXcH7bxFBKYYVy"
        );
        await contract.publishLand(
            "Hello World",
            "QmUGRVskbKfjU7LBM7PtkvQYDyZC6mbUh8aKpPWiPdAGDK"
        );
    },
    initCitizens: async (contract) => {
        await contract.publishCitizen(
            1000000000,
            "Pham Gia Bao1",
            0,
            1645574400
        );
        await contract.publishCitizen(
            1000000001,
            "Nguyen Quy Minh",
            0,
            1645574400
        );
    },
};
