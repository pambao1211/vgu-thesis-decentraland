import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Web3 from "web3";

import Loading from "../components/Loading";
import { getContract } from "../actions";

const AuthContext = React.createContext();
const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
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
                    const accounts = await window.web3.eth.getAccounts();
                    setCurrentUser(accounts[0]);
                });

                const accounts = await window.web3.eth.getAccounts();
                setCurrentUser(accounts[0]);
                await dispatch(getContract());
                setIsLoading(false);
            } else {
                window.alert(
                    "No ethereum browser detected. You should consider trying Metamask"
                );
            }
        };

        loadWeb3AndContract();
    }, []);
    const value = {
        currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {isLoading ? <Loading /> : children}
        </AuthContext.Provider>
    );
};

export { useAuth };
export default AuthProvider;
