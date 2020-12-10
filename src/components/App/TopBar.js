import React from "react";
import holly from "../../imgs/Holly-sm.png"
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
    fontSize: "150%",
    padding: "20px",
    marginTop: "20px",
    // margin: "40px",
    boxSizing: "border-box",
    color: styles.white()
  };

  return (
    <div style={topBarStyle}>
      <span><img alt="A sprig of holly" src={holly}></img></span>
      <h1>Write a Letter to Santa!</h1>
      <span><img alt="a sprig of holly" src={holly}></img></span>
    </div>
  );
};

export default TopBar;