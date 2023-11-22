import { ethers } from "ethers";
import { GAS_PREMIUM, PROVIDER_RPC, ZERO_ADDRESS } from "../constants";
import { DataBase } from "../db";
import { sleep } from "../utils/program";
import { stringToHex } from "../utils/hex";
import Spinnies from "spinnies";
import { printer } from "../utils/log4js";
import { bnUtils } from "../utils/bn";
import { sayMinerLog } from "../utils/prompts";
import dayjs from "dayjs";
import { generateNonce } from "../utils";
import { readFile } from "fs/promises";

interface IMineOptions {
  account: string;
}

let unique = 0;
export const runMine = async (tick: string, options: IMineOptions) => {
  sayMinerLog();
  const str = await readFile("./tokens.json", "utf-8");
  const ticks = JSON.parse(str) as Record<string, { amt: string; workc: string }>;
  const tickInfo = ticks[tick];
  if (!tickInfo) {
    throw new Error(`Mining attempt failed: 'tick' value ${tick} is not found in tokens.json.`);
  }
  const { amt, workc } = tickInfo;
  const { account } = options;
  if (!(await DataBase.miner.exists(`/${account}`))) {
    console.log(`
This mining user configuration was not found!
💡 Tips: 
1. cli wallet ---set <privateKey> Import the user.
2. cli wallet --all to see configured users
- For more information, use cli help wallet
        `);
    throw new Error("Mining user configuration not found");
  }

  printer.trace(`Start mining with ${account}`);
  const { privateKey } = await DataBase.miner.getObject<{ privateKey: string }>(`/${account}`);
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_RPC);
  const miner = new ethers.Wallet(privateKey, provider);

  const network = await provider.getNetwork();
  printer.trace(`network is ${network.name} (chainID: ${network.chainId})`);

  const currentGasPrice = await provider.getGasPrice();
  const targetGasFee = currentGasPrice.div(100).mul(GAS_PREMIUM);

  printer.trace(`Current gas price usage ${bnUtils.fromWei(targetGasFee.toString(), 9)} gwei`);
  const nonce = await miner.getTransactionCount();
  printer.trace(`nonce is ${nonce}`);
  const balance = await miner.getBalance();
  printer.trace(`balance is ${bnUtils.fromWei(balance.toString(), 18).dp(4).toString()}`);

  const spinnies = new Spinnies();
  printer.trace(`The current mining difficulty is ${workc}`);
  printer.trace(`Expected to take 1-2 minutes to calculate...`);
  spinnies.add("mining", { text: "start mining...", color: "blue" });
  await sleep(1000);
  let timer = Date.now(),
    startTimer = timer,
    mineCount = 0;

  while (true) {
    mineCount += 1;
    const callData = `data:application/json,{"p":"ierc-20","op":"mint","tick":"${tick}","amt":${amt},"nonce":"${generateNonce()}${unique++}"}`;
    // console.log("🚀 ~ transactionData:", callData)
    const transaction = {
      type: 2,
      chainId: network.chainId,
      to: ZERO_ADDRESS,
      maxPriorityFeePerGas: targetGasFee,
      maxFeePerGas: targetGasFee,
      gasLimit: ethers.BigNumber.from("25000"),
      nonce: nonce,
      value: ethers.utils.parseEther("0"),
      data: stringToHex(callData),
    };
    const rawTransaction = ethers.utils.serializeTransaction(transaction);
    const transactionHash = ethers.utils.keccak256(rawTransaction);
    // console.log("🚀 ~ transactionHash:", transactionHash)

    const signingKey = miner._signingKey();
    const signature = signingKey.signDigest(transactionHash);
    // console.log("🚀 ~ signature:", signature)

    const recreatedSignature = ethers.utils.joinSignature(signature);
    // console.log("🚀 ~ recreatedSignature:", recreatedSignature)

    const predictedTransactionHash = ethers.utils.keccak256(
      ethers.utils.serializeTransaction(transaction, recreatedSignature)
    );

    // console.log("🚀 ~ predictedTransactionHash:", predictedTransactionHash)
    const now = Date.now();
    if (now - timer > 100) {
      await sleep(1);
      spinnies.update("mining", {
        text: `[${dayjs(now).format(
          "YYYY-MM-DD HH:mm:ss"
        )}] ${mineCount} - ${predictedTransactionHash}`,
        color: "red",
      });
      timer = now;
    }

    if (predictedTransactionHash.includes(workc)) {
      unique = 0;
      spinnies.succeed("mining", {
        text: `${mineCount} - ${predictedTransactionHash}`,
        color: "green",
      });
      const mineTime = (Date.now() - startTimer) / 1000;
      printer.info(
        `Total time spent ${mineTime}s, average arithmetic ${Math.ceil(mineCount / mineTime)} c/s`
      );
      // console.log("🚀 ~ transaction:", transaction)
      const realTransaction = await miner.sendTransaction(transaction);
      // console.log("🚀 ~ realTransaction:", realTransaction)
      printer.info(`mining hash: ${realTransaction.hash}`);
      await realTransaction.wait();

      return printer.info("mining success");
    }
    // await sleep(1)
  }
};
