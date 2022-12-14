import type { HydratedDocument, Types } from 'mongoose';
import type { Request } from './model';
import RequestModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Request> is the output of the RequestModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class RequestCollection {
  /**
   * Add a Request to the collection
   *
   * @param {string} author - The author of the Request
   * @param {string} contact - The phone/email of the author
   * @param {string} description - The description of the request
   * @return {Promise<HydratedDocument<Request>>} - The newly created Request
   */
  static async addOne(requestDetails: { author: string, contact: string, description: string, color: string, size: string }): Promise<HydratedDocument<Request>> {
    const date = new Date();
    const { author, contact, description, color, size } = requestDetails;
    const request = new RequestModel({
      author,
      contact: contact,
      description: description,
      dateCreated: date,
      color: color,
      size: size,
      images: []
    });
    await request.save(); // Saves freet to MongoDB
    return request.populate('author'); //TODO: SHOULD I CHANGE THIS TO AUTHOR?
  }

  /**
   * Find a request by requestId
   *
   * @param {string} requestId - The id of the request to find
   * @return {Promise<HydratedDocument<Request>> | Promise<null> } - The request with the given requestId, if any
   */
  static async findOne(requestId: Types.ObjectId | string): Promise<HydratedDocument<Request>> {
    return RequestModel.findOne({ _id: requestId }).populate('author');
  }

  /**
   * Get all the requests in the database
   *
   * @return {Promise<HydratedDocument<Request>[]>} - An array of all of the requests
   */
  static async findAll(): Promise<Array<HydratedDocument<Request>>> {
    // Retrieves Requests and sorts them from most to least recent
    return RequestModel.find({}).sort({ dateCreated: -1 }).populate('author');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Request>>> {
    const author = await UserCollection.findOneByUsername(username);
    return RequestModel.find({ author: author._id }).sort({ dateCreated: -1 }).populate('author');
  }

  /**
   * Get all the requests in a given color
   *
   * @param {string} color - The color of the items
   * @return {Promise<HydratedDocument<Request>[]>} - An array of all of the requests with the specified color
   */
  static async findAllByColor(color: string): Promise<Array<HydratedDocument<Request>>> {
    return RequestModel.find({ color: color }).sort({ dateCreated: -1 }).populate('author');
  }

  /**
   * Get all the requests in a given size
   *
   * @param {string} size - The color of the items
   * @return {Promise<HydratedDocument<Request>[]>} - An array of all of the requests with the specified color
   */
  static async findAllBySize(size: string): Promise<Array<HydratedDocument<Request>>> {
    return RequestModel.find({ size: size }).sort({ dateCreated: -1 }).populate('author');
  }

  /**
   * Get all the requests in a given size
   *
   * @param {string} size - The color of the items
   * @return {Promise<HydratedDocument<Request>[]>} - An array of all of the requests with the specified color
   */
   static async findAllBySizeAndColor(size: string, color: string): Promise<Array<HydratedDocument<Request>>> {
    return RequestModel.find({ $and: [{size: size}, {color: color}]}).sort({ dateCreated: -1 }).populate('author');
  }
  
  /**
   * Get all the requests in a given size
   *
   * @param {string} size - The color of the items
   * @return {Promise<HydratedDocument<Request>[]>} - An array of all of the requests with the specified color
   */
  static async findAllBySizeAndUser(username: string, size: string): Promise<Array<HydratedDocument<Request>>> {
    const author = await UserCollection.findOneByUsername(username);
    return RequestModel.find({ $and: [{size: size}, {author: author._id}]}).sort({ dateCreated: -1 }).populate('author');
  }

  /**
   * Get all the requests in a given size
   *
   * @param {string} size - The color of the items
   * @return {Promise<HydratedDocument<Request>[]>} - An array of all of the requests with the specified color
   */
  static async findAllByColorAndUser(username: string, color: string): Promise<Array<HydratedDocument<Request>>> {
    const author = await UserCollection.findOneByUsername(username);
    return RequestModel.find({ $and: [{color: color}, {author: author._id}]}).sort({ dateCreated: -1 }).populate('author');
  }

  /**
   * Get all the requests in a given size
   *
   * @param {string} size - The color of the items
   * @return {Promise<HydratedDocument<Request>[]>} - An array of all of the requests with the specified color
   */
  static async findAllByAll(username: string, size: string, color: string): Promise<Array<HydratedDocument<Request>>> {
    const author = await UserCollection.findOneByUsername(username);
    return RequestModel.find({ $and: [{size: size}, {color: color}, {author: author._id}]}).sort({ dateCreated: -1 }).populate('author');
  }

  /** //TODO: UPDATE THIS
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(requestId: Types.ObjectId | string, description: string): Promise<HydratedDocument<Request>> {
    const request = await RequestModel.findOne({ _id: requestId });
    request.description = description;
    await request.save();
    return request.populate('author');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(requestId: Types.ObjectId | string): Promise<boolean> {
    const Request = await RequestModel.deleteOne({ _id: requestId });
    return Request !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await RequestModel.deleteMany({ authorId });
  }

  static async getImages(requestId: Types.ObjectId | string): Promise<Array<string>> {
    return (await RequestModel.findOne({ _id: requestId })).images;
  }

  static async saveImage(requestId: Types.ObjectId | string, imageURL: string): Promise<Boolean> {
    const event = await RequestModel.findOne({ _id: requestId });
    event.images.push(imageURL);
    await event.save();
    return event.populate('coordinatorId');
  }
}

export default RequestCollection;
