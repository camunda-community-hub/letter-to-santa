import React from "react";
import logo from "../../imgs/Logo_White.png"
const FooterMenu = ({ menuItems, styles }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: styles.footerMenuHeight,
        // backgroundColor: "#333",
        color: "#fff",
        position: "fixed",
        bottom: 0
      }}
    >
      <span class="powered">Powered by <a href="https://camunda.com" target="_new"><img class="photo" alt="camunda logo" src={logo}></img></a></span>

    </div>
  );
};

export default FooterMenu;