import { useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";

import { useAuth } from "../../../contexts/AuthContext";
import { getCitizen, getCitizenByIdNumber, postCitizen } from "../../../apis";
import GenericForm from "../../../components/commons/GenericForm";

export default function AddCitizen() {
    const toast = useToast();
    const [isIdNumberExisted, setIsIdNumberExisted] = useState(true);
    const [isCheckingIdNum, setIsCheckingIdNum] = useState(false);
    const contract = useSelector((state) => state.contractReducer);
    const { currentUser } = useAuth();

    const handleSubmit = async (values) => {
        const { idNumber, fullName, gender, dob } = values;
        console.log(values);
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

    const handleCitizenIdNumChange = async (e, form) => {
        if (e.target.value.length > 10) return;
        form.setFieldValue("idNumber", e.target.value);
    };

    const handleValidate = async (values) => {
        const error = {};
        const validateIdNumber = async (idNumber) => {
            if (!idNumber) {
                error.idNumber = "You must enter idNumber";
                return;
            }
            if (idNumber.length == 10) {
                const citizen = await getCitizenByIdNumber(contract, idNumber);
                if (citizen.id != "0") {
                    error.idNumber = "Id number already existed";
                }
                return;
            }
            if (idNumber.length < 10) {
                error.idNumber = "Id number must have 10 digits";
            }
        };

        if (!values.fullName) {
            error.fullName = "You must enter full name";
        }
        await validateIdNumber(values.idNumber);
        if (!values.dob) {
            error.dob = "You must enter date of birth";
        }
        return error;
    };

    const formProperties = {
        heading: "Citizen Registration Form",
        initialValues: {
            fullName: "",
            idNumber: "",
            gender: 0,
            dob: "",
        },
        validate: handleValidate,
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
                type: "citizenIdNumber",
                isRequired: true,
                disabled: isCheckingIdNum,
                onChange: handleCitizenIdNumChange,
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
