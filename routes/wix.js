var express = require("express");
var router = express.Router();
const config = require("../wix/config");
const credentials = require("../wix/credentials");

const APP_ID = config.APP_ID;
const APP_SECRET = credentials.APP_SECRET;
const PUBLIC_KEY = config.PUBLIC_KEY;
const AUTH_PROVIDER_BASE_URL = "https://www.wix.com/oauth";
const INSTANCE_API_URL = "https://dev.wix.com/api/v1";

const incomingWebhooks = [];

function getTokensFromWix(authCode) {
  return axios
    .post(`${AUTH_PROVIDER_BASE_URL}/access`, {
      code: authCode,
      client_secret: APP_SECRET,
      client_id: APP_ID,
      grant_type: "authorization_code",
    })
    .then((resp) => resp.data);
}

function getAccessToken(refreshToken) {
  return axios
    .post(`${AUTH_PROVIDER_BASE_URL}/access`, {
      refresh_token: refreshToken,
      client_secret: APP_SECRET,
      client_id: APP_ID,
      grant_type: "refresh_token",
    })
    .then((resp) => resp.data);
}

router.post("/webhook-callback", (req, res) => {
  console.log("got webhook event from Wix!", req.body);
  console.log("===========================");
  const data = jwt.verify(req.body, PUBLIC_KEY);
  const parsedData = JSON.parse(data.data);
  const prettyData = {
    ...data,
    data: { ...parsedData, data: JSON.parse(parsedData.data) },
  };
  console.log("webhook event data after verification:", prettyData);
  incomingWebhooks.push({ body: prettyData, headers: req.headers });
  res.send(req.body);
});

router.get("/signup", (req, res) => {
  // This route  is called before the user is asked to provide consent
  // Configure the `Redirect URL` in  Wix Developers to point here
  // *** PUT YOUR SIGNUP CODE HERE *** ///
  console.log("got a call from Wix for signup");
  console.log("==============================");

  const permissionRequestUrl =
    "https://www.wix.com/app-oauth-installation/consent";
  const appId = APP_ID;
  const redirectUrl = `https://${req.get("host")}/login`;
  const token = req.query.token;
  var url = `${permissionRequestUrl}?token=${token}&appId=${appId}&redirectUrl=${redirectUrl}`;

  console.log("redirecting to " + url);
  console.log("=============================");
  res.redirect(url);
});

router.get("/login", async (req, res) => {
  // This route  is called once the user finished installing your application and Wix redirects them to your application's site (here).
  // Configure the `App URL` in the Wix Developers to point here
  // *** PUT YOUR LOGIN CODE HERE *** ///
  console.log("got a call from Wix for login");
  console.log("=============================");

  const authorizationCode = req.query.code;

  console.log("authorizationCode = " + authorizationCode);

  let refreshToken, accessToken;
  try {
    console.log("getting Tokens From Wix ");
    console.log("=======================");
    const data = await getTokensFromWix(authorizationCode);

    refreshToken = data.refresh_token;
    accessToken = data.access_token;

    console.log("refreshToken = " + refreshToken);
    console.log("accessToken = " + accessToken);
    console.log("=============================");

    instance = await getAppInstance(refreshToken);

    console.log("api call to instance returned: ");
    console.log(instance);

    // TODO: Save the instanceId and tokens for future API calls
    console.log("=============================");
    console.log(`User's site instanceId: ${instance.instance.instanceId}`);
    console.log("=============================");

    // need to post https://www.wix.com/app-oauth-installation/token-received to notif wix that we finished getting the token

    res.render("login", {
      title: "Wix Application",
      app_id: APP_ID,
      site_display_name: instance.site.siteDisplayName,
      instance_id: instance.instance.instanceId,
      permissions: instance.instance.permissions,
      token: refreshToken,
      response: JSON.stringify(instance, null, "\t"),
    });
  } catch (wixError) {
    console.log("Error getting token from Wix");
    console.log({ wixError });
    res.status(500);
    return;
  }
});

// router.get("/webhooks", async (req, res) => {
//   res.render("webhooks", {
//     title: "Wix Application",
//     app_id: APP_ID,
//     webhooks: JSON.stringify(incomingWebhooks, null, 2),
//   });
// });

// this is sample call to Wix instance API - you can find it here: https://dev.wix.com/api/app-management.app-instance.html#get-app-instance
async function getAppInstance(refreshToken) {
  try {
    console.log("getAppInstance with refreshToken = " + refreshToken);
    console.log("==============================");
    const { access_token } = await getAccessToken(refreshToken);
    console.log("accessToken = " + access_token);

    const body = {
      // *** PUT YOUR PARAMS HERE ***
      //query: {limit: 10},
    };
    const options = {
      headers: {
        authorization: access_token,
      },
    };
    const appInstance = axios.create({
      baseURL: INSTANCE_API_URL,
      headers: { authorization: access_token },
    });
    const instance = (await appInstance.get("instance", body)).data;

    return instance;
  } catch (e) {
    console.log("error in getAppInstance");
    console.log({ e });
    return;
  }
}

module.exports = router;
