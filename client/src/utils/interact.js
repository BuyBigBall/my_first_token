import { chainId } from '../constants/address'
import React, { Component }  from 'react';

export const connectWallet = async () => {

  console.log("chainId", chainId);
  if (window.ethereum) {
    try {
      const chain = await window.ethereum.request({ method: 'eth_chainId' })
      // console.log(chain, parseInt(chain, 16), chainId, parseInt(chain, 16) === chainId)
      if (chain == chainId) {
        const addressArray = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 You can mint new pack now.",
          }
        } else {
          return {
            address: "",
            status: "😥 Connect your wallet account to the site.",
          }
        }
      } else {
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId:chainId }],
        })
        return {
          address: "",
          status: "😥 Connect your wallet account to the site.",
        }
      }
      
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      }
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            {/* <a target="_blank" href={`https://metamask.io/download.html`}> */}
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.(https://metamask.io/download.html)
            {/* </a> */}
          </p>
        </span>
      ),
    }
  }
}


  // export const connectWallet = async () => {
  //   if (window.ethereum) {
  //     try {
  //       const addressArray = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       const obj = {
  //         status: "👆🏽 Write a message in the text-field above.",
  //         address: addressArray[0],
  //       };
  //       return obj;
  //     } catch (err) {
  //       return {
  //         address: "",
  //         status: "😥 " + err.message,
  //       };
  //     }
  //   } else {
  //     return {
  //       address: "",
  //       status: (
  //         <span>
  //           <p>
  //             {" "}
  //             🦊{" "}
  //             <a target="_blank" href={`https://metamask.io/download.html`}>
  //               You must install Metamask, a virtual Ethereum wallet, in your
  //               browser.
  //             </a>
  //           </p>
  //         </span>
  //       ),
  //     };
  //   }
  // };
  
  export const getCurrentWalletConnected = async () => {
    console.log("window.ethereum", window.ethereum);
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Write a message in the text-field above.",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };
  