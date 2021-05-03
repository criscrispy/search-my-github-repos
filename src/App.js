import github from "./db";
import { useEffect, useState, useCallback } from 'react';
import query from "./Query";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox";
import NavButtons from "./NavButtons";

function App() {

  // Setting state
  let [userName, setUserName] = useState('');
  let [repoList, setRepoList] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState('');
  let [totalCount, setTotalCount] = useState(null); // Total number of repositories

  // SEtting state for pagination feature
  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setEndCursor] = useState(null);
  let [hasPreviousPage, setHasPreviousPage] = useState(false);
  let [hasNextPage, setHasNextPage] = useState(true);
  let [paginationKeyword, setPaginationKeyword] = useState("first");
  let [paginationString, setPaginationString] = useState("");


  // Setting useCallback() to create memoization
  const fetchData = useCallback(

    () => {
      const queryText = JSON.stringify(query(pageCount, queryString, paginationKeyword, paginationString))

      fetch(github.baseURl, {
        method: "POST",
        headers: github.headers,
        body: queryText,
      })
        .then((response) => response.json())
        .then(({ data }) => { // destructuring otherwise we would have to write data.data.viewer.login
          const viewer = data.viewer;
          const repos = data.search.edges;
          const total = data.search.repositoryCount;

          const start = data.search.pageInfo?.startCursor;
          const end = data.search.pageInfo?.endCursor;
          const next = data.search.pageInfo?.hasNextPage;
          const previous = data.search.pageInfo?.hasPreviousPage;

          setUserName(viewer.name);
          setRepoList(repos);
          setTotalCount(total);

          setStartCursor(start);
          setEndCursor(end);
          setHasNextPage(next);
          setHasPreviousPage(previous);

        })
        .catch((err) => console.log(err))
    }, [pageCount, queryString, paginationKeyword, paginationString])

  useEffect(() => {
    fetchData()
  },
    [fetchData]
  )


  return (
    <div className="App container mt-5">
      <h1 className="text-primary">
        <i className="bi bi-diagram-2-fill"></i>
        Repos
      </h1>
      <p>Hello there {userName}</p>

      <SearchBox
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onTotalChange={(myNumber) => setPageCount(myNumber)}
        onQueryChange={(myString) => setQueryString(myString)}
      />

      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />

      {repoList && (
        <ul className="list-group list-group-flush">
          {
            repoList.map((repo) => (
              <RepoInfo key={repo.node.id} repo={repo.node} />
            ))
          }
        </ul>
      )}

      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />

    </div>
  );
}

export default App;
