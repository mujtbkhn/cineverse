export const LOGO =
  "https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png";

export const BACKGROUND =
  "https://assets.nflxext.com/ffe/siteui/vlv3/c38a2d52-138e-48a3-ab68-36787ece46b3/eeb03fc9-99c6-438e-824d-32917ce55783/IN-en-20240101-popsignuptwoweeks-perspective_alpha_website_medium.jpg";

export const USER_AVATAR =
  "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Fnetflix-profile-pictures-5yup5hd2i60x7ew3.jpg&tbnid=raoZ8oJIDTA6IM&vet=12ahUKEwiote-Tr_qDAxV-iGMGHZxIC7UQMygBegQIARB2..i&imgrefurl=https%3A%2F%2Fwallpapers.com%2Fnetflix-profile-pictures&docid=mP1fs-f48JPRJM&w=1000&h=1000&q=netflix%20user%20image&ved=2ahUKEwiote-Tr_qDAxV-iGMGHZxIC7UQMygBegQIARB2";

export const OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer " + process.env.REACT_APP_TMDB_KEY,
  },
};

export const IMG_CDN = "https://image.tmdb.org/t/p/w300";

export const SUPPORTED_LANGUAGES = [
  { identifier: "en", name: "English" },
  { identifier: "hindi", name: "Hindi" },
  { identifier: "arabic", name: "Arabic" },
];

export const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;
