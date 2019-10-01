import React, { useState, useEffect } from "react";
import { ajax } from "rxjs/ajax";
import { List } from "react-virtualized";

import MenuItem from './MenuItem';

export default (props) => {
  const [items, setItems] = useState([]);
  let subscription;
  let cache = {};

  useEffect(() => {
    const items = ajax(__HACKER_NEWS_BASE__ + "/topstories.json") 
    subscription = items.subscribe(
      res => setItems(res.response),
      err => console.error(err),
    );
    
    return () => {
      subscription.unsubscribe();
    }
  }, [])

  const setCache = (id,item) => {
    cache[id] = item;
  }

  return (
    items.length > 0 &&<List
      height={700}
      rowHeight={150}
      width={800}
      rowCount={items.length}
      overscanRowCount={10}
      rowRenderer={({ index, key, style }) => {
        const id = items[index];
        if (cache[id]!==undefined) {
          return <MenuItem style={style} key={key} id={items[index]} item={cache[id]} setCache={setCache} />;
        }
        return <MenuItem style={style} key={key} id={items[index]} setCache={setCache}/>
      }}
    />
  );
}
