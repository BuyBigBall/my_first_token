import "../assets/css/bootstrap.min.css";
import "../assets/css/style.css";
import "../assets/css/animate.css";

import footer_bg from "../assets/img/bg-5.jpg";
import JN59UlI from "../assets/img/5.png";
import twitter from "../assets/img/twitter.svg";
import discord from "../assets/img/discord.svg";
import telegram from "../assets/img/telegram.svg";
import metamask from "../assets/img/metamask-icon.webp";

import { connectWallet, getCurrentWalletConnected } from "../util/interact.js";

import { useEffect, useState } from "react";
import { HashRouter as Router, Route, Link} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { BigNumber, parseEther } from "ethers";

import { tokenAddress } from '../constants/address';
import { icoAddress } from '../constants/address';
import { chainId } from '../constants/address';
import api from "../util/api.js";
import $ from "jquery";
import Web3 from 'web3'
const BN = require('bn.js');

function AdminPage() {

  const [status, setStatus] = useState("");  
  const [icoContract, setIcoContract] = useState("");
  const [tokenContract, setTokenContract] = useState("");
  let history = useHistory();

  // const rpcURL = "https://bsc-dataseed.binance.org/";
  // const rpcURL = "https://data-seed-prebsc-1-s1.binance.org:8545";
  const rpcURL = "https://api.techpay.io/";
  
  const web3 = new Web3(rpcURL);
  const [walletAddress, setWallet] = useState("");
  const [walletConnectState, setWalletConnectState] = useState("Connect Wallet");
  
  //////////////////           ICO          //////////////////
  const [ownerAddress, setOwnerAddress] = useState("0x");
  const [icoContractAddress, setIcoContractAddress] = useState("0x");
  const [uzumakiBalance, setUzumakiBalance] = useState("0");
  const [unlockedUzumaki, setUnlockedUzumaki] = useState("0");
  const [priceForPresale, setPriceForPresale] = useState("0");
  const [contractBalance, setContractBalance] = useState("0");
  const [icoStartTime, setIcoStartTime] = useState("0");
  const [icoEndTime, setIcoEndTime] = useState("0");
  const [icoHolder, setIcoHolder] = useState("0");
  const [presaleExtra, setPresaleExtra] = useState("0");

  
  //////////////////           Token          //////////////////
  const [icoTokenAddress, setTokenContractAddress] = useState("0x");
  const [tokenOwnerAddress, setTokenOwnerAddress] = useState("0x");
  const [tokenTotalSupply, setTokenTotalSupply] = useState("0");
  const [circulatingSupply, setCirculatingSupply] = useState("0");
 

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);

    addStyles();
    getContractAndShowInfo(address);
    addWalletListener();
    showWalletAddress(address);

  }, []);

  const getContractAndShowInfo = async (walletAddress) => {
    
    const icoAbi = require("../constants/icoAbi.json");
    let contractOfICO = await new web3.eth.Contract(icoAbi, icoAddress);

    console.log(contractOfICO);

    const tokenAbi = require("../constants/tokenAbi.json");
    let contractOfToken = await new web3.eth.Contract(tokenAbi, tokenAddress);

    console.log(contractOfToken);

      //////////////////           ICO          //////////////////

      let value;

      value = await contractOfICO.methods.owner().call();
      console.log(value)
      setOwnerAddress(value);

      setIcoContractAddress(icoAddress);

      value = await contractOfICO.methods.balanceOfToken().call();
      value = Number(value) / 1e18;
      setUzumakiBalance(value);
      
      value = await contractOfICO.methods.getUnlockedTokens().call();
      value = Number(value) / 1e18;
      setUnlockedUzumaki(value);

      value = await contractOfICO.methods.getPriceOfToken().call();
      value = Number(value) / 1e18;
      setPriceForPresale(value);

      
      value = await contractOfICO.methods.getBalance().call();
      value = Number(value) / 1e18;
      setContractBalance(value);
      
      value = await contractOfICO.methods.icoStartTime().call();
      value = transferSecondToDate(Number(value));
      setIcoStartTime(value);

      value = await contractOfICO.methods.icoEndTime().call();
      value = transferSecondToDate(Number(value));
      setIcoEndTime(value);
      
      value = await contractOfICO.methods.lastIDCount().call();
      setIcoHolder(value);
      
      value = await contractOfICO.methods.presaleExtra().call();
      setPresaleExtra(value);
      
      
      //////////////////           Token          //////////////////

      setTokenContractAddress(tokenAddress);
      
      value = await contractOfToken.methods.owner().call();
      setTokenOwnerAddress(value);

      value = await contractOfToken.methods.totalSupply().call();
      value = value / 1e18;
      setTokenTotalSupply(value);
      
      value = await contractOfToken.methods.getCirculatingSupply().call();
      value = value / 1e18;
      setCirculatingSupply(value);


    setIcoContract(contractOfICO);
    setTokenContract(contractOfToken);    
  }


  const addStyles = () => {
    $(window).on('scroll', function() {
      var scroll = $(window).scrollTop();
  
        if (scroll >= 80) {
            $('header').addClass('nav-fixed');
        } else {
            $('header').removeClass('nav-fixed');
        }
    });

    $(window).scroll(function() {
      if ($(this).scrollTop() > 150) {
        $('.scrollup').fadeIn();
      } else {
        $('.scrollup').fadeOut();
      }
    });
    
    $(".scrollup").on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, 600);
      return false;
    });

    //Hide Navbar Dropdown After Click On Links
    var navBar = $(".header_wrap");
    var navbarLinks = navBar.find(".navbar-collapse ul li a.nav_item");

    $.each( navbarLinks, function( i, val ) {

      var navbarLink = $(this);

        navbarLink.on('click', function () {
          navBar.find(".navbar-collapse").collapse('hide');
          $("header").removeClass("active");
        });

    });
    
    //Main navigation Active Class Add Remove
    $('.navbar-toggler').on('click', function() {
      $("header").toggleClass("active");
    });

    $(document).on("ready", function () {
      if ($(window).width() > 991) {
        $("header").removeClass("active");
      }
      $(window).on("resize", function () {
      if ($(window).width() > 991) {
          $("header").removeClass("active");
        }
      })
    })
  }

  const transferSecondToDate = (sec) => {
   
    let t = new Date(1970, 0, 1);
    t.setSeconds(sec);
    
    let date = t.getFullYear() + "/" + (t.getMonth() + 1) + "/" + t.getDate();

    return date;
  }

  const showWalletAddress = (walletAddress) => {
    if (walletAddress.length > 0) {
      let addr = walletAddress;
      addr = addr.slice(0, 5) + "...." + addr.slice(-5);
      setWalletConnectState(addr);
    }
  }

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          getContractAndShowInfo(accounts[0]);
          let addr = accounts[0];
          addr = addr.slice(0, 5) + "...." + addr.slice(-5);
          setWalletConnectState(addr);
        } else  {
          setWallet("");
          setWalletConnectState("Connect Wallet");
        }
      });
    } else {
      setStatus(
        <p>
          <a
            target="_blank"
            href={`https://metamask.io/download.html`}
            rel="noreferrer"
          >
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }
  
  const connectWalletFunc = async () => {

    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        if (addressArray.length > 0) {
          setWallet(addressArray[0]);
          let addr = addressArray[0];
          addr = addr.slice(0, 5) + "...." + addr.slice(-5);
          setWalletConnectState(addr);
        } else {
        }
      } catch (err) {
      }
    } else {
    }
  }

  const setUzumakiPriceFunc = async () => {
    if (walletAddress == "") {
      alert("Please connect your wallet");
      return;
    }
    if (walletAddress.toLowerCase() != ownerAddress.toLocaleLowerCase()) {
      alert("This wallet address is not owner.");
      return;
    }
    let uzumakiPriceInput = $("#uzumakiPriceInput").val();
    if (uzumakiPriceInput == "") {
      alert("Please insert Price.");
      return;
    }
    uzumakiPriceInput = uzumakiPriceInput * 1e18;

    const transactionParameters = {
      to: icoAddress,
      from: walletAddress,
      data: icoContract.methods.setPriceOfToken(uzumakiPriceInput).encodeABI(),
    };

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    }).then (function(res, err) {
      if (res) {
        alert("Price was Successfully Setten.");
        setPriceForPresale(uzumakiPriceInput / 1e18);
      }
      console.log("Price Was Successfully Setten.");
    })

  }

  const setPresaleExtraFunc = async () => {
    if (walletAddress == "") {
      alert("Please connect your wallet");
      return;
    }
    if (walletAddress.toLowerCase() != ownerAddress.toLocaleLowerCase()) {
      alert("This wallet address is not owner.");
      return;
    }
    let presaleExtraInput = $("#presaleExtraInput").val();
    if (presaleExtraInput == "") {
      alert("Please insert Extra Value.");
      return;
    }

    presaleExtraInput = Number(presaleExtraInput);
    const transactionParameters = {
      to: icoAddress,
      from: walletAddress,
      data: icoContract.methods.setPresaleExtra(presaleExtraInput).encodeABI(),
    };

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    }).then (function(res, err) {
      if (res) {
        alert("Price was Successfully Setten.");
        setPresaleExtra(presaleExtraInput);
      }
      console.log("Price was Successfully Setten.");
    })

  }

  const setTokenAddressFunc = async () => {
    if (walletAddress == "") {
      alert("Please connect your wallet");
      return;
    }
    if (walletAddress.toLowerCase() != ownerAddress.toLocaleLowerCase()) {
      alert("This wallet address is not owner.");
      return;
    }
    let uzumakiAddressInput = $("#uzumakiAddressInput").val();
    if (uzumakiAddressInput == "") {
      alert("Please insert Uzumaki Address.");
      return;
    }
    if (uzumakiAddressInput.slice(0, 2) != "0x" || uzumakiAddressInput.length != 42) {
      alert("Uzumaki address form is wrong.");
      return;
    }

    const transactionParameters = {
      to: icoAddress,
      from: walletAddress,
      data: icoContract.methods.setTokenAddress(uzumakiAddressInput).encodeABI(),
    };

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    }).then (function(res, err) {
      if (res) {
        alert("Uzumaki Address Successfully Setten.");
      }
      console.log("Uzumaki Address Successfully Setten.");
    })

  }

  const setIcoDaysFunc = async () => {
    if (walletAddress == "") {
      alert("Please connect your wallet");
      return;
    }
    if (walletAddress.toLowerCase() != ownerAddress.toLocaleLowerCase()) {
      alert("This wallet address is not owner.");
      return;
    }
    let icoDaysInput = $("#icoDaysInput").val();
    if (icoDaysInput == "") {
      alert("Please insert days of Presale.");
      return;
    }

    const transactionParameters = {
      to: icoAddress,
      from: walletAddress,
      data: icoContract.methods.setIcoEndTime(icoDaysInput).encodeABI(),
    };

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    }).then (function(res, err) {
      if (res) {
        alert("Presale Duration is Successfully Setten.");        
      }
      console.log("Uzumaki Address is Successfully Setten.");
    })
    
    let value = await icoContract.methods.icoStartTime().call();
    value = transferSecondToDate(Number(value) + 3600*24*Number(icoDaysInput));
    setIcoEndTime(value);
  }

  const setTransferOwnershipFunc = async () => {
    if (walletAddress == "") {
      alert("Please connect your wallet");
      return;
    }
    if (walletAddress.toLowerCase() != ownerAddress.toLocaleLowerCase()) {
      alert("This wallet address is not owner.");
      return;
    }
    let transferOwnershipInput = $("#transferOwnershipInput").val();
    if (transferOwnershipInput == "") {
      alert("Please insert address to Transfer.");
      return;
    }
    if (transferOwnershipInput.slice(0, 2) != "0x" || transferOwnershipInput.length != 42) {
      alert("The address form is wrong.");
      return;
    }

    const transactionParameters = {
      to: icoAddress,
      from: walletAddress,
      data: icoContract.methods.transferOwnership(transferOwnershipInput).encodeABI(),
    };

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    }).then (function(res, err) {
      if (res) {
        alert("Transfer Ownership was Successfully Performed.");
        setOwnerAddress(transferOwnershipInput);
      }
      console.log("Uzumaki Address was Successfully Performed.");
    })
  }

  const withdrawFunc = async () => {
    if (walletAddress == "") {
      alert("Please connect your wallet");
      return;
    }
    if (walletAddress.toLowerCase() != ownerAddress.toLocaleLowerCase()) {
      alert("This wallet address is not owner.");
      return;
    }
    let withdrawAddressInput = $("#withdrawAddressInput").val();
    if (withdrawAddressInput == "") {
      alert("Please insert address to Transfer.");
      return;
    }
    if (withdrawAddressInput.slice(0, 2) != "0x" || withdrawAddressInput.length != 42) {
      alert("The address form is wrong.");
      return;
    }

    const transactionParameters = {
      to: icoAddress,
      from: walletAddress,
      data: icoContract.methods.withDraw(withdrawAddressInput).encodeABI(),
    };

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    }).then (function(res, err) {
      if (res) {
        alert("Withdraw all TPC was Successfully Performed.");
      }
      console.log("Withdraw all TPC was Successfully Performed.");
    })

    let value = await icoContract.methods.getBalance().call();
    value = Number(value) / 1e18;
    setContractBalance(value);
  }

  const transferTokenFunc = async () => {
    if (walletAddress == "") {
      alert("Please connect your wallet");
      return;
    }
    if (walletAddress.toLowerCase() != tokenOwnerAddress.toLocaleLowerCase()) {
      alert("This wallet address is not owner.");
      return;
    }
    let transferTokenAddressInput = $("#transferTokenAddressInput").val();
    if (transferTokenAddressInput == "") {
      alert("Please insert address to Transfer.");
      return;
    }
    if (transferTokenAddressInput.slice(0, 2) != "0x" || transferTokenAddressInput.length != 42) {
      alert("The address form is wrong.");
      return;
    }
    let transferTokenAmountInput = $("#transferTokenAmountInput").val();
    if (transferTokenAmountInput == "") {
      alert("Please insert Amount to Transfer.");
      return;
    }

    const tokenAbi = require("../constants/tokenAbi.json");
    let contractOfToken = await new web3.eth.Contract(tokenAbi, tokenAddress);

    const s = Web3.utils.toWei(transferTokenAmountInput, 'ether');

    let transactionParameters = {
      to: tokenAddress,
      from: walletAddress,
      data: contractOfToken.methods.transfer(transferTokenAddressInput, BigNumber.from(s)).encodeABI(),
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

  }

  const mintFunc = async () => {
    if (walletAddress == "") {
      alert("Please connect your wallet");
      return;
    }
    if (walletAddress.toLowerCase() != tokenOwnerAddress.toLocaleLowerCase()) {
      alert("This wallet address is not owner.");
      return;
    }
    let mintReceiverAddressInput = $("#mintReceiverAddressInput").val();
    if (mintReceiverAddressInput == "") {
      alert("Please insert address to Mint.");
      return;
    }
    if (mintReceiverAddressInput.slice(0, 2) != "0x" || mintReceiverAddressInput.length != 42) {
      alert("The address form is wrong.");
      return;
    }
    let mintAmountInput = $("#mintAmountInput").val();
    if (mintAmountInput == "") {
      alert("Please insert Amount to Mint.");
      return;
    }
            
    const tokenAbi = require("../constants/tokenAbi.json");
    let contractOfToken = await new web3.eth.Contract(tokenAbi, tokenAddress);

    const s = Web3.utils.toWei(mintAmountInput, 'ether');

    let transactionParameters = {
      to: tokenAddress,
      from: walletAddress,
      data: contractOfToken.methods.mint(mintReceiverAddressInput, BigNumber.from(s)).encodeABI(),
    };

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    }).then (function(res, err) {
      if (res) {
        alert("Token Mint was Successfully Performed.");
      }
      console.log("Token Mint was Successfully Performed.");
    })

  }

  const transferOwnershipOfTokenFunc = async () => {
    if (walletAddress == "") {
      alert("Please connect your wallet");
      return;
    }
    if (walletAddress.toLowerCase() != tokenOwnerAddress.toLocaleLowerCase()) {
      alert("This wallet address is not owner.");
      return;
    }
    let transferOwnershipOfTokenInput = $("#transferOwnershipOfTokenInput").val();
    if (transferOwnershipOfTokenInput == "") {
      alert("Please insert address to Transfer.");
      return;
    }
    if (transferOwnershipOfTokenInput.slice(0, 2) != "0x" || transferOwnershipOfTokenInput.length != 42) {
      alert("The address form is wrong.");
      return;
    }
            
    const tokenAbi = require("../constants/tokenAbi.json");
    let contractOfToken = await new web3.eth.Contract(tokenAbi, tokenAddress);
    console.log(contractOfToken);

    const transactionParameters = {
      to: tokenAddress,
      from: walletAddress,
      data: contractOfToken.methods.transferOwnership(transferOwnershipOfTokenInput).encodeABI(),
    };

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    }).then (function(res, err) {
      if (res) {
        alert("Transfer Ownership was Successfully Performed.");
        setTokenOwnerAddress(transferOwnershipOfTokenInput);
      }
      console.log("Transfer Ownership was Successfully Performed.");
    })

  }

  return (
    <>
      <div className="v_dark loaded" data-spy="scroll" data-offset="110" data-new-gr-c-s-check-loaded="14.1050.0" data-gr-ext-installed="">
        <div className="parallax-mirror div1-1">
          <img className="parallax-slider img1-1" src={footer_bg} data-xblocker="passed" />
        </div>
        
        <header className="header_wrap fixed-top">
          <div className="container-fluid">
            <nav className="navbar navbar-expand-lg"> 
              <a className="navbar-brand page-scroll animation animated fadeInDown" data-animation="fadeInDown" data-animation-delay="1s" style={{animationDelay: '1s', opacity: 1}}>
                <img className="logo_light fav-logo" height="50px" width="50px" src={JN59UlI} alt="logo" /> 
                <img className="logo_dark fav-logo" src={JN59UlI} alt="logo" data-xblocker="passed" style={{visibility: 'visible'}} /> 
                <strong style={{color:'white', marginLeft:'5px'}}>Uzumaki</strong>
              </a>
              <div className="space animation animated fadeInDown"><span style={{color:"white", float:"right"}}>{walletConnectState}</span></div>
              <button className="navbar-toggler green animation animated fadeInDown" height="20px" width="20px" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" data-animation="fadeInDown" data-animation-delay="1.1s" style={{animationDelay: '1.1s', opacity: 1}}> 
                ≡
              </button>
              <button className="navbar-toggler1 green animation animated fadeInDown" onClick={() => { connectWalletFunc() }} type="button"  data-animation="fadeInDown" data-animation-delay="1.1s" style={{animationDelay: '1.1s', opacity: 1}}>               
                <img className="logo_light fav-logo" height="20px" width="20px" src={metamask} alt="logo" /> 
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav m-auto">
                  <li className="dropdown animation animated fadeInDown nav-item" data-animation="fadeInDown" >
                    <Link to="/" className="nav-link">Home</Link>
                  </li>
                  <li className="dropdown animation animated fadeInDown nav-item" data-animation="fadeInDown">
                    <Link to="/presale" className="nav-link">Presale</Link>
                  </li>
                  <li className="dropdown animation animated fadeInDown nav-item" data-animation="fadeInDown">
                    <Link to="/account" className="nav-link">Account</Link>
                  </li>
                  <li className="dropdown animation animated fadeInDown nav-item" data-animation="fadeInDown">
                    <Link to="/admin" className="nav-link">Admin</Link>
                  </li>
                </ul>
                <span className="wallet-address animation animated fadeInDown" data-animation="fadeInDown">{walletConnectState}</span>
              </div> 
            </nav>
          </div>
        </header>
        <div id="sm-walletstate" className=" animation animated fadeInDown"><span style={{color:"white"}}>{walletConnectState}</span></div>            
        <section className="admin-first" data-z-index="1" data-parallax="scroll" data-image-src={footer_bg}>
          <div className="container">
            <div className="row">
              <div className="col-lg-2 col-md-12 col-sm-12">
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="glass animation animated fadeInDown">
                  <div className="text-center">
                    <strong className="account-first-text">Uzumaki Presale Contract</strong>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-12 col-sm-12">
              </div>
            </div>
          </div>
        </section>
        
        <section className="admin-second" data-z-index="1" data-parallax="scroll" data-image-src={footer_bg}>
          <div className="container">
            <div className="glass1 animation animated fadeInDown">
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>ICO Contract Address</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span style={{wordWrap:'break-word'}}>{icoContractAddress}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Owner Address</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span style={{wordWrap:'break-word'}}>{ownerAddress}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Uzumaki Amount For Presale</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>{uzumakiBalance}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Unlocked Uzumaki</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>{unlockedUzumaki}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Presale Price, TPC</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>{priceForPresale}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Contract Balance, TPC</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>{contractBalance}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>ICO Start Time</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>{icoStartTime}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>ICO End Time</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>{icoEndTime}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>ICO holder</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>{icoHolder}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Presale Extra, %</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>{presaleExtra}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="admin-second" data-z-index="1" data-parallax="scroll" data-image-src={footer_bg}>
          <div className="container">
            <div className="glass1 animation animated fadeInDown">

              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Set Uzumaki Price</span>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="uzumakiPriceInput"/>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <button className=" animation animated fadeInDown green admin-set"  onClick={() => { setUzumakiPriceFunc() }}>set</button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Set Presale Extra</span>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="presaleExtraInput"/>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <button className=" animation animated fadeInDown green admin-set"  onClick={() => { setPresaleExtraFunc() }}>set</button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Set Uzumaki Token Address</span>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="uzumakiAddressInput"/>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <button className=" animation animated fadeInDown green admin-set"  onClick={() => { setTokenAddressFunc() }}>set</button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Set presale Days</span>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="icoDaysInput"/>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <button className=" animation animated fadeInDown green admin-set"  onClick={() => { setIcoDaysFunc() }}>set</button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Transfer Ownership Of Contract</span>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="transferOwnershipInput" placeholder="Address for Transfer"/>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <button className=" animation animated fadeInDown green admin-set"  onClick={() => { setTransferOwnershipFunc() }}>set</button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Withdraw All TPC of Contract</span>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="withdrawAddressInput" placeholder="Address to withdraw"/>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <button className=" animation animated fadeInDown green admin-set" onClick={() => { withdrawFunc() }}>set</button>
                  </div>
                </div>
              </div>

{/* 
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Sponor address</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text"/>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Sponor address</span>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" placeholder="write here"/>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>0</span>
                  </div>
                </div>
                <div className="col-lg-2 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <button className=" animation animated fadeInDown green admin-set">Buy</button>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 presale-button-container">
                  <button id="presale-button" className=" animation animated fadeInDown green">Buy</button>
                </div>
              </div>
               */}

               
            </div>
          </div>
        </section>

        <section className="" data-z-index="1" data-parallax="scroll" data-image-src={footer_bg}>
          <div className="container">
            <div className="row">
              <div className="col-lg-2 col-md-12 col-sm-12">
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="glass animation animated fadeInDown">
                  <div className="text-center">
                    <strong className="account-first-text">Uzumaki Token Contract</strong>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-12 col-sm-12">
              </div>
            </div>
          </div>
        </section>

        <section className="admin-second" data-z-index="1" data-parallax="scroll" data-image-src={footer_bg}>
          <div className="container">
            <div className="glass1 animation animated fadeInDown">
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Uzumaki Token Address</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span style={{wordWrap:'break-word'}}>{icoTokenAddress}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Owner Address</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span style={{wordWrap:'break-word'}}>{tokenOwnerAddress}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Total Supply</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>{tokenTotalSupply}</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Circulating Supply</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="admin-text glass2 animation animated fadeInDown">
                    <span>{circulatingSupply}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="admin-second" data-z-index="1" data-parallax="scroll" data-image-src={footer_bg}>
          <div className="container">
            <div className="glass1 animation animated fadeInDown">
              
              <div className="row two-input">
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Transfer Uzumaki</span>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="transferTokenAddressInput" placeholder="Address"/>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="transferTokenAmountInput" placeholder="Amount"/>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <button className="animation animated fadeInDown green admin-set" onClick={() => { transferTokenFunc() }}>Transfer</button>
                  </div>
                </div>
              </div>
              {/* <div className="row two-input">
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>Mint Uzumaki</span>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="mintReceiverAddressInput" placeholder="Address"/>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="mintAmountInput" placeholder="Amount"/>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <button className=" animation animated fadeInDown green admin-set" onClick={() => { mintFunc() }}>Mint</button>
                  </div>
                </div>
              </div> */}

              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-label animation animated fadeInDown">
                    <span>TransferOwnership Of Token</span>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <input type="text" id="transferOwnershipOfTokenInput" placeholder="Address"/>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="admin-input animation animated fadeInDown">
                    <button className=" animation animated fadeInDown green admin-set" onClick={() => { transferOwnershipOfTokenFunc() }}>set</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <div className="bottom_footer">
            <div className="container">
              <div className="row footer_img">
                <div className="col-lg-6 col-md-12 col-sm-12 footer-left">
                    <strong className="general-text">Connect with us : </strong>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 footer-right">
                    <a href="#">
                      <img src={twitter}/>
                    </a>
                    <a href="#">
                      <img src={discord}/>
                    </a>
                    <a href="#">
                      <img src={telegram}/>
                    </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
        <div style={{height: '30px'}}></div>

        <a href="#" className="scrollup green" style={{display: 'none'}}>
          ⇧
        </a>
      </div>
    </>
  );
}

export default AdminPage;
