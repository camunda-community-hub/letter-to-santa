import React, { useReducer, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';


const Form = ({ styles }) => {
  const formReducer = (state, event) => {
    return {
      ...state,
      [event.name]: event.value
    }
  }
  const baseStyle = {  }

  const [formData, setFormData] = useReducer(formReducer, {});
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
    fetch('https://write-a-letter-to-santa.org:9091/santa', requestOptions);

alert('Santa has been notified! You can reload the page to send another letter.');

  }
  const handleChange = event => {
    setFormData({
      name:  event.target.name ,
      value:  event.target.value,
    });
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