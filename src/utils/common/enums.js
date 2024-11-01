const roles = {
  ADMIN: "admin",
  USER: "user",
};

const themePreference = {
  LIGHT: "light",
  DARK: "dark",
};

const friendRequestStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

const activityTypes = {
  USER_CREATED: "user_created",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  FRIEND_REQUEST_CREATED: "friend_request_created",
  FRIEND_ACCEPTED: "friend_accepted",
  FRIEND_REJECTED: "friend_rejected",
  MESSAGE: "message",
  USER_UPDATED_PROFILE: "user_updated_profile",
};

module.exports = { roles, themePreference, friendRequestStatus, activityTypes };
