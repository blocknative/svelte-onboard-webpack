<script>
  import './global.css'
  import Onboard from 'bnc-onboard'

  const rpcUrl = 'https://rinkeby.infura.io/v3/cea9deb6467748b0b81b920b005c10c1'

  const onboard = Onboard({
    networkId: 4,
    walletSelect: {
      wallets: [
        { walletName: 'metamask' },
        {
          walletName: 'trezor',
          appUrl: 'https://reactdemo.blocknative.com',
          email: 'aaron@blocknative.com',
          rpcUrl
        },
        {
          walletName: 'ledger',
          rpcUrl
        }
      ]
    }
  })
</script>

<button on:click={onboard.walletSelect}>Select Wallet</button>
<button on:click={onboard.walletCheck}>Check Wallet</button>
