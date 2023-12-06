import type { NextApiRequest, NextApiResponse } from "next";
import type { Group, User } from "~/types";
import { db } from "~/server/mongo";
import { getEmailUser, sendEmail } from "~/server/nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "PUT") {
    res.status(400).end();
    return;
  }

  const body = req.body as {
    _id: string;
    email: string;
    name: string;
    message: string;
    lang: "en" | "ko";
  };

  if (!body) {
    res.status(400).end();
    return;
  }

  const groupDocs = await db("groups");

  const group = (await groupDocs.findOne({ _id: body._id })) as Group;

  const inviteLink = [req.headers.origin, `groups`, body._id].join("/");

  const sent = await sendEmail({
    from: getEmailUser(),
    replyTo: getEmailUser(),
    to: body.email,
    subject:
      body.lang === "en"
        ? `[Onus] ${body.name}'s member invites you to join and pray together.`
        : `[온어스] ${group.data.name}에서 당신을 초대합니다.`,
    text: body.message,
    html: `
    <div>
        <h2 style="margin-bottom: 20px;">
            ${
              body.lang === "en"
                ? "Ounus' Group Invitation"
                : "온어스의 그룹 초대장"
            }
        </h2>
        <div style="margin-bottom: 10px;">
            <p style="margin-bottom:3.5px;">
               ${
                 body.lang === "en"
                   ? `<strong>From</strong> ${body.name}'s member`
                   : `<strong>보낸이</strong> ${body.name} 멤버`
               }
            </p>
            <p>
                ${
                  body.lang === "en"
                    ? `<strong>To</strong> You (${body.email})`
                    : `<strong>받는이</strong> 당신 (${body.email})`
                }
            </p>
        </div>
        <p style="margin-bottom: 30px; font-size: 17px;">
            ${
              body.lang === "en"
                ? `<strong><u>TO ACCEPT OR DECLINE,</u></strong> visit the link <a href="${inviteLink}" target="_blank">here</a>.`
                : `<strong><u>초대장을 수락 또는 거절 하시려면,</u></strong> 링크를 따라 방문해주세요 <a href="${inviteLink}" target="_blank">여기</a>.`
            }
        </p>
        <p style="font-family: monospace; font-size: 13.5px; color: #666;">
        ${
          body.lang === "en"
            ? `This mail was delivered via the origin site of <a href="${req.headers.origin}" target="_blank">Onus team</a>.`
            : `이 메일은 공식 사이트 <a href="${req.headers.origin}" target="_blank">온어스 팀</a> 으로부터 발송되었습니다 `
        }
    </p>
    </div>
    `,
    attachments: [],
  });

  if (!sent) {
    res.status(500).end();
    return;
  }

  await groupDocs.updateOne(
    { _id: body._id },
    {
      $set: {
        data: {
          ...group.data,
          emails:
            group.data.emails.length >= 1
              ? [body.email, ...group.data.emails]
              : [body.email],
        },
      },
    }
  );

  res.status(200).end();
}
