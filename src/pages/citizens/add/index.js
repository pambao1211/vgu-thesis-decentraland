import { Box, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";

import { useAuth } from "../../../contexts/AuthContext";
import { postCitizen } from "../../../apis";
import GenericForm from "../../../components/commons/GenericForm";

export default function AddCitizen() {
    const contract = useSelector((state) => state.contractReducer);
    const { currentUser } = useAuth();
    const toast = useToast();

    const handleSubmit = async (values) => {
        const { idNumber, fullName, gender, dob } = values;
        const formattedDob = new Date(dob).getTime() / 1000;
        try {
            await postCitizen(
                contract,
                idNumber,
                fullName,
                gender,
                formattedDob,
                currentUser
            );
            toast({
                title: "Citizen Registration Success",
                description: "Citizen A has been successfully registered",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (e) {
            if (e.code && e.code === 4001) {
                toast({
                    title: "Transaction Denied",
                    description: "You have denied transaction signature",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    const formProperties = {
        heading: "Citizen Registration Form",
        initialValues: {
            fullName: "",
            idNumber: "",
            gender: 0,
            dob: "",
        },
        validate: (values) => {
            const error = {};
            if (!values.fullName) {
                error.fullName = "You must enter full name";
            }
            if (!values.idNumber) {
                error.idNumber = "You must enter id number";
            }
            if (!values.dob) {
                error.dob = "You must enter id date of birth";
            }
            return error;
        },
        handleSubmit: handleSubmit,
        fields: [
            {
                name: "fullName",
                label: "Full Name",
                isRequired: true,
            },
            {
                name: "idNumber",
                label: "Identification Number",
                isRequired: true,
            },
            {
                name: "gender",
                label: "Gender",
                isRequired: true,
                type: "select",
                options: [
                    {
                        label: "Male",
                        value: 0,
                    },
                    {
                        label: "Female",
                        value: 1,
                    },
                ],
            },
            {
                name: "dob",
                label: "Date of Birth",
                isRequired: true,
                type: "date",
            },
        ],
    };
    return <GenericForm {...formProperties} />;
}
