import ListGroup from "./components/ListGroup";
import BookSearchBar from "./components/BookSearchBar";
import BookSearchResultItem from "./components/BookSearchResultItem";

function App() {
  let items = ["New York", "San Francisco", "Tokyo", "London", "Paris"];

  return (
    <div>
      <BookSearchBar />
      <BookSearchResultItem
        author="John Doe"
        description="A great book about everything you need to know. A thriling saga about how to live your life to the full extent of it."
        title="The Great Book"
        year={2023}
      />
      <BookSearchResultItem
        author="Morgan Freeman"
        description="Biography of the actor and film legend Morgan Freeman. From his early life to his rise to fame, this book covers it all."
        title="Morgan Freeman: A Life in Film"
        year={2023}
      />
      <BookSearchResultItem
        author="A stoic philosopher"
        description="A deep dive into the teachings of stoicism and how it can be applied to modern life."
        title="The Art of Living"
        year={2023}
      />
      <BookSearchResultItem
        author="Gordon Ramsay"
        description="Hells kitchen is a place where the best chefs in the world come to compete and show off their skills. This book takes you behind the scenes of the hit TV show."
        title="Hells Kitchen: Behind the Scenes"
        year={2023}
      />
    </div>
  );
}

export default App;
