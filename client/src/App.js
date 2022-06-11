import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import Token from "../src/contracts/Token.json";
import Contracts from "../src/contracts/contract-address.json";
import "./App.css";
import { BigNumber, parseEther } from "ethers";
import { connectWallet, getCurrentWalletConnected } from "../src/utils/interact.js";

class App extends Component {
  state = {
    tokenName: '',
    myBalance: 0,
    myAddress: '',
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    reciverAddress: '',
    sendingTokens: 0
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      
      // ############ truffle ###############
      //const deployedNetwork = Token.networks[networkId];
      //const deployedAddress = deployedNetwork.address;

      // ############ hardhat ###############
      const deployedAddress = Contracts.Token;
      const instance = new web3.eth.Contract(
        Token.abi,
        Contracts && deployedAddress,
      );
        console.log("contract", instance);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getInfo);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };



  sendCoin = async (event) => {

    event.preventDefault();
    const web3 = this.state.web3;
    console.log("sendCoin.web3", web3);
    console.log(this.state.reciverAddress);
    console.log(this.state.sendingTokens);
    console.log( this.state.reciverAddress + ": isAddress - "+ web3.utils.isAddress(this.state.reciverAddress) );

    if (this.state.reciverAddress === '' || this.state.sendingTokens === 0) { } else {
      try{
        const sAmount = web3.utils.toWei(this.state.sendingTokens, 'ether');
        const bigAmount = BigNumber.from(sAmount);
        console.log("sAmount", sAmount);
        console.log("bigAmount", bigAmount);
        const { accounts, contract } = this.state;
        
        
        // let respons = await contract.methods.transfer(
        //     this.state.reciverAddress, 
        //     bigAmount
        //     ).send({ from: accounts[0]
        //              // ,value: 9999 
        //        })
        // console.log(respons);


        // ############ update start
        const wallResult = await getCurrentWalletConnected();
        console.log("wallResult", wallResult);
        const walletAddress = wallResult.address;
        
        let transactionParameters = {
          to: Contracts.Token,
          from: walletAddress,
          data: contract.methods.transfer(
              this.state.reciverAddress, 
              bigAmount).encodeABI(),
        };
        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        }).then (function(res, err) {
          if (res) {
            alert("Token Transfer was Successfully Performed.");
          }
          console.log("Token Transfer was Successfully Performed.");
        })
        // ############ update end

      }
      catch(error)
      {
        alert("token sending error");
        console.error(error);
      }
      this.getInfo()
    }
  }

  getInfo = async () => {
    const { accounts, contract } = this.state;

    console.log("getInfo.contract", contract);
    const response = await contract.methods.name.call();
    this.setState({ myAddress: accounts[0] });
    console.log("name.call()",response);

    contract.methods.balanceOf(accounts[0]).call().then((balance) => {
      let bal = parseInt((balance / 1000000000000000000)).toFixed(18)
      this.setState({ myBalance: bal });
    })
    // let result1 = contract.methods.name.call().call((error, result) => {
    //   console.log("call().call", result);
    //   this.setState({ tokenName: result });
    // });
    let result = await contract.methods.name.call();
    this.setState({ tokenName: result.name });
    console.log("name.call2()", result);
  }


  render() {
    if (!this.state.web3) {
      return (
        <div className="bg-white w-full h-screen flex justify-center items-center">
          Loading Web3, accounts, and contract...
        </div>
      );
    }
    return (
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              {this.state.tokenName}
            </h2>
            <p className="mt-5 text-xl text-gray-400">
              Your Address is: {this.state.myAddress}
            </p>
            <p className="mt-5 text-xl text-gray-400">
              Your Balance is: {this.state.myBalance}
            </p>
          </div>
          <div className="mt-10 w-full max-w-xs">
            <label htmlFor="currency" className="block text-base font-medium text-gray-300">
              Send Token
            </label>
            <div className="mt-1.5 relative">

              <form action="" method="POST" className="grid grid-cols-1 gap-y-6" onSubmit={this.sendCoin}>
                <div>
                  <label htmlFor="full-name" className="sr-only">
                    Tokens
                  </label>
                  <input
                    type="text"
                    onChange={(e) => this.setState({ sendingTokens: e.target.value })}
                    autoComplete="name"
                    className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    placeholder="Send Tokens"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="sr-only">
                    Address
                  </label>
                  <textarea

                    rows={4}
                    className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                    placeholder="Reciver Address"
                    defaultValue={''}
                    onChange={(e) => this.setState({ reciverAddress: e.target.value })}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
