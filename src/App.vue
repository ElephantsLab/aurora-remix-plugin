<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/aurora-logo.png" @click="checkUserChainId" />
  </div>
</template>

<script>
export default {
  methods: {
    
    async checkUserChainId() {
      const AURORA_MAINNET_CHAIN_ID = 1313161554;

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
  }
}
</script>

<style>
div#app {
  width: 100%;
  text-align: center;
}
img {
  width: 200px;
  margin: 0 auto;
  cursor: pointer;
}
</style>
