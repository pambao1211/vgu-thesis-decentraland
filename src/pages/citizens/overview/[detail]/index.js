import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Box, Flex } from "@chakra-ui/react";

import LandOwnedInfoList from "../../../../components/pages/citizens/overview/LandOwnedInfoList";
import Empty from "../../../../components/commons/Empty";
import DetailBase from "../../../../components/commons/DetailBase";
import { getCitizen, getCitizenOwnedLandTrxs } from "../../../../apis";
import { formatDate, formatTime, formatDob } from "../../../../utils";

const CitizenDetail = () => {
    const router = useRouter();
    const contract = useSelector((state) => state.contractReducer);
    const [citizen, setCitizen] = useState({});
    const { detail: id } = router.query;

    useEffect(() => {
        const fetchCitizen = async () => {
            const citizen = await getCitizen(contract, id);
            const transactions = await getCitizenOwnedLandTrxs(contract, id);
            setCitizen({ ...citizen, transactions: transactions });
        };
        fetchCitizen();
    }, []);

    useEffect(() => {
        console.log(citizen);
    }, [citizen]);

    const detailCards = !_.isEmpty(citizen.transactions) ? (
        <LandOwnedInfoList transactions={citizen.transactions} />
    ) : (
        <Flex w="100" direction="column" align="center">
            <Empty message="Citizen does not own any land" />
        </Flex>
    );

    const dataConfig = {
        headingIcon: citizen.fullName,
        heading: citizen.fullName,
        title1: "Citizen Profile",
        detailedFields: [
            {
                title: "Citizen Identification",
                value: citizen.id,
            },
            {
                title: "Full Name",
                value: citizen.fullName,
            },
            {
                title: "Identification Number",
                value: citizen.idNumber,
            },
            {
                title: "Gender",
                value: "0" ? "Male" : "Female",
            },
            {
                title: "Date of Birth",
                value: formatDob(citizen.idNumber),
            },
            {
                title: "Publish Admin",
                value: citizen.publishAdmin,
            },
            {
                title: "Publish Date",
                value: formatDate(citizen.publishDate),
            },
            {
                title: "Publish Time",
                value: formatTime(citizen.publishDate),
            },
        ],
        title2: "Citizen properties",
        detailCards: detailCards,
    };

    return <DetailBase dataConfig={dataConfig}></DetailBase>;
};

export default CitizenDetail;
