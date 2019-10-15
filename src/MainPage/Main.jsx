import React, { useState } from "react";

import Comment from "./Comment";


export default (props) => {

  const renderComment = (id) => {
    const comment = props.comments[id];
    if (comment === undefined) {
      return;
    } else {
      return (
        <div className="comment" key={comment.id}>
          <Comment {...comment}/>
          {comment.kids !== undefined && comment.kids.length > 0 &&
            <div className="comment">{comment.kids.map(id => renderComment(id))}</div>}
        </div>
      )
    }
  }


  return (
    <main>
      {props.activePost !== undefined &&
        props.activePost.kids !== undefined &&
        props.activePost.kids.map(id => renderComment(id))
      }
    </main>
  )
}