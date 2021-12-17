<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/aurora-logo.png" @click="checkUserChainId" /><br />
    <span style="cursor: pointer" v-if="!isTurnedOn" @click="checkUserChainId" >
      <div class="circle-red"></div> Switched OFF
    </span>
    <span style="cursor: pointer" v-if="isTurnedOn" @click="checkUserChainId" >
      <div class="circle-green"></div> Switched ON
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOn: false,
      AURORA_MAINNET_CHAIN_ID: 1313161554
    }
  },
  async mounted() {
    let _this = this;

    setTimeout(function checkChainId() {
      // console.log(window.ethereum.chainId);
      // console.log(Number.parseInt(window.ethereum.chainId));
      // console.log(_this.AURORA_MAINNET_CHAIN_ID);
      if (!window.ethereum || window.ethereum.chainId === null) {
        _this.isOn = false;
      } else if (Number.parseInt(window.ethereum.chainId) === _this.AURORA_MAINNET_CHAIN_ID) {
        _this.isOn = true;
      } else {
        _this.isOn = false
      }

      setTimeout(checkChainId.bind(_this), 1000);
    }.bind(this), 0);
  },
  computed: {
    isTurnedOn() {
      return this.isOn;
    },
  },
  methods: {
    async checkUserChainId() {
      if (!window.ethereum || window.ethereum.chainId === null) {
        this.isOn = false;
        setTimeout(checkUserChainId, 500);

        return;
      }

      if (Number.parseInt(window.ethereum.chainId) !== this.AURORA_MAINNET_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${this.AURORA_MAINNET_CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError) {
          console.log(switchError);
          if (switchError.code === 4902) { // This error code indicates that the chain has not been added to MetaMask
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: `0x${this.AURORA_MAINNET_CHAIN_ID.toString(16)}`,
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
.circle-red {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: red;
  display: inline-block;
}
.circle-green {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: green;
  display: inline-block;
}
</style>
