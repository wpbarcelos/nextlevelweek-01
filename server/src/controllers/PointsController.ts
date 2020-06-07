import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("points.uf", String(uf))
      .where("points.city", String(city))
      .distinct()
      .select("points.*");

    if (!points) {
      return response.status(400).json({ message: "Points not found." });
    }

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://192.168.0.9:3333/uploads/${point.image}`,
      };
    });

    return response.json(serializedPoints);
  }
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    const [point_id] = await trx("points").insert(point);

    const point_items = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => ({ point_id, item_id }));

    await trx("point_items").insert(point_items);

    await trx.commit();

    return response.json({ id: point_id, ...point });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await knex("points")
      .where("id", id)
      .first();

    if (!point) {
      return response.status(400).json({ message: "Point not found" });
    }

    const items = await knex("items")
      .join("point_items", "point_items.item_id", "=", "items.id")
      .where("point_items.point_id", point.id)
      .select("items.*");

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.0.9:3333/uploads/${point.image}`,
    };

    return response.json({ point: serializedPoint, items });
  }
}

export default PointsController;
