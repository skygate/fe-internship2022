import { Request, Response } from "express";
import actions from "../models/actions";

export const getAllActions = async (req: Request, res: Response) => {
    try {
        const actionsWithInfo = await actions.find().populate([
            {
                path: "profileID",
                select: "profilePicture profileName",
                strictPopulate: false,
            },
            {
                path: "objectID",
                select: "profileID productID startDate endDate profileName profilePicture likes",
                strictPopulate: false,
                populate: {
                    path: "productID",
                    select: "productName productImageUrl ownerID",
                    model: "Products",
                    strictPopulate: false,
                },
            },
        ]);

        const flatActions = actionsWithInfo.map((action) => {
            if (action.verb === "addBid") {
                return {
                    message: `You placed a ${action.offer}$ bid!`,
                    title: "Bid placed",
                    imageURL: action.objectID.productID.productImageUrl,
                    date: action.date,
                    linkTo: `auction/${action.objectID._id}`,
                };
            }
            if (action.verb === "receiveBid") {
                return {
                    message: `${action.objectID.productID.productName} has new ${action.offer}$ bid!`,
                    title: "New bid!",
                    imageURL: action.objectID.productID.productImageUrl,
                    date: action.date,
                    linkTo: `auction/${action.objectID._id}`,
                };
            }

            if (action.verb === "like") {
                return {
                    message: `${action.objectID.productID.productName} was liked!`,
                    title: "New like!",
                    imageURL: action.objectID.productID.productImageUrl,
                    date: action.date,
                    linkTo: `auction/${action.objectID._id}`,
                };
            }

            if (action.verb === "receivedFollow") {
                return {
                    message: `${action.objectID.profileName} is now following you!`,
                    title: "New follower!",
                    imageURL: action.objectID.profilePicture,
                    date: action.date,
                    linkTo: `profile/${action.objectID._id}`,
                };
            }

            if (action.verb === "startAuction") {
                return {
                    message: `${action.objectID.productID.productName} is now on sale!`,
                    title: "New auction started!",
                    imageURL: action.objectID.productID.productImageUrl,
                    date: action.date,
                    linkTo: `auction/${action.objectID._id}`,
                };
            }

            if (action.verb === "sold") {
                return {
                    message: `${action.objectID.productID.productName} was sold for ${action.offer}$`,
                    title: "Item sold!",
                    imageURL: action.objectID.productID.productImageUrl,
                    date: action.date,
                    linkTo: `profiles/${action.objectID.productID.ownerID}`,
                };
            }

            if (action.verb === "purchased") {
                return {
                    message: `${action.objectID.productID.productName} was purchased for ${action.offer}$`,
                    title: "Item purchased!",
                    imageURL: action.objectID.productID.productImageUrl,
                    date: action.date,
                    linkTo: `profiles/${action.objectID.productID.ownerID}`,
                };
            }
        });
        res.status(200).json(flatActions);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
