import { ethers } from "ethers";
import { DataBase } from "../db";

interface IWalletArgs {
  create?: boolean;
  all?: boolean;
  set?: string;
  target?: string;
}

export const runWallet = async (args: IWalletArgs) => {
  if (args.create) {
    try {
      console.log("Creating a mining account...");
      const wallet = ethers.Wallet.createRandom();
      await DataBase.miner.push(
        `/${wallet.address}`,
        {
          privateKey: wallet.privateKey,
          mnemonic: wallet.mnemonic,
        },
        false
      );
      console.log("Mining account created successfully");
      console.log(wallet);
    } catch (error) {
      console.log("Mining account created failed");
      console.error(error);
    }
  }
  if (args.set) {
    const previteKey = args.set;
    const wallet = new ethers.Wallet(previteKey);
    await DataBase.miner.push(
      `/${wallet.address}`,
      {
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic,
      },
      false
    );
    console.log("Mining account created successfully");
  }

  if (args.target) {
    const target = args.target;
    console.log("🚀 ~ target:", target);
    const wallet = await DataBase.miner.getObject<Record<string, ethers.Wallet>>(`/${target}`);
    if (!wallet) {
      throw new Error("target not found");
    }
    console.log(wallet);
  }

  if (args.all) {
    const minersData = await DataBase.miner.getObject<Record<string, ethers.Wallet>>(`/`);

    const minersTable = Object.keys(minersData).map((account) => {
      return {
        address: account,
        privateKey: minersData[account].privateKey,
      };
    });

    if (!minersTable.length) {
      console.log(`
No mining account configured!
💡 tips:
1. cli wallet --create can create a new user
2. cli wallet --set <privateKey> to import a user.
- For more information, use cli help wallet 
`);
      throw new Error("No mining account configured!");
    }
    console.table(minersTable);
  }
};
