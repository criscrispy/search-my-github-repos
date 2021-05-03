const github = {
    baseURl: "https://api.github.com/graphql",
    headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${process.env.REACT_APP_GITHUB_GQL_KEY}`,
    }
}


export default github