cd ../local-poa-chain/node1
geth --networkid 1211 --datadir "./data" --bootnodes enode://2bd4e6b747462eaefe45d7fe9fbb2dacd74287bc2234353a4cf93bea45d7b6b5c378e1b61f9715a84db8ff2694277440b89cc86a0c5c1d60fcaae80399d429d6@127.0.0.1:0?discport=30301 --port 30303 --ipcdisable --syncmode full --http --allow-insecure-unlock --http.corsdomain "*" --http.port 8545 --unlock 0x8411f48086e9097520920F61754Be32f3Cb0849B --password password.txt --mine console