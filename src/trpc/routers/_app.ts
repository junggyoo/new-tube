import { studioRouter } from "@/modules/studio/server/prodedures";
import { videosRouter } from "@/modules/videos/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
	studio: studioRouter,
	videos: videosRouter,
	categories: categoriesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
