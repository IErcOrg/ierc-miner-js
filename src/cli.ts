import { program } from "commander";
import { runMine } from "./scripts/mine";
import { runWallet } from "./scripts/wallet";

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
  .description("Perform Ethernet IERC POW Mining")
  .option("-a, --account <account>", "Provide your mining address")
  .action((tick, options) => {
    runMine(tick, options);
  });

program.parse(process.argv);
