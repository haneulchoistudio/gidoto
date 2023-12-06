import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/mongo";
import { getEmailUser, sendEmail } from "~/server/nodemailer";
import { Group, GroupProps, PrayerProps, User } from "~/types";

type ReturnJson = {
  _id_prayer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnJson>
) {
  const method = req.method;

  if (method !== "POST") {
    res.status(400).end();
    return;
  }

  const body = req.body as PrayerProps;

  if (!body) {
    res.status(400).end();
    return;
  }

  const prayerDocs = await db("prayers");
  const { insertedId } = await prayerDocs.insertOne({
    _id: new ObjectId().toString(),
    data: body,
  });

  const groupDocs = await db("groups");

  const group = (await groupDocs.findOne({
    _id: body.group_responsible,
  })) as Group;

  await groupDocs.updateOne(
    { _id: body.group_responsible },
    {
      $set: {
        data: {
          ...group.data,
          prayers:
            group.data.prayers.length >= 1
              ? ([insertedId, ...group.data.prayers] as string[])
              : ([insertedId] as string[]),
        },
      },
    }
  );

  if (group.data.members.length >= 1) {
    const inviteLink = [
      req.headers.origin,
      `groups`,
      group._id,
      "prayers",
      insertedId,
    ].join("/");

    let members: (string | User)[] = [
      ...group.data.members,
      group.data.user_responsible,
    ];

    const userDocs = await db("users");

    members = (await Promise.all(
      members.map(async (member_id) => {
        const member = (await userDocs.findOne({ _id: member_id })) as User;

        await sendEmail({
          from: getEmailUser(),
          replyTo: getEmailUser(),
          to: member.data.email,
          subject: [
            member.data.preferred_language === "en" ? `[Onus]` : `[온어스]`,
            member.data.preferred_language === "en"
              ? `New prayer has been shared`
              : `나의 그룹 ${group.data.name}에`,
            member.data.preferred_language === "en"
              ? `in your group ${group.data.name},`
              : `새로운 기도제목이 공유되었습니다.`,
          ].join(" "),
          text:
            member.data.preferred_language === "en"
              ? "Let's pray together for this new prayer!"
              : "새 기도제목을 위해 같이 기도해봐요!",
          html: `
          <div>
              <h2 style="margin-bottom: 20px;">
                  ${
                    member.data.preferred_language === "en"
                      ? "Group Prayer Notification from Onus"
                      : "온어스의 새로운 기도제목 공유 알림"
                  }
              </h2>
              <div style="margin-bottom: 10px;">
                  <p>
                     ${
                       member.data.preferred_language === "en"
                         ? `One of your group members from ${group.data.name} shared a new prayer.`
                         : `당신의 그룹 ${group.data.name} 멤버 중 한명이 기도제목을 공유했습니다.`
                     }
                  </p>
              </div>
              <p style="margin-bottom: 30px; font-size: 17px;">
                  ${
                    member.data.preferred_language === "en"
                      ? `<strong><u>TO VIEW THIS PRAYER,</u></strong> visit the link <a href="${inviteLink}" target="_blank">here</a>.`
                      : `<strong><u>공유된 기도제목을 보시려면,</u></strong> 링크를 따라 방문해주세요 <a href="${inviteLink}" target="_blank">여기</a>.`
                  }
              </p>
              <p style="font-family: monospace; font-size: 13.5px; color: #666;">
                  ${
                    member.data.preferred_language === "en"
                      ? `This mail was delivered via the origin site of <a href="${req.headers.origin}" target="_blank">Onus team</a>.`
                      : `이 메일은 공식 사이트 <a href="${req.headers.origin}" target="_blank">온어스 팀</a> 으로부터 발송되었습니다 `
                  }
              </p>
          </div>
          `,
          attachments: [],
        });

        return member;
      })
    )) as User[];
  }

  res.status(200).json({ _id_prayer: insertedId as string });
}
