# About

A simple library that allows you to commit to a GitHub repository with a javascript client.

This library was extracted from the WYSIWYG blog editor [Lanyon](https://github.com/swanson/lanyon)

A more detailed explanation on the inner working can be found at [Mike Swanson's blog](http://swanson.github.com/blog/2011/07/23/digging-around-the-github-api-take-2.html)

# Usage

```javascript
function GitHubWebCommit(){
  	gh = new Github({
  			repositoryRoot : 'donskifarrell/github-webcommit.js'
			defaultPath : '/commit/destination/from/repo/root',
			defaultCommitMessage : 'Commit by GitHub-WebCommit.js'
		});

    gh.setCredentials($usernameField.val(), $passwordField.val());
    gh.commit(post);
}
```