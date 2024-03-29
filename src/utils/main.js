import {BehaviorSubject} from "rxjs";
import Web3 from 'web3';
import NFTManager from './nft_manager';
import OpenSeaBid from "./opensea_bid";
import OpenSeaSniper from "./opensea_sniper";
import io from "socket.io-client";
import Task from "./task";
import {fixAddress, getEthPrice, getGasPrices, getUpcomingMints} from "./utils";
import OpenSeaListing from "./opensea_listing";
import OpenSeaProject from "./opensea_project";

class Main {

    constructor() {
        this.globalWeb3 = null;
        this.nftManager = new NFTManager();

        this.walletsStream = new BehaviorSubject([]);
        this.ethTasksStream = new BehaviorSubject([]);
        this.openseaBidderStream = new BehaviorSubject([]);
        this.openseaSniperStream = new BehaviorSubject([]);
        this.openSeaTransferStream = new BehaviorSubject([]);
        this.quickTaskProfileStream = new BehaviorSubject([]);
        this.openseaListingsStream = new BehaviorSubject([]);
        this.openseaLiveListingStream = new BehaviorSubject([]);
        this.openseaProjectStatus = new BehaviorSubject(null);

        this.webhook = localStorage.getItem('discordWebHook') === null ? '' : localStorage.getItem('discordWebHook');

        this.abi = [];
        this.wallets = [];
        this.ethTasks = [];
        this.openseaBidders = [];
        this.openseaSnipers = [];
        this.openseaTransferData = [];
        this.quickTaskProfiles = [];
        this.openseaListings = [];
        this.openseaProjectFetcher = new OpenSeaProject();

        // live data coming from websocket
        this.openseaListingData = [];
        this.openseaListingFilter = "";

        this.ethDataStream = new BehaviorSubject({
            ethPrice: '--',
            maxFee: '--',
            priorityFee: '--',
            pendingBlock: '--'
        });

        this.ethData = {
            ethPrice: '--',
            maxFee: '--',
            priorityFee: '--',
            pendingBlock: '--'
        }

        this.upcomingMints = [];

        this.mintaioSocket = null;

        this.walletsStream.subscribe((data) => {
            this.wallets = data;
        });

        this.ethTasksStream.subscribe((data) => {
            this.ethTasks = data;
        });

        this.openseaBidderStream.subscribe((data) => {
            this.openseaBidders = data;
        });

        this.openseaSniperStream.subscribe((data) => {
            this.openseaSnipers = data;
        });

        this.openSeaTransferStream.subscribe((data) => {
            this.nftWatchList = data;
        });

        this.quickTaskProfileStream.subscribe((data) => {
            this.quickTaskProfiles = data;
        });

        if(localStorage.getItem("abi-list") !== null) {
            this.abi = JSON.parse(localStorage.getItem("abi-list"));
        } else {
            localStorage.setItem("abi-list", JSON.stringify(this.abi));
        }

        if(localStorage.getItem("globalRpc") !== null) {
            const rpc = localStorage.getItem("globalRpc");

            try {
                this.globalWeb3 = new Web3(rpc);
            } catch(e) {
                console.log(e);
            }

        } else {
            localStorage.setItem("globalRpc", "");
        }

        if(localStorage.getItem("etherscan-api") === null) {
            localStorage.setItem("etherscan-api", "");
        }

        this.disperseABI = [{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"recipients","type":"address[]"},{"name":"values","type":"uint256[]"}],"name":"disperseTokenSimple","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"recipients","type":"address[]"},{"name":"values","type":"uint256[]"}],"name":"disperseToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recipients","type":"address[]"},{"name":"values","type":"uint256[]"}],"name":"disperseEther","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}];

        this.sidebarData();

        this.ethDataInterval = setInterval(() => {
            this.sidebarData();
        }, 1000 * 15);

        this.connectToMintAIOSocket();
        this.connectOpenSeaListing();

        console.log("Main state initiated, MintAIO - v0.1-beta");
    }

    async getUpcomingMintingData() {

        if(this.upcomingMints.length === 0) {
            const mintingData = await (await getUpcomingMints()).json();
            this.upcomingMints = mintingData.data;
        }

        return this.upcomingMints;
    }

    async sidebarData() {

        try {
            const ethPrice = await (await getEthPrice()).json();
            const gasPrices = await (await getGasPrices()).json();

            this.ethData.ethPrice = ethPrice['USD'];
            this.ethData.baseFee = gasPrices['baseFeePerGas'].toString().split(".")[0];
            this.ethData.priorityFee = gasPrices['maxPrice'];
            this.ethData.pendingBlock = gasPrices['pendingBlockNumberValue'];

            this.ethDataStream.next(this.ethData);
        } catch(e) {
            console.log("Error:", e);

            this.ethData.ethPrice = '--';
            this.ethData.maxFee = '--';
            this.ethData.priorityFee = '--';
            this.ethData.pendingBlock = '--';

            this.ethDataStream.next(this.ethData);
        }



    }

    /**
     * Create a new opensea listing. There can only be 1 per wallet.
     * @param wallet
     * @returns {*}
     */

    createOpenSeaListing(wallet) {

        if(wallet.isLocked()) {
            return null;
        }

        for(const listing of this.openseaListings) {
            if(fixAddress(listing.wallet.account.address) === fixAddress(wallet.account.address)) {
                return listing;
            }
        }

        const listing = new OpenSeaListing({wallet});

        this.openseaListings.push(listing);
        this.openseaListingsStream.next(this.openseaListings);

        return listing;
    }

    getOpenSeaListing(wallet) {
        for(const listing of this.openseaListings) {
            if(fixAddress(listing.wallet.account.address) === fixAddress(wallet.account.address)) {
                return listing;
            }
        }

        return null;
    }

    addLog(str) {
        //this.logs.push(`[${new Date().toLocaleString()}][LOG]` + str);
    }

    connectToMintAIOSocket() {
        try {
            //this.mintaioSocket = io.connect('https://mintaio-auth.herokuapp.com/');
        } catch(e) {
            console.log('e', e);
        }

    }

    connectOpenSeaTransfer() {
        /*if(this.mintWatchActive()) {
            return 'LIVE';
        }*/

        // https://mintaio-auth.herokuapp.com/
        // http://localhost:3001/

        if(this.mintaioSocket === null) return;

        try {

            this.mintaioSocket.on('opensea-transferred', (data) => {
                this.openseaTransferData.unshift(data);

                if(this.openseaTransferData.length > 200) {
                    this.openseaTransferData = this.openseaTransferData.slice(0, 199);
                }

                this.openSeaTransferStream.next(this.openseaTransferData);
            });

            return 'LIVE';

        } catch(e) {
            return 'OFFLINE'
        }
    }

    connectOpenSeaListing() {
        /*if(this.mintWatchActive()) {
            return 'LIVE';
        }*/

        // https://mintaio-auth.herokuapp.com/
        // http://localhost:3001/

        if(this.mintaioSocket === null) return;

        try {

            this.mintaioSocket.on('opensea-listing', (data) => {

                if(data.payload.collection.slug === this.openseaListingFilter) {

                    this.openseaListingData.unshift(data);

                    if(this.openseaListingData.length > 200) {
                        this.openseaListingData = this.openseaListingData.slice(0, 199);
                    }

                    this.openseaLiveListingStream.next(this.openseaListingData);
                }
            });

            return 'LIVE';

        } catch(e) {
            return 'OFFLINE'
        }
    }

    disconnectMintWatch() {
        if(!this.mintWatchActive()) {
            return;
        }

        this.mintaioSocket.disconnect();
        this.mintaioSocket = null;
    }

    mintWatchActive() {
        return this.mintaioSocket !== null;
    }

    async getContractAbi(contract, network) {

        let output = this.abi.find(a => a.contractAddress === contract);

        if(typeof output !== 'undefined' && output.abi === 'Contract source code not verified') {
            this.abi = this.abi.filter(a => a.contractAddress !== contract);
            output = undefined;
        }

        if(typeof output === 'undefined') {
            let abi = await this.fetchContractAbi(contract, network);

            if(abi === null) {
                return null;
            }

            this.abi.push({
                contractAddress: contract,
                abi: abi
            })

            // prevent setting of invalid abi.
            localStorage.setItem('abi-list', JSON.stringify(this.abi));

            return abi;
        }

        return output.abi;
    }

    async fetchContractAbi(contract, network) {
        let data = await fetch(`https://api${network === 'mainnet' ? '' : `-${network}`}.etherscan.io/api?module=contract&action=getabi&address=${contract}&apikey=${localStorage.getItem('etherscan-api')}`);
        if(data.status === 200) {
            let abi = await data.json();
            return abi.result;
        }

        return null;
    }

    getContractMethods(abi) {

        let methods = null;
        const valid_json = this.validJson(abi);

        if(methods === null && !valid_json) {
            console.log("no methods found and the abi was invalid");
            return null;
        } else if(methods === null && valid_json) {
            methods = JSON.parse(abi);
        }

        let payable_methods = [];
        let view_methods = [];

        for(const m of methods) {
            if((m.stateMutability === 'payable' && m.type === 'function') || (m.stateMutability === 'nonpayable' && m.type === 'function')) {
                payable_methods.push(m);
            } else if(m.stateMutability === 'view') {
                view_methods.push(m);
            }
        }

        return {mintMethods: payable_methods, readMethods: view_methods};
    }

    validJson(json) {
        try {
            JSON.parse(json);
        } catch {
            return false;
        }

        return true;
    }

    unlockWallet(address, password) {
        const _wallet = this.wallets.find(w => w.account.address === address);

        // if wallet doesn't exist, just remove it.
        if(typeof _wallet === 'undefined') {
            const _wallets = this.wallets.filter(w => w.account.address !== address)
            this.walletsStream.next(_wallets);
            return false;
        }

        const unlocked = _wallet.unlock(this.globalWeb3, password);

        if(unlocked) {
            for(const t of this.ethTasks) {
                if(t.wallet === _wallet.account.address) {
                    t.privateKey = _wallet.account.privateKey;
                }
            }
        }

        this.walletsStream.next(this.wallets);
        this.ethTasksStream.next(this.ethTasks);

        return unlocked;
    }

    deleteEthTask(id) {
        const _task = this.ethTasks.find(t => t.id === id);

        if(typeof _task === 'undefined') {
            console.log(`Could not find task with id ${id}`);
            return;
        }

        _task.delete(this);

        const _tasks = this.ethTasks.filter(t => t.id !== id);

        this.ethTasks = _tasks;
        this.ethTasksStream.next(_tasks);
    }

    deleteOpenSeaSniperTask(id) {
        const _task = this.openseaSnipers.find(t => t.id === id);

        if(typeof _task === 'undefined') {
            console.log(`Could not find sniper with id ${id}`);
            return;
        }

        _task.delete(this);

        const _tasks = this.openseaSnipers.filter(t => t.id !== id);

        this.openseaSnipers = _tasks;
        this.openseaSniperStream.next(_tasks);
    }

    postTaskUpdate() {
        // we have to create a clone because rxjs doesn't detect a change when we just assign this.ethTasks as the next value.
        const clone = [...this.ethTasks];
        this.ethTasksStream.next(clone);
    }

    postOpenSeaSniperUpdate() {
        // we have to create a clone because rxjs doesn't detect a change when we just assign this.ethTasks as the next value.
        const clone = [...this.openseaSnipers];
        this.openseaSniperStream.next(clone);
    }

    postOpenSeaListingUpdate() {
        // we have to create a clone because rxjs doesn't detect a change when we just assign this.ethTasks as the next value.
        const clone = [...this.openseaListings];
        this.openseaListingsStream.next(clone);
    }

    refreshAllBalance() {
        for(const w of this.wallets) {
            w.getBalance(this);
        }
    }

    async disperseFunds(mainWallet, totalValue, recipients, values) {

        const account = this.globalWeb3.eth.accounts.privateKeyToAccount(mainWallet.account.privateKey);
        const contract = new this.globalWeb3.eth.Contract(this.disperseABI, '0xD152f549545093347A162Dce210e7293f1452150');
        const nonce = await this.globalWeb3.eth.getTransactionCount(account.address, 'latest');
        const value = `${this.globalWeb3.utils.toWei(`${totalValue}`, 'ether')}`;

        const gasLimit = await contract.methods['disperseEther'](recipients, values).estimateGas(
            {
                from: account.address,
                value: value
            });

        const data = contract.methods['disperseEther'](recipients, values).encodeABI();

        const tx = {
            from: account.address,
            to: '0xD152f549545093347A162Dce210e7293f1452150',
            value: value,
            nonce: nonce,
            maxFeePerGas: `${this.globalWeb3.utils.toWei('100', 'gwei')}`,
            maxPriorityFeePerGas: `${this.globalWeb3.utils.toWei(`1.5`,  'gwei')}`,
            gasLimit: Number.parseInt(gasLimit),
            data: data
        };

        const sign = await this.globalWeb3.eth.accounts.signTransaction(tx, account.privateKey);

        return this.globalWeb3.eth.sendSignedTransaction(sign.rawTransaction);
    }

    mintSuccessMessage(contract_address, tx_hash, price, max_gas, priority_fee, webhook) {

        if(webhook.length === 0) {
            console.log("Webhook not set");
            return;
        }

        try {
            const message = {
                "embeds": [
                    {
                        "title": "Successfully Minted!",
                        "description": `Project: [View on etherscan](https://etherscan.io/address/${contract_address})  Transaction: [View on etherscan](https://etherscan.io/tx/${tx_hash})\n\n**Price**: ${price} ETH\n**Max Gas:** ${max_gas} | **Priority Fee:** ${priority_fee}`,
                        "color": 3135616,
                        "author": {
                            "name": "MintAIO",
                            "url": "https://twitter.com/MintAIO_"
                        }
                    }
                ]
            }

            fetch(webhook, {
                method: 'POST',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch {

        }
    }

    mintErrorMessage(contract_address, sender, price, amount, max_gas, priority_fee, status, error, webhook) {

        if(webhook.length === 0) {
            console.log("Webhook not set");
            return;
        }

        try {
            const message = {
                "embeds": [
                    {
                        "title": "MintAIO",
                        "description": `**Status:** ${status} | **Mode:** Automatic\n**Project**: [View on etherscan](https://etherscan.io/address/${contract_address}) | **Sender:** [View on etherscan](https://etherscan.io/address/${sender})\n\n**Price:** ${price} ETH | **Quantity:** ${amount} | **Max Gas:** ${max_gas} | **Priority Fee:** ${priority_fee}\n\n**Error:** ${error}`,
                        "color": 13963794
                    }
                ]
            }

            fetch(webhook, {
                method: 'POST',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        } catch {

        }
    }

    snipeSuccessMessage(slug, tx_hash, price, webhook) {

        if(webhook.length === 0) {
            console.log("Webhook not set");
            return;
        }

        try {
            const message = {
                "embeds": [
                    {
                        "title": "Successfully Sniped!",
                        "description": `Project: [View on OpenSea](https://opensea.io/collection/${slug}) Transaction: [View on etherscan](https://etherscan.io/tx/${tx_hash})\n\n**Price**: ${price} ETH`,
                        "color": 3135616,
                        "author": {
                            "name": "MintAIO",
                            "url": "https://twitter.com/MintAIO_"
                        }
                    }
                ]
            }

            fetch(webhook, {
                method: 'POST',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch {

        }
    }

    snipeErrorMessage(slug, price, error, webhook) {

        if(webhook.length === 0) {
            console.log("Webhook not set");
            return;
        }

        try {
            const message = {
                "embeds": [
                    {
                        "title": "MintAIO",
                        "description": `**Project:** ${slug} [View on OpenSea](https://opensea.io/collection/${slug})\n\n**Price:** ${price} ETH\n\n**Error:** ${error}`,
                        "color": 13963794
                    }
                ]
            }

            fetch(webhook, {
                method: 'POST',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        } catch {

        }
    }

    snipeDebugMessage(slug, price, order, webhook) {

        if(webhook.length === 0) {
            console.log("Webhook not set");
            return;
        }

        try {
            const message = {
                "embeds": [
                    {
                        "title": "MintAIO - Debug",
                        "description": `**Project**: ${slug} [View on OpenSea](https://opensea.io/collection/${slug})\n**Price**: ${price} ETH\n\n**Order**: ${JSON.stringify(order)}`,
                        "color": 15773241
                    }
                ],
            }

            fetch(webhook, {
                method: 'POST',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        } catch {

        }
    }

    testWebHook() {
        fetch(this.webhook, {
            method: 'POST',
            body: JSON.stringify({
                "content": "This is a test from MintAIO! Your Discord webhook is working :)",
                "embeds": null,
                "attachments": []
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    getProfiles() {
        return this.quickTaskProfiles;
    }

    createQuickTask(data, p) {

        const profile = this.quickTaskProfiles.find(_p => _p.name === p.name);

        if(typeof profile === 'undefined') {
            console.log("Could not find profile");
            return;
        }

        for(const w of p.wallets) {
            const wallet = this.wallets.find(_w => fixAddress(w) === fixAddress(_w.account.address));

            if(typeof wallet === 'undefined') {
                console.log("Could not find wallet", fixAddress(w));
                continue;
            }

            const provider = this.globalWeb3.currentProvider.host;
            let network = 'mainnet';

            if(provider.length === 0) {
                console.log("Provider was not set for QT");
                return;
            }

            if(provider.toLowerCase().includes('rinkeby')) {
                network = 'rinkeby';

            } else if(provider.toLowerCase().includes('ropsten')) {
                network = 'ropsten';

            } else if(provider.toLowerCase().includes('goerli')) {
                network = 'goerli';
            }

            const task = new Task(provider, data.contractAddress, wallet, data.price, 1, Number.parseFloat(data.maxGas).toFixed(0), Number.parseFloat(data.priorityFee).toFixed(0), Number.parseFloat(`${Number.parseInt(data.gasLimit) * 1.1}`).toFixed(0), null, [], "");

            task.customHexData = data.hexData;
            task.network = network;

            task.save();
            this.ethTasks.push(task);
            this.postTaskUpdate();
        }

    }

    createQuickTaskAll(data, profiles) {
        for(const p of profiles) {
            this.createQuickTask(data, p);
        }
    }

    createOpenSeaSniper(options) {

        const sniper = new OpenSeaSniper(options);

        sniper.save();

        this.openseaSnipers.push(sniper);
        this.openseaSniperStream.next(this.openseaSnipers);

        console.log("Created sniper");
    }

    startOpenSeaSniper(id) {
        const sniper = this.openseaSnipers.find(t => t.id === id);

        if(typeof sniper === 'undefined') {
            return false;
        }

        sniper.fetchAssetListings(this);
    }

    stopOpenSeaSniper(id) {
        const sniper = this.openseaSnipers.find(t => t.id === id);

        if(typeof sniper === 'undefined') {
            return false;
        }

        sniper.stopFetchingAssets(this);
    }

    startBidding() {
        const wallet = this.wallets.find(w => w.name === 'Mainnet');
        const openseaBidder = new OpenSeaBid(this, wallet);
        openseaBidder.start();
    }

    fetchProject(slug) {
        if(this.openseaProjectFetcher.isRunning()) {
            console.log("Already running");
            return;
        }

        this.openseaProjectFetcher.startFetchingAssets(this, slug);
    }

    stopFetchingProject() {
        if(!this.openseaProjectFetcher.isRunning()) {
            console.log("Not running");
            return;
        }

        this.openseaProjectFetcher.stopFetchingAssets(this);
    }
}

export default Main;