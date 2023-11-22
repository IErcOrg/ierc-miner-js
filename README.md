# Ethereum IERC PoW Miner Program

This Ethereum IERC PoW Miner Program is a Node.js command-line application that enables users to interact with Ethereum wallets and perform PoW mining.

## Features

**Wallet Management**: Manage Ethereum wallets, including viewing wallet information, creating new wallets, and setting up existing accounts.

**Mining**: Engage in Ethereum IERC PoW Mining by providing a mining address.

## Risk Disclaimer

Please note that this tool does not provide the capability to track mining progress or verify if a specific tick has been successfully minted. For this information, visit [IERC Official Website](https://ierc20.com). Use this tool with the understanding that it does not provide real-time updates on the availability of mining opportunities. Users are advised to proceed with caution and at their own risk.

## Installation

### Prerequisites

Before installing the program, ensure you have Node.js installed on your system. If not, follow these steps to install Node.js:

1. Visit [Node.js official website](https://nodejs.org/).
2. Download the Node.js installer for your operating system.
3. Follow the installation instructions to install Node.js and npm.

### Setting Up the Program

Once Node.js is installed, you can set up the Ethereum IERC PoW Mining Program:
To use this program, ensure you have Node.js installed on your system. Clone the repository and install dependencies:

```bash
git clone https://github.com/IErcOrg/ierc-miner-js
cd ierc-miner-js
npm i -g yarn
yarn install
```

## Usage

### Quick Start

1. Create wallet Or Set wallet

```shell
yarn cli wallet -create
Or
yarn cli wallet -set <privateKey>
```

Note: Newly created wallets require a transfer of funds

2. pow mine

```shell
yarn cli mine <tick> --account <address>
```



### Wallet Commands

- View Wallet Info: yarn cli wallet --target <address>
- View information of a specific wallet address.
- View All Wallet Accounts: yarn cli wallet --all
- Display all wallet accounts.
- Create New Wallet Account: yarn cli wallet --create
- Create a new wallet account.
- Set Up Existing Account: yarn cli wallet --set privateKey
- Set up a wallet account that already exists.

### Mining Commands

Start Mining: yarn cli mine <tick> --account <address>

- Start mining by specifying the number of ticks and the mining address.
