import { useState, useEffect } from "react";
import * as postService from '../../services/postService'

export default function PostListPage() {
 const [posts, setPosts] = useState([]);

 useEffect(() => {
  async function fetchPosts() {
   const posts = await postService.index();
   setPosts(posts);
  }
  fetchPosts();
 }, []);

 return (
  <div>
   <h1>Post List Page</h1>
   {posts.length ?
    <ul>
     {posts.map((post) => <li key={post._id}>{post.content}</li>)}
    </ul>
    :
    <p>No Posts Yet</p>
   }
  </div>
 );
}
