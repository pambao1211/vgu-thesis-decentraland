const Decentraland = artifacts.require("Decentraland");

module.exports = function (deployer) {
    deployer.deploy(Decentraland);
};
