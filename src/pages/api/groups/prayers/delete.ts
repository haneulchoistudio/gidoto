import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/mongo";
import { Group, Prayer, User } from "~/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "DELETE") {
    res.status(400).end();
    return;
  }

  const body = req.body as Prayer;

  if (!body) {
    res.status(400).end();
    return;
  }

  // 1. remove prayers id from the group prayers
  // 2. delete prayer doc

  const prayerDocs = await db("prayers");
  const groupDocs = await db("groups");
  const group = (await groupDocs.findOne({
    _id: body.data.group_responsible,
  })) as Group;

  await groupDocs.updateOne(
    { _id: group._id },
    {
      $set: {
        data: {
          ...group.data,
          prayers: group.data.prayers.filter((each) => each !== body._id),
        },
      },
    }
  );

  await prayerDocs.deleteOne({ _id: body._id });

  res.status(200).end();
}
