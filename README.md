# Real-Estate-Escrow

[![Build Status](https://img.shields.io/badge/tests-passing-brightgreen.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An end-to-end example of a Solidity escrow contract for real-estate fundraising, with a full TypeScript + Viem client, automated Mocha tests, and local Hardhat development. Designed to showcase best practices in smart-contract architecture, testing, and developer ergonomics.

---

## 🚀 Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
5. [License](#license)  

---

## 📖 Project Overview

**RealEstateEscrow** is a Solidity smart contract that simulates a simple fundraising escrow for tokenized real-estate projects.  
- Contributors lock ETH into the contract via `invest()` before a deadline.  
- If the funding goal is met by the deadline, the funds are released to the developer via `releaseToDeveloper()`.  
- Otherwise, contributors can reclaim their ETH with `refund()`.

This repo demonstrates:
- **Clean contract design** in Solidity 0.8⟂  
- **Local dev** with Hardhat & Ganache-style network  
- **Type-safe client** code in TypeScript using Viem  
- **Automated end-to-end tests** with Mocha + Chai  
- **CI-ready structure** and clear README for prospective employers  

---

## ✨ Features

- ✔️ Fundraising goal + deadline  
- ✔️ Safe refunds with re-entrancy guard  
- ✔️ Secure release to developer  
- ✔️ Full on-chain state inspection (balances + mapping)  
- ✔️ TypeScript + Viem client for scriptable interactions  
- ✔️ Automated Mocha tests (invest, refund, release)  
- ✔️ Hardhat local node for fast iteration  

---

## 🛠 Tech Stack

- **Solidity 0.8.x** – Smart-contract language  
- **Hardhat** – Local Ethereum environment, compilation, console  
- **TypeScript** – Client & tests  
- **Viem** – Typed Ethereum client (RPC, wallet, contracts)  
- **Mocha & Chai** – Test runner & assertions  
- **dotenv** – Environment-variable management  

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18  
- npm (comes with Node)  
- git

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/realestate-escrow.git
cd realestate-escrow

# Install dependencies
npm install

# Compile Contracts
npm run compile 

# deploy contracts
npm run deploy

# Run local hardhat node
npm run dev

# run tests

npm run test:viem
