# Dbilia Token - A Simple Custom Non Fungible Token

## Assignment

In this project you will be using either truffle or hardhat to build a small minting smart contract.
We recommend you to use the solidity version ^0.8.0;

Dbilia app accepts payment both in USD and ETH for minting; and smart contract needs to track this information.

- When a user wants to pay in USD, user pays gas fee to Dbilia in advance; and Dbilia’s ethereum account will mint the token on the user’s behalf and will keep the token.
- When a user wants to pay in ETH, user himself (msg.sender) will mint and keep the token.

Create two minting functions in DbiliaToken.sol and make sure to emit an event.

- mintWithUSD()
  i. when we confirm the user has paid gas fee to Dbilia, we will trigger this function
  ii. Only Dbilia can trigger using a modifier
  iii. take four parameters (userId, cardId, edition, tokenURI)
  iv. add any require statements as much as possible
  v. create a mapping to track the owner of token using userId (because dbilia is minting on their behalf)
  vi. cardId and edition should be mapped to a mapping
  vii. mint
  viii. set token uri

- mintWithETH()
  i. take three parameters (cardId, edition, tokenURI)
  ii. add any require statements as much as possible
  iii. cardId and edition should be mapped to a mapping
  iv. mint
  v. set token uri

Make sure you create a test script and test all this process thoroughly.

## Configuration

### Install Truffle cli

_Skip if you have already installed._

```
npm install -g truffle
```

### Install Dependencies

```
yarn install
```

## Test!💥

### Run Tests

Launch Ganache then run:

```
yarn test
```

or test in truffle console

```
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: DbiliaToken
    mintWithUSD
      √ should be called by only owner (1142ms)
      √ should not mint for invalid user (188ms)
      √ should mint (293ms)
      √ should not be able to mint with same card (815ms)
    mintWithETH
      √ should require sufficient ETH (196ms)
      √ should mint (356ms)
      √ should not be able to mint with same card (1132ms)


  7 passing (6s)

```
