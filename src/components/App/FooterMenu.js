import React from "react";

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
    <h3>Powered by Camunda</h3>

    </div>
  );
};

export default FooterMenu;