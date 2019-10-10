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

  return (items.length > 0 &&
    <List
      height={650}
      rowHeight={150}
      width={400}
      style={{ flex: '0 1 auto', position: 'sticky', top: 0 }}
      rowCount={items.length}
      overscanRowCount={10}
      rowRenderer={({ index, key, style }) => {
        const id = items[index];
        const menuProps = {
          style,
          key,
          id,
          setCache,
          onItemClick: comment => props.onItemClick(comment),
        }
        if (cache[id] !== undefined) {
          menuProps.item = cache[id];
        }

        return <MenuItem {...menuProps} />;
      }}
    />
  );
}
