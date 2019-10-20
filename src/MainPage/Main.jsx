import React from "react";

import Comment from "./Comment";
import { safeGet } from '../util';


export default (props) => {

  const renderComment = (id) => {
    const comment = props.comments[id];
    if (comment === undefined) {
      return;
    } else {
      return (
        <div className="comment" key={comment.id}>
          <Comment {...comment}/>
          <div className="comment">
            {safeGet(['kids'], comment, []).map(id => renderComment(id))}
          </div>
        </div>
      )
    }
  }


  return (
    <main>
      {safeGet(['activePost', 'kids'], props, []) === 0 || Object.keys(props.comments).length === 0 ?
        "No comment to show"
        : safeGet(['activePost', 'kids'], props, []).map(id => renderComment(id))
      }
    </main>
  )
}