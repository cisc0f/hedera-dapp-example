import { ContractId, ContractExecuteTransaction } from "@hashgraph/sdk";
import {HashConnect} from 'hashconnect';

let hashconnect = new HashConnect();

let saveData = {
    topic: "",
    pairingString: "",
    privateKey: "",
    pairedWalletData: null,
    pairedAccounts: [],
};
let appMetadata = {
    name: "Hedera dApp Example",
    description: "Let's buidl a dapp on Hedera",
    icon: "https://raw.githubusercontent.com/ed-marquez/hedera-dapp-days/testing/src/assets/hederaLogo.png",
};
let accountId = ""

let contractId = ContractId.fromString("0.0.47907889");


export async function connect(){
    //first init and store the private for later
    let initData = await hashconnect.init(appMetadata);
    saveData.privateKey = initData.privKey;

    //then connect, storing the new topic for later
    let state = await hashconnect.connect();
    saveData.topic = state.topic;

    console.log('\nTopic is: $(saveData.topic)\n')

    //generate a pairing string, which you can display and generate a QR code from
    saveData.pairingString = hashconnect.generatePairingString(state, "testnet", false);

    //find any supported local wallets
    const resultWallet = hashconnect.findLocalWallets();
    //    provider = hashconnect.getProvider(network, topic, accountId);
    //    let balance = await provider.getAccountBalance(accountId);
    //    signer = hashconnect.getSigner(provider);

    console.log(state);

    console.log(resultWallet + 'result')
    hashconnect.connectToLocalWallet(saveData.pairingString)


    hashconnect.pairingEvent.once(pairingData => {
    pairingData.accountIds.forEach(id => {
        accountId =id 
        console.log(accountId)
    })
    })

}

export async function run() {

    const provider = hashconnect.getProvider('testnet', saveData.topic,  accountId)
    const signer = hashconnect.getSigner(provider)
    const stakeTx  = await new ContractExecuteTransaction() 
        .setContractId(contractId)
        .setGas(500000)
        .setPayableAmount(50)
        .setFunction("stakeTokens")
        .freezeWithSigner(signer);

    const result = await stakeTx.executeWithSigner(signer);
    console.log(result)

}