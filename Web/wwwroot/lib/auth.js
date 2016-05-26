var config = {
    authority: "http://docker/",
    client_id: "js_oidc",
    redirect_uri: window.location.protocol + "//" + window.location.host + "/index.html",
    post_logout_redirect_uri: window.location.protocol + "//" + window.location.host + "/index.html",
    // these two will be done dynamically from the buttons clicked, but are
    // needed if you want to use the silent_renew
    response_type: "id_token token",
    scope: "openid profile email api1 api2",
    // this will toggle if profile endpoint is used
    load_user_profile: true,
    // silent renew will get a new access_token via an iframe 
    // just prior to the old access_token expiring (60 seconds prior)
    silent_redirect_uri: window.location.protocol + "//" + window.location.host + "/silent_renew.html",
    silent_renew: false,
    // this will allow all the OIDC protocol claims to be visible in the window. normally a client app 
    // wouldn't care about them or want them taking up space
    filter_protocol_claims: false
};
var mgr = new OidcTokenManager(config);
mgr.addOnTokenObtained(function () {
    console.log("token obtained");
});
mgr.addOnTokenRemoved(function () {
    display("#response", { message: "Logged Out" });
    showTokens();
});
function display(selector, data) {
    if (data && typeof data === 'string') {
        data = JSON.parse(data);
    }
    if (data) {
        data = JSON.stringify(data, null, 2);
    }
    document.querySelector(selector).textContent = data;
}
function showTokens() {
    display("#id-token", mgr.profile || "");
    display("#access-token", mgr.access_token && { access_token: mgr.access_token, expires_in: mgr.expires_in } || "");
    checkSessionState();
}
showTokens();
function handleCallback() {
    mgr.processTokenCallbackAsync().then(function () {
        var hash = window.location.hash.substr(1);
        var result = hash.split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});
        display("#response", result);
        showTokens();
    }, function (error) {
        display("#response", error.message && { error: error.message } || error);
    });
}
function authorize(scope, response_type) {
    config.scope = scope;
    config.response_type = response_type;
    mgr.redirectForToken();
}
function logout() {
    mgr.redirectForLogout();
}
function callApi() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
        if (xhr.status >= 400) {
            display("#ajax-result", {
                status: xhr.status,
                statusText: xhr.statusText,
                wwwAuthenticate: xhr.getResponseHeader("WWW-Authenticate")
            });
        }
        else {
            display("#ajax-result", xhr.response);
        }
    };
    xhr.onerror = function () {
        if (xhr.status === 401) {
            mgr.removeToken();
            showTokens();
        }
        display("#ajax-result", {
            status: xhr.status,
            statusText: xhr.statusText,
            wwwAuthenticate: xhr.getResponseHeader("WWW-Authenticate")
        });
    };
    xhr.open("GET", "http://localhost:3721/identity", true);
    xhr.setRequestHeader("Authorization", "Bearer " + mgr.access_token);
    xhr.send();
}
if (window.location.hash) {
    handleCallback();
}
[].forEach.call(document.querySelectorAll(".request"), function (button) {
    button.addEventListener("click", function () {
        authorize(this.dataset["scope"], this.dataset["type"]);
    });
});
document.querySelector(".call").addEventListener("click", callApi, false);
document.querySelector(".logout").addEventListener("click", logout, false);
function checkSessionState() {
    mgr.oidcClient.loadMetadataAsync().then(function (meta) {
        if (meta.check_session_iframe && mgr.session_state) {
            document.getElementById("rp").src = "check_session.html#" +
                "session_state=" + mgr.session_state +
                "&check_session_iframe=" + meta.check_session_iframe +
                "&client_id=" + config.client_id
                ;
        }
        else {
            document.getElementById("rp").src = "about:blank";
        }
    });
}
window.onmessage = function (e) {
    if (e.origin === window.location.protocol + "//" + window.location.host && e.data === "changed") {
        mgr.removeToken();
        //config.scope = "openid";
        //config.response_type = "id_token";
        //mgr.renewTokenSilentAsync().then(function () {
        //    console.log("renewTokenSilentAsync success");
        //}, function () {
        //    console.log("renewTokenSilentAsync failed");
        //});
    }
}