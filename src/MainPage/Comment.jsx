import React from "react";

export default (props) => {
  return (
    <article>
      <p>{props.text}</p>
      <small>{props.by}</small>
    </article>
  ) 
}