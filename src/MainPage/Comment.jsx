import React from "react";

export default (props) => {
  return (
    <article>
      <h6>{`${props.by} said :`}</h6>
      <p dangerouslySetInnerHTML={{
        __html:props.text
      }}/>
    </article>
  ) 
}