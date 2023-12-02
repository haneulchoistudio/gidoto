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

  const body = req.body as { _id: string; email: string };

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
          emails: group.data.emails.filter((each) => each !== body.email),
        },
      },
    }
  );

  res.status(200).end();
}
