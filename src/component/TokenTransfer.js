
import { useState } from 'react';

import { Input, Button, Row, Col, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import WalletUtil from '../utils/WalletUtil';

function TokenTransfer(props){

    const [transferState, setTransferState] = useState({
        transferAddress:'',
        transferAmount:0,
        transferGasAmount:0
    });

    const transferAddressChange = (e) => {

        // 正则匹配字符

        setTransferState({...transferState, transferAddress:e.target.value});
    }

    const transferAmountChange = (e) => {

        // 正则匹配字符

        setTransferState({...transferState, transferAmount:e.target.value});
    }

    const transferTokenHandler = () => {

        // 检查地址是否有效
        if (!WalletUtil.checkAddress(transferState.transferAddress)) {
            message.warning('转账地址无效!');
            return
        }

        // 检查数量是否有效
        if (isNaN(transferState.transferAmount) || transferState.transferAmount <= 0) {
            message.warning('转账金额无效!');
            return;
        }

        props.transferTokenHandler(transferState.transferAddress, transferState.transferAmount);
    }

    return (
        <>
            <Row style={{paddingTop:'25px'}}>
                <Col span={6} className='wallet_transfer_icon'>
                    From:&nbsp;&nbsp;
                </Col>
                <Col span={16}>
                    <Input value={props.walletAddress} disabled/>
                </Col>
            </Row>
            <Row style={{paddingTop:'25px'}}>
                <Col span={6} className='wallet_transfer_icon'>
                    To:&nbsp;&nbsp;
                </Col>
                <Col span={16}>
                    <Input placeholder="enter transfer address"
                            value={transferState.transferAddress}
                            onChange={transferAddressChange}/>
                </Col>
            </Row>
            <Row style={{paddingTop:'25px'}}>
                <Col span={6} className='wallet_transfer_icon'>
                    Amount:&nbsp;&nbsp;
                </Col>
                <Col span={16}>
                    <Input placeholder="enter transfer amount"
                            value={transferState.transferAmount}
                            onChange={transferAmountChange}/>
                </Col>
            </Row>
            <Row className='wallet_row_content'>
                <Button onClick={transferTokenHandler}>
                    <CheckOutlined />确认
                </Button>
            </Row>
        </>
    )
}

export default TokenTransfer;