import { 
    createWalletClient, 
    http,
  } from "viem";
  import {localhost, mainnet} from "viem/chains"
  import escrowJson from "../artifacts/contracts/RealEstateEscrow.sol/RealEstateEscrow.json";
import { privateKeyToAccount } from "viem/accounts";
  
  export async function deployEscrow() {
    
    const PRIVATE_KEY = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";  
    const walletClient = createWalletClient({
      chain: localhost,
      transport: http('http://127.0.0.1:8545'),
      account: privateKeyToAccount(PRIVATE_KEY),
    });
  
    const txHash = await walletClient.deployContract({
      abi: escrowJson.abi,
      bytecode: escrowJson.bytecode as `0x${string}`,
      args: [
        BigInt(5e18),  // goal = 5 ETH
        1              // duration = 1 day
      ],
    });
  
    return { walletClient, txHash };
  }
  