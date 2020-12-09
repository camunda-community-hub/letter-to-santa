import React, { useReducer, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';


const Form = ({ styles }) => {
  const formReducer = (state, event) => {
    return {
      ...state,
    //   [event.target.name]: event.target.value
      [event.name]: event.value
    }
  }
  //var submitted = false;
  const baseStyle = {  }
  const formStyle = {
    width: document.body.width - 50,
    height: document.body.height - 50
  }
  const [formData, setFormData] = useReducer(formReducer, {});
  //const[showMe, setShowMe] = useState(true);
  const [submitted, setSubmitting] = useState(false);

  const handleSubmit = event => {

    event.preventDefault();
    setSubmitting(true);
    if (!event.target.checkValidity()) {
      // form is invalid! so we do nothing
      return;
    }


    console.log("Sending: ", formData)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: JSON.stringify(formData)
    };
    fetch('http://localhost:9090/santa', requestOptions)
      .then(response => response.json())
      .then(data => this.setState({ postId: data.id }));

alert('Santa has been notified!');
    //setShowMe(false);

    // setTimeout(() => {
    //   setSubmitting(false);
    // }, 3000)
  }
  const handleChange = event => {
    setFormData({
      name:  event.target.name ,
      value:  event.target.value,
    });
  }
  const thanksStyle = {
    fontSize: 96,
    textAlign: "center",
    color: "white"
  }
  return (
    <div style={baseStyle}>
      <div style={{ display: !submitted ? "none" : "thanksStyle" }}>Thank you! Santa has been notified!</div>
    <form style={{ display: submitted ? "none" : "formStyle" }} onSubmit={handleSubmit}>
      <fieldset >
        <label>
          <p>Name</p>
          <input name="name" onChange={handleChange} required/>
        </label>
        <label>
          <p>Parent's Email Address</p>
          <input type="email" name="ParentEmailAddress" onChange={handleChange} required/>
        </label>
        <p></p>
        <label for="SantaLetter" >Your Letter to Santa:</label>
          <TextareaAutosize name="letter" minRows={10} required onChange={handleChange}/>
      </fieldset>
      <div class="button-center">
        <button class="button" type="submit">Send Letter</button>
      </div>
    </form>
    </div>
  );
};

export default Form