export function Articles(params) {
    let articles = (params.data.articles)?params.data.articles:[];
    let queryName = (params.query.queryName)?params.query.queryName:"na";
    let q = (params.query.q)?params.query.q:"na";
    let language = (params.query.language)?params.query.language:"na";
    let pageSize = (params.query.pageSize)?params.query.pageSize: "na";
    let articleCount = (params.data.totalResults)?params.data.totalResults:0;
    return (
      <div>
        <strong>Query Parameters</strong>
        <ul>
          <li><strong>Query:</strong> {queryName}</li>
          <li><strong>Query Text: </strong> {q}</li>
          <li><strong>Language: </strong> {language}</li>
          <li><strong>Page Size: </strong> {pageSize}</li>
        <li><strong>Article Count:</strong>{articleCount}</li>
        </ul>
        <ol >{
            articles.map((item, idx) => {
              if(item){
                if(item.title){
                  if(item.title === "[Removed]"){
                    return (<li key={idx} >Was Removed</li>);
                  }
                  // Apply inline style to the title text
              const titleStyle = {
                fontWeight: "bold", // Style properties
                color: "blue",
              };
              return (<li key={idx}><a href={item.url} target="_self" rel="noreferrer"><span style={titleStyle}>{item.title}</span></a></li>); //Changed target to self to allow story to open in new window
                }else{
                  return (<li key={idx}>No Title</li>);
                }
              }else{
                return (<li key={1} >No Item</li>);
              }
            })
        }</ol>
      </div>
    )
  
  }