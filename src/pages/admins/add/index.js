import { useToast } from "@chakra-ui/react";

import GenericForm from "../../../components/commons/GenericForm";
import ContractOwnerAuth from "../../../components/auth/ContractOwnerAuth";
import { useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import { postAdmin } from "../../../apis";

const AddAdminWithAuth = () => {
    return (
        <ContractOwnerAuth>
            <AddAdmin />
        </ContractOwnerAuth>
    );
};

const AddAdmin = () => {
    const toast = useToast();
    const { currentUser } = useAuth();
    const contract = useSelector((state) => state.contractReducer);

    const handleValidate = (values) => {
        const error = {};
        if (!values.title) {
            error.title = "You must enter admin title";
        }
        if (!values.address) {
            error.address = "You must enter admin address";
        }
        return error;
    };

    const handleSubmit = async (values) => {
        console.log(values);
        const { title, address } = values;
        try {
            await postAdmin(contract, title, address, currentUser);
            toast({
                title: "Admin Registration Success",
                description: "Admin A has been successfully registered",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (e) {
            if (e.code && e.code === 4001) {
                toast({
                    title: "Transaction Denied",
                    description: "You have denied transaction",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    const formProperties = {
        heading: "Admin Registration Form",
        initialValues: {
            title: "",
            address: "",
        },
        validate: handleValidate,
        handleSubmit: handleSubmit,
        fields: [
            {
                name: "title",
                label: "Admin Title",
                isRequired: true,
            },
            {
                name: "address",
                label: "Admin Address",
                isRequired: true,
            },
        ],
    };

    return <GenericForm {...formProperties} />;
};

export default AddAdminWithAuth;
