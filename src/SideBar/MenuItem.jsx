import React, { useState, useEffect } from "react";
import { ajax } from "rxjs/ajax";

export default (props) => {
  const [item, setItem] = useState(null);
  let subscription;

  useEffect(() => {
    if (props.item === undefined) {
      const item = ajax.getJSON(__HACKER_NEWS_BASE__ + `/item/${props.id}.json`)
      subscription = item.subscribe(
        res => {
          props.setCache(props.id, res);
          setItem(res);
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


  // const fetchRecursive = (id) => {
  //   return fetchComment(id).pipe(
  //     map(comment => ({
  //       parent: { ...comment, kids: [] },
  //       kidIds: comment && comment.kids || [],
  //     })),
  //     flatMap(comment => forkJoin([
  //       of(comment.parent),
  //       ...comment.kidIds.map(id=>fetchRecursive(id))
  //     ])),
  //     tap(([parent, ...kids]) => parent.kids = kids),
  //     map(([parent]) => parent)
  //   );
  // }

  const handleItemClick = () => {
    props.onItemClick(item)
  }

  return (
    item && (
      <article onClick={handleItemClick} style={props.style}>
        <h5>{item.title}</h5>
        <p>by {item.by}</p>
        <small>{`${item.kids ? item.kids.length : 0} comments`}</small>
        <a href={item.url}>go to page</a>
      </article>)
  )
};