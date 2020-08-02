import React, { useState, useEffect, useCallback } from 'react';

import { getNews } from 'api';

import { StyledContainer } from 'components/StyledContainer';

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    const news = await getNews();
    setNews(news);
    setLoading(false);
  }, [setNews, setLoading]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  if (loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <StyledContainer>
      {news.length ? (
        <>
          <h1>Job Related News</h1>
          <p className="mx-4 font-bold text-gray-800 text-sm">
            Total Results: {news.length}
          </p>
          {news
            .slice()
            .reverse()
            .map((n) => (
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                key={n.publishedAt}
                className="news-item">
                <div className="flex flex-col-reverse justify-between sm:flex-row">
                  <div>
                    <p className="news-title">{n.title}</p>
                    <p className="source">
                      <span>Source:</span> {n.source.name}
                    </p>
                    {n.author && (
                      <p className="author">
                        <span>Author:</span> {n.author}
                      </p>
                    )}
                    <p className="news-description">{n.description}</p>
                  </div>
                  <img
                    className="mb-2 sm:mb-0 sm:ml-3 h-40 sm:h-32 w-full sm:w-56"
                    src={
                      n.urlToImage
                        ? n.urlToImage
                        : 'https://www.trendingnews.news/wp-content/uploads/2019/03/Trending-News_Horizontal.png'
                    }
                    alt={n.title}
                  />
                </div>
                <div className="publishedAt">
                  <p className="text-sm text-blue-500 hover:underline">
                    Read more...
                  </p>
                  <p>
                    Published on:{' '}
                    {new Date(
                      n.publishedAt.substring(0, 10),
                    ).toLocaleDateString()}
                  </p>
                </div>
              </a>
            ))}
        </>
      ) : (
        <h1>No recent news found!</h1>
      )}
    </StyledContainer>
  );
}

export default News;
