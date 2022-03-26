import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import DetailBase from "../../../../components/commons/DetailBase";
import ContractOwnerAuth from "../../../../components/auth/ContractOwnerAuth";
import { getAdmin } from "../../../../apis";
import { formatDate } from "../../../../utils";

const AdminDetailWithAuth = () => {
    return (
        <ContractOwnerAuth>
            <AdminDetail />
        </ContractOwnerAuth>
    );
};

const AdminDetail = () => {
    const router = useRouter();
    const contract = useSelector((state) => state.contractReducer);
    const [admin, setAdmin] = useState({});
    const { detail: id } = router.query;

    useEffect(() => {
        const fetchAdmin = async () => {
            const adminResult = await getAdmin(contract, id);
            setAdmin(adminResult);
        };
        fetchAdmin();
    }, []);

    const dataConfig = {
        headingIcon: admin.adminAddr,
        heading: admin.title,
        title1: "Admin Profile",
        detailedFields: [
            {
                title: "Admin Identification",
                value: admin.id,
            },
            {
                title: "Admin Title",
                value: admin.title,
            },
            {
                title: "Admin Code",
                value: admin.adminCode,
            },
            {
                title: "Admin Address",
                value: admin.adminAddr,
            },
            {
                title: "Publish Admin",
                value: admin.publishAdmin,
            },
            {
                title: "Publish Date",
                value: formatDate(admin.publishDate),
            },
        ],
    };

    return <DetailBase dataConfig={dataConfig}>Hello World</DetailBase>;
};

export default AdminDetailWithAuth;
