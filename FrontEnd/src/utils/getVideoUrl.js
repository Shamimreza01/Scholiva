export const getYoutubeVideoUrl = (text) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = text.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};
export const getFacebookVideoUrl = (text) => {
  const fbRegExp =
    /(?:https?:\/\/)?(?:www\.|web\.|m\.)?(?:facebook\.com\/(?:video\.php\?v=\d+|watch\/?\?v=\d+|.+?\/videos\/\d+|share\/[vr]\/\w+|reels?\/\d+)|fb\.watch\/\w+)/g;
  const match = text.match(fbRegExp);
  return match ? match[0] : null;
};
