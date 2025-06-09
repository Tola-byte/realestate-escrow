import { expect } from "chai";
import 'dotenv/config';
import {
    Chain,
  createPublicClient,
  createWalletClient,
  http,
  parseEther
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import escrowJson from "../artifacts/contracts/RealEstateEscrow.sol/RealEstateEscrow.json";

describe("RealEstateEscrow", () => {

const customLocalhost: Chain = {
    id: 31337,
    name: 'Localhost',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['http://127.0.0.1:8545'] },
      public:  { http: ['http://127.0.0.1:8545'] },
    },
    blockExplorers: {
      default: { name: 'Local Explorer', url: 'http://localhost:8545' },
    },
    testnet: true,
  }
  
  let publicClient = createPublicClient({ chain: customLocalhost, transport: http() });
  let escrowAddress: `0x${string}`;
  let deployerAddress: `0x${string}`;

  let investorAddress: `0x${string}`
  const account =  privateKeyToAccount(process.env.DEV_PRIVATE_KEY! as `0x${string}`)

   const walletClient = createWalletClient({
    chain: customLocalhost,
    transport: http(),
    account
  });

  const investorAccount = privateKeyToAccount(process.env.INVESTORS_PRIVATE_KEY! as `0x${string}`);
   const investorClient = createWalletClient({
      chain: customLocalhost,
      transport: http(),
      account: investorAccount,
    });
  beforeEach(async () => {

    deployerAddress = account.address;

    investorAddress = investorAccount.address; 

    // deploy contract , deploy with dev 
    const txHash = await walletClient.deployContract({
        account,
        abi: escrowJson.abi,
        bytecode: escrowJson.bytecode as `0x${string}`,
        args: [parseEther("5"), 1], // 5 eth is goal here, deadline 1 day
    });

    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    escrowAddress = receipt!.contractAddress!;
  });
  

  // for the invest, I have to create a separate wallet , say investors .

  it("invest(): accepts ETH before deadline and updates state", async () => {
    const amount = parseEther("10");

    // 1) Call invest() sending 1 ETH
   const txHash = await investorClient.writeContract({
        address: escrowAddress,
        abi: escrowJson.abi,
        functionName: "invest",
        args: [],
        value: amount
    });

    await publicClient.getTransactionReceipt({ hash: txHash })

  
    const contributed = await publicClient.readContract( {
      address: escrowAddress,
      abi: escrowJson.abi,
      functionName: "contributions",
      args: [investorAddress],
    });
    expect(contributed).to.equal(amount);

    const balance = await publicClient.getBalance({ address: escrowAddress });
    console.log("Contract is holding:", balance.toString(), "wei") // 1 eth = 10^18 wei
    expect(balance).to.equal(amount);
  });




  it("refund(): refund if deadline passed or amount reached", async() => {
    
  await investorClient.writeContract({
    address: escrowAddress,
    abi: escrowJson.abi,
    functionName: "invest",
    args: [],
    value: parseEther("1")
  });

  // 2) Fast-forward past the 1-day deadline
await publicClient.request({ method: "evm_increaseTime" as any, params: [2 * 24 * 60 * 60] as any });
await publicClient.request({ method: "evm_mine"         as any, params: []                     as any });


  // 3) Call refund()
  await investorClient.writeContract({
    address: escrowAddress,
    abi: escrowJson.abi,
    functionName: "refund",
    args: [],
  });

  // zeroed out to avoid re-entracy. so hackers dont inject wrong values.
  const afterContrib = await publicClient.readContract({
    address: escrowAddress,
    abi: escrowJson.abi,
    functionName: "contributions",
    args: [deployerAddress],
  });
  expect(afterContrib).to.equal(0n);


  const afterBal = await publicClient.getBalance({ address: escrowAddress });
  expect(afterBal).to.equal(0n);

  })

  it("sends all ETH to the developer", async () => {
    const deposit = parseEther("6");   
  
    const investTx = await investorClient.writeContract({
      address: escrowAddress,
      abi: escrowJson.abi,
      functionName: "invest",
      args: [],
      value: deposit,
    });
    await publicClient.getTransactionReceipt({ hash: investTx });
  
    const before = await publicClient.getBalance({ address: deployerAddress });
  

    await publicClient.request({ method: "evm_increaseTime" as any, params: [2 * 24 * 60 * 60] as any });
    await publicClient.request({ method: "evm_mine"         as any, params: []                     as any });
  
    const releaseTx = await walletClient.writeContract({
      address: escrowAddress,
      abi: escrowJson.abi,
      functionName: "releaseToDeveloper",
      args: [],
    });
    const receipt = await publicClient.getTransactionReceipt({ hash: releaseTx });
    const gasCost = receipt!.gasUsed * receipt!.effectiveGasPrice!;
  
    const after = await publicClient.getBalance({ address: deployerAddress });

    expect(after).to.equal(before + deposit - gasCost);
  
    const finalBal = await publicClient.getBalance({ address: escrowAddress });
    expect(finalBal).to.equal(0n);
  });
});
