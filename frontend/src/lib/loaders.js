import apiRequest from "./apiRequest";
import { defer } from "react-router-dom";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = async ({request,params}) => {
    const query = request.url.split("?")[1];
    const url = query ? `/posts?${query}` : "/posts";
    const postPromise = apiRequest(url);
    return defer({
        postResponse: postPromise
    });
}

export const profilePageLoader = async ({ request, params }) => {
  const postPromise = apiRequest("/users/profilePosts/" + params.id);
  const chatPromise = apiRequest("/chats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};

export const contactLoader = async ({ request, params }) => {
  const userPromise = apiRequest("/users/");
  const chatPromise = apiRequest("/chats");
  return defer({
    userResponse: userPromise,
    chatResponse: chatPromise,
  });
};
