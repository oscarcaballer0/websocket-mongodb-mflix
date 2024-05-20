
import { useEffect, useState } from "react";
import { ChangeStream } from "mongodb";
import clientPromise from "../lib/mongodb";

interface Movie {
  _id: string;
  title: string;
  metacritic: number;
  plot: string;
}

const useMovieChangeStream = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const collection = db.collection("movies");
        
        const changeStream: ChangeStream<Movie> = collection.watch();
        
        changeStream.on("change", (change) => {
          console.log("Change:", change);
          // Handle change event here, update movies state accordingly
          // Example: setMovies((prevMovies) => [...prevMovies, change.fullDocument]);
        });

        // Fetch initial movies data
        const initialMovies = await collection
          .find({})
          .sort({ metacritic: -1 })
          .limit(20)
          .toArray();
        
        setMovies(initialMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();

    return () => {
      // Clean up
      // Close MongoDB connection, unsubscribe from change stream, etc.
    };
  }, []);

  return movies;
};

export default useMovieChangeStream;
