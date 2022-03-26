import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";

import LoadingSkeleton from "../commons/LoadingSkeleton";
import { useAuth } from "../../contexts/AuthContext";

const ContractOwnerAuth = ({ children }) => {
    const router = useRouter();
    const { currentAdmin } = useAuth();

    useEffect(() => {
        const { pathname } = router;
        if (currentAdmin) {
            const { isContractOwner } = currentAdmin;

            if (pathname.includes("/admins") && !isContractOwner) {
                router.push("/");
            }
        }
    }, [router, currentAdmin]);

    if (!currentAdmin) {
        return <LoadingSkeleton numberSkeleton={3} />;
    }
    if (currentAdmin && !currentAdmin.isContractOwner) {
        return <Box>Not authorized</Box>;
    }
    return children;
};

export default ContractOwnerAuth;
