import {
  IFacebookPost,
  IFacebookPostDetailsResponse,
  IFacebookPostInsight,
} from "@/interfaces/ISocial";
import moment from "moment";

export class FacebookPost {
  //   private readonly _details: IFacebookPost;
  //   private readonly _insights: IFacebookPostInsight[];

  //   constructor(facebookPostObj: IFacebookPostDetailsResponse) {
  //     this._details = facebookPostObj.details;
  //     this._insights = facebookPostObj.insights;
  //   }

  //   getFullPicture() {
  //     return this._details.full_picture;
  //   }

  static getInsights(facebookPostObj: IFacebookPostDetailsResponse) {
    return {
      basic: {
        likes: facebookPostObj.details.likes?.data.length ?? 0,
        comments: facebookPostObj.details.comments?.data.length ?? 0,
        shares: facebookPostObj.details.shares?.count ?? 0,
        full_picture: facebookPostObj.details.full_picture,
        created_at: moment(facebookPostObj.details.created_time).format(
          "DD/MM/YYYY, hh:mma"
        ),
      },
      insights: FacebookPost.transformInsights(facebookPostObj.insights),
    };
  }

  private static transformInsights(insights: IFacebookPostInsight[]) {
    return insights.map((insight) => {
      return {
        key: insight.name,
        name: insight.title,
        value: insight.values[0].value,
      };
    });
  }
}
