# About

A simple library that allows you to commit to a GitHub repository with a javascript client.

This library was extracted from the WYSIWYG blog editor [Lanyon](https://github.com/swanson/lanyon)

A more detailed explanation on the inner workings can be found at [Mike Swanson's blog](http://swanson.github.com/blog/2011/07/23/digging-around-the-github-api-take-2.html)

# Usage

```javascript
function GitHubWebCommit(){
  	gh = new Github({
  			repositoryRoot : 'donskifarrell/github-webcommit.js'
			defaultCommitPath : '/commit/destination/from/repo/root',
			defaultCommitMessage : 'Commit by GitHub-WebCommit.js'
		});

    gh.setCredentials($GitHub_Username, $GitHub_Password);
    gh.commit(post);
}
```

# TODO

There is always something to do:

* If possible, integrate with GitHub OAuth api to avoid the need of username/password when already logged in.
* Add simple static page example of committing to a GitHub repo
* Add minified version of js file
