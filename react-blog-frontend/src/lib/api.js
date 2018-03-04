import axios from 'axios';
import queryString from 'query-string';

export const writePost = ({title, body, tags}) => axios.post('/api/post', {title, body, tags});
export const getPost = ({id}) => axios.get(`/api/post/${id}`);
export const getPostList = ({tag, page}) => axios.get(`/api/post/?${queryString.stringify({tag, page})}`);
export const editPost = ({id, title, body, tags}) => axios.patch(`/api/post/${id}`, {title, body, tags});
export const removePost = ({id}) => axios.delete(`/api/post/${id}`);

export const login = (password) => axios.post('/api/auth/login', {password});
export const checkLogin = () => axios.get('/api/auth/check');
export const logout = () => axios.post('/api/auth/logout');