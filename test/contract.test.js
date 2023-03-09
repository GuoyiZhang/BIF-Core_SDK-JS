'use strict'

const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
    host: 'http://test-bif-core.xinghuo.space'
})
const ContractInvokeOperation = require('../lib/operation/contractInvokeOperation')
/**
 * 检测合约账户的有效性
 */
it('test checkContractAddress', async () => {
    let param = {
        contractAddress: 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        domainId: '20'
    }
    let data = await sdk.contract.checkContractAddress(param)
    console.log('checkContractAddress() : ', JSON.stringify(data))
})

/**
 * 合约创建
 */
it('test createContract', async () => {
    let pay = "\"use strict\";\n" + "function init(input)\n" + "{\n" + "  /*init whatever you want*/\n" + "  return;\n" + "}\n" + "\n" + "function main(input)\n" + "{\n" + "  let para = JSON.parse(input);\n" + "  if (para.do_foo)\n" + "  {\n" + "    let x = {\n" + "      'hello' : 'world'\n" + "    };\n" + "  }\n" + "}\n" + "\n" + "function query(input)\n" + "{ \n" + "  return input;\n" + "}"
    let createContractOperation = {
        sourceAddress: 'did:bid:efHzcjj3w1eg9B4aoaem5axrBLS8y8JF',
        privateKey: 'priSPKk7LBEPdwYARirLfAheRbYTTmKAJJWUpKQgTRMG7cWMay',
        payload: pay,
        initBalance: '1',
        remarks: 'create account',
        type: 0,
        feeLimit: '100208801',
        gasPrice: '',
        ceilLedgerSeq: '',
        initInput: '',
        domainId: '20'
    }
    let data = await sdk.contract.createContract(createContractOperation)
    console.log('createContract() : ', JSON.stringify(data))
})

/**
 * 根据交易Hash查询合约地址
 */
it('test getContractAddress', async () => {
    let param = {
        hash: '9808eb68bb2c84867c32cfb23d0c25c325b4f2e6058723ef72a239aafb34f60f',
        domainId: '0'
    }
    let data = await sdk.contract.getContractAddress(param)
    console.log('getContractAddress() : ', JSON.stringify(data))
})

/**
 * 查询合约代码。
 */
it('test getContractInfo', async () => {
    let param = {
        contractAddress: 'did:bid:efdzmPKbie68djWpAdyAP8uLY1WtVoXP',
        // contractAddress: 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB',
        domainId: '20'
    }
    let data = await sdk.contract.getContractInfo(param)
    console.log('getContractInfo() : ', JSON.stringify(data))
})

/**
 * 调用合约查询接口。
 */
it('test contractQuery', async () => {
    let contractQueryOperation = {
        sourceAddress: '',
        contractAddress: 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        input: '',
        feeLimit: '',
        gasPrice: '',
        domainId: '20'
    }
    let data = await sdk.contract.contractQuery(contractQueryOperation)
    console.log('contractQuery() : ', JSON.stringify(data))
})

/**
 * 调用合约查询接口。
 */
it('test contractInvoke', async () => {
    let contractInvokeOperation = {
        sourceAddress: 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB',
        privateKey: 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK',
        contractAddress: 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        ceilLedgerSeq: '',
        feeLimit: '',
        gasPrice: '',
        remarks: 'contractInvoke',
        amount: '1',
        input: '',
        domainId: '20'
    }
    let data = await sdk.contract.contractInvoke(contractInvokeOperation)
    console.log('contractInvoke() : ', JSON.stringify(data))
})

/**
 * 用于批量合约调用。
 */
it('test batchContractInvoke', async () => {
    let senderAddress = 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB'
    let senderPrivateKey = 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK'
    let contractAddress = 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu'

    let amount = '0'
    const KeyPairEntity = sdk.keypair.getBidAndKeyPair()
    const destAddress1 = KeyPairEntity.encAddress
    const destAddress2 = KeyPairEntity.encAddress
    let input1 = '{"method":"creation","params":{"document":{"@context": ["https://w3.org/ns/did/v1"],"context": "https://w3id.org/did/v1","id": "' + destAddress1 + '", "version": "1"}}}'
    let input2 = '{"method":"creation","params":{"document":{"@context": ["https://w3.org/ns/did/v1"],"context": "https://w3id.org/did/v1","id": "' + destAddress2 + '", "version": "1"}}}'

    let contractInvokeOperation1 = new ContractInvokeOperation()
    contractInvokeOperation1.setContractAddress(contractAddress)
    contractInvokeOperation1.setAmount(amount)
    contractInvokeOperation1.setInput(input1)
    let contractInvokeOperation2 = new ContractInvokeOperation()
    contractInvokeOperation2.setContractAddress(contractAddress)
    contractInvokeOperation2.setAmount(amount)
    contractInvokeOperation2.setInput(input2)

    let operations = []
    operations.push(contractInvokeOperation1)
    operations.push(contractInvokeOperation2)

    let contractInvokeRequestOperation = sdk.operaction.contractInvokeRequestOperation
    contractInvokeRequestOperation.setSenderAddress(senderAddress)
    contractInvokeRequestOperation.setPrivateKey(senderPrivateKey)
    contractInvokeRequestOperation.setRemarks('contract invoke')
    contractInvokeRequestOperation.setDomainId('0')
    contractInvokeRequestOperation.setCeilLedgerSeq('')
    contractInvokeRequestOperation.setOperations(operations)
    let data = await sdk.contract.batchContractInvoke(contractInvokeRequestOperation)
    console.log('batchContractInvoke() : ', JSON.stringify(data))
})
