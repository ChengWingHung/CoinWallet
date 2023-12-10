
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

        let transferAddress = e.target.value;
        
        transferAddress = transferAddress.toString().replace(/[^0-9a-z]/g, '');

        setTransferState({...transferState, transferAddress});
    }

    const transferAmountChange = (e) => {

        let transferAmount = e.target.value;
        
        transferAmount = transferAmount.toString().replace(/[^0-9.]/, '');

        setTransferState({...transferState, transferAmount});
    }

    const transferTokenHandler = () => {

        // 检查地址是否有效
        if (!WalletUtil.checkAddress(transferState.transferAddress)) {
            message.warning('转账地址无效!');
            return
        }

        // 检查数量是否有效
        if (isNaN(transferState.transferAmount) || transferState.transferAmount <= 0) {
            message.warning('转账数量无效!');
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
            <Row>
                <Col span={6}>
                    
                </Col>
                <Col span={16} className='wallet_transfer_icon' style={{textAlign:'left'}}>
                balance：{props.ethCountValue}
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