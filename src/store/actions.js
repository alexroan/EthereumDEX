export function web3Loaded(connection){
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export function web3AccountLoaded(account){
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
    }
}

export function tokenLoaded(token){
    return {
        type: 'TOKEN_LOADED',
        token
    }
}

export function exchangeLoaded(exchange){
    return {
        type: 'EXCHANGE_LOADED',
        exchange
    }
}