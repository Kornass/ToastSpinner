import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import Spinner from "./components/Spinner";
function App() {
  const [search, setSearch] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${Number(search)}`
      );
      if (res.status === 200) {
        toast.warning("Post fetching....");
        setTimeout(() => {
          setPosts([res.data]);
          setLoading(false);
          toast.success(`Post ${search} fetched successfully!`);
        }, 2500);
      }
    } catch (error) {
      if (error.response.status === 404) {
        setTimeout(() => {
          toast.error(
            "Request failed with code 404! Check if input is a number from 1 to 100",
            { theme: "colored" }
          );
          setLoading(false);
        }, 2500);
      }
    }
  };

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
      if (res.status === 200) {
        toast.warning("Posts fetching....");
        setTimeout(() => {
          setPosts(res.data);
          setLoading(false);
          toast.success("All posts fetched successfully!");
        }, 2500);
      }
    } catch (error) {
      if (error.response.status === 404) {
        setTimeout(() => {
          toast.error(
            "Request failed with code 404! Check if you request URL is correct!",
            { theme: "colored" }
          );
          setLoading(false);
        }, 2500);
      }
    }
  };

  useEffect(() => {
    if (!posts && !loading) {
      fetchAllPosts();
    }
  }, []);

  useEffect(() => {
    if (clicked) {
      toast.info("You need to input number from 1 to 100");
      setTimeout(() => {
        setClicked(false);
      }, [2000]);
    }
  }, [clicked]);

  const displayPosts = (posts) => {
    return posts.map((post) => (
      <div className="post" key={uuidv4()}>
        <div className="head">
          <span>{post.id}.</span>
          <h3>{post.title}</h3>
          <span>user ID:{post.userId}</span>
        </div>
        <p>{post.body}</p>
      </div>
    ));
  };

  // if (loading) {
  //   return <Spinner />;
  // }

  return (
    <>
      <div className="App">
        <form onSubmit={onSubmit}>
          <label>Search by post Id</label>
          <input
            type="number"
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setClicked(true)}
          />
          <button type="submit">Search</button>
        </form>
        {posts ? displayPosts(posts) : <h3>No posts!</h3>}
        {posts.length == 1 && (
          <button onClick={fetchAllPosts}>All posts</button>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={2000} closeOnClick />
      {loading && <Spinner />}
    </>
  );
}

export default App;
