import { QueryForm } from "./QueryForm";
import { Articles } from "./Articles";
import { useState, useEffect } from "react";
import { exampleQuery, exampleData } from "./data";
import { defaultQueries } from "./data"; // Imports default queries to be used when no user is logged in.
import { SavedQueries } from "./SavedQueries";
import { LoginForm } from "./LoginForm";

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery); // latest query send to newsapi
  const [data, setData] = useState(exampleData); // current data returned from newsapi
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: "", password: "" });
  const urlNews = "/news";
  const urlQueries = "/queries";
  const urlUsersAuth = "/users/authenticate";

  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);

  useEffect(() => {
    getNews(query);
  }, [query]);

  useEffect(() => {
    getQueryList();
  }, []);


  
  async function login() {
    try {
      if (currentUser) {
        // If there is a valid currentUser, logout
        setCurrentUser(null);
      } else {
        // If currentUser is null, authenticate and login
        const response = await fetch(urlUsersAuth, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (response.status === 200) {
          // If authentication is successful, set currentUser and clear credentials
          setCurrentUser(credentials);
          setCredentials({ user: "", password: "" });
        } else {
          // If authentication fails, display an error message and reset currentUser
          alert(
            "Error during authentication, update credentials and try again"
          );
          setCurrentUser(null);
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        console.log("savedQueries has been retrieved: ");
        setSavedQueries(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }
  async function saveQueryList(savedQueries) {
    try {
      const response = await fetch(urlQueries, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedQueries),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("savedQueries array has been persisted:");
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }

  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }

  function currentUserMatches(user) {
    if (currentUser) {
      if (currentUser.user) {
        if (currentUser.user === user) {
          return true;
        }
      }
    }
    return false;
  }

  function onFormSubmit(queryObject) {
    if (currentUser === null){
      alert("Log in if you want to create new queries!")
      return; 
      }
    if (savedQueries.length >= 3 && currentUserMatches("guest")) {
      alert("guest users cannot submit new queries once saved query count is 3 or greater!")
      return;
      }
     
    let newSavedQueries = [];
    newSavedQueries.push(queryObject);
    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }
    console.log(JSON.stringify(newSavedQueries));
    saveQueryList(newSavedQueries);
    setSavedQueries(newSavedQueries);
    setQuery(queryObject);
  }

  async function getNews(queryObject) {
    try {
      if (!queryObject.q || queryObject.q.trim() === "") {
        // When queryObject.q is null or empty, setData() is called with an empty object
        setData({});
      } else {
        // When queryObject.q is not empty, make a fetch() request
        const response = await fetch(urlNews, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryObject),
        });

        // Throw an error if the fetch response does not come back ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Call response.json() to get the response body (the article data)
        const responseData = await response.json();

        // Pass the response data to setData()
        setData(responseData);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      // Handle the error condition as required, e.g., set data to an empty object
      setData({});
    }
  }

  function resetSavedQueries() {
    const confirmReset = window.confirm("Are you sure you want to clear queries?");
    if (confirmReset) {
      setSavedQueries([]);
    }
  }

  return (
    <div>
      <div>
        <LoginForm
          login={login}
          credentials={credentials}
          currentUser={currentUser}
          setCredentials={setCredentials}
        />
        <section className="parent">
          <div className="box box2"> {/*Added box 2 class*/}
            <span className="title">Query Form</span>
            <QueryForm
              currentUser={currentUser}
              setFormObject={setQueryFormObject}
              formObject={queryFormObject}
              submitToParent={onFormSubmit}
            />
          </div>
          <div className="box box2"> {/*Added box 2 class*/}
            <span className="title">Saved Queries</span>

            <SavedQueries
              savedQueries={currentUser ? savedQueries : defaultQueries} // If currentUser has value (truthy) render savedQueries, otherwise pull defaultQueries
              selectedQueryName={query.queryName}
              onQuerySelect={onSavedQuerySelect}
            />
            {currentUser && ( // If currentUser has value (truthy) render button that runs resetSavedQueries function, otherwise don't show button.
            <button onClick={resetSavedQueries}>Reset</button>
            )} 
          </div>
          <div className="box box2"> {/*Added box 2 class*/}
            <span className="title">Articles List</span>
            <div className="scroll-container">
            <Articles query={query} data={data} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}