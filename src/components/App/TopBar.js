import React from "react";

const TopBar = ({ styles }) => {
  const topBarStyle = {
    position: "fixed",
    top: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    height: styles.topBarHeight,
    // backgroundColor: styles.white(),
    // borderBottom: `1px solid ${styles.black(0.1)}`,
    fontWeight: "bold",
    padding: "20px",
    // margin: "40px",
    boxSizing: "border-box",
    color: styles.white()
  };

  return (
    <div style={topBarStyle}>
      <span>{`🎅🏽`}</span>
      <h1>Write a Letter to Santa!</h1>
      <span>{`🎄`}</span>
    </div>
  );
};

export default TopBar;