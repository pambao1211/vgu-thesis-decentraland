const Decentraland = artifacts.require("Decentraland");

module.exports = (deployer) => {
    deployer.deploy(Decentraland);
};
