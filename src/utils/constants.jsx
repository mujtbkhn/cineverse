import IMG from "../../images/cineverse.png";
import SEARCH from "../../images/search.svg";

export const LOGO = IMG ;
export const search_img = SEARCH ;

export const BACKGROUND =
  "https://assets.nflxext.com/ffe/siteui/vlv3/c38a2d52-138e-48a3-ab68-36787ece46b3/eeb03fc9-99c6-438e-824d-32917ce55783/IN-en-20240101-popsignuptwoweeks-perspective_alpha_website_medium.jpg";

export const USER_AVATAR =
  "https://i.pravatar.cc/300";

export const OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
  },
};

export const IMG_CDN = "https://image.tmdb.org/t/p/w300";

export const SUPPORTED_LANGUAGES = [
  { identifier: "en", name: "English" },
  { identifier: "hindi", name: "Hindi" },
  { identifier: "arabic", name: "Arabic" },
];

export const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;
