import type { NextApiRequest, NextApiResponse } from "next";
import type { Group, User } from "~/types";
import { db } from "~/server/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "PUT") {
    res.status(400).end();
    return;
  }

  const body = req.body as { _id: string; user: User };

  if (!body) {
    res.status(400).end();
    return;
  }

  const groupDocs = await db("groups");

  const group = (await groupDocs.findOne({ _id: body._id })) as Group;

  await groupDocs.updateOne(
    { _id: body._id },
    {
      $set: {
        data: {
          ...group.data,
          emails: group.data.emails.filter(
            (each) => each !== body.user.data.email
          ),
          members:
            group.data.members.length >= 1
              ? ([body.user._id, ...group.data.members] as string[])
              : ([body.user._id] as string[]),
        },
      },
    }
  );

  const usersDocs = await db("users");

  await usersDocs.updateOne(
    { _id: body.user._id },
    {
      $set: {
        data: {
          ...body.user.data,
          groups:
            body.user.data.groups.length >= 1
              ? [body._id, ...body.user.data.groups]
              : [body._id],
        },
      },
    }
  );

  res.status(200).end();
}
