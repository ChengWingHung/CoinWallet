
import { useState } from 'react';

import WaveEffect from '../component/WaveEffect';
import { Input, Button, Row, Col } from 'antd';
import { UserOutlined, KeyOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';

import chengsaucai_weixin from '../component/Img';

function Login(props){

    const [loginState, setLoginState] = useState({
        "login_name":"",
        "private_key":""
    });

    const loginNameChange = (e) => {

        setLoginState({...loginState, "login_name":e.target.value});
    }

    const privateKeyChange = (e) => {

        let private_key = e.target.value;

        private_key = private_key.toString().replace(/[^0-9a-z]/g, '');

        setLoginState({...loginState, private_key});
    }

    const loginEthWallet = () => {

        console.log("得到的信息", loginState);
        if (loginState.login_name.trim() === '' || loginState.private_key.trim() === '') return;
        loginWalletProcess();
    }

    const clearLoginInfo = () => {

        setLoginState({
            "login_name":"",
            "private_key":""
        });
    }

    const loginWalletProcess = () => {

        props.successCallBack(loginState);
    }

    return (
        <>
            <div className='wallet_container'>
                <div className='wallet_content'>
                    <div className='wallet_content_header'>
                        <span style={{color:'white', fontWeight:'bold'}}>Coin Wallet Login</span>
                    </div>
                    <WaveEffect />
                    <div className='wallet_content_property_list' style={{height:'450px'}}>
                        <Row style={{paddingTop:'25px'}}>
                            <Col span={4} className='wallet_login_icon'>
                                <UserOutlined />&nbsp;&nbsp;
                            </Col>
                            <Col span={18}>
                                <Input placeholder="enter your login name"
                                    value={loginState.login_name}
                                    onChange={loginNameChange}/>
                            </Col>
                        </Row>
                        <Row style={{paddingTop:'25px'}}>
                            <Col span={4} className='wallet_login_icon'>
                                <KeyOutlined />&nbsp;&nbsp;
                            </Col>
                            <Col span={18}>
                                <Input placeholder="enter your private key"
                                    value={loginState.private_key}
                                    onChange={privateKeyChange}/>
                            </Col>
                        </Row>
                        <Row className='wallet_row_content'>
                            <Button onClick={loginEthWallet}>
                                <CheckOutlined />确认
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={clearLoginInfo}>
                                <DeleteOutlined />清空
                            </Button>
                        </Row>
                        <Row className='wallet_row_content'>
                            <img src={chengsaucai_weixin}/>
                        </Row>
                    </div>
                </div>
                
            </div>
            
        </>
    )
}

export default Login;