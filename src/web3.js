import Web3 from "web3";
// this is where we insert our web3 into the browser's web3 provider.
const web3 = new Web3(window.web3.currentProvider);

export default web3;
