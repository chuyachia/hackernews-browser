import React, { useState, useEffect } from "react";
import { ajax } from "rxjs/ajax";
import { List } from "react-virtualized";

import MenuItem from './MenuItem';
import { safeGet } from '../util';

export default (props) => {
  const [items, setItems] = useState([]);
  let subscription;
  let cache = {};

  useEffect(() => {
    const items = ajax.getJSON(__HACKER_NEWS_BASE__ + "/topstories.json") 
    subscription = items.subscribe(
      res => setItems(res),
      err => console.error(err),
    );
    
    return () => {
      subscription.unsubscribe();
    }
  }, [])

  const setCache = (id,item) => {
    cache[id] = item;
  }

  const rowRenderer = ({ index, key, style }) => {
    const id = items[index];
    const menuProps = {
      style,
      key,
      id,
      setCache,
      index,
      onItemClick: comment => props.onItemClick(comment),
    }
    if (cache[id] !== undefined) {
      menuProps.item = cache[id];
    }

    return <MenuItem {...menuProps} active={props.activePostId === id} />;
  }

  return (<aside>
    <List
      height={650}
      rowHeight={200}
      width={400}
      rowCount={safeGet(['length'], items, 0)}
      overscanRowCount={10}
      rowRenderer={rowRenderer}
    />
  </aside>);
}
