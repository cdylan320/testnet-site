import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from 'ethers';
import { Web3Service, TESTNET_URL, TESTNET_ID } from './web3.service';

@Injectable({
  providedIn: 'root',
})
export class WalletConnectService extends Web3Service {
  private readonly provider: WalletConnectProvider;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    let provider: ethers.providers.AsyncSendable|undefined;
    try {
      provider = isPlatformServer(platformId) ? undefined : new WalletConnectProvider({
        rpc: {
          [TESTNET_ID]: TESTNET_URL,
        }
      });
    } catch (e) {
      console.error(e);
    }
    super(platformId, new ethers.providers.Web3Provider(provider));
    this.provider = provider as WalletConnectProvider;
  }

  async enable() {
    await this.provider.enable();
  }
}
