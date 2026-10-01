import BlogPost from '../../../src/components/blog/BlogPost';
import posts from '../../../src/content/posts';
export const prerender=true;
export default function Page(){return <BlogPost post={posts[0]} />;}
