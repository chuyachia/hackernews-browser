import React, { useState, useEffect } from "react";
import { ajax } from "rxjs/ajax";

export default (props) => {
  const [items, setItems] = useState([]);
  let subscription;

  useEffect(() => {
    const items = ajax(__HACKER_NEWS_BASE__ + "/askstories.json") 
    subscription = items.subscribe(
      res => setItems(res.response),
      err => console.error(err),
    );
    
    return () => {
      subscription.unsubscribe();
    }
  }, [])
  return <div><div onClick={() => subscription.unsubscribe()}>Stop</div>{items.map(item => <div key={item}>{item}</div>)}</div>
}