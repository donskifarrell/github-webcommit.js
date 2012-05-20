var Github = function(config) {
    var API_URL = 'https://api.github.com';
    var that = this;

    that.repo = (typeof config.repositoryRoot === "undefined") ?
        alert("The GitHub repository root needs to be defined in order to commit to it!") : 
        config.repositoryRoot;

    that.commitPath = (typeof config.defaultCommitPath === "undefined") ? 
        '' : config.defaultCommitPath;
        
    that.defaultMessage = (typeof config.defaultCommitMessage === "undefined") ?
        "Commit by GitHub-WebCommit.js" : config.defaultCommitMessage;

    this.base64encode = function(string){
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var result     = '';

        var i = 0;
        do {
            var a = string.charCodeAt(i++);
            var b = string.charCodeAt(i++);
            var c = string.charCodeAt(i++);

            a = a ? a : 0;
            b = b ? b : 0;
            c = c ? c : 0;

            var b1 = ( a >> 2 ) & 0x3F;
            var b2 = ( ( a & 0x3 ) << 4 ) | ( ( b >> 4 ) & 0xF );
            var b3 = ( ( b & 0xF ) << 2 ) | ( ( c >> 6 ) & 0x3 );
            var b4 = c & 0x3F;

            if( ! b ) {
                b3 = b4 = 64;
            } else if( ! c ) {
                b4 = 64;
            }

            result += characters.charAt( b1 ) + characters.charAt( b2 ) + 
                characters.charAt( b3 ) + characters.charAt( b4 );

        } while ( i < string.length );

        return result;
    }

    this.setCredentials = function(username, password) {
        that.username = username;
        that.password = password;
    }

    this.commit = function(post) {
        that.post = post;
        that.repoPrefix = '/repos/' + that.repo;
        getApi(that.repoPrefix + '/git/refs/heads/master', null, 'getLatestCommit');
    }

    getLatestCommit = function(response) {
        that.sha_latest_commit = response.data.object.sha;
        getApi(that.repoPrefix + '/git/commits/' + that.sha_latest_commit, null,
                'getLatestTree');
    }

    getLatestTree = function(response) {
        var sha_base_tree = response.data.tree.sha;
        var postData = {
            "base_tree": sha_base_tree,
            "tree": [
                {
                    "path": that.commitPath + that.post.filename,
                    "mode": "100644",
                    "type": "blob",
                    "content": that.post.body
                }
            ]
        };

        postApi(that.repoPrefix + '/git/trees', postData, buildTree, 
                that.username, that.password);
    }

    buildTree = function(response) {
        var tree_sha = response.sha;
        var postData = {
            "tree" : tree_sha,
            "message": that.defaultMessage,
            "parents": [
                that.sha_latest_commit
            ]
        };

        postApi(that.repoPrefix + '/git/commits', postData, buildCommit,
                that.username, that.password);
    }

    buildCommit = function(response) {
        var commit_sha = response.sha;
        var postData = {
            "sha": commit_sha
        }

        postApi(that.repoPrefix + '/git/refs/heads/master', postData, commitSuccess,
                that.username, that.password);
    }

    commitSuccess = function(response) {
        alert(response.url);
    }

    getApi = function(route, data, cb){
        $.ajax({
            url: API_URL + route,
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            processData: false,
            contentType: 'json',
            data: JSON.stringify(data),
            jsonpCallback: cb
        });
    }

    postApi = function(route, data, cb, user, pw) {
        $.ajax({
            type: 'POST',
            url: API_URL + route,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',
            success: cb,
            beforeSend : function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + that.base64encode(user + ':' + pw));
            }
        });
    }
}
