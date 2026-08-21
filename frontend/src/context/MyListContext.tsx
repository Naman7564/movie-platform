import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Movie } from '../types';

interface MyListContextType {
  myList: Movie[];
  isInList: (movieId: number) => boolean;
  addToList: (movie: Movie) => void;
  removeFromList: (movieId: number) => void;
  toggleList: (movie: Movie) => void;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

const STORAGE_KEY = 'filmora_my_list_v1';

export const MyListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myList));
    } catch {
      // Ignore write errors
    }
  }, [myList]);

  const isInList = (movieId: number) => myList.some((m) => m.id === movieId);

  const addToList = (movie: Movie) => {
    if (!isInList(movie.id)) {
      setMyList((prev) => [movie, ...prev]);
    }
  };

  const removeFromList = (movieId: number) => {
    setMyList((prev) => prev.filter((m) => m.id !== movieId));
  };

  const toggleList = (movie: Movie) => {
    if (isInList(movie.id)) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  };

  return (
    <MyListContext.Provider value={{ myList, isInList, addToList, removeFromList, toggleList }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
};
