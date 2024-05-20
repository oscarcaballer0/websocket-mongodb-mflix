"use client"
import useMovieChangeStream from "../hooks/changeStream";
// import { useEffect } from "react";
import clientPromise from "../lib/mongodb";
import { GetServerSideProps } from "next";

interface Movie {
  _id: string;
  title: string;
  metacritic: number;
  plot: string;
}

interface MoviesProps {
  movies: Movie[];
}

const Movies: React.FC<MoviesProps> = ({ movies }) => {
  const moviesStream = useMovieChangeStream();
  return (
    <div>
      <h1>Top 20 Movies of All Time</h1>
      <p>
        <small>(According to Metacritic)</small>
      </p>
      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>
            <h2>{movie.title}</h2>
            <h3>{movie.metacritic}</h3>
            <p>{movie.plot}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const collection = db.collection("movies");
    const movies = await collection
      .find({})
      .sort({ metacritic: -1 })
      .limit(20)
      .toArray();
    return {
      props: { movies: JSON.parse(JSON.stringify(movies)) },
    };
  } catch (e) {
    console.error(e);
    return { props: { movies: [] } };
  }
};
