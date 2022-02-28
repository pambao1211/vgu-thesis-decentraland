import { useEffect, useState } from "react";
import { Button, Stack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import LoadingSkeleton from "../../../components/commons/LoadingSkeleton";
import CitizenListItem from "../../../components/pages/citizens/overview/CitizenListItem";
import Empty from "../../../components/commons/Empty";
import { PRIMARY_COLOR } from "../../../configs";
import { getCitizens } from "../../../apis";

export default function CitizensOverview() {
    const contract = useSelector((state) => state.contractReducer);
    const router = useRouter();
    const [hasFetched, setHasFetch] = useState(false);
    const [citizens, setCitizens] = useState([]);

    useEffect(() => {
        const fetchCitizensData = async () => {
            const result = await getCitizens(contract);
            setCitizens(result);
            setHasFetch(true);
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

    if (!hasFetched) {
        return <LoadingSkeleton numberSkeleton={3} />;
    }

    return (
        <>
            {citizens.length === 0 ? (
                <Empty
                    message="There is no citizen uploaded yet"
                    component={
                        <Button
                            colorScheme={PRIMARY_COLOR}
                            onClick={() => {
                                router.push("/citizens/add");
                            }}
                        >
                            Add Citizen
                        </Button>
                    }
                />
            ) : (
                renderedCitizens()
            )}
        </>
    );
}
