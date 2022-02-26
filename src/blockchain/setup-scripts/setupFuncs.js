module.exports = {
    initLands: async (contract) => {
        await contract.publishLand(
            "0x1cf3CF09CD09d476b03a5456ed35C8Cc77811149",
            "Hello World",
            "QmQi3QgPXjqCovd54CJH7fopaNq8h18ZSXcH7bxFBKYYVy"
        );
        await contract.publishLand(
            "0x1cf3CF09CD09d476b03a5456ed35C8Cc77811149",
            "Hello World",
            "QmUGRVskbKfjU7LBM7PtkvQYDyZC6mbUh8aKpPWiPdAGDK"
        );
    },
    initCitizens: async (contract) => {
        await contract.publishCitizen(
            1000000000,
            "Pham Gia Bao",
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
