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
    subject: `[Gidoto] ${body.name}'s member invites you to join and pray together.`,
    text: body.message,
    html: `
    <div>
        <h2 style="margin-bottom: 20px;">
            Gidoto Invitation
        </h2>
        <div style="margin-bottom: 10px;">
            <p style="margin-bottom:3.5px;">
                <strong>From</strong> ${body.name}'s member
            </p>
            <p>
                <strong>To</strong> You (${body.email})
            </p>
        </div>
        <p style="margin-bottom: 30px; font-size: 17px;">
            <strong><u>TO ACCEPT OR DECLINE,</u></strong> visit the link <a href="${inviteLink}" target="_blank">here</a>.
        </p>
        <p style="font-family: monospace; font-size: 13.5px; color: #666;">
            This mail was delivered via the origin site of <a href="http://localhost:3000" target="_blank">Gidoto team</a>.
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
