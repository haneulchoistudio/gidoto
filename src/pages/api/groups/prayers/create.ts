import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/mongo";
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

  res.status(200).json({ _id_prayer: insertedId as string });
}
