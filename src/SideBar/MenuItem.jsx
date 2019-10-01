import React, { useState, useEffect } from "react";
import { ajax } from "rxjs/ajax";

export default (props) => {
  const [item, setItem] = useState(null);
  let subscription;

  useEffect(() => {
    if (props.item === undefined) {
      const item = ajax(__HACKER_NEWS_BASE__ + `/item/${props.id}.json`)
      subscription = item.subscribe(
        res => {
          const item = res.response;
          props.setCache(props.id, item);
          setItem(item);
        },
        err => console.error(err),
      );
    } else {
      setItem(props.item);
    }
    
    return () => {
      if (subscription !== undefined) subscription.unsubscribe(); 
    }
  }, [])

  return (
    item && <div onClick={props.onClick} style={props.style}>
      <h5>{item.title}</h5>
      <p>by {item.by}</p>
      <a href={item.url}>go to page</a>
    </div>
  )
};