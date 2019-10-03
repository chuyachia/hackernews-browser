import React, { useState, useEffect } from "react";
import { ajax } from "rxjs/ajax";
import { flatMap, map, tap } from 'rxjs/operators';
import { forkJoin, of } from "rxjs";

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

  const fetchComment = (id) => {
    return ajax.getJSON(__HACKER_NEWS_BASE__ + `/item/${id}.json`)
  }

  const fetchRecursive = (id) => {
    return fetchComment(id).pipe(
      map(comment => ({
        parent: { ...comment, kids: [] },
        kidIds: comment.kids || [],
      })),
      flatMap(comment => forkJoin([
        of(comment.parent),
        ...comment.kidIds.map(id=>fetchRecursive(id))
      ])),
      tap(([parent, ...kids]) => parent.kids = kids),
      map(([parent]) => parent)
    );
  }

  const handleItemClick = () => {
    forkJoin(item.kids.map(comment=>fetchRecursive(comment)))
    .subscribe(
      res => props.onItemClick(res),
      err => console.error(err),
    )
  }

  return (
    item && (
      <div onClick={handleItemClick} style={props.style}>
        <h5>{item.title}</h5>
        <p>by {item.by}</p>
        <a href={item.url}>go to page</a>
      </div>)
  )
};