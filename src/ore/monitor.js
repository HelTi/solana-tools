
const solanaWeb3 = require('@solana/web3.js');
const dotenv = require('dotenv');
const { sendMail } = require('./send-email');
const { solanaAddresses } = require('../../address');

// 加载.env文件中的配置（如果存在）
dotenv.config();

const RpcUrl = process.env.RPC_URL
// 初始化Solana连接

const connection = new solanaWeb3.Connection(RpcUrl, 'confirmed');

// 要监控的Solana地址，在 address.js文件中配置
const addressToCheckArr = solanaAddresses

// 检查单个地址逻辑
async function checkSingleAddressTransaction(addressToCheck=''){
  const currentTime = new Date().getTime() / 1000; // 当前时间（秒）
  const twoMinutesAgo = currentTime - 120; // 两分钟前的时间（秒）

  try {
    // 获取该地址的交易签名列表
    const confirmedSignatures = await connection.getSignaturesForAddress(
      new solanaWeb3.PublicKey(addressToCheck),
      { limit: 1 }
    );

    // 过滤出在两分钟内的交易
    const recentTransactions = confirmedSignatures.filter(signatureInfo => {
      return signatureInfo.blockTime >= twoMinutesAgo;
    });

    // 打印最近的一条交易记录信息
    if (confirmedSignatures.length > 0) {
      const latestTransaction = confirmedSignatures[0];
      console.log(`Solana地址：${addressToCheck} 最近的一条交易信息:\n签名: ${latestTransaction.signature}\n区块时间: ${new Date(latestTransaction.blockTime * 1000).toLocaleString()}`);
    }


    // 判断是否有交易
    if (recentTransactions.length === 0) {
      const errMasg=`警告: Solana地址:${addressToCheck} 最近两分钟内没有交易记录!`
      console.warn(errMasg);
      sendMail(errMasg)
    } else {
      console.log(`Solana地址：${addressToCheck} 最近两分钟内有交易记录:`, recentTransactions.length);
    }
  } catch (error) {
    console.error(`获取Solana地址：${addressToCheck} 交易记录时出错:`, error);
  }
}

function checkTransactions() {
  addressToCheckArr.forEach(address=>{
    console.log('开始监控地址:', address);
    sendMail('开始监控地址:'+ address, 'ore 监控提醒')
    checkSingleAddressTransaction(address)
    // 多久检查一次
    setInterval(()=>checkSingleAddressTransaction(address), 2 * 60 * 1000);
  })
}

checkTransactions()
