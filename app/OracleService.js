const Web3 = require('web3');
const tx = require('ethereumjs-tx').Transaction;
const fetch = require('node-fetch');

const contractJson = require('../build/contracts/Oracle.json');

const web3 = new Web3('ws://127.0.0.1:7545')

const addressContract = ''
const contractInstance = new web3.eth.Contract(contractJson.abi, addressContract)
const privateKey = Buffer.from('0x1fd2073b0f15472307f516fed5a71e60e3c9b5895cf37affd8fc59eae7b41fd1', 'hex');
const address =  '0x1376aCb8FAcd630e8b55A568124dDb9A9E626d2E'

//Obtain block number
web3.eth.getBlockNumber().then(n => listenEvent(n-1))

function listenEvent(lastBlock) {
    contractInstance.events.__callbackNewData({},{fromBlock: lastBlock, toBlock: 'latest'}, (err, event => {

        event? updateData: null
        err ? console.log(err): null

    }))
}

function updateData() {
    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY'

    fetch(url)
    .then(response => response.json)
    .then(json => setDataContract(json.element_count))

}

function setDataContract(_value) {
    web3.eth.getTransactionCount(address, (err, txNum) => {
          contractInstance.methods.setNumberAsteroids(_value)
            .estimateGas({},(err, gasAmount)=>{
                let rawTx = {
                    nonce: web3.utils.toHex(txNum),
                    gasPrice : web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')),
                    gasLimit: web3.utils.toHex(gasAmount),
                    to: addressContract,
                    value: '0x00',
                    data: contractInstance.methods.setNumberAsteroids(_value).encodeABI()
                }
                const tx = new Tx(rawTx)
                tx.sign(privateKey)
                const serializedTx = tx.serialize().toString('hex')
                web3.eth.sendSignedTransaction('0x'+ serializedTx)
          })
    })
}
