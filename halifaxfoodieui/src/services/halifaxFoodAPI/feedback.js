const HALIFAXFOODIE_API_URL = "https://sentimentapi-5o6mak5rpa-ue.a.run.app";
export default {
  fetchReviewsAnalysis: () => {
    return {
      url: `${HALIFAXFOODIE_API_URL}/aws_fetch`,
      method: "get",
    };
  },
};
