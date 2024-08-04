// SavedArticlesContext.js
import React, { createContext, useState, useContext } from "react";

const SavedArticlesContext = createContext();

export const useSavedArticles = () => useContext(SavedArticlesContext);

export const SavedArticlesProvider = ({ children }) => {
  const [savedArticles, setSavedArticles] = useState([]);

  const toggleSaveArticle = (articleID) => {
    setSavedArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.articleID.toString() === articleID.toString()
          ? { ...article, isSaved: !article.isSaved }
          : article
      )
    );
  };

  const getArticleByID = (articleID) => {
    const article = savedArticles.find(
      (article) => article.articleID.toString() === articleID.toString()
    );
    return article ? article.isSaved : false;
  };

  const SetSaveStatusData = (articles) => {
    const uniqueArticles = new Map();

    articles.forEach((article) => {
      uniqueArticles.set(article.articleID, article);
    });
    const uniqueArticlesArray = Array.from(uniqueArticles.values());

    setSavedArticles(uniqueArticlesArray);
  };

  return (
    <SavedArticlesContext.Provider
      value={{
        getArticleByID,
        toggleSaveArticle,
        SetSaveStatusData,
        savedArticles,
      }}
    >
      {children}
    </SavedArticlesContext.Provider>
  );
};
