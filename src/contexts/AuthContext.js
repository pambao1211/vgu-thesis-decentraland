import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";

import Loading from "../components/Loading";
import NotAuthAdmin from "../components/auth/NotAuthAdmin";
import { getContract } from "../redux/actions";
import { checkIsContractOwner, getAdminByAddress } from "../apis";

const AuthContext = React.createContext();
const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const contract = useSelector((state) => state.contractReducer);
    useEffect(() => {
        const loadWeb3AndContract = async () => {
            if (window.ethereum || window.web3) {
                if (window.ethereum) {
                    window.web3 = new Web3(window.ethereum);
                    await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                } else {
                    window.web3 = new Web3(window.web3.currentProvider);
                }

                window.ethereum.on("accountsChanged", async () => {
                    await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    const currentAccounts = await window.web3.eth.getAccounts();
                    setCurrentUser(currentAccounts[0]);
                    await dispatch(getContract(currentAccounts[0]));
                });

                const accounts = await window.web3.eth.getAccounts();
                setCurrentUser(accounts[0]);
                await dispatch(getContract(accounts[0]));
                setIsLoading(false);
            } else {
                window.alert(
                    "No ethereum browser detected. You should consider trying Metamask"
                );
            }
        };
        loadWeb3AndContract();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        if (!contract) {
            return;
        }
        const loadAdminInfo = async () => {
            const admin = await getAdminByAddress(contract, currentUser);
            const isContractOwner = await checkIsContractOwner(
                contract,
                currentUser
            );
            setCurrentAdmin({ ...admin, isContractOwner });
            setIsLoading(false);
        };
        loadAdminInfo();
    }, [contract]);

    const value = {
        currentAdmin,
    };

    const renderContentWithAuth = () => {
        if (isLoading) {
            return <Loading />;
        }
        if (currentAdmin.id == 0) {
            return <NotAuthAdmin />;
        }
        return children;
    };

    return (
        <AuthContext.Provider value={value}>
            {renderContentWithAuth()}
        </AuthContext.Provider>
    );
};

export { useAuth };
export default AuthProvider;
