
import { useState, useEffect } from 'react';

import WalletLoading from './view/WalletLoading';
import Login from './view/Login';
import Wallet from './view/Wallet';


import './style/login.css';
import './style/wallet.css';

function App() {

  const [appState, setAppState] = useState({
    viewState:'loading',
    loginState:null
  });// 1. loading, 2. login, 3. wallet

  useEffect(()=>{

    let loadingTimes = setInterval(() => {

      clearInterval(loadingTimes);

      setAppState({
        viewState:'login',
        loginState:null
      });
    }, 3000);

  },[]);

  const successCallBack = (loginState) => {

    console.log("登录信息", loginState);
    setAppState({viewState:'wallet', loginState});
  }

  const logout = () => {

    setAppState({
      viewState:'login',
      loginState:null
    });
  }

  return (
    <>
      {
        appState.viewState === 'loading' ? <WalletLoading />:
        appState.viewState === 'login' ? <Login successCallBack={successCallBack}/>:<Wallet coinWallet={appState.loginState} logout={logout}/>
      }
    </>
  );
}

export default App;
