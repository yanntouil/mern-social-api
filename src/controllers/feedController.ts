import { Request, Response } from 'express'
import { RequestError } from '../errors'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId





/**
 * Feed Controller
 */
export default {
    /**
     * index
     */
    index : async (req: Request, res: Response) => {
        //
    },
    /**
     * Create
     */
    create : async (req: Request, res: Response) => {
        const { session } = res.locals
    },
    /**
     * Read
     */
    read : async (req: Request, res: Response) => {
        //
    },
    /**
     * Update
     */
    update : async (req: Request, res: Response) => {
        const { session } = res.locals
    },
    /**
     * Delete
     */
    delete : async (req: Request, res: Response) => {
        const { session } = res.locals
    },
}