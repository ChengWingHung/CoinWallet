
let ethers = require('ethers');

let checkAddress = (address) => {
    try {
        let addressNew = ethers.utils.getAddress(address);
        return addressNew
    } catch (error) {
        return ""
    }
};

let WalletUtil = {
    checkAddress
};

module.exports = WalletUtil;