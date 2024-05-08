export const useGetMe = () => ({
  id: "6544be2bf17aa96df1673fef",
  first_name: "Saurabh",
  last_name: "Singh",
  email: "sdf@sdf.sdf",
  emailVerified: null,
  image:
    "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/photo-1570294646112-27ce4f174e38.jpg",
  createdAt: null,
  updatedAt: null,
});

export const useGetUserProviders = () => [
  {
    id: "6603d62d2e9b415968bf64bb",
    userId: "6544be2bf17aa96df1673fef",
    type: "oauth",
    name: "Saurabh Singh",
    image:
      "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3355352478092592&height=50&width=50&ext=1714119467&hash=AfpefBokGrFsK78xPYaKAa9m5v0Vo54kOYwOi1ZYIXJvaQ",
    provider: "facebook",
    emailVerified: null,
    email: null,
    providerAccountId: "3355352478092592",
    refresh_token: null,
    access_token:
      "EAAJKrtHx2ZB8BOZCx7ReiHZBxWFaxvrN3qnlhySqr3i02EzNC2grSANHUrsrEw0oUdoTopZCRn3sCJqkkCewXgfc06WhwGap2jrFfGE3NJFLuAKez6wfagEQaICZCV0pxXu9ZCoqXNZC4VjvlMjF1Xm0vCFgJApQCfZCYEuV1kcSBfspVHElWQeZAoP2ZA",
    expires_at: 1719303466,
    token_type: "bearer",
    scope:
      "email,read_insights,pages_show_list,ads_management,business_management,instagram_basic,instagram_manage_insights,instagram_content_publish,leads_retrieval,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_ads,pages_manage_posts,pages_manage_engagement,public_profile",
    id_token: null,
    session_state: null,
    createdAt: "2024-05-04T07:30:52.284Z",
    updatedAt: "2024-05-04T07:30:52.284Z",
  },
];

export const useSession = () => ({
  user: {
    first_name: "Saurabh",
    last_name: "Singh",
    email: "sdf@sdf.sdf",
    id: "6544be2bf17aa96df1673fef",
    token: {
      sub: "6544be2bf17aa96df1673fef",
      iat: 1714807852,
      exp: 1717399852,
      email: "sdf@sdf.sdf",
      picture:
        "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/photo-1570294646112-27ce4f174e38.jpg",
      type: "ACCESS",
      accessToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTQ0YmUyYmYxN2FhOTZkZjE2NzNmZWYiLCJpYXQiOjE3MTQ4MDc4NTIsImV4cCI6MTcxNzM5OTg1MiwiZW1haWwiOiJzZGZAc2RmLnNkZiIsInBpY3R1cmUiOiJodHRwczovL3Nycy1iaWxsaW5nLXN0b3JhZ2UuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL3Bob3RvLTE1NzAyOTQ2NDYxMTItMjdjZTRmMTc0ZTM4LmpwZyIsInR5cGUiOiJBQ0NFU1MifQ.CXqXF4ZUKi4fpq3Wo6cqYJbblxJKAuAOQU_x14-6f3U",
    },
  },
  expires: "2024-06-03T07:30:52.503Z",
});
