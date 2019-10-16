import React, { useState, useEffect } from "react";
import { ajax } from "rxjs/ajax";
import { catchError, mergeMap, takeUntil, delay } from 'rxjs/operators';
import { of, from, Subject } from 'rxjs';

import SideBar from './SideBar';
import MainPage from './MainPage';
import { safeGet } from './util';

import 'normalize.css';
import './App.scss';

export default () => {
  const [activePost, setActivePost] = useState(undefined);
  const [comments, setComments] = useState({});

  const postChange = new Subject();

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
      mergeMap(id => fetchComment(id)),
      delay(5),
      takeUntil(postChange)
    )
  }

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
    <div className="app">
      <SideBar
        onItemClick={(post) => {
          if (post.id !== safeGet(['id'], activePost)) {
            postChange.next();
          }
          setActivePost(post);
        }}
        activePostId={safeGet(['id'], activePost)}
      />
      <MainPage activePost={activePost} comments={comments}/>
    </div>
  )
}