module.exports = {
    contracts_directory: "./src/blockchain/contracts",
    migrations_directory: "./src/blockchain/migrations",
    contracts_build_directory: "./abis",
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
        },
        private: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
            from: "0x8411f48086e9097520920F61754Be32f3Cb0849B",
        },
    },
    compilers: {
        solc: {
            version: "^0.8.0",
            // optimizer: {
            //     enable: true,
            //     runs: 200,
            // },
        },
    },
    console: {
        require: "./src/blockchain/setup-scripts/setupFuncs.js",
    },
};
