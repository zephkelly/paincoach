import * as z from "zod";



export const RecordTypeSchema = z.union([
    z.literal("pain"),
]);