const { assert } = require("chai");

const Decentraland = artifacts.require("./Decentraland.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Decentraland", ([deployer, author, tipper]) => {
    const DESCRIPTION = "Description";
    const LAND_HASH = "QmQi3QgPXjqCovd54CJH7fopaNq8h18ZSXcH7bxFBKYYVy";
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

    describe("land publish", async () => {
        const EXPECTED_LAND_PUBLISH_EVENT_NAME = "LandPublished";
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
            const eventName = result.logs[0].event;

            assert.equal(
                eventName,
                EXPECTED_LAND_PUBLISH_EVENT_NAME,
                `Event emmited should be ${EXPECTED_LAND_PUBLISH_EVENT_NAME}`
            );

            assert.equal(
                actualLandCount.toNumber(),
                landCount.toNumber(),
                "Incorrect landCount"
            );
            assert.equal(land.id.words[0], 1, "Incorrect land id");
            assert.equal(
                land.description,
                DESCRIPTION,
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

        it("publish fail with args missing", async () => {
            await contract.publishLand(DESCRIPTION, "", { from: author }).should
                .be.rejected;
            await contract.publishLand("", LAND_HASH, { from: author }).should
                .be.rejected;
        });
    });

    describe("citizen publish", async () => {
        const ID_NUMBER = 1000000005;
        const FULL_NAME = "Full name";
        const GENDER = 0;
        const DOB = 1645574400;
        let citizenId;
        before(async () => {
            const rs = await contract.publishCitizen(
                ID_NUMBER,
                FULL_NAME,
                GENDER,
                DOB,
                { from: author }
            );
            citizenId = rs.logs[0].args.id.toNumber();
        });

        it("publish successfully", async () => {
            const citizen = await contract.citizens(citizenId);
            const citizenCount = await contract.citizenCount();
            assert.equal(
                citizen.id.toNumber(),
                citizenCount,
                "Incorrect citizen count"
            );
            assert.equal(citizen.fullName, FULL_NAME, "Incorrect full name");
            assert.equal(citizen.gender, GENDER, "Incorrect gender");
            assert.equal(citizen.dob, DOB, "Incorrect dob");
        });

        it("publish fail with invalid id number", async () => {
            await contract.publishCitizen(1231, FULL_NAME, GENDER, DOB, {
                from: author,
            }).should.be.rejected;
            await contract.publishCitizen(ID_NUMBER, FULL_NAME, GENDER, DOB, {
                from: author,
            }).should.be.rejected;
        });

        it("publish fail with invalid gender", async () => {
            await contract.publishCitizen(1000000009, FULL_NAME, 2, DOB, {
                from: author,
            }).should.be.rejected;
        });

        it("publish fail with invalid dob", async () => {
            const today = new Date();
            const tomorrow = new Date(today).setDate(today.getDate() + 1);
            await contract.publishCitizen(
                1000000007,
                FULL_NAME,
                GENDER,
                tomorrow * 1000,
                {
                    from: author,
                }
            ).should.be.rejected;
        });
    });

    describe("land transfer", async () => {
        const EXPECTED_LAND_TRANSFER_EVENT_NAME = "LandTransfer";
        let landId, citizenEvent1, citizenEvent2;
        before(async () => {
            const landPublishRs = await contract.publishLand(
                "Description",
                LAND_HASH,
                {
                    from: author,
                }
            );
            const citizenPublishRs1 = await contract.publishCitizen(
                1000000000,
                "full name 1",
                0,
                1645574400,
                { from: author }
            );
            const citizenPublishRs2 = await contract.publishCitizen(
                1000000001,
                "full name 2",
                1,
                1645574400,
                { from: author }
            );

            landId = landPublishRs.logs[0].args.id.words[0];
            citizenEvent1 = citizenPublishRs1.logs[0].args;
            citizenEvent2 = citizenPublishRs2.logs[0].args;
        });

        it("land transfer successfully", async () => {
            const transferRs = await contract.transferLand(
                landId,
                citizenEvent1.idNumber.toNumber(),
                { from: author }
            );
            const transferEventName = transferRs.logs[0].event;
            const emmitedTransferEventId =
                transferRs.logs[0].args.id.toNumber();
            const landTrxs = await contract.getLandTrxs(landId);
            const citizenOwnedTrxs = await contract.getCitizenOwnedTrxs(
                citizenEvent1.id.toNumber()
            );
            const landLastTrxs = landTrxs[landTrxs.length - 1];
            assert.equal(
                transferEventName,
                EXPECTED_LAND_TRANSFER_EVENT_NAME,
                `Event name should be ${EXPECTED_LAND_TRANSFER_EVENT_NAME}`
            );
            assert.equal(
                landLastTrxs.id,
                emmitedTransferEventId,
                `Last trx of land should be ${emmitedTransferEventId}`
            );
            expect(citizenOwnedTrxs.map((trx) => parseInt(trx.id))).to.include(
                emmitedTransferEventId
            );
        });

        it("land transfer fail with no existing citizen id", async () => {
            await contract.transferLand(landId, 2000000000, {
                from: author,
            }).should.be.rejected;
            await contract.transferLand(landId, 12123, { from: author }).should
                .be.rejected;
        });

        it("land transfer fail with already owned land", async () => {
            const citizenId2 = citizenEvent2.idNumber.toNumber();
            await contract.transferLand(landId, citizenId2, { from: author });
            await contract.transferLand(landId, citizenId2, { from: author })
                .should.be.rejected;
        });

        it("land transfer should revoke last ownership", async () => {
            const citizenIdNum1 = citizenEvent1.idNumber.toNumber();
            const citizenId1 = citizenEvent1.id.toNumber();
            const citizenId2 = citizenEvent2.idNumber.toNumber();
            const transferEvent1 = await contract.transferLand(
                landId,
                citizenIdNum1,
                { from: author }
            );
            await contract.transferLand(landId, citizenId2, { from: author });
            const transferEvent1Id = transferEvent1.logs[0].args.id.toNumber();
            const citizen1OwnedTrxs = await contract.getCitizenOwnedTrxs(
                citizenId1
            );
            expect(
                citizen1OwnedTrxs.map((trx) => parseInt(trx.id))
            ).not.to.include(transferEvent1Id);
        });
    });
});
