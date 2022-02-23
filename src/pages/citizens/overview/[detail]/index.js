import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";

import DetailBase from "../../../../components/commons/DetailBase";
import { getCitizen } from "../../../../apis";
import { formatDate, formatTime, formatDob } from "../../../../utils";

const CitizenDetail = () => {
    const router = useRouter();
    const contract = useSelector((state) => state.contractReducer);
    const [citizen, setCitizen] = useState({});
    const { detail: id } = router.query;

    useEffect(() => {
        const fetchCitizen = async () => {
            const citizen = await getCitizen(contract, id);
            console.log(citizen);
            setCitizen(citizen);
        };
        fetchCitizen();
    }, []);

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
        ],
        title2: "Ownership information",
    };

    return <DetailBase dataConfig={dataConfig}></DetailBase>;
};

export default CitizenDetail;
