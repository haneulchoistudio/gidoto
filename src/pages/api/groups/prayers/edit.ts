import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/mongo";
import { Group, Prayer } from "~/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "PUT") {
    res.status(400).end();
    return;
  }

  const body = req.body as Prayer;

  if (!body) {
    res.status(400).end();
    return;
  }

  const prayerDocs = await db("prayers");

  await prayerDocs.updateOne({ _id: body._id }, { $set: { data: body.data } });

  res.status(200).end();
}
