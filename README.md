# WWW Backend

Backend for www project

## Installation

- First copy the `example.env` file to `.env` file

    ```bash
    cp example.env .env
    ```

- Use `yarn` to install the dependencies.

    ```bash
    yarn
    ```

- Generate the prisma types with `prisma`

    ```bash
    npx prisma generate
    ```

## Quick Start

- Use the default scripts to run the project

    ```bash
    yarn dev
    ```

- Or you can start using this script

    ```bash
    yarn start
    ```

## Cron Jobs & Services

- Buy token service
  - Trigger once the user has bought LANDC token with usdc
  - Receive webhook calls from stripe
  - Partition the amount by 96%, 3% and 1%
  - Transact the amounts to liquidity fund, escrow account and dev team respectively using Stripe
- Buring tokens cron:
  - Get 3% and 1% equivalent token from smart contract
  - Burn the equivalent token on monthly basis
