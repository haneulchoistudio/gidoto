import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/mongo";
import { Group } from "~/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "PUT") {
    res.status(400).end();
    return;
  }

  const body = req.body as Group;

  if (!body) {
    res.status(400).end();
    return;
  }

  const groupDocs = await db("groups");

  await groupDocs.updateOne({ _id: body._id }, { $set: { data: body.data } });

  res.status(200).end();
}
