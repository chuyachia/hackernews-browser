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
  const [topPostIds, setTopStoryIds] = useState([]);
  const [activePost, setActivePost] = useState(undefined);
  const [comments, setComments] = useState({});

  const postChange = new Subject();
  let postChangeSubscription;
  let subscription;

  useEffect(() => {
    const items = ajax.getJSON(__HACKER_NEWS_BASE__ + "/topstories.json") 
    subscription = items.subscribe(
      res => setTopStoryIds(res),
      err => console.error(err),
    );
    
    return () => {
      subscription.unsubscribe();
    }
  }, [])

  useEffect(() => {
    postChangeSubscription = postChange.subscribe(
      () => {
        setComments({});
      }
    );

    return () => postChangeSubscription.unsubscribe();
  }, [postChange])

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
        postIds={topPostIds}
        setActivePost={(post) => {
          if (post.id !== safeGet(['id'], activePost)) {
            setComments({});
            postChange.next(post.id);
          }
          setActivePost(post);
        }}
      />
      <MainPage activePost={activePost} comments={comments}/>
    </div>
  )
}