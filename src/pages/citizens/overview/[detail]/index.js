import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";

import { getCitizen } from "../../../../apis";

const CitizenDetail = () => {
    const router = useRouter();
    const contract = useSelector((state) => state.contractReducer);
    const [citizen, setCitizen] = useState({});
    const { detail: id } = router.query;

    useEffect(() => {
        const fetchCitizen = async () => {
            const citizen = await getCitizen(contract, id);
            console.log(citizen);
        };
        fetchCitizen();
    }, []);

    return <Box>Citizen Detail {id}</Box>;
};

export default CitizenDetail;
