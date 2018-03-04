import asyncComponent from 'lib/asyncComponent';

export const ListPage = asyncComponent(() => import('./ListPage'));
export const EditorPage = asyncComponent(() => import('./EditorPage'));
export const PostPage = asyncComponent(() => import('./PostPage'));
export const NotFoundPage = asyncComponent(() => import('./NotFoundPage'));
