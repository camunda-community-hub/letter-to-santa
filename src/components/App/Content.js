import React, { useReducer, useState } from 'react';
import Form from "./Form"

const Content = ({ styles }) => {
  const theWrapStyle = {
    width: "100%",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    marginTop: styles.topBarHeight + 10,
    width: document.body.width,
    height: document.body.height - (styles.topBarHeight + 10) - 20,
    color: "white"
  }
  const contentStyle = {
    // paddingTop: styles.topBarHeight + 10,
    paddingRight: 10,
    //paddingBottom: styles.footerMenuHeight + 10,
    paddingLeft: 10,
    width: "90%",
    marginTop: styles.topBarHeight + 10,
    width: document.body.width - 20,
    height: document.body.height - 20
  };
  
  //const [submitting, setSubmitting] = useState(false);
  return (

    <div style={contentStyle}>
      <div style={theWrapStyle} id="the-wrap">

        {Form.submitting &&
          <div>
            You are submitting the following:
         <ul>
            {Object.entries(Form.formData).map(([name, value]) => (
                <li key={name}><strong>{name}</strong>: {value.toString()}</li>
              ))}
            </ul>
          </div>
        }
        <Form />
      </div>
    </div>
  );
};

export default Content;