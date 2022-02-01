const { assert } = require("chai");

const Decentraland = artifacts.require("./Decentraland.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Decentraland", ([deployer, author, tipper]) => {
    let decentraland;

    before(async () => {
        decentraland = await Decentraland.deployed();
    });

    describe("deployment", async () => {
        it("deploys sucessfully", async () => {
            const address = await decentraland.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it("has a name", async () => {
            const name = await decentraland.name();
            assert.equal(name, "Decentraland");
        });
    });
});
