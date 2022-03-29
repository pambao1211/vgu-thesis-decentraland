import { useEffect, useState } from "react";
import { Box, Button, Stack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import AdminListItem from "../../../components/pages/admins/overview/AdminListItem";
import ContractOwnerAuth from "../../../components/auth/ContractOwnerAuth";
import LoadingSkeleton from "../../../components/commons/LoadingSkeleton";
import Empty from "../../../components/commons/Empty";
import { PRIMARY_COLOR } from "../../../configs";
import { getAdmins } from "../../../apis";

const AdminsOverviewWithAuth = () => {
    return (
        <ContractOwnerAuth>
            <AdminsOverview />
        </ContractOwnerAuth>
    );
};

const AdminsOverview = () => {
    const [hasFetched, setHasFetch] = useState(false);
    const [admins, setAdmins] = useState([]);
    const contract = useSelector((state) => state.contractReducer);
    const router = useRouter();

    useEffect(() => {
        const fetchAdminData = async () => {
            const result = await getAdmins(contract);
            setAdmins(result);
            setHasFetch(true);
        };
        fetchAdminData();
    }, []);

    const renderAdmins = () => {
        return (
            <Stack w="100%" spacing={3}>
                {admins.map((admin) => {
                    return (
                        <AdminListItem key={admin.adminAddr} admin={admin} />
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
            {admins.length === 0 ? (
                <Empty
                    message="There is no citizen uploaded yet"
                    component={
                        <Button
                            colorScheme={PRIMARY_COLOR}
                            onClick={() => {
                                router.push("/admins/add");
                            }}
                        >
                            Add Admin
                        </Button>
                    }
                />
            ) : (
                renderAdmins()
            )}
        </>
    );
};

export default AdminsOverviewWithAuth;
