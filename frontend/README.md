## Before we get started:

You'll need MetaMask installed to get this working. If you don't already have it, start by downloading & installing the MetaMask extension for Chrome, Firefox, Brave, or Edge: https://metamask.io/download.html (be careful to triple check the URL and ensure you are downloading from a trusted website). If you haven't set up MetaMask before, follow the instructions to set up an Ethereum account.

After the app is runned, you need to connect MetaMask to fetch swap transaction history from the Backend server.

## Set the environment variables.

Copy the `.env.template` into your own `.env` file, which you can use to bootstrap your own file. You'll need to copy this file and configure it with your application's settings for this to work. You can either do this manually, by copying and pasting the contents of `.env.template` into your own file and saving that as `.env`
Please set `SERVER_URL` variable as the currently running Backend server address.

## Run the App

```
npm install

npm start
```
