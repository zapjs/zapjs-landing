import articles from './posts.json';

// An explicit editorial estimate, not a measured reading duration.
export const readingWordsPerMinute = 200;
export default articles.map(article => {
  const wordCount = [article.title, article.excerpt, ...article.paragraphs].join(' ').trim().split(/\s+/u).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / readingWordsPerMinute));
  return { ...article, wordCount, readingMinutes, readTime: `About ${readingMinutes} min read` };
});
