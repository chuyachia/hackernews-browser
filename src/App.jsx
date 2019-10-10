import React, { useState, useEffect } from "react";
import { ajax } from "rxjs/ajax";
import { catchError, mergeMap } from 'rxjs/operators';
import { of, from, forkJoin } from 'rxjs';

import SideBar from './SideBar';
import MainPage from './MainPage';

export default () => {
  const [activePost, setActivePost] = useState(undefined);
  const [comments, setComments] = useState({});

  useEffect(() => {
    loadComments(activePost);
  }, [activePost])

  const fetchComment = (id) => {
    return ajax.getJSON(__HACKER_NEWS_BASE__ + `/item/${id}.json`).pipe(
      catchError(err => of(undefined))
    )
  }

  const fetchComments = (ids) => {
    return from(ids).pipe(
      mergeMap(id => fetchComment(id))
    )
  }

  // This creates multiple subscription, probably can use expand?
  const loadComments = (post) => {
    if (post === undefined || post.kids === undefined || post.kids.length === 0) {
      return;
    }

    fetchComments(post.kids)
      .subscribe(
        comment => {
          if(comment != undefined) {
            setComments((prevComments) => ({
              ...prevComments, [comment.id]: comment
            }));
            loadComments(comment);
          }
        },
        err => console.error(err),
      )
  }

  return (
    <div style={{ display: 'flex' }}>
      <SideBar onItemClick={(post) => setActivePost(post)} />
      <MainPage activePost={activePost} comments={comments}/>
    </div>
  )
}