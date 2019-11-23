export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
export const GREEN = "success";
export const RED = "danger";
export const DECIMALS = (10**18);

//calculate without importing web3
export const tokens = (wei) => {
    if(wei) {
        return (wei / DECIMALS);
    }
}

export const ether = tokens;

export const formatBalance = (balance) => {
    const precision = 100; //2 dm
    balance = ether(balance);
    balance = Math.round(balance * precision) / precision;
    return balance;
}