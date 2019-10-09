import React, { useState } from "react";

export default (props) => {

  const renderComment = (id) => {
    const comment = props.comments[id];
    if (comment === undefined) {
      return;
    } else {
      return (
        <div key={comment.id} style={{ padding: '5px' }}>
          <p>{comment.id}</p>
          {comment.kids !== undefined && comment.kids.length > 0 &&
            <div style={{ padding: '5px' }}>{comment.kids.map(id => renderComment(id))}</div>}
        </div>
      )
    }
  }

  console.log(props.activePost);
  console.log(props.comments);

  return (
    <div>
      {props.activePost !== undefined &&
        props.activePost.kids !== undefined &&
        props.activePost.kids.map(id => renderComment(id))
      }
    </div>
  )
}