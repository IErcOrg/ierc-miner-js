import { program } from "commander";
import { runMine } from "./scripts/mine";
import { runWallet } from "./scripts/wallet";
import { runMintPow } from "./scripts/mint-pow";

program
  .command("wallet")
  .description("wallet options")
  .option("-t,--target <address>", "show target address info")
  .option("-a,--all", "show all wallet accounts")
  .option("-c,--create", "Create a new wallet account")
  .option("-s,--set <privateKey>", "Setting up an account that already exists")
  .action(async (args) => {
    runWallet(args);
  });

program
  .command("mine <tick>")
  .description("Perform Ethereum IERC POW Mining")
  .option("-a, --account <account>", "Provide your mining address")
  .action((tick, options) => {
    runMine(tick, options);
  });
program
  .command("mint-pow <workc>")
  .description("Perform Ethereum IERC DPoS&PoW Mining")
  .option("-a, --account <account>", "Provide your mining address")
  .action((workc, options) => {
    runMintPow(workc, options);
  });
program.parse(process.argv);
