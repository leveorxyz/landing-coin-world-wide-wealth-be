import Web3 from "web3";
import OracleAbi from "../abis/oracle.json";
import ProtocolAbi from "../abis/protocol.json";
import LandKingAbi from "../abis/landkingToken.json";

const createWeb3WithAccount = () => {
  const web3 = new Web3(process.env.RPC_URL!);
  const account = web3.eth.accounts.privateKeyToAccount(
    `0x${process.env.OWNER_PRIVATE_KEY!}`
  );
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  return web3;
};

export const web3 = createWeb3WithAccount();
export const oracleContract = new web3.eth.Contract(
  //@ts-ignore
  OracleAbi,
  process.env.ORACLE_CONTRACT_ADDRESS
);

export const protocolContract = new web3.eth.Contract(
  //@ts-ignore
  ProtocolAbi,
  process.env.PROTOCOL_CONTRACT_ADDRESS
);

export const landKingTokenContract = new web3.eth.Contract(
  //@ts-ignore
  LandKingAbi,
  process.env.LANDING_TOKEN_CONTRACT_ADDRESS
);