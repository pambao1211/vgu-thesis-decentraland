const { assert } = require("chai");

const Decentraland = artifacts.require("./Decentraland.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Decentraland", ([deployer, account1, account2]) => {
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
            const name = await contract.NAME();
            assert.equal(name, "Decentraland");
        });
    });

    describe("land publish", async () => {
        const EXPECTED_LAND_PUBLISH_EVENT_NAME = "LandPublished";
        let result, landCount;
        before(async () => {
            result = await contract.publishLand(DESCRIPTION, LAND_HASH, {
                from: deployer,
            });
            landCount = await contract.getLandCount();
        });

        it("publish successfully", async () => {
            const actualLandCount = await contract.getLandCount();
            const land = await contract.getLand(result.logs[0].args.id);
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
            assert.equal(land.id, 1, "Incorrect land id");
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
            assert.equal(
                land.publishAdmin,
                deployer,
                "Incorrect publish admin"
            );
        });

        it("publish fail with args missing", async () => {
            await contract.publishLand(DESCRIPTION, "", { from: deployer })
                .should.be.rejected;
            await contract.publishLand("", LAND_HASH, { from: deployer }).should
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
                { from: deployer }
            );
            citizenId = rs.logs[0].args.id.toNumber();
        });

        it("publish successfully", async () => {
            const citizen = await contract.getCitizen(citizenId);
            const citizenCount = await contract.getCitizenCount();
            assert.equal(citizen.id, citizenCount, "Incorrect citizen count");
            assert.equal(citizen.fullName, FULL_NAME, "Incorrect full name");
            assert.equal(citizen.gender, GENDER, "Incorrect gender");
            assert.equal(citizen.dob, DOB, "Incorrect dob");
        });

        it("publish fail with invalid id number", async () => {
            await contract.publishCitizen(1231, FULL_NAME, GENDER, DOB, {
                from: deployer,
            }).should.be.rejected;
            await contract.publishCitizen(ID_NUMBER, FULL_NAME, GENDER, DOB, {
                from: deployer,
            }).should.be.rejected;
        });

        it("publish fail with invalid gender", async () => {
            await contract.publishCitizen(1000000009, FULL_NAME, 2, DOB, {
                from: deployer,
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
                    from: deployer,
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
                    from: deployer,
                }
            );
            const citizenPublishRs1 = await contract.publishCitizen(
                1000000000,
                "full name 1",
                0,
                1645574400,
                { from: deployer }
            );
            const citizenPublishRs2 = await contract.publishCitizen(
                1000000001,
                "full name 2",
                1,
                1645574400,
                { from: deployer }
            );

            landId = landPublishRs.logs[0].args.id.words[0];
            citizenEvent1 = citizenPublishRs1.logs[0].args;
            citizenEvent2 = citizenPublishRs2.logs[0].args;
        });

        it("land transfer successfully", async () => {
            const transferRs = await contract.transferLand(
                landId,
                citizenEvent1.idNumber.toNumber(),
                { from: deployer }
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
                from: deployer,
            }).should.be.rejected;
            await contract.transferLand(landId, 12123, { from: deployer })
                .should.be.rejected;
        });

        it("land transfer fail with already owned land", async () => {
            const citizenId2 = citizenEvent2.idNumber.toNumber();
            await contract.transferLand(landId, citizenId2, { from: deployer });
            await contract.transferLand(landId, citizenId2, { from: deployer })
                .should.be.rejected;
        });

        it("land transfer should revoke last ownership", async () => {
            const citizenIdNum1 = citizenEvent1.idNumber.toNumber();
            const citizenId1 = citizenEvent1.id.toNumber();
            const citizenId2 = citizenEvent2.idNumber.toNumber();
            const transferEvent1 = await contract.transferLand(
                landId,
                citizenIdNum1,
                { from: deployer }
            );
            await contract.transferLand(landId, citizenId2, { from: deployer });
            const transferEvent1Id = transferEvent1.logs[0].args.id.toNumber();
            const citizen1OwnedTrxs = await contract.getCitizenOwnedTrxs(
                citizenId1
            );
            expect(
                citizen1OwnedTrxs.map((trx) => parseInt(trx.id))
            ).not.to.include(transferEvent1Id);
        });
    });

    describe("admin publish", async () => {
        const ADMIN_TITLE = "Admin 1";
        const ADMIN_ADDRESS = account1;
        const ADMIN_PUBLISH_EVENT_NAME = "AdminPublished";
        let result;

        before(async () => {
            result = await contract.publishAdmin(ADMIN_TITLE, ADMIN_ADDRESS, {
                from: deployer,
            });
        });

        it("publish successfully", async () => {
            const actualAdminCount = await contract.getAdminCount();
            const admin = await contract.getAdmin(
                result.logs[0].args.id.toNumber()
            );
            const eventName = result.logs[0].event;

            assert.equal(
                eventName,
                ADMIN_PUBLISH_EVENT_NAME,
                `Event emmited should be ${ADMIN_PUBLISH_EVENT_NAME}`
            );

            assert.equal(admin.id, 2, "Incorrect admin id");
            assert.equal(admin.title, ADMIN_TITLE, "Incorrect admin title");
            assert.equal(
                admin.adminAddr,
                ADMIN_ADDRESS,
                "Incorrect admin address"
            );
        });

        it("publish fail with existing address", async () => {
            await contract.publishAdmin("Admin 3", ADMIN_ADDRESS).should.be
                .rejected;
        });
    });

    describe("access control", async () => {
        it("land publish fail with non-admin account", async () => {
            await contract.publishLand("Description", LAND_HASH, {
                from: account2,
            }).should.be.rejected;
        });

        it("citizen publish fail with non-admin account", async () => {
            const ID_NUMBER = 1000000006;
            const FULL_NAME = "Full name";
            const GENDER = 0;
            const DOB = 1645574400;

            await contract.publishCitizen(ID_NUMBER, FULL_NAME, GENDER, DOB, {
                from: account2,
            }).should.be.rejected;
        });

        it("admin publish fail with non-admin account", async () => {
            await contract.publishAdmin("Admin 1", account2, { from: account2 })
                .should.be.rejected;
        });

        it("admin publish fail with non-owner account", async () => {
            await contract.publishAdmin("Admin 1", account1, { from: account2 })
                .should.be.rejected;
        });

        it("land transfer fail with non-admin account", async () => {
            await contract.transferLand(1, 2, { from: account2 }).should.be
                .rejected;
        });
    });
});
