import Vue from 'vue'
import App from './App.vue'

import { createClient } from '@remixproject/plugin-iframe';

const AURORA_MAINNET_CHAIN_ID = 1313161554;

const client = createClient();
client.onload(async () => {
  await checkUserChainId();

  //const data = await client.call('fileManager', 'readFile', 'contracts/AuroraBooking.sol');

  //console.log(data);

  client.on('solidity', 'compilationFinished', async (fileName, result) => {
    //let result = await client.call('solidity', 'getCompilationResult', fileName);
    //TODO: implement logic
  });
})

let checkUserChainId = async () => {
  if (!window.ethereum || window.ethereum.chainId === null) {
    setTimeout(checkUserChainId, 500);

    return;
  }

  if (Number.parseInt(window.ethereum.chainId) !== AURORA_MAINNET_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${AURORA_MAINNET_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) { // This error code indicates that the chain has not been added to MetaMask
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${AURORA_MAINNET_CHAIN_ID.toString(16)}`,
                chainName: "Aurora Mainnet",
                nativeCurrency: {
                  name: 'Aurora ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ["https://mainnet.aurora.dev"],
                blockExplorerUrls: ['https://explorer.mainnet.aurora.dev/']
              }
            ],
          });
        } catch (addError) {
          console.log(addError);
        }
      }
    }
  }
}

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
