import { useEffect, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { getCitizens } from "../../../apis";
import CitizenListItem from "../../../components/pages/citizens/overview/CitizenListItem";
import Empty from "../../../components/commons/Empty";

export default function CitizensOverview() {
    const contract = useSelector((state) => state.contractReducer);
    const router = useRouter();
    const [citizens, setCitizens] = useState([]);

    useEffect(() => {
        const fetchCitizensData = async () => {
            const result = await getCitizens(contract);
            console.log(result);
            setCitizens(result);
        };
        fetchCitizensData();
    }, []);

    const renderedCitizens = () => {
        return (
            <Stack w="100%" spacing={3}>
                {citizens.map((citizen) => {
                    return (
                        <CitizenListItem key={citizen.id} citizen={citizen} />
                    );
                })}
            </Stack>
        );
    };

    return (
        <>
            {citizens.length === 0 ? (
                <Empty
                    message="There is no citizen uploaded yet"
                    action={{
                        title: "Add Citizen",
                        action: () => {
                            router.push("/citizens/add");
                        },
                    }}
                />
            ) : (
                renderedCitizens()
            )}
        </>
    );
}
