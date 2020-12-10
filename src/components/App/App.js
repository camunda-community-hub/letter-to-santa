import React from 'react';
import TopBar from "./TopBar";
import Content from "./Content"
import FooterMenu from "./FooterMenu";
import './App.css';


function App() {


  const styles = {
    white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    black: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    red: (opacity = 0) => `#CC1800`,
    topBarHeight: 40,
    footerMenuHeight: 50
  };

  return (

    <div className="wrapper">

        <TopBar styles={styles} />

        {/* <FooterMenu menuItems={menuItems} styles={styles} /> */}
        <Content styles={styles} />
        <FooterMenu styles={styles} />




      <div class="ball-bkg">
      <div class="ball-wrapper">
        <div class="long-string"></div>
        <div class="ring"></div>
        <div class="collar"></div>
        <div class="red-ball"></div>
      </div>



      <div class="ball-wrapper">
        <div class="short-string"></div>
        <div class="ring"></div>
        <div class="collar"></div>
        <div class="green-ball"></div>
      </div>

      <div class="ball-wrapper">
        <div class="med-string"></div>
        <div class="ring"></div>
        <div class="collar"></div>
        <div class="blue-ball"></div>
        </div>
        <div class="small-ball-wrapper">
          <div class="long-string"></div>
          <div class="small-ring"></div>
          <div class="small-collar"></div>
          <div class="small-ball"></div>
        </div>
      <div class="ball-wrapper">
        <div class="string"></div>
        <div class="ring"></div>
        <div class="collar"></div>
        <div class="white-ball"></div>
        </div>

      </div>
    </div>


  )

}

export default App;
