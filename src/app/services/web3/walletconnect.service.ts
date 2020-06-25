import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from 'ethers';
import { Web3Service, TESTNET_URL, TESTNET_ID } from './web3.service';

@Injectable({
  providedIn: 'root',
})
export class WalletConnectService extends Web3Service {
  private provider: WalletConnectProvider;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    let provider: WalletConnectProvider | ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc;
    try {
      // provider = isPlatformServer(platformId) ? undefined : new ethers.providers.JsonRpcProvider(TESTNET_URL) as any;
      provider = isPlatformServer(platformId) ? undefined : new WalletConnectProvider({
        rpc: {
          [TESTNET_ID]: TESTNET_URL,
        }
      });
      super(platformId, new ethers.providers.Web3Provider(provider));
      this.provider = provider as WalletConnectProvider;
    } catch (e) {
      console.error(e);
    }
  }

  async enable() {
    // this.provider = new WalletConnectProvider({
    //   rpc: {
    //     [TESTNET_ID]: TESTNET_URL,
    //   }
    // });
    await this.provider.enable();
    const block = await this.provider.send('eth_blockNumber', [])
    console.log('WalletConnectService::enable::block: ', block);
  }

  async ethBalanceOf(address: string): Promise<string> {
    if (isPlatformServer(this.platformId)) {
      return Promise.resolve('0');
    }

    const bal = await this.provider.send('eth_getBalance', [address, 'latest']);
    return ethers.utils.formatEther(bal);
  }
}
