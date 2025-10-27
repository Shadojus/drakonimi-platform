/**
 * Clear All Data: Delete all dragons from database
 * Use this to reset before reseeding
 */

import { internalMutation } from "./_generated/server";

export const clearDragons = internalMutation({
  handler: async (ctx) => {
    const dragons = await ctx.db.query("dragons").collect();
    
    for (const dragon of dragons) {
      await ctx.db.delete(dragon._id);
    }

    return { 
      status: "success", 
      message: `Deleted ${dragons.length} dragons` 
    };
  },
});
