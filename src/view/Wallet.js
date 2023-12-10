
import { useState, useEffect } from 'react';
import WaveEffect from '../component/WaveEffect';
import TokenTransfer from '../component/TokenTransfer';
import Collection from '../component/Collection';
import { Spin, Button, Row, Col, message } from 'antd';
import { SwapOutlined, VerticalAlignBottomOutlined, LogoutOutlined } from '@ant-design/icons';

// 引入axios库进行HTTP请求
import axios from 'axios';

const { ethers } = require("ethers");

function Wallet(props){

    const [walletState, setWalletState] = useState({
        coin_wallet:null,
        walletAddress:'',
        ethCountValue:0,
        walletBalanceValue:999999999.99,
        viewState:'list',
        loading: false,
        tokenNameColor:[
            "#ffbd0b",
            "#ffd60b",
            "#00DDAA",
            "#BBFF66",
            "#AAFFEE",
            "#FFDDAA",
            "#FF7744 ",
            "#FFCC22",
            "#FFC8B4",
            "#0088A8"
        ],
        showTokenList:[
            /*{
                "token_name":"eth",
                "token_num":"929929.0982",
                "token_amount":"28228.98"
            },
            {
                "token_name":"btc",
                "token_num":"7379.8768",
                "token_amount":"99999999.32"
            },{
                "token_name":"bnb",
                "token_num":"500",
                "token_amount":"28228.98"
            },{
                "token_name":"mx",
                "token_num":"10000",
                "token_amount":"8782828.32"
            },{
                "token_name":"chn",
                "token_num":"9000000",
                "token_amount":"9000000.00"
            },{
                "token_name":"ftm",
                "token_num":"9888",
                "token_amount":"9019.00"
            },{
                "token_name":"fil",
                "token_num":"76",
                "token_amount":"82123.00"
            },{
                "token_name":"iota",
                "token_num":"100000",
                "token_amount":"3500023.00"
            },{
                "token_name":"link",
                "token_num":"889",
                "token_amount":"1929293.00"
            }*/
        ]
    });

    // 节点地址获取：https://chainlist.org/
    // 点击主网，右下角列表复制地址
    let network = "https://rpc.flashbots.net";
    let provider;
    let ethCurrentPrice;

    useEffect(()=>{

        console.log("登录信息内容", props);
        provider = new ethers.providers.JsonRpcProvider(network);

        getEthWalletAddress();
    },[]);    

    const getEthWalletAddress = () => {

        if (!props || !props.coinWallet || !props.coinWallet.private_key) return;

        let coin_wallet = new ethers.Wallet(props.coinWallet.private_key, provider);

        let walletAddress = coin_wallet.signingKey.address;
        
        walletAddress = walletAddress.toLowerCase();

        console.log("得到的地址信息", walletAddress);
        getWalletBalanceByAddress(coin_wallet, walletAddress);
    }

    const getWalletBalanceByAddress = async (coin_wallet, walletAddress) => {

        let ethCountValue = await coin_wallet.getBalance('latest');

        ethCountValue = ethers.utils.formatEther(ethCountValue);
        ethCountValue = ethCountValue/1000000000000000000;// 1 ETH = 18 wei;
        ethCurrentPrice = await getEthCurrentUsdtPrice();// 当前的实时价格$2300

        console.log("得到的eth数量", ethCountValue);

        let showTokenList = [];
        let walletBalanceValue = ethCountValue*ethCurrentPrice;

        let ethToken = {
            "token_name":"eth",
            "token_num":ethCountValue > 0.0001?ethCountValue:0,
            "token_amount":walletBalanceValue < 0.01?'0.00':walletBalanceValue
        };

        showTokenList.push(ethToken);

        setWalletState({...walletState, coin_wallet, walletAddress, showTokenList, ethCountValue, walletBalanceValue});
        // setWalletState({...walletState, coin_wallet, walletAddress, ethCountValue, walletBalanceValue});
    }

    const getEthCurrentUsdtPrice = async () => {

        let ethUsdPrice = 2300;

        setWalletState({...walletState, loading:true});

        try {
            // 发送GET请求到CoinMarketCap API
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', {
                timeout:30000 // 设置超时时间
            });
            
            // 从返回结果中提取ETH的USD价格
            ethUsdPrice = response.data['ethereum'].usd;
            
            console.log(`ETH的当前价格为 ${ethUsdPrice} USD`);
            setWalletState({...walletState, loading:false});

            return ethUsdPrice;
        } catch (error) {

            console.error("获取eth价格异常", error);
            setWalletState({...walletState, loading:false});

            return ethUsdPrice;
        }
    }

    const processBalanceFormat = (walletBalanceValue) => {

        let resultBalanceValue;
        // 只展示金额后两位
        if (walletBalanceValue < 0.01) {
            resultBalanceValue = '0.00';
        } else {

            if (walletBalanceValue.toString().indexOf('.') < 0) walletBalanceValue += '.00';

            // 处理千分位分割
            let tempText = walletBalanceValue.toString().substring(0, walletBalanceValue.toString().indexOf('.'));

            if (tempText.length > 3) {

                let addDotCount = 0;
    
                for (let i=tempText.length - 1;i>0;i--) {
    
                    if ((tempText.substring(i, tempText.length).length - addDotCount)%3 === 0) {
                        tempText = tempText.substring(0, i) + ',' + tempText.substring(i, tempText.length);
                        addDotCount++;
                    }
                }

                resultBalanceValue = tempText + walletBalanceValue.toString().substring(walletBalanceValue.toString().indexOf('.'), walletBalanceValue.length);
            } else {

                resultBalanceValue = walletBalanceValue;
            }
        }

        return '$' + resultBalanceValue;
    }

    const logout = () => {

        props.logout();
    }

    const transferTokenHandler = () => {

        setWalletState({...walletState, viewState:'transfer'});
    }

    const transferTokenAmountHandler = async (toAddress, amount) => {

        console.log("转到的地址: ", toAddress);
        console.log("账户余额", walletState.walletBalanceValue, "转出金额: ", amount);

        // 输入数量是否大于账户余额数
        if (amount > walletState.ethCountValue) {
            message.warning('转账数量已超出账户余额!');
            return;
        }

        //转账逻辑
        let walletActive = walletState.coin_wallet; //得到激活的钱包

        //这个转换动作必须做，否则不满足转账数据类型, 会出错
        let transferAmount = ethers.utils.parseEther(amount);
        console.log("转账金额处理后: ", transferAmount);

        try {
            let res = await walletActive.sendTransaction({
                to: toAddress,
                value: transferAmount
            });
            console.log("转账返回结果详细信息 :", res);
            message.success('转账成功!');
            getWalletBalanceByAddress(walletState.coin_wallet, walletState.walletAddress);
        } catch (error) {
            message.error('转账失败!');
            console.log(error);
        }
    }

    const tokenCollectionHandler = () => {

        setWalletState({...walletState, viewState:'collection'});
    }

    const backToListView = () => {

        setWalletState({...walletState, viewState:'list'});
    }

    let tokenIndex = 1;
    let propertyDetailList = [];
    let showBalanceValue = processBalanceFormat(walletState.walletBalanceValue);// '67,5421,992.23'

    if (walletState.viewState === 'list') {

        // 显示币种信息
        for (let showTokenData of walletState.showTokenList) {

            // 币种信息
            propertyDetailList.push(
                <Row key={"token_detail_"+tokenIndex} style={{backgroundColor:`${tokenIndex%2 === 0?'rgb(250, 250, 250)':'white'}`}}>
                    <Col span={12}>
                        <div className='wallet_token_name' style={{backgroundColor:`${walletState.tokenNameColor[Math.floor(Math.random()*10)]}`}}>
                            <span style={{fontWeight:'bold'}}>
                                {showTokenData['token_name'].toUpperCase()}
                            </span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <Row style={{textAlign:'right'}}>
                            <Col className='total'>
                                {showTokenData['token_num']}
                            </Col>
                        </Row>
                        <Row>
                            <Col className='amout'>
                                {showTokenData['token_amount']}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
    
            tokenIndex++;
        }

        // 增加展示信息
        if (walletState.walletBalanceValue < 0.01) {

            propertyDetailList.push(<span></span>);// 提示用户将会好运连连，马上暴富
        } else if (walletState.walletBalanceValue < 1000000.00) {

            propertyDetailList.push(<span></span>);// 提示用户即将更加富裕
        } else {

            propertyDetailList.push(<span></span>);// 啥也别说了
        }

    } else if (walletState.viewState === 'collection') {

        // 显示收款码
        propertyDetailList.push(
            <Collection key={"collectionview_"+tokenIndex} walletAddress={walletState.walletAddress}/>
        );
    } else {

        // 转账界面
        propertyDetailList.push(
            <TokenTransfer key={"transferview_"+tokenIndex} walletAddress={walletState.walletAddress}
            transferTokenHandler={transferTokenAmountHandler}
            ethCountValue={walletState.ethCountValue}/>
        );
    }

    return (
        <Spin spinning={walletState.loading} tip="Loading...">
            <div className='wallet_container'>
                <div className='wallet_content'>
                    <div className='wallet_content_header'>
                        <div className='wallet_logout'>
                            <LogoutOutlined onClick={logout}/>
                        </div>
                        <div style={{fontSize:`${30 - Math.floor(showBalanceValue.length/18)*4}px`, fontWeight:'bold'}}>
                            {showBalanceValue}
                        </div>
                    </div>
                    <WaveEffect />
                    <div className='wallet_content_property_list'>
                        {propertyDetailList}   
                    </div>
                    {
                        walletState.viewState === 'list'?
                        <div className='wallet_content_floor'>
                            <Button onClick={transferTokenHandler}>
                            <SwapOutlined />转账
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={tokenCollectionHandler}>
                            <VerticalAlignBottomOutlined />收款
                            </Button>
                        </div>
                        :
                        <div className='wallet_content_floor'>
                            <Button type='link' onClick={backToListView}>
                            返回
                            </Button>
                        </div>
                    }
                    
                </div>
                
            </div>
            
        </Spin>
    )
}

export default Wallet;