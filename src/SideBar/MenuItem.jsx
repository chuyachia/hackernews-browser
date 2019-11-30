import React, { useState, useEffect } from "react";
import { ajax } from "rxjs/ajax";

import { safeGet } from '../util';

export default (props) => {
  const [item, setItem] = useState(undefined);
  let subscription;
  
  useEffect(()=> {
    if (props.active && item !== undefined) {
      props.onActivePostChange(item);
    }

  },[props.active,item])
 
  useEffect(() => {
    if (item === undefined) {
      const item = ajax.getJSON(__HACKER_NEWS_BASE__ + `/item/${props.id}.json`)
      subscription = item.subscribe(
        res => {
          props.setCache(props.id, res);
          setItem(res);
        },
        err => console.error(err),
      );
    }
    return () => {
      if (subscription !== undefined) subscription.unsubscribe();
    }
  }, [props.id])

  const handleItemClick = () => {
    props.onItemClick(item.id);
  }

  return (
    <article className="menu-item" style={props.style}>
      <h5 onClick={handleItemClick} className={props.active ? 'active' : ''}>{safeGet(['title'], item)}</h5>
      <p>by {safeGet(['by'], item)}</p>
      <small>{`${safeGet(['kids', 'length'], item, 0)} comments`}</small>
      <div className="hyperlink"><a href={safeGet(['url'], item)}>open page</a></div>
    </article>
  )
};