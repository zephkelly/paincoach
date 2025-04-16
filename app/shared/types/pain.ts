import  * as z from "zod";
import { PainLevelSchema } from "~~/shared/schemas/pain";



export type PainLevel = z.infer<typeof PainLevelSchema>;