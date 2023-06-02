import React, { useState, useEffect, useRef } from "react";
import { Input, Button, message } from "antd";
import { goTo } from "react-chrome-extension-router";
import Home from "./home/home";
import SignUp from "./signup/signup";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
  onAuthStateChanged,
  signInWithCredential,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../service/firebase";
import "@pages/popup/Popup.css";
import GoogleIcon from "@assets/img/google-icon.png";

const Popup = () => {
  document.body.style.width = "347px";
  document.body.style.height = "494px";
  document.getElementsByTagName("html")[0].style.width = "347px";
  document.getElementsByTagName("html")[0].style.height = "494px";

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const emailRef = useRef(null);
  const pswRef = useRef(null);
  setPersistence(auth, browserLocalPersistence);

  useEffect(() => {
    init();
  }, [user]);

  const init = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user != null) {
        goTo(Home);
      } else {
      }
    });
  };
  
  const handleGoogleSignIn = () => {
      if (auth.currentUser != null) {
        messageApi.warning(`${auth.currentUser} has already logged in!`)
      } else {
        startSignIn();
      }
  };

  const handleGooglePopup = () => {
    console.log('click login')
    chrome.runtime.sendMessage({name: 'login'}, response => {
      if(response.status !== '200') {
        console.log('response.error',response.error)
        return;
      }
      console.log("Login succeeded:", response.user);
    })
  }

  const startSignIn = () => {
    const user = auth.currentUser;
    
    if (user) {
      auth.signOut();
    } else {
      startAuth(true);
    }
  };
  
  const startAuth = (interactive: boolean) => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      //Token:  This requests an OAuth token from the Chrome Identity API.
      if (chrome.runtime.lastError && !interactive) {
        console.log("It was not possible to get a token programmatically.");
      } else if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else if (token) {
        const credential = GoogleAuthProvider.credential(null, token);
        signInWithCredential(auth, credential)
        .then( async (result) => {
          await chrome.storage.local.set({ careerlyUser: result.user });
          await messageApi.success('Login Success!')
          goTo(Home);
          setUser(result.user);
        })
        .catch((error) => {
          console.log(error);
        });
      } else {
        console.error("The OAuth token was null");
        messageApi.warning('Please try again!')
      }
    });
  };
  
  const signup = () => {
    goTo(SignUp);
  };
  
  const handleChange = (e) => {
    if (e.target.id === "email") {
      setEmail(e.target.value);
    }
    if (e.target.id === "password") {
      setPassword(e.target.value);
    }
  };

  const loginEmaillPSW = async () => {
    if (email == "") {
      emailRef.current.focus();
    } else if (password == "") {
      pswRef.current.focus();
    } else {
      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        // console.log("user", user);
      } catch (error) {
        messageApi.open({
          type: "error",
          content: `Invalid Info`,
        });
      }
    }
  };

  return (
    <div className="App">
      {contextHolder}
      <div className="App-header">
        <svg
          width="96"
          height="23"
          viewBox="0 0 96 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.94036 17.7243C5.7588 17.7243 4.69689 17.4551 3.75463 16.9167C2.82733 16.3783 2.09446 15.6454 1.55603 14.7181C1.0176 13.7758 0.748379 12.7064 0.748379 11.5099C0.748379 10.3134 1.0176 9.2515 1.55603 8.3242C2.09446 7.38194 2.82733 6.6416 3.75463 6.10317C4.69689 5.56473 5.7588 5.29552 6.94036 5.29552C8.01723 5.29552 9.00435 5.46752 9.90174 5.81151C10.8141 6.15551 11.5395 6.64908 12.0779 7.29221L9.812 9.98437C9.64748 9.77498 9.43809 9.58802 9.18383 9.4235C8.92957 9.24403 8.6454 9.10942 8.33131 9.01968C8.03218 8.91498 7.69566 8.86264 7.32175 8.86264C6.82819 8.86264 6.39445 8.97481 6.02054 9.19916C5.64662 9.4235 5.35497 9.73759 5.14558 10.1414C4.95115 10.5303 4.85393 10.979 4.85393 11.4875C4.85393 11.996 4.95115 12.4447 5.14558 12.8336C5.34002 13.2224 5.62419 13.5365 5.9981 13.7758C6.38697 14.0151 6.82819 14.1348 7.32175 14.1348C7.69566 14.1348 8.03218 14.0899 8.33131 14.0002C8.6454 13.9104 8.92209 13.7833 9.1614 13.6188C9.41566 13.4543 9.63253 13.2598 9.812 13.0355L12.0779 15.7501C11.5245 16.3783 10.7917 16.8643 9.87931 17.2083C8.98192 17.5523 8.00227 17.7243 6.94036 17.7243ZM18.2655 17.7019C17.2784 17.7019 16.3885 17.4402 15.5958 16.9167C14.818 16.3783 14.1973 15.6454 13.7337 14.7181C13.285 13.7758 13.0607 12.7064 13.0607 11.5099C13.0607 10.2835 13.285 9.20663 13.7337 8.27933C14.1824 7.35203 14.8031 6.62664 15.5958 6.10317C16.3885 5.56473 17.3008 5.29552 18.3328 5.29552C18.8862 5.29552 19.3947 5.3703 19.8584 5.51986C20.322 5.66943 20.7258 5.8863 21.0698 6.17047C21.4138 6.45464 21.713 6.77621 21.9672 7.13516C22.2215 7.49412 22.4309 7.88299 22.5954 8.30177L21.7429 8.2569V5.5423H25.8484V17.5H21.6531V14.5835L22.573 14.6284C22.4384 15.0621 22.2365 15.4659 21.9672 15.8398C21.713 16.2137 21.3989 16.5428 21.025 16.827C20.6511 17.0962 20.2323 17.313 19.7686 17.4776C19.3199 17.6271 18.8189 17.7019 18.2655 17.7019ZM19.4545 14.2694C19.9332 14.2694 20.3445 14.1647 20.6885 13.9553C21.0325 13.731 21.2942 13.4094 21.4737 12.9906C21.6681 12.5718 21.7653 12.0783 21.7653 11.5099C21.7653 10.9266 21.6681 10.4256 21.4737 10.0068C21.2942 9.58802 21.0325 9.27394 20.6885 9.06455C20.3445 8.8402 19.9332 8.72803 19.4545 8.72803C18.9759 8.72803 18.5646 8.8402 18.2206 9.06455C17.8916 9.27394 17.6373 9.58802 17.4579 10.0068C17.2784 10.4256 17.1886 10.9266 17.1886 11.5099C17.1886 12.0783 17.2784 12.5718 17.4579 12.9906C17.6373 13.4094 17.8916 13.731 18.2206 13.9553C18.5646 14.1647 18.9759 14.2694 19.4545 14.2694ZM28.987 17.5V5.5423H32.8907L33.115 9.46837L32.2401 8.79533C32.4345 8.13725 32.7336 7.54647 33.1374 7.02299C33.5562 6.48456 34.0573 6.06578 34.6406 5.76665C35.2239 5.45256 35.8371 5.29552 36.4802 5.29552C36.7494 5.29552 37.0037 5.31795 37.243 5.36282C37.4823 5.39273 37.7066 5.4376 37.916 5.49743L36.7719 10.119C36.6073 10.0143 36.3755 9.92455 36.0764 9.84976C35.7773 9.76002 35.4557 9.71516 35.1117 9.71516C34.8126 9.71516 34.5434 9.7675 34.304 9.8722C34.0647 9.96194 33.8628 10.0965 33.6983 10.276C33.5338 10.4555 33.4067 10.6724 33.3169 10.9266C33.2272 11.1659 33.1823 11.4501 33.1823 11.7791V17.5H28.987ZM44.9623 17.7243C43.6012 17.7243 42.4272 17.4626 41.44 16.9391C40.4529 16.4007 39.6901 15.6678 39.1517 14.7405C38.6133 13.7983 38.344 12.7289 38.344 11.5324C38.344 10.635 38.4936 9.80489 38.7927 9.04211C39.0919 8.27933 39.5107 7.62125 40.0491 7.06786C40.5875 6.49951 41.2232 6.06578 41.956 5.76665C42.7039 5.45256 43.519 5.29552 44.4014 5.29552C45.2689 5.29552 46.0541 5.44508 46.7571 5.74421C47.475 6.04334 48.0882 6.4696 48.5967 7.02299C49.1202 7.57638 49.5165 8.22699 49.7858 8.97481C50.0699 9.72263 50.1971 10.5452 50.1671 11.4426L50.1447 12.3849H40.7221L40.2061 10.2985H46.8019L46.3981 10.7472V10.3209C46.3981 9.99185 46.3084 9.70768 46.1289 9.46837C45.9644 9.21411 45.74 9.01968 45.4559 8.88507C45.1717 8.75046 44.8501 8.68316 44.4912 8.68316C43.9826 8.68316 43.5564 8.78785 43.2124 8.99724C42.8833 9.19168 42.6291 9.47585 42.4496 9.84976C42.2701 10.2237 42.1804 10.6724 42.1804 11.1958C42.1804 11.7941 42.3 12.3101 42.5393 12.7438C42.7936 13.1776 43.16 13.5141 43.6386 13.7534C44.1322 13.9927 44.7305 14.1124 45.4334 14.1124C45.8971 14.1124 46.3009 14.0525 46.6449 13.9329C47.0038 13.8132 47.3852 13.6038 47.7891 13.3047L49.7184 16.0193C49.195 16.4381 48.664 16.7746 48.1256 17.0289C47.6021 17.2682 47.0786 17.4402 46.5552 17.5449C46.0317 17.6645 45.5007 17.7243 44.9623 17.7243ZM58.1076 17.7243C56.7466 17.7243 55.5725 17.4626 54.5854 16.9391C53.5982 16.4007 52.8355 15.6678 52.297 14.7405C51.7586 13.7983 51.4894 12.7289 51.4894 11.5324C51.4894 10.635 51.6389 9.80489 51.9381 9.04211C52.2372 8.27933 52.656 7.62125 53.1944 7.06786C53.7329 6.49951 54.3685 6.06578 55.1014 5.76665C55.8492 5.45256 56.6643 5.29552 57.5468 5.29552C58.4142 5.29552 59.1994 5.44508 59.9024 5.74421C60.6203 6.04334 61.2335 6.4696 61.742 7.02299C62.2655 7.57638 62.6619 8.22699 62.9311 8.97481C63.2153 9.72263 63.3424 10.5452 63.3125 11.4426L63.29 12.3849H53.8675L53.3515 10.2985H59.9473L59.5434 10.7472V10.3209C59.5434 9.99185 59.4537 9.70768 59.2742 9.46837C59.1097 9.21411 58.8854 9.01968 58.6012 8.88507C58.317 8.75046 57.9955 8.68316 57.6365 8.68316C57.128 8.68316 56.7017 8.78785 56.3577 8.99724C56.0287 9.19168 55.7744 9.47585 55.5949 9.84976C55.4155 10.2237 55.3257 10.6724 55.3257 11.1958C55.3257 11.7941 55.4454 12.3101 55.6847 12.7438C55.9389 13.1776 56.3054 13.5141 56.784 13.7534C57.2775 13.9927 57.8758 14.1124 58.5788 14.1124C59.0424 14.1124 59.4462 14.0525 59.7902 13.9329C60.1492 13.8132 60.5306 13.6038 60.9344 13.3047L62.8638 16.0193C62.3403 16.4381 61.8094 16.7746 61.2709 17.0289C60.7474 17.2682 60.224 17.4402 59.7005 17.5449C59.177 17.6645 58.6461 17.7243 58.1076 17.7243ZM65.4872 17.5V5.5423H69.3909L69.6152 9.46837L68.7403 8.79533C68.9347 8.13725 69.2338 7.54647 69.6377 7.02299C70.0564 6.48456 70.5575 6.06578 71.1408 5.76665C71.7241 5.45256 72.3373 5.29552 72.9804 5.29552C73.2497 5.29552 73.5039 5.31795 73.7432 5.36282C73.9825 5.39273 74.2069 5.4376 74.4163 5.49743L73.2721 10.119C73.1076 10.0143 72.8757 9.92455 72.5766 9.84976C72.2775 9.76002 71.9559 9.71516 71.6119 9.71516C71.3128 9.71516 71.0436 9.7675 70.8043 9.8722C70.565 9.96194 70.3631 10.0965 70.1985 10.276C70.034 10.4555 69.9069 10.6724 69.8171 10.9266C69.7274 11.1659 69.6825 11.4501 69.6825 11.7791V17.5H65.4872ZM76.2231 17.5V0.898313H80.396V17.5H76.2231ZM84.5347 22.66L87.4063 15.8847L87.4512 17.7243L81.7752 5.5423H86.4416L88.4383 10.2985C88.6028 10.6724 88.7449 11.0463 88.8646 11.4202C88.9992 11.7791 89.0964 12.1231 89.1562 12.4522L88.6851 12.8111C88.7449 12.6167 88.8347 12.3475 88.9543 12.0035C89.074 11.6595 89.2086 11.2632 89.3581 10.8145L91.1753 5.5423H95.8642L90.6818 17.5L88.5954 22.66H84.5347Z"
            fill="#4356E0"
          />
        </svg>

        <svg
          width="19"
          height="8"
          viewBox="0 0 19 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.06559 6.18552C5.66556 7.34543 13.2596 6.59788 15.3031 3.09482M13.9545 1.46414L16.4319 1.74316L17.5902 3.81484"
            stroke="#4356E0"
            strokeWidth="2.10325"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="App-content">
        <h1>Sign in</h1>
        <div className="login-wrapper">
          <div className="email-wrapper">
            <p className="label-text">Email</p>
            <Input
              id="email"
              className="font-Jakarta input-field"
              onChange={handleChange}
              ref={emailRef}
              placeholder="Email"
            />
          </div>
          <div className="password-wrapper">
            <p className="label-text">Password</p>
            <Input.Password
              id="password"
              className="font-Jakarta input-field"
              onChange={handleChange}
              ref={pswRef}
              placeholder="Password"
            />
            <p className="forget-password">Forget Password</p>
          </div>
        </div>
        <div className="loging-btn-wrapper">
          <Button className="login-btn" type="primary" onClick={loginEmaillPSW}>
            Log In
          </Button>
          <p className="signup-text">
            Don’t have an account yet? <span onClick={signup}>Sign Up</span>
          </p>
        </div>
        <div className="google-auth-wrapper">
          <div className="divider-wrapper">
            <div className="divider-line left-divider" />
            <span>Or sign up with email</span>
            <div className="divider-line right-divider" />
          </div>
          <Button className="google-auth-btn" onClick={handleGooglePopup}>
            <img src={GoogleIcon} />
            <span>Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
