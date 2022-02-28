const { assert } = require("chai");
const { GiConsoleController } = require("react-icons/gi");

const Decentraland = artifacts.require("./Decentraland.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Decentraland", ([deployer, author, tipper]) => {
    let contract;

    before(async () => {
        contract = await Decentraland.deployed();
    });

    describe("deployment", async () => {
        it("deploys sucessfully", async () => {
            const address = await contract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it("has a name", async () => {
            const name = await contract.name();
            assert.equal(name, "Decentraland");
        });
    });

    describe("land_publish", async () => {
        const DESCRIPTION = "Description";
        const LAND_HASH = "QmQi3QgPXjqCovd54CJH7fopaNq8h18ZSXcH7bxFBKYYVy";
        let result, landCount;

        before(async () => {
            result = await contract.publishLand(DESCRIPTION, LAND_HASH, {
                from: author,
            });
            landCount = await contract.landCount();
        });

        it("publish successfully", async () => {
            const actualLandCount = await contract.landCount();
            const land = await contract.lands(result.logs[0].args.id);

            // console.log(land);

            assert.equal(actualLandCount, landCount, "Incorrect landCount");
            assert.equal(land.id, 1, "Incorrect land id");
            assert.equal(
                land.description,
                landDescription,
                "Incorrect land description"
            );
            assert.equal(
                land.landCoordinatorHash,
                LAND_HASH,
                "Incorrect land hash"
            );
            assert.equal(
                land.isOccupied,
                false,
                "Land must be vacant on publish"
            );
            assert.equal(land.publishAdmin, author, "Incorrect publish admin");
        });

        it();
    });
});
