var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var oauth_1 = require("../oauth");
var utility_1 = require("../utility");
var PROVIDER_NAME = "Imgur";
var Imgur = (function (_super) {
    __extends(Imgur, _super);
    function Imgur(options) {
        if (options === void 0) { options = {}; }
        _super.call(this);
        if (!options.clientId || options.clientId == "") {
            throw Error("A " + PROVIDER_NAME + " client id must exist");
        }
        this.imgurOptions = options;
        this.imgurOptions.redirectUri = options.hasOwnProperty("redirectUri") ? options.redirectUri : "http://localhost/callback";
        this.flowUrl = "https://api.imgur.com/oauth2/authorize?client_id=" + this.imgurOptions.clientId + "&redirect_uri=" + this.imgurOptions.redirectUri + "&response_type=token";
    }
    Imgur.prototype.login = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (window.cordova) {
                if (window.cordova.InAppBrowser) {
                    var browserRef = window.cordova.InAppBrowser.open(_this.flowUrl, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
                    browserRef.addEventListener("loadstart", function (event) {
                        if ((event.url).indexOf(_this.imgurOptions.redirectUri) === 0) {
                            browserRef.removeEventListener("exit", function (event) { });
                            browserRef.close();
                            var parsedResponse = (new utility_1.OauthUtility()).parseImplicitResponse(((event.url).split("#")[1]).split("&"));
                            if (parsedResponse) {
                                resolve(parsedResponse);
                            }
                            else {
                                reject("Problem authenticating with " + PROVIDER_NAME);
                            }
                        }
                    });
                    browserRef.addEventListener("exit", function (event) {
                        reject("The " + PROVIDER_NAME + " sign in flow was canceled");
                    });
                }
                else {
                    reject("The Apache Cordova InAppBrowser plugin was not found and is required");
                }
            }
            else {
                reject("Cannot authenticate with " + PROVIDER_NAME + " via a web browser");
            }
        });
    };
    return Imgur;
})(oauth_1.OauthProvider);
exports.Imgur = Imgur;