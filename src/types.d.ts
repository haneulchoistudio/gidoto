import type { ObjectId } from "mongodb";

export interface UserProps {
  name: string;
  nickname: string;
  image: string;
  email: string;
  bio: string;
  groups: string[];
  subscription: "free" | "paid";

  preferred_language: "en" | "ko";
  preferred_view_profile: "public" | "hidden";
  preferred_theme: "light" | "dark";
  preferred_show_nickname: boolean;
}

export type User = {
  _id: string | ObjectId;
  data: UserProps;
  provider: string;
};

export interface GroupProps {
  name: string;
  theme: "default:default" | "adom:red" | "tsahov:yellow" | "kahol:blue";
  description: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  accounts: {
    instagram: string;
    kakaotalk: string;
  };
  address: string;

  members: string[];
  emails: string[];

  user_responsible: string;

  prayers: string[];
}

export type Group = {
  _id: string | ObjectId;
  data: GroupProps;
};

export interface PrayerProps {
  title: string;
  short: string;
  long: string;

  tags: string[];

  group_responsible: string;
  user_responsible: string;
  user_name: string;
  user_image: string;
  prayer_status: "incomplete" | "completed";
  anonymous: boolean;
}

export type Prayer = {
  _id: string | ObjectId;
  data: PrayerProps;
};
