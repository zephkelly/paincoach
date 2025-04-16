import * as z from "zod";



export const PainLevelSchema = z.number().min(0).max(10).nullable();