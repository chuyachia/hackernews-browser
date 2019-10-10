import React, { useState } from "react";

import Comment from "./Comment";

export default (props) => {

  const renderComment = (id) => {
    const comment = props.comments[id];
    if (comment === undefined) {
      return;
    } else {
      return (
        <div key={comment.id} style={{ paddingLeft: '5px' }}>
          <Comment {...comment}/>
          {comment.kids !== undefined && comment.kids.length > 0 &&
            <div style={{ paddingLeft: '5px' }}>{comment.kids.map(id => renderComment(id))}</div>}
        </div>
      )
    }
  }


  return (
    <main style={{ flex: '1 1 800px' }}>
      {props.activePost !== undefined &&
        props.activePost.kids !== undefined &&
        props.activePost.kids.map(id => renderComment(id))
      }
    </main>
  )
}